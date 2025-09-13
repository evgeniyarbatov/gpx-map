const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    const basemap = req.query.basemap || 'osm';
    const htmlPath = path.join(__dirname, 'public', 'index.html');

    fs.readFile(htmlPath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading file');
        }

        const modifiedHtml = data.replace(
            '<script type="module" src="./main.js"></script>',
            `<script type="module" src="./main.js?basemap=${basemap}"></script>`
        );

        res.send(modifiedHtml);
    });
});

app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
