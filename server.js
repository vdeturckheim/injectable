'use strict';
require('http').createServer((req, res) => {
    res.end('ok');
}).listen(8080);

console.log('pid:', process.pid);
console.log('process running');
