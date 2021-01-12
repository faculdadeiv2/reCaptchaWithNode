const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const fs = require('fs');

var data = fs.readFile('peopleInfo.json', function read(err, data){
    if(err){
        throw err;
    }
    var peopleInfo = JSON.parse(data);
})


const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/subscribe', (req, res) => {
    if (
        req.body.reCaptcha === undefined ||
        req.body.reCaptcha === '' ||
        req.body.reCaptcha === null
    ) {
        return res.json({ "success": false, "msg": "Por favor, preencha o reCaptcha!" });
    }

    const secretKey = '6LeCVSQaAAAAAGbZRKZiIn2i-yLIOB0HLTd26gIg';

    const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.reCaptcha}&remoteip=${req.connection.remoteAddress}`;

    request(verifyUrl, (err, response, body) => {
        body = JSON.parse(body);

        if (body.success !== undefined && !body.success) {
            return res.json({ "success": false, "msg": "Falha na Verificação!" });
        }

        return res.json({ "success": true, "msg": "Verificação sucedida!" });
    })

    var data = JSON.stringify(req.body, null, 2);

    fs.appendFile('peopleInfo.json', `, ${data}`, (err) => {
        if(err) console.log(err);
        console.log("Cadastro Completo!");
    });

});

app.listen(3000, () => {
    console.log("Servidor Iniciado na porta 3000!");
})