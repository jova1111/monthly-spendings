const express = require('express');
const compression = require('compression');
const port = process.env.PORT || 8080;
const app = express();

app.use(express.static(__dirname + "/dist/"));
app.use(compression());
app.get(/.*/, function(request, response) {
    response.sendfile(__dirname + "/dist/index.html");
});
app.listen(port);

console.log('Server started....');