/**
* Google Maps initialisation for home page of web application. Inclusion of
* user marker to signify user location. */
function initMap() {
  //Setup the map
  map = new google.maps.Map(document.getElementById("mapid"), {
    center: { lat: lat, lng: lon },
    zoom: 8,
  });
  //create the marker for the user's location
  let marker = new google.maps.Marker({
    position: { lat: lat, lng: lon },
    map: map,
  });
  //If user clicks the marker, display a window
  const infowindow = new google.maps.InfoWindow({
    content: "You Are Here"
  });
  marker.addListener("click", () => {
    infowindow.open({
      anchor: marker,
      map,
      shouldFocus: false,
    });
  });
  userMarker.push(marker);
}

/**
 * The on-click hotel button function. Sends a get request to the '/hotels' 
 * endpoint and receives an object of information regarding hotels in 
 * a certain vicinity of the given latitude and longitude. */
function hotelButton() {
  /**1. Use server to call API, get hotel info back.*/
  var options = {
    method: 'GET',
    url: '/hotels',
    params: {
      latitude: lat,
      longitude: lon,
    },
  };
  axios.request(options).then(function (response) {
    /**2. Setup markers on map*/
    for(let i = 0; i < 10; ++i) {
      let current = response.data.data[i];
      if ( current && current.photo && current.photo.images) {
        displayMarker(parseFloat(current.latitude), parseFloat(current.longitude), current.name, 
          current.ranking, current.photo.images.medium.url, "orange");
      }
    }
  }).catch(function (error) {
    //catch error and display it
    console.error(error);
  });
}

/**
 * The on-click restaurant button function. Sends a get request to the '/restaurants' 
 * endpoint and receives an object of information regarding restaurants in 
 * a certain vicinity of the given latitude and longitude. */
function restaurantButton() {
  /**1. Use server to call API, get restaurant info back.*/
  var options = {
    method: 'GET',
    url: '/restaurants',
    params: {
      latitude: lat,
      longitude: lon,
    },
  };
  axios.request(options).then(function (response) {
    /**2. Setup markers on map*/
    for(let i = 0; i < 10; ++i) {
      let current = response.data.data[i];
      if ( current && current.photo && current.photo.images) {
        displayMarker(parseFloat(current.latitude), parseFloat(current.longitude), current.name, 
          current.description, current.photo.images.medium.url, "green");
      }
    }
  }).catch(function (error) {
    //catch error and display it
    console.error(error);
  });
}

/**
 * Displays marker on map with the given marker information and saves 
 * the marker information in an array (markers). Also adds information
 * to the marker info-window. 
 * @param {number} latitude One part of the coordinate used to place the marker.
 * @param {number} longitude The second part of the coordinate used to place the marker.
 * @param {string} name The name of the hotel/restaurant for the info-window contents.
 * @param {string} description A specification of the hotel/restaurant for the info-window.
 * @param {string} imageUrl The url of the images being displayed in the info-window. 
 * @param {string} colour The colour of the marker.  
 */
function displayMarker(latitude, longitude, name, description, imageUrl, colour) {
  const titleString = `<h1>${name}</h1><p>${description}</p><div><img src=${imageUrl}></div>`;
  const marker = new google.maps.Marker({
    position: { lat: latitude, lng: longitude },
    map: map,
    icon: `/images/${colour}-dot.png`
  });
  const infowindow = new google.maps.InfoWindow({
    content: titleString
  });
  marker.addListener("click", () => {
    infowindow.open({
      anchor: marker,
      map,
      shouldFocus: false,
    });
  });
  markers.push(marker);
}

/**
 * Removes all the markers from the map and the markers array. 
 * */
function removeMarkers() {
  for (let i = 0; i < markers.length; ++i) {
    //remove marker from map
    markers[i].setMap(null);
  }
  markers = [];
}

/**
 * The on-click 'enter' button function. Sends a get request to the '/location' 
 * endpoint and receives an object of information regarding the location (lat, lon)
 * from the given address. */
function enterAddress() {
  var addr = document.getElementById("addressInfo").value;
  if(addr.length == 0) {
    return;
  }
  /*1. use geocoding api via /location endpoint*/
  var options = {
    method: 'GET',
    url: '/location',
    params: {
      address: addr
    },
  };
  axios.request(options).then(function (response) { 
    /*2. Reset user marker on map*/
    if(response.data == "Use Default") {
      //invalid location given
      changeUserMarker(defLat, defLon);
    } else {
      let info = response.data.results[0].geometry.location
      changeUserMarker(parseFloat(info.lat), parseFloat(info.lng));
    }
    /*remove all current hotel/restaurant markers*/
    removeMarkers();
  }).catch(function (error) {
    //catch error and display it
    console.error(error);
  });
}

/**
 * Changes the user marker (red marker) from its current location to the new location.
 * Also removes all restaurant/hotel markers that were previosuly generated (if any). 
 * 
 * @param {number} la new latitude for user marker.
 * @param {number} lo new longitude for user marker.
 */
function changeUserMarker(la, lo) {
  //change user location variables
  lat = la;
  lon = lo;
  //remove all markers
  removeMarkers();
  //remove current user marker
  userMarker[0].setMap(null);
  //create new user marker
  const marker = new google.maps.Marker({
    position: { lat: la, lng: lo },
    map: map
  });
  //If user clicks the marker, display a window
  const infowindow = new google.maps.InfoWindow({
    content: "You Are Here"
  });
  marker.addListener("click", () => {
    infowindow.open({
      anchor: marker,
      map,
      shouldFocus: false,
    });
  });
  userMarker[0] = marker;
}