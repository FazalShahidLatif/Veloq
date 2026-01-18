const { Pool } = require('pg'); // Assuming you're using PostgreSQL

const pool = new Pool({
  user: 'your-db-user',
  host: 'localhost',
  database: 'your-database',
  password: 'your-password',
  port: 5432,
});

// User operations
const createUser = async (userData) => {
  const query = 'INSERT INTO users(name, email) VALUES($1, $2) RETURNING *';
  const values = [userData.name, userData.email];
  return pool.query(query, values);
};

const getUserById = async (userId) => {
  const query = 'SELECT * FROM users WHERE id = $1';
  const values = [userId];
  return pool.query(query, values);
};

// Template operations
const createTemplate = async (templateData) => {
  const query = 'INSERT INTO templates(name, content) VALUES($1, $2) RETURNING *';
  const values = [templateData.name, templateData.content];
  return pool.query(query, values);
};

const getTemplateById = async (templateId) => {
  const query = 'SELECT * FROM templates WHERE id = $1';
  const values = [templateId];
  return pool.query(query, values);
};

// Payment operations
const createPayment = async (paymentData) => {
  const query = 'INSERT INTO payments(user_id, amount) VALUES($1, $2) RETURNING *';
  const values = [paymentData.userId, paymentData.amount];
  return pool.query(query, values);
};

const getPaymentById = async (paymentId) => {
  const query = 'SELECT * FROM payments WHERE id = $1';
  const values = [paymentId];
  return pool.query(query, values);
};

module.exports = {
  createUser,
  getUserById,
  createTemplate,
  getTemplateById,
  createPayment,
  getPaymentById,
};
