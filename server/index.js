const express = require('express');
const axios = require('axios');
const csv = require('csv-parser');
const { PassThrough } = require('stream');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());

app.use('/', async (req, res) => {
  const csvUrl = 'https://raw.githubusercontent.com/Pleang1/population-csv/main/population-and-demography.csv';

  try {
    const response = await axios.get(csvUrl, { responseType: 'stream' });
    const data = [];

    response.data.pipe(csv())
      .on('data', (row) => {
        data.push(row);
      })
      .on('end', () => {
        res.json(data);
      })
      .on('error', (err) => {
        console.error('Error parsing CSV:', err);
        res.status(500).json({ error: 'Error parsing CSV file' });
      });
  } catch (err) {
    console.error('Error fetching CSV:', err);
    res.status(500).json({ error: 'Error fetching CSV file' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
