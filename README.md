# REST API by Arbi M Ihsan

This is the documentation of my REST API project.

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


## Additional Info
**Created by:** Arbi M Ihsan  
**Docker Hub:** [arbiihsan/rest-api](https://hub.docker.com/r/arbiihsan/rest-api)
