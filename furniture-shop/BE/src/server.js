const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const routes = require('./routes');
const { connect } = require('./configs/database.config');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Furniture Shop API is running'
  });
});

app.use('/api', routes);

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await connect();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('DB connection failed, starting server without DB. Error:', error.message || error);
    // Start server anyway for frontend development. DB-dependent routes will fail until DB is available.
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} (DB not connected)`);
    });
  }
})();
