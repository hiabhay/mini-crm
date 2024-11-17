// app.js

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db.config');
const passport = require('./services/auth.service');
const session = require('express-session');
// app.js (or wherever the consumer logic is)
const Customer = require('./models/Customer');  // Import the Customer model
const startConsumer = require('./consumers/data-ingestion.consumer'); // Import the consumer

const { consumeMessages } = require('./services/queue.service'); // Import consumeMessages
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Allow only your frontend's origin
  credentials: true // Enable credentials
}));
app.use(express.json());
app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
    })
);
app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB
connectDB();

// Define routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/customers', require('./routes/customer.routes'));
app.use('/api/orders', require('./routes/order.routes'));
app.use('/api/campaigns', require('./routes/campaign.routes'));

// Start consuming messages from the queue
consumeMessages(async (message) => {
  if (message.type === 'CREATE_CUSTOMER') {
    const customer = new Customer(message.payload);
    try {
      await customer.save();
      console.log(`[x] Customer created from app: ${JSON.stringify(customer)}`);
    } catch (error) {
      console.error('Error saving customer:', error.message);
    }
  }
});

startConsumer(); // Start the consumer

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
