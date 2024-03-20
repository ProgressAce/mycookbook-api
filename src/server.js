// Express server of API
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.json({message: 'Heard and responded'});
});

app.listen(PORT, () => {
    console.log(`API listening on port ${PORT}`);
});