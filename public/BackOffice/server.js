const express = require('express');
const cors = require('cors');
const fs = require('fs');
let app = express();




app.put('/backoffice/users.json', (req, res) => {
    var filepath = 'public/BackOffice/users.json';
    var file = fs.readFileSync(filepath);
    var json = JSON.parse(file);
    // var user = JSON.parse(req.body);
    const newUser = {
        usernames: req.username,
        email: "user.email",
        password: "user.password",
        admin: 0
    };
    //json.push(newUser);
    console.log(req.data);
    console.log(req.body);
    fs.writeFileSync(filepath, JSON.stringify(json));
    res.send();
})