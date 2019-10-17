const express = require('express');
const app = express();
const port = process.env.PORT || 80;
var path = require('path');
var multer = require('multer')
var cors = require('cors');


var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
}

app.use(cors());

// static assets
// app.use(express.static('dist'));
// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'dist')));
// Handles any requests that don't match the ones above
// app.get('*', (req,res) =>{
//     res.sendFile(path.join(__dirname+'/dist/index.html'));
// });
// app.get('*', cors(corsOptions), (req, res) => {
//     res.sendFile(path.join(__dirname + '/dist/index.html'));
// });

app.get('/', cors(corsOptions), function (req, res) {
    res.sendFile(__dirname + '/dist/index.html');
});
app.get('/individual', cors(corsOptions), function (req, res) {
    res.sendFile(__dirname + '/dist/index.html');
});
app.get('/product', cors(corsOptions), function (req, res) {
    res.sendFile(__dirname + '/dist/index.html');
});
app.get('/uploadfile', cors(corsOptions), function (req, res) {
    res.sendFile(__dirname + '/dist/index.html');
});


app.get('/exported_individual', cors(corsOptions), function (req, res) {
    const file = `${__dirname}/dist/downloads/exported_individual.xlsm`;
    res.download(file);
});

app.get('/exported_product', cors(corsOptions), function (req, res) {
    const file = `${__dirname}/dist/downloads/exported_product.xlsm`;
    res.download(file);
});

// app.get('/individual', function (req, res) {
//     res.sendFile(__dirname + '/app/individualaccount.html');
// });

// Serve the files on port 3000.
app.listen(port, function () {
    console.log('Running\n');
});

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './dist')
    },
    filename: function (req, file, cb) {
        //cb(null, Date.now() + '-' + file.originalname)
        cb(null, file.originalname)
        //cb(null, 'exported_individual.json')
    }
})
var upload = multer({ storage: storage }).single('file');

app.post('/upload', cors(corsOptions), function (req, res) {

    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }
        return res.status(200).send(req.file)

    })

});