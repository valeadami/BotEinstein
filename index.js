const functions = require('firebase-functions');
const querystring = require('querystring');
const {WebhookClient} = require('dialogflow-fulfillment');
const https = require('http');

let avaSession='';
let cont=0;
let strSessions=new Array();


postData = querystring.stringify({
    'searchText': 'ciao',
    'user':'',
    'pwd':'',
    'ava':'FarmaInfoBot'
    
  });
   const options = {
    hostname: '86.107.98.69',
    port: 8080, 
    path: '/AVA/rest/searchService/search_2?searchText=', 
    method: 'POST', 
    headers: {
      'Content-Type': 'application/json', 
     // 'Content-Length': Buffer.byteLength(postData),
      'Cookie':'JSESSIONID=' +avaSession
    }
  };

 exports.dialogflowFirebaseFulfillment = functions.https.onRequest((req, res) => {
   
   const agent = new WebhookClient({ request: req, response: res});
 
   //console.log('Dialogflow Request headers: ' + JSON.stringify(req.headers));
   //console.log('DIALOGFLOW Request body: ' + JSON.stringify(req.body));

    console.log('*************inizio da INLINE EDITOR  **********');
     
    let strRicerca='';
    if (req.body.queryResult.parameters['searchText']) {
      strRicerca=querystring.escape(req.body.queryResult.parameters['searchText']); //querystring.escape(
        console.log('valore della chiave di ricerca '+ strRicerca);
  
      
        options.path+=strRicerca+'&user=&pwd=&ava=FarmaInfoBot';
      
        console.log('---->percorso  ' + options.path);
    }
    
   callAVA(agent, strRicerca).then((strOutput)=> {
       
        return res.json({ 'fulfillmentText': strOutput }); 
       
    }).catch((error) => {
        //console.log('Si è verificato errore : ' +error);
       return res.json({ 'fulfillmentText': 'non lo so!!!!!!!!!!'});
     
    });
 

  
function callAVA(agent, strRicerca) {
  return new Promise((resolve, reject) => {
  
    let data = '';
    const req = https.request(options, (res) => {
    console.log('________valore di options.path INIZIO ' + options.path);
    console.log(`STATUS DELLA RISPOSTA: ${res.statusCode}`);
    console.log(`HEADERS DELLA RISPOSTA: ${JSON.stringify(res.headers)}`);
     console.log('..............BEFORE valore di avaSession ' + avaSession );
    
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
     console.log(`BODY: ${chunk}`);
     data += chunk;
    //sposto qua
     let c=JSON.parse(data);
            let strOutput=c.output[0].output; // c.output[0].output;
            strOutput=strOutput.replace(/(<\/p>|<p>|<b>|<\/b>|<br>|<\/br>|<strong>|<\/strong>|<div>|<\/div>|<ul>|<li>|<\/ul>|<\/li>|&nbsp;|)/gi, '');
            
            //inserito questo
           // let idSessione=c.sessionID;
           // strSessions.push(idSessione);
    
            //console.log('cookie inserito in array ' + strSessions[cont] );
            //avaSession=strSessions[cont];
             //console.log('..............AFTER valore di avaSession ' + avaSession );
            //cont++;
            //CONTROLLO SE AVASESSION E' VUOTA, SE NO CONCATENA SEMPRE le sessioni
             if (avaSession ==='' ){
                 console.log('se avaSession è vuota ...');
                //avaSession=strSessions[cont];
                avaSession=c.sessionID;
                
                //cont++;
                //options.headers.Cookie+=avaSession;
                 options.headers.Cookie+=avaSession;
                 console.log('VALORE DEL COOKIE ' + options.headers.Cookie);
                console.log('------------->VALORE DEL COOKIE<------' +options.headers.Cookie);
            }else {
                
                 console.log('NN HO INSERITO IL COOKIE'); 
                
            }
           
            
            /* fino a qui */
            console.log(strOutput);
        
            console.log("stato della risposta "  + res.statusCode);
            console.log('ora sono in end ');
            resolve(strOutput);  
    });
    res.on('end', () => {
      console.log('No more data in response.');
      
           
            options.path='/AVA/rest/searchService/search_2?searchText=';
            console.log('valore di options.path FINE ' +  options.path);

    });
  });
  
  req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
  });
  
  // write data to request body
  
  req.write(postData);
  req.end();
    
 });
} 


//let intentMap = new Map();
//intentMap.set('test_fb', callAVA);
//agent.handleRequest(intentMap);
});