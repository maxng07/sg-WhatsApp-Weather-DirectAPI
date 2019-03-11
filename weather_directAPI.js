const axios = require('axios');
const date = require('date-and-time');

//obtain current UTC time with +GMT8 offset and shorten into a single variable with data.format and offset
const now = date.format(date.addHours(new Date(), +8), 'YYYY-MM-DDTHH:mm:ss');  
const addr = 'https://api.data.gov.sg/v1/environment/2-hour-weather-forecast?date_time='+now ;
console.log(addr);
var jsonobj1 = []; //global variable to hold the axios response
exports.handler = function(context, event, callback) {
    const body = event.Body ? event.Body.toLowerCase(): null ;
    let twiml = new Twilio.twiml.MessagingResponse();
    let key = body;
  
    return axios.get(addr).then(response => {
    jsonobj = JSON.stringify(response.data.items).substr(1,JSON.stringify(response.data.items).length-2);
    jsonobj1 = JSON.parse(jsonobj);
    }).catch(error =>{
        console.log("There is an error");
        twiml.message("Sorry, there seems to be an error, please try again later");
        callback(null, twiml); // send a message back to user if remote NEA API Server is unavailable
        })
    .then(data => {
    var key = body; //In Twilio function, the body constant though inherit BODY event but cannot be used for later uses. declaring a var to inherit body 
    var keyval = [] ; //the array to obtain the value property of the key 
    var msg = "" ; // the response message type to be send back
    var keyarea = "" ; // to obtain the matched area
    var timestamp = (jsonobj1.valid_period.end).substr(0,10) + " " + (jsonobj1.valid_period.end).substr(11,5) +"h" ; // print valid timestamp

//obtaining the value property of the key matched in the key-value array
for (var i = 0; i < jsonobj1.forecasts.length; i++){
     var obj =jsonobj1.forecasts[i] ;  
    //Check for a special key 
     if (key === "all") {
    // Print out the whole JS array 
        keyval = JSON.stringify(jsonobj1.forecasts);
        msg = 2 ;
        break ;
    }

    // check for key "area" to print out all the avail regions
    else if
    (key === "area") {
        var x = "area" ;
        var tempkeyval = {} ;
    for (x in jsonobj1.forecasts) {
     tempkeyval += jsonobj1.forecasts[x].area + " " ;
     msg = 0  ; // set the variable to determine which message to send back
     console.log(tempkeyval) ;
     } break ;
    } 
    else if 
    // looping through the JSON Javascript object array
//for (var i = 0; i < jsonobj1.forecasts.length; i++){
//     var obj =jsonobj1.forecasts[i] ;
     (key === obj.area.toLowerCase()) { 
         keyval = obj.forecast ;
         keyarea = obj.area ;
         msg =1 ; //set the variable to determine which message to send back
         break ; // break is necessary to get out of the loop. Seems to be a bug even when true, send to next action.
     } else {
         msg = 3 ;
     }
}

//    keyval = jsonobj1.forecasts['key']; // this only work for JSON JS object but the imported file is JSON JS array instead
    console.log("The key is " + key +" , " + keyval);
    var resp3 = "The valid keyword to use is All, Area, and the Area-name. Type Area to obtain the Area-name, follow by Area-name of your choice" ;
    var resp2 = "The weather forecast in Singapore " +keyval +"\n" +"Valid till: " + timestamp ;
    var resp1 = "The areas for weather forecasts are: " + tempkeyval;
    var resp = "The weather in " + keyarea + " is " +keyval + "\n" + "Valid till: " + timestamp ; //constructing the message response, twilio twl does not support var within

    if (msg === 0) {
        twiml.message(resp1) ;
    }
    if (msg === 1) {
        twiml.message(resp) ;
    }
    if (msg === 2) {
        twiml.message(resp2) ;
    }
    if (msg === 3) {
        twiml.message(resp3) ;
    }
   
    console.log(resp + " " + keyval);
    callback(null, twiml);
    });
};  