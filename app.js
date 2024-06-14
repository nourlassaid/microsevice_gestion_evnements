const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
const eventsRouter = require('./routes/eventRoutes');
const client = require('prom-client');

const app = express();

// Enable Prometheus metrics collection
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// Create a histogram metric for evnement-ms service
const evnementRequestDurationMicroseconds = new client.Histogram({
  name: 'evnement_request_duration_seconds',
  help: 'Duration of evnement-ms service HTTP requests in microseconds',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});

// Register the histogram for evnement-ms service
register.registerMetric(evnementRequestDurationMicroseconds);

// Middleware to measure request duration for evnement-ms service
app.use((req, res, next) => {
  const end = evnementRequestDurationMicroseconds.startTimer();
  res.on('finish', () => {
    end({ method: req.method, route: req.url, code: res.statusCode });
  });
  next();
});

// Route to expose Prometheus metrics
app.get('/metrics', async (req, res) => {
  try {
    const metrics = await register.metrics();
    res.set('Content-Type', register.contentType);
    res.end(metrics);
  } catch (error) {
    console.error('Error generating metrics:', error);
    res.status(500).send('Error generating metrics');
  }
});
app.use(cors());
app.use(bodyParser.json());

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '0000',
    database: process.env.DB_NAME || 'formation_management',
    port: process.env.DB_PORT || 3306
};

let connection;

function handleDisconnect() {
    connection = mysql.createConnection(dbConfig);

    connection.connect((err) => {
        if (err) {
            console.error('Erreur de connexion à la base de données : ', err);
            setTimeout(handleDisconnect, 2000); // Reconnexion après 2 secondes
        } else {
            console.log('Connexion à la base de données MySQL réussie');
        }
    });

    connection.on('error', (err) => {
        console.error('Erreur de connexion à la base de données : ', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
        } else {
            throw err;
        }
    });
}

handleDisconnect();

app.use('/api', eventsRouter);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
