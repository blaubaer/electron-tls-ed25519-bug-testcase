const https = require('https');
const fs = require("fs");
const path = require("path");

function filePath(fileName) {
    const dirPath = './var';
    fs.mkdirSync(dirPath, {recursive: true});
    return path.join(dirPath, fileName);
}

function readFile(fileName) {
    return fs.readFileSync(filePath(fileName));
}

https.get('https://localhost:9999', {
    key: readFile('client.key'),
    cert: readFile('client.crt'),
    ca: readFile('ca.crt'),
    rejectUnauthorized: true,
}, res => {
    console.log('statusCode:', res.statusCode);
    console.log('headers:', res.headers);
    res.on('data', (d) => {
        process.stdout.write(d);
    });
}).on('error', (e) => {
    console.error(e);
    process.exit(1);
});