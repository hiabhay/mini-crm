const { consumeMessages } = require('../services/queue.service');
const Customer = require('../models/Customer');
const Order = require('../models/Order');
const CommunicationLog = require('../models/CommunicationLog');
const connectDB = require('../config/db.config');

// Handle different types of messages
const handleMessage = async (message) => {
  try {
    console.log(`[x] Received message: ${JSON.stringify(message)}`);
    switch (message.type) {
      case 'CREATE_CUSTOMER':
        console.log(`[x] Handling CREATE_CUSTOMER with payload: ${JSON.stringify(message.payload)}`);
        try {
          const customer = new Customer(message.payload);
          await customer.save();
          console.log(`[x] Customer created: ${JSON.stringify(customer)}`);
        } catch (err) {
          if (err.code === 11000) {
            console.log(`[x] Duplicate customer detected: ${err.message}`);
          } else {
            console.error(`[x] Error creating customer: ${err.message}`);
          }
        }
        break;

      case 'CREATE_ORDER':
        console.log(`[x] Handling CREATE_ORDER with payload: ${JSON.stringify(message.payload)}`);
        let savedOrderId;
        try {
          const order = new Order(message.payload);
          await order.save();
          savedOrderId = order._id;
          console.log(`[x] Order created: ${JSON.stringify(order)}`);
        } catch (err) {
          console.error(`[x] Error creating order: ${err.message}`);
        }

        // Update customer's totalSpend and numVisits
        try {
          const customerId = message.payload.customerId;
          const order = await Order.findById(savedOrderId);  // Fetch the created order by ID
          console.log("[x] Fetched order: ", order);
          console.log(`[x] Fetching customer with ID: ${customerId}`);
          const customerObj = await Customer.findById(customerId);

          if (customerObj) {
            console.log(`[x] Customer found: ${JSON.stringify(customerObj)}`);
            customerObj.totalSpend += order.amount;
            customerObj.numVisits += 1;
            customerObj.lastVisitDate = new Date();
            await customerObj.save();
            console.log(`[x] Customer updated: ${JSON.stringify(customerObj)}`);
          } else {
            console.error(`[x] Customer with ID ${customerId} not found`);
          }
        } catch (err) {
          console.error(`[x] Error updating customer: ${err.message}`);
        }
        break;

      case 'UPDATE_COMMUNICATION_LOG':
        console.log(`[x] Handling UPDATE_COMMUNICATION_LOG with payload: ${JSON.stringify(message.payload)}`);
        try {
          const { id, status } = message.payload;
          const communicationLog = await CommunicationLog.findById(id);
          if (communicationLog) {
            communicationLog.status = status;
            await communicationLog.save();
            console.log(`[x] Communication log updated: ${JSON.stringify(communicationLog)}`);
          } else {
            console.error(`[x] Communication log with ID ${id} not found`);
          }
        } catch (err) {
          console.error(`[x] Error updating communication log: ${err.message}`);
        }
        // No operation for this case, but you can add handling if needed
        break;

      default:
        console.log(`[x] Unhandled message type: ${message.type}`);
    }
  } catch (err) {
    console.error(`[x] Error handling message: ${err.message}`);
  }
};

// Start the consumer to listen for messages
const startConsumer = async () => {
  try {
    console.log('[x] Connecting to database...');
    await connectDB(); // Connect to the database
    console.log('[x] Connected to database');
    console.log('[x] Starting to consume messages...');
    consumeMessages(handleMessage); // Start consuming messages
  } catch (err) {
    console.error(`[x] Error starting consumer: ${err.message}`);
  }
};

module.exports = startConsumer;
