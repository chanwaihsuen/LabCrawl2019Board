const express = require('express');
const app = express();
const port = process.env.PORT || 80;
var path = require('path');
var multer = require('multer')
var cors = require('cors');
const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Sheets API.
  authorize(JSON.parse(content), listMajors);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error while trying to retrieve access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
function listMajors(auth) {
  const sheets = google.sheets({ version: 'v4', auth });
  sheets.spreadsheets.values.get({
    spreadsheetId: '1ikLoqiY86gjO33VG3oTTiW3VE-64c2U9ZZIIJzW0nPg',
    range: 'Labcrawl!C1:C',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const rows = res.data.values;
    if (rows.length) {
      // Print columns A and E, which correspond to indices 0 and 4.
      rows.map((row) => {
        console.log(`${row[0]}`);
      });
    } else {
      console.log('No data found.');
    }
  });
}

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
}

app.use(cors());

// static assets
// app.use(express.static('dist'));
// Serve the static files from the React app
// //app.use(express.static(path.join(__dirname, 'dist')));
// Handles any requests that don't match the ones above
// app.get('*', (req,res) =>{
//     res.sendFile(path.join(__dirname+'/dist/index.html'));
// });
// app.get('*', cors(corsOptions), (req, res) => {
//     res.sendFile(path.join(__dirname + '/dist/index.html'));
// });

app.get('/getData', cors(corsOptions), function (req, res) {
  // const { client_secret, client_id, redirect_uris } = credentials.installed;
  // const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
  // fs.readFile(TOKEN_PATH, (err, token) => {
  //   if (err) return getNewToken(oAuth2Client, callback);
  //   oAuth2Client.setCredentials(JSON.parse(token));
  //   datapull(oAuth2Client);
  // });

  fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Sheets API.
    authorize(JSON.parse(content), datapull);
  });

  // Callback function pulling data
  function datapull(auth) {
    const sheets = google.sheets({ version: 'v4', auth });
    sheets.spreadsheets.values.get({
      spreadsheetId: '1ikLoqiY86gjO33VG3oTTiW3VE-64c2U9ZZIIJzW0nPg',
      range: 'Labcrawl!C1:C',
    }, (err, res) => {
      if (err) return console.log('The API returned an error: ' + err);
      const rows = res.data.values;
      if (rows.length) {
        // Print columns A and E, which correspond to indices 0 and 4.
        rows.map((row) => {
          console.log(`${row[0]}`);
        });
      } else {
        console.log('No data found.');
      }
    });
  }
});



// Serve the files on port 3000.
app.listen(port, function () {
  console.log('Running\n');
});

// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './dist')
//     },
//     filename: function (req, file, cb) {
//         //cb(null, Date.now() + '-' + file.originalname)
//         cb(null, file.originalname)
//         //cb(null, 'exported_individual.json')
//     }
// })
// var upload = multer({ storage: storage }).single('file');

// app.post('/upload', cors(corsOptions), function (req, res) {

//     upload(req, res, function (err) {
//         if (err instanceof multer.MulterError) {
//             return res.status(500).json(err)
//         } else if (err) {
//             return res.status(500).json(err)
//         }
//         return res.status(200).send(req.file)

//     })

// });