# School Payments Dashboard Backend

A complete Node.js/Express backend for a School Payments Dashboard with JWT authentication and transaction management.

## Features

- 🔐 JWT Authentication (Register, Login, Logout)
- 📊 Transaction Management with Filtering
- 🔍 Search and Pagination
- 🛡️ Input Validation and Error Handling
- 🌐 CORS Enabled for React Frontend
- 📝 Comprehensive Logging

## API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user
- `POST /auth/logout` - Logout

### Transactions
- `GET /transactions` - List transactions with filtering
- `GET /transaction-status/:orderId` - Check transaction status

### System
- `GET /health` - Backend health check

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone or download the project**
   ```bash
   cd school-payments-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set environment variables (optional)**
   ```bash
   # Create .env file
   PORT=4000
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   ```

4. **Start the server**
   ```bash
   # Development mode (with auto-restart)
   npm run dev
   
   # Production mode
   npm start
   ```

5. **Verify the server is running**
   - Server will start on `http://localhost:4000`
   - Visit `http://localhost:4000/health` to check if it's running

## API Usage Examples

### Registration
```javascript
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Login
```javascript
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Get Transactions
```javascript
GET /transactions?page=1&pageSize=10&status=Success&schoolId=SCH001
Authorization: Bearer <your-jwt-token>

Response:
{
  "data": [
    {
      "collect_id": "COL001",
      "school_id": "SCH001",
      "gateway": "Razorpay",
      "order_amount": 15000,
      "transaction_amount": 15000,
      "status": "Success",
      "custom_order_id": "ORD001",
      "student_name": "John Doe",
      "payment_date": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 20,
  "page": 1,
  "pageSize": 10
}
```

### Transaction Status
```javascript
GET /transaction-status/ORD001
Authorization: Bearer <your-jwt-token>

Response:
{
  "collect_id": "COL001",
  "school_id": "SCH001",
  "gateway": "Razorpay",
  "order_amount": 15000,
  "transaction_amount": 15000,
  "status": "Success",
  "custom_order_id": "ORD001",
  "student_name": "John Doe",
  "payment_date": "2024-01-15T10:30:00Z"
}
```

## Query Parameters for Transactions

- `page` - Page number (default: 1)
- `pageSize` - Items per page (default: 10)
- `schoolId` - Filter by school ID (e.g., SCH001)
- `status` - Filter by status (Success, Pending, Failed)
- `q` - Search in student name, order ID, or gateway
- `startDate` - Filter from date (ISO format)
- `endDate` - Filter to date (ISO format)

## Mock Data

The backend includes 20 sample transactions with:
- Various school IDs (SCH001, SCH002, SCH003, SCH004, SCH005)
- Different payment gateways (Razorpay, PayU, Stripe)
- Different statuses (Success, Pending, Failed)
- Realistic amounts (8,000 - 35,000)
- Unique order IDs (ORD001 - ORD020)

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Input validation
- CORS protection
- Error handling

## Development

### File Structure
```
school-payments-backend/
├── server.js          # Main application file
├── package.json       # Dependencies and scripts
└── README.md         # This file
```

### Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (placeholder)

## Frontend Integration

This backend is designed to work with a React frontend running on `http://localhost:5173`. Make sure your frontend:

1. Sends requests to `http://localhost:4000`
2. Includes JWT token in Authorization header: `Bearer <token>`
3. Handles the response format as shown in examples above

## Error Handling

The API returns appropriate HTTP status codes:
- `200` - Success
- `201` - Created (registration)
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid credentials)
- `403` - Forbidden (invalid token)
- `404` - Not Found
- `409` - Conflict (duplicate email)
- `500` - Internal Server Error

## Production Deployment

For production deployment:

1. Set a strong JWT_SECRET environment variable
2. Use a proper database instead of in-memory storage
3. Enable HTTPS
4. Set up proper logging
5. Use environment-specific configurations

## Support

For issues or questions, please check the console logs for detailed error messages and debugging information.
