
/* JavaScript content from js/CarLocation.js in folder common */
/**
 * 
 */

var map, layer, markers, marker, returnedHtml;
var markerList = [];

var Lat = 0;
var Lng = 0;

      

$("#carLocationBtn").click(function(){
	
	 $.mobile.changePage("#carLocationPage");
	 
	 
	 
	 loadmap();
	 
})

function loadmap() {

  var intLat = parseFloat(Lat);
  var intLng = parseFloat(Lng);
  
  WL.Logger.error("intLat,intLng::"+ intLat +", " +intLng);
  
  if(Lat == 0 && Lng == 0) {
  	fLat = 37.496;
  	fLng = 127.047;
  	
  } 
           
	
	map = new OpenLayers.Map('map');
	size = new OpenLayers.Size(300, 400);
	map.size = size;

	var position = new OpenLayers.LonLat(fLng, fLat);
	
	var proj4326 = new OpenLayers.Projection("EPSG:4326");
    var projmerc = new OpenLayers.Projection("EPSG:900913");

	//.transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject());
	layer = new OpenLayers.Layer.OSM("Customer Location");
	map.addLayer(layer);

	map.setCenter(position.transform(proj4326, projmerc), 14);

	
	
	markers =  new OpenLayers.Layer.Markers("Markers");
	
	icon = new OpenLayers.Icon('http://maps.google.com/mapfiles/ms/icons/red-pushpin.png'); 
	marker = new OpenLayers.Marker(position, icon);
  marker.name = "test";
  
  markers.addMarker(marker);
	
	map.addLayer(markers);
//	map.addControl(new OpenLayers.Control.LayerSwitcher());
}

function carSubscribe() {
	try {
		  var subscribeTopicName = "invenReq/delivery/tracking/coord/"+ASNDVCL;
		  WL.Logger.error("Car  subscribeTopicNamet::"+subscribeTopicName);
		  
      var options = {qos:0, 
                     onFailure: function(responseObject) {alert(responseObject.errorMessage + subscribeTopicName);}};
      client.subscribe(subscribeTopicName, options);
    } catch (error) {
      alert(error.message);
    } 
}


function carUnsubscribe() {
	try {
		  var subscribeTopicName = "invenReq/delivery/tracking/coord/"+ASNDVCL;
		  
		  WL.Logger.error("Car  Unsubscribe::"+subscribeTopicName);
		  
      var options = {onFailure: function(responseObject) {alert(responseObject.errorMessage + subscribeTopicName);}};
      client.unsubscribe(subscribeTopicName, options);
      

    } catch (error) {
      alert(error.message);
    } 
}

