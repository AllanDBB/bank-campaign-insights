# Bank Campaign Insights - Backend Server

Backend server for the banking campaign insights dashboard application.

## Tech Stack

- Node.js with Express.js
- MongoDB with Mongoose ODM
- CORS enabled for frontend integration
- Environment-based configuration

## Project Structure

```
server/
├── src/
│   ├── controllers/     # HTTP request handlers
│   ├── services/        # Business logic layer
│   ├── daos/           # Data Access Objects
│   ├── models/         # Mongoose schemas
│   ├── routes/         # Express route definitions
│   ├── middleware/     # Custom middleware functions
│   ├── config/         # Configuration files
│   └── utils/          # Utility functions
├── .env.example        # Environment variables template
├── package.json        # Dependencies and scripts
└── server.js          # Application entry point
```

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (running locally or remote instance)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Configure your `.env` file with appropriate values:
```
MONGODB_URI=mongodb://localhost:27017/banking_dashboard
PORT=3001
NODE_ENV=development
```

### Running the Server

Development mode with auto-restart:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Health Check
- **GET** `/api/health`
- Returns server status and database connectivity
- Response: 200 (healthy) or 503 (unhealthy)

## Development

The server includes:
- Error handling middleware
- Database connection management
- CORS configuration for frontend
- Logging for database events and errors
