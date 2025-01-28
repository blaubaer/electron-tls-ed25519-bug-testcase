const fs = require('fs');
const path = require('path');
const https = require('https');
const {execSync} = require('child_process');

function filePath(fileName) {
    const dirPath = './var';
    fs.mkdirSync(dirPath, {recursive: true});
    return path.join(dirPath, fileName);
}

function writeFile(fileName, content) {
    const fn = filePath(fileName);
    fs.writeFileSync(fn, content, 'utf8');
    return fn;
}

function readFile(fileName) {
    return fs.readFileSync(filePath(fileName));
}

function openssl(command) {
    command = 'openssl ' + command;
    try {
        execSync(command, {input: 'ignore', stdio: 'ignore'});
    } catch (e) {
        console.error(`Command failed with exit code ${e.status}`, e);
        throw e;
    }
}

// 1. Generate CA key/cert...
openssl(`genpkey -algorithm ED25519 -out ${filePath('ca.key')}`);
openssl(`req -new -x509 -key ${filePath('ca.key')} -out ${filePath('ca.crt')} -days 365 -subj "/CN=My CA"`);

// 2. Generate Server key/cert...
const serverExtFn = writeFile('server-ext.cnf',
    `subjectAltName=DNS:localhost,IP:127.0.0.1\nextendedKeyUsage=serverAuth`,
);
openssl(`genpkey -algorithm ED25519 -out ${filePath('server.key')}`);
openssl(`req -new -key ${filePath('server.key')} -out ${filePath('server.csr')} -subj "/CN=Server"`);
openssl(`x509 -req -in ${filePath('server.csr')} -CA ${filePath('ca.crt')} -CAkey ${filePath('ca.key')} -CAcreateserial -out ${filePath('server.crt')} -days 30 -extfile ${serverExtFn}`);

// 3. Generate Client key/cert...
const clientExtFn = writeFile('client-ext.cnf',
    `extendedKeyUsage=clientAuth`,
);
openssl(`genpkey -algorithm ED25519 -out ${filePath('client.key')}`);
openssl(`req -new -key ${filePath('client.key')} -out ${filePath('client.csr')} -subj "/CN=Client""`);
openssl(`x509 -req -in ${filePath('client.csr')} -CA ${filePath('ca.crt')} -CAkey ${filePath('ca.key')} -CAcreateserial -out ${filePath('client.crt')} -days 30 -extfile ${clientExtFn}`);

https.createServer({
    key: readFile('server.key'),
    cert: readFile('server.crt'),
    ca: readFile('ca.crt'),
    requestCert: true,
    rejectUnauthorized: true,
}, (req, res) => {
    res.writeHead(200);
    res.end('OK');
}).listen(9999, 'localhost', () => {
    console.log('HTTPS server running on https://localhost:9999');
});
