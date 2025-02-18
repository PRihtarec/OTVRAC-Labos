const express = require('express');
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
const app = express();
const port = 3000;
const { auth } = require('express-openid-connect');
const { Parser } = require('json2csv');

const config = {
  authRequired: false,
  auth0Logout: false,
  secret: 'a long, randomly-generated string stored in env',
  baseURL: 'http://localhost:3000',
  clientID: 'fnRoTZSICdPVbzzrP3ogtixwWBmBvvy4',
  issuerBaseURL: 'https://dev-yl6hu6xq2472y1wi.us.auth0.com'
};

const { requiresAuth } = require('express-openid-connect');




app.set('view engine', 'ejs');
app.use(auth(config));
app.set('views', path.join(__dirname, 'public'));

app.get("/", (req, res) => 
  {
      res.sendFile(req.oidc.isAuthenticated() ? "indexLoggedin.html": "index.html", { root: path.join(__dirname, 'public'),});
  });

  app.get('/profile', requiresAuth(), (req, res) => {
    const user = req.oidc.user;
    res.render('profile', { user });
  });
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'bolesti',
  password: 'n7kSI4hejr',
  port: 5432,
});

client.connect();

app.use(express.static('public'));
app.use(express.json());


const createResponse = (status, data, message = '') => ({
  status,
  data,
  message,
});

const sendResponse = (res, statusCode, responseObj) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(statusCode).send(JSON.stringify(responseObj));
};

app.get('/refresh', requiresAuth(), async (req, res) => {
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
      LEFT JOIN 
        bolest_simptom bs ON b.bolest_id = bs.bolest_id
      LEFT JOIN 
        simptomi s ON bs.simptom_id = s.simptom_id
      GROUP BY b.bolest_id
    `);

    const data = result.rows;

    const jsonFilePath = path.join(__dirname, 'public', 'bolesti.json');
    const csvFilePath = path.join(__dirname, 'public','bolesti.csv');

    // Save JSON file with aggregated symptoms
    fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2), 'utf8');

    // Prepare CSV file with one row per symptom
    const header = [
      'Bolest ID',
      'Naziv bolesti',
      'Vrsta tretmana',
      'Faktori rizika',
      'Razina opasnosti',
      'Uobičajeni lijekovi',
      'Dijagnostički testovi',
      'Genetska predispozicija',
      'Brzina progresije bolesti',
      'Tipična starost dijagnoze',
      'Simptom'
    ];

    const escapeCsv = (cell) => {
      if (cell == null) return ''; // Handle null/undefined
      const str = cell.toString();
      return str.includes(',') || str.includes('"') || str.includes('\n')
        ? `"${str.replace(/"/g, '""')}"`
        : str;
    };

    const rows = [header.map(escapeCsv).join(',')];
    data.forEach((row) => {
      if (row.simptomi && row.simptomi.length > 0) {
        row.simptomi.forEach((simptom) => {
          rows.push([
            escapeCsv(row.bolest_id),
            escapeCsv(row.naziv_bolesti),
            escapeCsv(row.tip_tretmana),
            escapeCsv(row.faktori_rizika),
            escapeCsv(row.razina_opasnosti),
            escapeCsv(row.uobicajeni_lijekovi),
            escapeCsv(row.dijagnosticki_testovi),
            escapeCsv(row.genetska_predispozicija),
            escapeCsv(row.brzina_progresije_bolesti),
            escapeCsv(row.tipicna_starost_dijagnoze),
            escapeCsv(simptom)
          ].join(','));
        });
      } else {
        rows.push([
          escapeCsv(row.bolest_id),
          escapeCsv(row.naziv_bolesti),
          escapeCsv(row.tip_tretmana),
          escapeCsv(row.faktori_rizika),
          escapeCsv(row.razina_opasnosti),
          escapeCsv(row.uobicajeni_lijekovi),
          escapeCsv(row.dijagnosticki_testovi),
          escapeCsv(row.genetska_predispozicija),
          escapeCsv(row.brzina_progresije_bolesti),
          escapeCsv(row.tipicna_starost_dijagnoze),
          '' // No symptoms
        ].join(','));
      }
    });

    const csvContent = rows.join('\n');
    fs.writeFileSync(csvFilePath, csvContent, 'utf8');

    // Redirect back to the home page after successful file generation
    res.redirect('/');
  } catch (err) {
    console.error(err);
    sendResponse(res, 500, createResponse('greska', null, 'Greska pri generiranju datoteka.'));
  }
});





app.get('/api/bolesti', async (req, res) => {
  try {
    const result = await client.query(`SELECT 
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
      LEFT JOIN 
    bolest_simptom bs ON b.bolest_id = bs.bolest_id
LEFT JOIN 
    simptomi s ON bs.simptom_id = s.simptom_id
      GROUP BY b.bolest_id`);
    sendResponse(res, 200, createResponse('uspjeh', result.rows, 'Dohvacene sve bolesti.'));
  } catch (err) {
    sendResponse(res, 500, createResponse('greska', null, 'Greska pri dohvacanju bolesti.'));
  }
});


app.get('/api/bolesti/:id', async (req, res) => {
  const { id } = req.params;
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
        LEFT JOIN 
    bolest_simptom bs ON b.bolest_id = bs.bolest_id
LEFT JOIN 
    simptomi s ON bs.simptom_id = s.simptom_id
        WHERE b.bolest_id = $1
        GROUP BY b.bolest_id;
    `, [id]);
    if (result.rows.length === 0) {
      return sendResponse(res, 404, createResponse('greska', null, 'Bolest nije nadena.'));
    }
    sendResponse(res, 200, createResponse('uspjeh', result.rows[0], `Dohvacena bolest koja ima ID ${id}.`));
  } catch (err) {
    sendResponse(res, 500, createResponse('greska', null, 'Greska pri dohvacanju bolesti po ID-u.'));
  }
});


app.get('/api/bolesti/tip/:tip', async (req, res) => {
  const { tip } = req.params;
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
        LEFT JOIN 
    bolest_simptom bs ON b.bolest_id = bs.bolest_id
LEFT JOIN 
    simptomi s ON bs.simptom_id = s.simptom_id
        WHERE b.tip_tretmana LIKE $1
        GROUP BY b.bolest_id;
    `, ["%"+tip+"%"]);
    if (result.rows.length === 0) {
      return sendResponse(res, 404, createResponse('greska', null, 'Bolest nije nadena.'));
    }
    sendResponse(res, 200, createResponse('uspjeh', result.rows, `Dohvacene bolesti s tipom tretmana: ${tip}.`));
  } catch (err) {
    sendResponse(res, 500, createResponse('greska', null, 'Greska pri dohvacanju bolesti po tipu tretmana.'));
  }
});


app.get('/api/bolesti/genetska/:predispozicija', async (req, res) => {
  const { predispozicija } = req.params;
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
        LEFT JOIN 
    bolest_simptom bs ON b.bolest_id = bs.bolest_id
LEFT JOIN 
    simptomi s ON bs.simptom_id = s.simptom_id
        WHERE b.genetska_predispozicija LIKE $1
        GROUP BY b.bolest_id;
    `, ["%"+predispozicija+"%"]);
    if (result.rows.length === 0) {
      return sendResponse(res, 404, createResponse('greska', null, 'Bolest nije nadena.'));
    }
    sendResponse(res, 200, createResponse('uspjeh', result.rows, `Dohvacene bolesti s genetskom predispozicijom: ${predispozicija}.`));
  } catch (err) {
    sendResponse(res, 500, createResponse('greska', null, 'Greska pri dohvacanju bolesti po genetskoj predispoziciji.'));
  }
});


app.get('/api/bolesti/naziv/:naziv', async (req, res) => {
  const { naziv } = req.params;
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
      LEFT JOIN 
    bolest_simptom bs ON b.bolest_id = bs.bolest_id
LEFT JOIN 
    simptomi s ON bs.simptom_id = s.simptom_id
        WHERE b.naziv_bolesti LIKE $1
        GROUP BY b.bolest_id;
    `, ["%"+naziv+"%"]);
    if (result.rows.length === 0) {
      return sendResponse(res, 404, createResponse('greska', null, 'Bolest nije nadena.'));
    }
    sendResponse(res, 200, createResponse('uspjeh', result.rows, `Dohvacene bolesti s nazivom: ${naziv}.`));
  } catch (err) {
    sendResponse(res, 500, createResponse('greska', null, 'Greska pri dohvacanju bolesti po nazivu.'));
  }
});


app.post('/api/bolesti', async (req, res) => {
  const { naziv_bolesti, tip_tretmana, faktori_rizika, razina_opasnosti, uobicajeni_lijekovi, dijagnosticki_testovi, genetska_predispozicija, brzina_progresije_bolesti, tipicna_starost_dijagnoze } = req.body;

  //console.log("dodana:", naziv_bolesti, tip_tretmana, faktori_rizika, razina_opasnosti, uobicajeni_lijekovi, dijagnosticki_testovi, genetska_predispozicija, brzina_progresije_bolesti, tipicna_starost_dijagnoze);

  try {
    const result = await client.query(
      `
      INSERT INTO bolesti (naziv_bolesti, tip_tretmana, faktori_rizika, razina_opasnosti, uobicajeni_lijekovi, dijagnosticki_testovi, genetska_predispozicija, brzina_progresije_bolesti, tipicna_starost_dijagnoze)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [naziv_bolesti, tip_tretmana, faktori_rizika, razina_opasnosti, uobicajeni_lijekovi, dijagnosticki_testovi, genetska_predispozicija, brzina_progresije_bolesti, tipicna_starost_dijagnoze]
    );

   // console.log("dodano:", result.rows[0]); // Log the inserted data
    sendResponse(res, 201, createResponse('uspjeh', result.rows[0], 'Bolest uspjesno dodana.'));
  } catch (err) {
    //console.error("greska:", err); // Log the error message
    sendResponse(res, 500, createResponse('greska', null, 'Greska pri dodavanju bolesti.'));
  }
});


app.put('/api/bolesti/:id', async (req, res) => {
  const { id } = req.params;
  const { naziv_bolesti, tip_tretmana, faktori_rizika, razina_opasnosti, uobicajeni_lijekovi, dijagnosticki_testovi, genetska_predispozicija, brzina_progresije_bolesti, tipicna_starost_dijagnoze } = req.body;

  try {
    const result = await client.query(
      `
      UPDATE bolesti 
      SET naziv_bolesti = $1, tip_tretmana = $2, faktori_rizika = $3, razina_opasnosti = $4, uobicajeni_lijekovi = $5, dijagnosticki_testovi = $6, genetska_predispozicija = $7, brzina_progresije_bolesti = $8, tipicna_starost_dijagnoze = $9
      WHERE bolest_id = $10
      RETURNING *`,
      [naziv_bolesti, tip_tretmana, faktori_rizika, razina_opasnosti, uobicajeni_lijekovi, dijagnosticki_testovi, genetska_predispozicija, brzina_progresije_bolesti, tipicna_starost_dijagnoze, id]
    );

    if (result.rows.length === 0) {
      return sendResponse(res, 404, createResponse('greska', null, 'Bolest nije nadena.'));
    }
    sendResponse(res, 200, createResponse('uspjeh', result.rows[0], `Bolest koja ima ID ${id} uspjesno promijenjena.`));
  } catch (err) {
    sendResponse(res, 500, createResponse('greska', null, 'Greska pri mijenjanju bolesti.'));
  }
});


app.delete('/api/bolesti/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await client.query('DELETE FROM bolesti WHERE bolest_id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return sendResponse(res, 404, createResponse('greska', null, 'Bolest nije nadena.'));
    }
    sendResponse(res, 200, createResponse('uspjeh', result.rows[0], `Bolest koja ima ID ${id} uspjesno obrisana.`));
  } catch (err) {
    sendResponse(res, 500, createResponse('greska', null, 'Greska pri brisanju bolesti.'));
  }
});
app.get("/api/openapi", (req, res) => 
  {
      res.sendFile(path.join(__dirname, "openapi.json"));
  });
  
app.all("*", (req, res) => 
  {
    sendResponse(res, 501, createResponse('greska', null, `Zahtjev ${req.method} nije implementiran za '${req.originalUrl}'.`));
     
  });

    
app.listen(port, () => {
  console.log(`Server upaljen na http://localhost:${port}`);
});
