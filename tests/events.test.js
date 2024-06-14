const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const eventsRouter = require('../routes/eventRoutes');


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/api', eventsRouter);

describe('Event Routes', () => {
  it('should get all events', async () => {
    const response = await request(app).get('/api/events');
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it('should create a new event', async () => {
    const newEvent = {
      title: 'New Event',
      description: 'This is a new event',
      date: '2024-06-20',
      time: '10:00:00',
      location: 'Online',
      category: 'Webinar'
    };

    const response = await request(app).post('/api/events').send(newEvent);
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe(newEvent.title);
  });

  // Ajoutez d'autres tests pour vos routes selon vos besoins
});
