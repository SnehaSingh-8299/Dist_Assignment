require("dotenv").config();
const express = require('express');
const app = express();
const server = require("http").createServer(app);
const dotenv = require('dotenv');
const cors = require("cors");
const logger = require("morgan");


const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const connection = require('./config/db')
const { errorHandler } = require("./middleware/errorHandler");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(logger("dev"));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`)
    connection.mongodb();

});

