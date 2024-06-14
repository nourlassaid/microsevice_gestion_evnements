pipeline {
    agent any
    environment {
        SONARQUBE_TOKEN = 'sqp_cb42562016837fc8c43b443c3c59c4537be00158'
        SONARQUBE_HOST = 'http://localhost:9000'
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    bat '''
                        sonar-scanner.bat \
                        -Dsonar.projectKey=microservice_evnement \
                        -Dsonar.projectName=microservice_evnement \
                        -Dsonar.projectVersion=4.0 \
                        -Dsonar.sources=. \
                        -Dsonar.host.url=%SONARQUBE_HOST% \
                        -Dsonar.login=%SONARQUBE_TOKEN%
                    '''
                }
            }
        }
        stage('Build Docker Image') {
            steps {
                bat 'docker build -t nour0/evnement_kubernetes:latest .'
            }
        }
        stage('Push Docker Image') {
            steps {
                bat 'docker push nour0/evnement_kubernetes:latest'
            }
        }
        stage('Deploy to Kubernetes') {
            steps {
                bat 'kubectl apply -f eve-deployment.yaml'
                bat 'kubectl apply -f backend-service.yaml'
            }
        }
    }
}
