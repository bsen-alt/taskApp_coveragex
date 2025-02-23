require('dotenv').config();
const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');
const swaggerDocs = require('./config/swagger');

const app = express();
app.use(cors());
app.use(express.json());

// Use Task Routes
app.use('/tasks', taskRoutes);

// Initialize Swagger Documentation
swaggerDocs(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
