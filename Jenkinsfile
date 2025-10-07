pipeline {
    agent any

    environment {
        AWS_REGION = 'us-east-1a'                // Your AWS region (e.g., Mumbai)
        ECR_REPO = 'user-service'           // Your ECR repo name
        IMAGE_TAG = "${env.BUILD_NUMBER}"        // Image tag = build number
        AWS_ACCOUNT_ID = '841731975771'          // Replace with your AWS Account ID
        CLUSTER_NAME = 'microservices-dev'          // Your ECS cluster name
        SERVICE_NAME = 'userservice-service-5ogcteqk'            // ECS service name
        CONTAINER_NAME = 'user-container'        // Container name inside ECS task
    }

    stages {

        stage('Checkout Code') {
            steps {
                echo "Checking out source code..."
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo "Building Docker image..."
                    sh """
                    docker build -t $ECR_REPO:$IMAGE_TAG .
                    """
                }
            }
        }

        stage('Login to ECR') {
            steps {
                script {
                    echo "Logging in to Amazon ECR..."
                    sh """
                    aws ecr get-login-password --region $AWS_REGION \
                    | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
                    """
                }
            }
        }

        stage('Tag and Push Image to ECR') {
            steps {
                script {
                    echo "Tagging and pushing Docker image to ECR..."
                    sh """
                    docker tag $ECR_REPO:$IMAGE_TAG $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO:$IMAGE_TAG
                    docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO:$IMAGE_TAG
                    """
                }
            }
        }

        stage('Deploy to ECS') {
            steps {
                script {
                    echo "Deploying updated image to ECS..."
                    sh """
                    aws ecs update-service \
                        --cluster $CLUSTER_NAME \
                        --service $SERVICE_NAME \
                        --force-new-deployment \
                        --region $AWS_REGION
                    """
                }
            }
        }
    }

    post {
        success {
            echo "✅ Deployment successful! User microservice is live on ECS."
        }
        failure {
            echo "❌ Deployment failed. Check Jenkins logs for details."
        }
    }
}
