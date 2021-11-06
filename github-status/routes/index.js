var express = require('express');
var router = express.Router();
var axios = require("axios").default;

/** 
 * Route that initialises the home page by rendering the title and 
 * latitude and longitude. It gets the information for the longitude and 
 * latitude from the 'http://ip-api.com/json/' API via a get request. 
 * Reference API:
 * 
 * Outer request
 * @name Home-Page-Endpoint
 * @function
 * @path {GET} '/'
 * @param {callback} middleware - Express Middleware. 
 * 
 * Inner API-request
 * @name Location-Info
 * @function
 * @path {GET} 'http://ip-api.com/json/'
 * @param {callback} middleware - Express Middleware.
 * @response {Object} response
 * @response {Object} response.data
 * @response {number} response.data.lat
 * @response {number} response.data.lon
*/
router.get('/', function(req, res, next) {
  //automatically get location and display on map
  let lat1;
  let lon1;
  var options = {
    method: 'GET',
    url: 'http://ip-api.com/json/'
  };
  axios.request(options).then(function (response) {
    lat1 = response.data.lat;
    lon1 = response.data.lon;
    res.render('index', {
      title: 'Hotel and Restaurant Finder',
      lat: lat1,
      lon: lon1
    });
  }).catch(function (error) {
    console.log("Got here");
    //catch error and display it
    console.error(error);
  });
});


/**
 * Route that creates the '/hotels' endpoint and receives the hotel information
 * from the 'https://travel-advisor.p.rapidapi.com/hotels/list-by-latlng' API via
 * another get request. 
 * 
 * Outer request
 * @name Hotels-Endpoint
 * @function
 * @path {GET} '/hotels'
 * @param {callback} middleware - Express Middleware
 * 
 * Inner-API request
 * @name Hotel-Info
 * @function
 * @path {GET} 'https://travel-advisor.p.rapidapi.com/hotels/list-by-latlng'
 * @param {callback} middleware - Express Middleware.
 * @param {number} latitude is x-value of the user's coordinates. 
 * @param {number} longitude is the y-value of the user's coordinates.
 * @param {String} lang is the language that the response will be in. 
 * @param {String} currency is the form of currency used. 
 * @header {String} x-rapidapi-host - the host of the API.
 * @header {String} x-rapidapi-key - the key for the API.
 * @response {Object} response
 * @response {Object} repsonse.data
 */
router.get('/hotels', function(req, res, next) {
  var options = {
    method: 'GET',
    url: 'https://travel-advisor.p.rapidapi.com/hotels/list-by-latlng',
    params: {
      latitude: req.query.latitude,
      longitude: req.query.longitude,
      lang: 'en_US',
      currency: 'USD',
      distance: '3' 
    },
    headers: {
      'x-rapidapi-host': 'travel-advisor.p.rapidapi.com',
      'x-rapidapi-key': '3569d239f0mshbbc68a09fb60f2fp151d7ajsnbaa4f10afc20'
    }
  };
  axios.request(options).then(function (response) {
    //send response back to client
    res.send(response.data);
  }).catch(function (error) {
    //catch error and display it
    console.error(error);
  });
});

/**
 * Route that creates the '/restaurants' endpoint and receives the restaurant information
 * from the 'https://travel-advisor.p.rapidapi.com/restaurants/list-by-latlng' API via
 * another get request.
 * 
 * Outer request
 * @name Restaurants-Endpoint
 * @function
 * @path {GET} '/restaurants'
 * @param {callback} middleware - Express Middleware
 * 
 * Inner-API request
 * @name Restaurant-info
 * @function
 * @path {GET} 'https://travel-advisor.p.rapidapi.com/restaurants/list-by-latlng'
 * @param {callback} middleware - Express Middleware.
 * @param {number} latitude is x-value of the user's coordinates. 
 * @param {number} longitude is the y-value of the user's coordinates.
 * @param {String} currency is the form of currency used.
 * @param {String} open_now signifies to open the object. 
 * @param {String} lunit signifies the unit of distance. 
 * @param {String} lang signifies the language being used.  
 */
router.get('/restaurants', function(req, res, next) {
  var options = {
    method: 'GET',
    url: 'https://travel-advisor.p.rapidapi.com/restaurants/list-by-latlng',
    params: {
      latitude: req.query.latitude,
      longitude: req.query.longitude,
      currency: 'USD',
      open_now: 'true',
      lunit: 'km',
      lang: 'en_US',
      distance: '3'
    },
    headers: {
      'x-rapidapi-host': 'travel-advisor.p.rapidapi.com',
      'x-rapidapi-key': '3569d239f0mshbbc68a09fb60f2fp151d7ajsnbaa4f10afc20'
    }
  };
  axios.request(options).then(function (response) {
    //send response back to client
    res.send(response.data);
  }).catch(function (error) {
    //catch error and display it
    console.error(error);
  });
});

/**
 * Route that creates the '/location' endpoint and receives the location information 
 * from the https://maps.googleapis.com/maps/api/geocode/json API via another get
 * request. 
 * 
 * Outer request
 * @name Location-Endpoint
 * @function
 * @path {GET} '/location'
 * @param {callback} middleware
 * 
 * Inner request
 * @name Location-info
 * @function
 * @path {GET} 'https://maps.googleapis.com/maps/api/geocode/json'
 * @param {callback} middleware
 * @param {String} address the address to find location (lat, lon) of. 
 * @param {String} key used to access the API. 
 * 
 */
router.get('/location', function(req, res, next) {
  var options = {
    method: 'GET',
    url: 'https://maps.googleapis.com/maps/api/geocode/json',
    params: {
      address: req.query.address,
      key: 'AIzaSyDhJiDzY8i8lhGPnQxdmHLUenEmW1B6Etg'
    }
  };
  axios.request(options).then(function (response) {
    //send response back to client
    //res.send(response.data);
    if(response.data.status == "OK"){
      res.send(response.data);
    } else{
      //invalid address
      res.send("Use Default");
    }
  }).catch(function (error) {
    //catch error and display it
    console.error(error);
  });
})

module.exports = router;
