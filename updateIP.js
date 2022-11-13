const http = require('http');
const fs = require('fs');

http.get({ host: 'api.ipify.org', port: 80, path: '/' }, function (resp) {
    resp.on('data', function (ip) {
       fs.writeFile('ip.txt', ip, function (err) {});
       console.log(ip);
    });
 });