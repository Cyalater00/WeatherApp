// Weather Application
// we have to start off by grabbing our packages
//crerate a variable for your packeages

const express = require("express"); //includes the express package from node
const app = express(); //import a express package
const bodyParser = require("body-parser");
const https = require("https"); //import a package called "https" which allows us to make requests to other websites and get data from them.
const { json } = require("stream/consumers");

//Here we are creating our roiute for URL to page.html
app.use(bodyParser.urlencoded({ extended: true })); //We set up to the "body-parser" package so that it can understand and handle data sent to it.
app.get("/", function (req, res) {
  //We define a route for the homepage ("/")
  //we are aceessing the html file and creating a function for a request
  res.sendFile(__dirname + "/index.html");
});

//Here we will implement our API CALL to our URL 
// API call to get geographical data for that location

app.post("/", function (req, res) {
  const cityName = req.body.cityName;
  const state = req.body.state;
  const geourl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName},${state},US&limit=&appid=7fd3d2ea9ae9489fa8bb3e97c9b5ae18`;
  https.get(geourl, function (response) { // We make an HTTPS request to the API using the URL we created,
    response.on("data", function (data) {
      const geodata = JSON.parse(data)[0];
    //   We extract the latitude and longitude
      console.log(geodata);
      const lat = geodata.lat;
      const long = geodata.lon;
    //   Create another URL using the latitude and longitude to make another API call to get weather data for that location
      const weatherurl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=7fd3d2ea9ae9489fa8bb3e97c9b5ae18&units=imperial`;
      https.get(weatherurl, function (weatherResponse) { //create another http req.
        weatherResponse.on("data", function (weatherdata) {
          const weatherJson = JSON.parse(weatherdata);
          console.log(weatherJson);
          //we get the temperature, weather description, and weather icon from the 'weatherJson'
          const temp = weatherJson.main.temp;
          const des = weatherJson.weather[0].description;
          const icon = weatherJson.weather[0].icon;
          const imageurl =
            "http://openweathermap.org/img/wn/" + icon + "@2x.png";
          res.write( //It will show a image based the current weather conditon

            //inline css to style the webpage
            `<div>
            <head> <link rel="stylesheet" href="index.css" /> <title>Weather Application Data</title> </head>
            <h1>The temp in  ${cityName}, ${geodata.state} is ${temp}</h1>
            <p id = "description" >The weather description is ${des}</p>
            <img src ="${imageurl}">
            </div>
            `
          );
          res.send();
        });
      });
    });
  });
});

//MIME
app.get("/index.css", function (req, res) {
  res.setHeader("Content-Type", "text/css");
  res.sendFile(__dirname + "/index.css");
});

app.listen(8000);
