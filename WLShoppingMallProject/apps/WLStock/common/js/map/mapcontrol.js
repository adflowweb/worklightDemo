/**
 * 
 */

var map, layer, markers, marker, returnedHtml;
var markerList = [];
var inventoryMap, inventoryLayer, inventoryMarkers, inventoryMarker, inventoryReturnedHtml;
var inventoryMarkerList = [];

function loadmap() {
	
	map = new OpenLayers.Map('map');
	var position = new OpenLayers.LonLat(127.047, 37.496);
	
	var proj4326 = new OpenLayers.Projection("EPSG:4326");
    var projmerc = new OpenLayers.Projection("EPSG:900913");

	//.transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject());
	layer = new OpenLayers.Layer.OSM("Customer Location");
	map.addLayer(layer);
	map.setCenter(position.transform(proj4326, projmerc), 14);

	map.events.register("click", map, function(e) {
		
		var position = this.events.getMousePosition(e);
		var lonlat = map.getLonLatFromPixel(position);
		var lonlatTransf = lonlat.transform(map.getProjectionObject(), proj4326);
		var lonlat = lonlatTransf.transform(proj4326, map.getProjectionObject());
		var mk = addMarker(lonlat);	
		addFeature(mk, lonlat);
		if(mk.feature.popup == null){
			mk.feature.popup = mk.feature.createPopup(mk.feature.checkBox);
			mk.feature.popup.contentHTML = getStoreList(mk.feature.id);
			map.addPopup(mk.feature.popup);
			mk.feature.popup.show();
		}
		//alert ('lonlatTrans=> lat='+lonlatTransf.lat+' lon='+lonlatTransf.lon+'\nlonlat=>'+lonlat+'\nposition=>'+position);
	});
	
	
	getMarkers();
	map.addLayer(markers);
	map.addControl(new OpenLayers.Control.LayerSwitcher());
}

function loadInventorymap() {
	inventoryMap = new OpenLayers.Map('inventoryMap');
	var position = new OpenLayers.LonLat(128.11275965881396, 36.787629692902044);
	
	var proj4326 = new OpenLayers.Projection("EPSG:4326");
    var projmerc = new OpenLayers.Projection("EPSG:900913");

    inventoryLayer = new OpenLayers.Layer.OSM("Customer Location");
    inventoryMap.addLayer(inventoryLayer);
    inventoryMap.setCenter(position.transform(proj4326, projmerc), 8);
	
	getInventoryMarkers();
	inventoryMap.addLayer(inventoryMarkers);
	
	var size = new OpenLayers.Size(21, 25);
	var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
	var icon = new OpenLayers.Icon('http://www.openlayers.org/dev/img/marker.png', size, offset);
	var icon2 = new OpenLayers.Icon('http://www.openlayers.org/dev/img/marker.png', size, offset);
	
	var firstPosition = new OpenLayers.LonLat(14203355.025866, 4471307.419208);
	var secondPosition = new OpenLayers.LonLat(14261217.856270999, 4397316.375838302);
	var firstMarker = addInventoryMarker(firstPosition, icon);
	var secondMarker = addInventoryMarker(secondPosition, icon2);
	inventoryMap.addControl(new OpenLayers.Control.LayerSwitcher());
}

function addMarker(position, icon){
	if(icon == undefined){
		icon = new OpenLayers.Icon('http://maps.google.com/mapfiles/ms/icons/red-pushpin.png'); 
	}
	var tempMarkers = getMarkers();
	var tempMarker = new OpenLayers.Marker(position, icon);
	markerList.push(tempMarker);
	tempMarker.name = markerList.length -1;
	tempMarkers.addMarker(tempMarker);
	return tempMarker;
}

function addInventoryMarker(position, icon){
	if(icon == undefined){
		icon = new OpenLayers.Icon('http://maps.google.com/mapfiles/ms/icons/red-pushpin.png'); 
	}
	var tempMarkers = getInventoryMarkers();
	var tempMarker = new OpenLayers.Marker(position, icon);
	markerList.push(tempMarker);
	tempMarker.name = markerList.length -1;
	tempMarkers.addMarker(tempMarker);
	return tempMarker;
}

function addCustomerMarker(){	
	var position = new OpenLayers.LonLat(127.047, 37.496);	
	var proj4326 = new OpenLayers.Projection("EPSG:4326");
    var projmerc = new OpenLayers.Projection("EPSG:900913");
    
    position.transform(proj4326, projmerc);
 	
	var size = new OpenLayers.Size(21, 25);
	var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
	var icon = new OpenLayers.Icon('http://www.openlayers.org/dev/img/marker.png', size, offset);
	
	var newMarker = addMarker(position, icon);
	addFeature(newMarker, position);
}

function closeMarker(inputmj){	
	if(marker.feature.popup != null){
		marker.feature.popup.toggle();
	}
}

function getMarkers(){
	if(markers == undefined){
		markers =  new OpenLayers.Layer.Markers("Markers");
	}
	return markers;
}

function getInventoryMarkers(){
	if(inventoryMarkers == undefined){
		inventoryMarkers =  new OpenLayers.Layer.Markers("InventoryMarkers");
	}
	return inventoryMarkers;
}

function addFeature(marker, position){
	var tempMarkers = getMarkers();	
	var feature = new OpenLayers.Feature(tempMarkers, position);
		
    feature.closeBox = true;
    feature.popupClass = OpenLayers.Class(OpenLayers.Popup.Anchored, {minSize: new OpenLayers.Size(300, 180)});
    feature.data.popupContentHTML = feature.id +  "<input type=\"button\" value=\"Save\" onclick=save(\'" + feature.id + "\') />";
    feature.data.overflow = "hidden";
       
    marker.feature = feature;
	
    marker.events.register("click", feature, function(e){
		
		if(this.popup == null){
			this.popup = this.createPopup(this.checkBox);
			map.addPopup(this.popup);
			this.popup.show();
		}else{
			this.popup.toggle();
		}
		OpenLayers.Event.stop(e);
	});
//    tempMarkers.addMarker(marker);
}

function save(featureId){
	
	var proj4326 = new OpenLayers.Projection("EPSG:4326");
    var projmerc = new OpenLayers.Projection("EPSG:900913");
    
    
	for(var i=0;i<markerList.length;i++){
		if(markerList[i].feature.id == featureId){
			var radioId = featureId + "_storeId";
			var storeId = $(':radio[name=\"'+radioId+'\"]:checked').val();
			var position = new OpenLayers.LonLat(markerList[i].lonlat.lon, markerList[i].lonlat.lat);
			position = position.transform(projmerc, proj4326);
			var lon = position.lon;
			var lat = position.lat;
			saveStoreLonlat(storeId, lon, lat);
			markerList[i].feature.popup.toggle();
		}
	}	
}

function getStores(){
	
	var returnedData = getStoreList();
}

function getStoreList(featureId){

	var returnData = "";
	$.ajax({
		url : "actionpages/getStoreList.jsp",
		type : "post",
		data : {fid : featureId},
		async : false,
		dataType : "html",
		success : function(data) {
//			alert("success : " + data);
	
		},
		error : function(data) {
			alert("error : " + data);
		}
	}).done(function(data){
		returnData = "<div style=\"overflow:scroll;width:100%;height:80%;background-color:gold;\">" + data.replace(/\r\n/g,"") + "</div>";
		returnData = returnData + "<input type=\"button\" name=\"save\" value=\"저장\" onclick=\"save(\'" + featureId + "');\" />";
	});
	return returnData;
}

function saveStoreLonlat(storeid, lon, lat){
	$.ajax({
		url : "actionpages/setStoreLonlat.jsp",
		type : "post",
		data : {storeId : storeid, lon : lon, lat : lat},
		async : false,
		dataType : "html",
		success : function(data) {
//			alert("success : " + data);
	
		},
		error : function(data) {
			alert("error : " + data);
		}
	});
}

