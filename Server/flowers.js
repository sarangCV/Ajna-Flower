/*-----------------------------------------------------------*
 *    @ author   : Prashant Gaurav                           *
 *    @ version  : 1.0                                       *
 *    @ module   : API index page(Create Server)             *
 *-----------------------------------------------------------*/
const http = require('http');
const apiConfig = require('./source/configuration');
const app = require('./source/routs');
const port = apiConfig.API_PORT || 5002;
const server = http.createServer(app);
server.listen(port);
console.log(`|| ------- |> AjnaFlower API is up on port : ${port} <| ------- ||`);
