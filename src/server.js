// Express server of API
const express = require('express');
const authRoutes = require('./routes/authRoutes');
const dbClient = require('./utils/db').dbClient;
const configSession = require('./middleware/session');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(configSession.configSession);
app.use('/api/v1', authRoutes);

app.get('/', (req, res) => {
    res.json({message: 'Heard and responded'});
});

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