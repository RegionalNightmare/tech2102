pipeline {
    agent any

    environment {
        IMAGE_NAME      = 'tech2102-group2'
        IMAGE_TAG       = 'latest'
        CONTAINER_NAME  = 'tech2102-group2-container'
        HOST_PORT       = '3000'
        CONTAINER_PORT  = '3000'
        CI              = 'true'
    }

    stages {
        stage('Build') {
            agent {
                docker {
                    image 'node:18-alpine'
                    reuseNode true
                }
            }
            steps {
                echo '==> Installing dependencies (npm install)'
                sh 'npm install'
            }
        }

        stage('Test') {
            agent {
                docker {
                    image 'node:18-alpine'
                    reuseNode true
                }
            }
            steps {
                echo '==> Running unit tests (App.test.js)'
                sh 'npm test -- --watchAll=false'
            }
        }

        stage('Docker Build') {
            steps {
                echo "==> Building Docker image ${IMAGE_NAME}:${IMAGE_TAG}"
                sh 'docker build -t $IMAGE_NAME:$IMAGE_TAG .'
            }
        }

        stage('Run Container') {
            steps {
                echo '==> Removing previous container (if any) and starting a new one'
                sh 'docker rm -f $CONTAINER_NAME || true'
                sh 'docker run -d --name $CONTAINER_NAME -p $HOST_PORT:$CONTAINER_PORT $IMAGE_NAME:$IMAGE_TAG'
                echo '==> Container running. Open http://localhost:3000 in your browser.'
            }
        }
    }

    post {
        success {
            echo 'SUCCESS: Pipeline finished. App is live at http://localhost:3000'
        }
        failure {
            echo 'FAILURE: Pipeline failed. Check console output above.'
        }
    }
}
