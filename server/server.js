const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());

app.get('/data', (req, res) => {
  const data = [];

  fs.createReadStream('population-and-demography.csv')
    .pipe(csv())
    .on('data', (row) => {
      data.push(row);
    })
    .on('end', () => {
      res.json(data);
    })
    .on('error', (err) => {
      console.error('Error reading CSV:', err);
      res.status(500).json({ error: 'Error reading CSV file' });
    });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
