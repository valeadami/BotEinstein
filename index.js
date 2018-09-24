//Hey. Can you tell me how much energy gets generated from an atom?
//questa è la versione 1
//curl -H "Content-Type: application/json; charset=utf-8"  -H "Authorization: Bearer ya29.c.EloiBgoNHxVno0PlVavs7hICAUPFk34D8qjZk0NQhoKEGtPhBg4_HojCmKiVei0esZysSVkQ8of7aIyV7jS9IHBIcgTpmoqw6bEt4WUa7nu7QkDnJ140ms_-dFc"  -d "{\"queryInput\":{\"text\":{\"text\":\"3 kg\",\"languageCode\":\"en\"}},\"queryParams\":{\"timeZone\":\"Europe/Rome\"}}" "https://dialogflow.googleapis.com/v2/projects/einstein-f1c44/agent/sessions/59d5513d-2a88-5edd-b26e-0020bdc10c26:detectIntent"
// EinsteinBot webhooks
// Author : VERSIONE MIA
//WEBHOOK ORIGINALE https://einstein-bot.herokuapp.com/emc2
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();
console.log("sto per partire...");
app.set('port', (process.env.PORT || 5000));

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// Process application/json
app.use(bodyParser.json());

app.use(express.static('public'));

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am EinsteinBot webhook.')
})


app.post('/emc2/', function (req, res) {
    console.log(JSON.stringify(req.body));
    //var weight = req.body.result.parameters.weight;
    var weight = req.body.queryResult.parameters['weight'];
    var m = weight.amount;
    var weight_unit = weight.unit;
    //convert weight into kg
    if (weight_unit == 'g'){
        m = m/1000.0;
    }
    var c2 = 9 * 10^16; //in m^2/s^2
    var e = m * c2;
    
    res.setHeader('Content-Type', 'application/json');
    
    var botSpeech = "OUTPUT: Energy that the system can create is " + e 
    + " Joules.";
    /*
    out = {speech: botSpeech,
            displayText: botSpeech,
            data: null};
    */
   out = {fulfillmentText: botSpeech,
   
        payload: null};
    var outString = JSON.stringify(out);
    console.log('MIO OUTPUT :' + outString);
    
    res.send(outString);
})

