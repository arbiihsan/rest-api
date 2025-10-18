# REST API by Arbi M Ihsan

This is the documentation of my REST API project. Including `screenshots` for some of the process. 

## Features

- RESTful API with Express.js
- MongoDB database with Mongoose ODM
- JWT-based authentication
- Password hashing with bcrypt
- Input validation with Joi
- Docker containerization
- CI/CD pipeline with GitHub Actions
- Comprehensive unit tests with Jest
- Kubernetes deployment ready

## API Endpoints

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/users` | Create a new user |
| POST | `/login` | Authenticate user and get JWT token |
| PUT | `/users/:id` | Update user details |
| DELETE | `/users/:id` | Delete a user |

### Private Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | Get all users |
| GET | `/users/:id` | Get user by ID |

## Installation

1. Clone the repository
2. Install dependencies (npm install)
3. Create `.env` file from this example:

```
# Server Config
PORT=3000
NODE_ENV=development

# MongoDB Config
MONGODB_URI=mongodb://localhost:27017/rest-api

# JWT Config
JWT_SECRET=jwt_secret_key
JWT_EXPIRE=24h
```

4. Update environment variables in `.env`

## Running the Application

### Dev Mode
```bash
npm run dev
```

### Prod Mode
```bash
npm start
```

### Running Tests
```bash
npm test
```
locally, this app is accessible at: `http://localhost:3000`

## API Usage Examples (bash)

App is accessible at: http://137.184.251.206

### Create a User
```bash
curl -X POST http://137.184.251.206/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Arbi Ihsan",
    "email": "arbi@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://137.184.251.206/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "arbi@example.com",
    "password": "password123"
  }'
```

Response:
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "Arbi Ihsan",
    "email": "arbi@example.com",
    "createdAt": "2025-10-16T..."
  }
}
```

### Get All Users (Private)
```bash
curl -X GET http://137.184.251.206/users \
  -H "Authorization: Bearer JWT_TOKEN"
```

### Get User by ID (Private)
```bash
curl -X GET http://137.184.251.206/users/:id \
  -H "Authorization: Bearer JWT_TOKEN"
```

### Update User
```bash
curl -X PUT http://137.184.251.206/users/:id \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Arbi M Ihsan"
  }'
```

### Delete User
```bash
curl -X DELETE http://137.184.251.206/users/:id
```

## CI/CD Pipeline

Github Actions workflow:

1. Runs tests 
2. Builds Docker image and push to Docker Hub
3. Deploys to Kubernetes cluster

Add these secrets to Github repo:

- `DOCKER_USERNAME` - Docker Hub username
- `DOCKER_PASSWORD` - Docker Hub access token
- `KUBE_CONFIG` - Base64 encoded Kubernetes config file

## Error Handling

error responses template:

```json
{
  "success": false,
  "message": "Error message",
  "errors": ["Error detail 1", "Error detail 2"]
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `404` - Not Found
- `409` - Conflict (duplicate email)
- `500` - Internal Server Error

## Screenshots

### Test case passed
![plot](./screenshots/screenshot_test%20case.png)

### CI/CD pipeline jobs completed
![plot](./screenshots/screenshot_cicd%20pipeline.png)

### Check all kubernetes resources
![plot](./screenshots/screenshot_kube%20resources.png)

### Deployed API Usage
#### Check API status
![plot](./screenshots/screenshot_kube%20resources.png)
#### Create User
![plot](./screenshots/Screenshot%202025-10-18%20221932.png)
#### Login
![plot](./screenshots/Screenshot%202025-10-18%20222028.png)
#### Get all user
![plot](./screenshots/Screenshot%202025-10-18%20222123.png)
#### Get user by id
![plot](./screenshots/Screenshot%202025-10-18%20222236.png)
#### Update user
![plot](./screenshots/Screenshot%202025-10-18%20222356.png)
#### Delete user
![plot](./screenshots/Screenshot%202025-10-18%20222438.png)

## Additional Info
**Created by:** Arbi M Ihsan  
**Docker Hub:** [arbiihsan/rest-api](https://hub.docker.com/r/arbiihsan/rest-api)
