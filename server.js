const express = require('express');
const { Client } = require('pg');
const app = express();
const port = 3000;

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'bolesti',
  password: 'n7kSI4hejr',
  port: 5432,
});

client.connect();


app.use(express.static('public'));


app.get('/api/data', async (req, res) => {
  try {
    const result = await client.query(`
      SELECT 
        b.bolest_id, 
        b.naziv_bolesti, 
        b.tip_tretmana, 
        b.faktori_rizika, 
        b.razina_opasnosti, 
        b.uobicajeni_lijekovi, 
        b.dijagnosticki_testovi, 
        b.genetska_predispozicija, 
        b.brzina_progresije_bolesti, 
        b.tipicna_starost_dijagnoze,
        array_agg(s.simptom) AS simptomi
      FROM bolesti b
      NATURAL JOIN bolest_simptom bs
      NATURAL JOIN simptomi s
      GROUP BY b.bolest_id
    `);

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).send('Error fetching data');
  }
});


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});