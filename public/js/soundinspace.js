/*global google*/
function initialize() {
  var mapOptions = {
    center: new google.maps.LatLng(37.770186961429175, -122.46781960133366),
    zoom: 18,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    zoomControl: true,
    clickToGo: true
  };
  
  
  
  var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
  
  var markers = [
        ['De Young, SF', 37.770186961429175, -122.46781960133366]
  ];
  
  //var bounds = map.getBounds();
  // markers & place each one on the map  
  for(var i = 0; i < markers.length; i++ ) {
    var position = new google.maps.LatLng(markers[i][1], markers[i][2]);
    //bounds.extend(position);
    var marker = new google.maps.Marker({
      position: position,
      map: map,
      title: markers[i][0]
    });
    
    
    
    // Automatically center the map fitting all markers on the screen
    //map.fitBounds(bounds);
    google.maps.event.addListener(map, 'center_changed', function(e) {
    	var center = this.getCenter();
    	console.log('lat', center.lat());
    	console.log('lng', center.lng());
    })
  }
  
}

google.maps.event.addDomListener(window, 'load', initialize);