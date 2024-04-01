// Express server of API
const express = require('express');
const authRoutes = require('./routes/authRoutes');
const dbClient = require('./utils/db').dbClient;
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.json({message: 'Heard and responded'});
});

app.use('/api/v1', authRoutes);

async function startServer() {
    try {
        await dbClient.connect();
        app.listen(PORT, () => {
            console.log(`API listening on port ${PORT}`,
                        '\n========== ==========');
        });
    } catch (err) {
        console.log(`Error starting server: ${err.message}`);
    }
};

startServer();