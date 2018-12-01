
/*
 *  PlunderMap - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data            -- Array with all plunder acts
 */

PlunderMap = function(_parentElement, _data, _mapCenter, _mapboxUsername, _mapboxStyleId, _mapboxToken){ // _geoJSON) {

	this.parentElement = _parentElement;
	this.data = _data;
	this.mapCenter = _mapCenter;
	// this.geoJSON = _geoJSON;
  this.mapboxStyleId = _mapboxStyleId;
  this.mapboxUsername = _mapboxUsername;
  this.mapboxToken = _mapboxToken;

	this.initVis();
}

/*
 * Initialize PlunderMap
 */

PlunderMap.prototype.initVis = function(){
  var vis = this;
	console.log(`https://api.mapbox.com/styles/v1/${vis.mapboxUsername}/${vis.mapboxStyleId}?access_token=${vis.mapboxToken}`);
  //vis.mapboxStyle = $.get(`https://api.mapbox.com/styles/v1/${vis.mapboxUsername}/${vis.mapboxStyleId}?access_token=${vis.mapboxToken}`);
	//console.log(vis.mapboxStyle);

  //Create map
	vis.map = L.map(vis.parentElement).setView(vis.mapCenter, 10);

	L.tileLayer(`https://api.mapbox.com/styles/v1/${vis.mapboxUsername}/${vis.mapboxStyleId}/tiles/{z}/{x}/{y}@2x?access_token=${vis.mapboxToken}`, {
		tileSize: 512,
		maxZoom: 18,
		zoomOffset: -1,
		accessToken: vis.mapboxToken
	}).addTo(vis.map);

	//Create acts layer
	vis.acts = L.layerGroup().addTo(vis.map);

	//Custom markers?

	vis.wrangleData();
}

/*
 *  Data wrangling
 */

PlunderMap.prototype.wrangleData = function() {
	var vis = this;

	vis.displayData = vis.data;


	// Update the visualization
	vis.updateVis();
}

/*
 *  The drawing function
 */

PlunderMap.prototype.updateVis = function() {
	var vis = this;

	//Add plunder acts
	vis.displayData.forEach(function(act){
		var popup = `<strong>Town</strong>: ${act.town}<br /><strong>Object</strong>: ${act.object}`;
		// var icon;
		// if(station.nbBikes == 0 || station.nbEmptyDocks == 0){
		// 	icon = vis.redMarker;
		// } else {
		// 	icon = vis.greenMarker;
		// }
		var marker = L.marker(
			[act.lat, act.lon],
			// {
			// 	icon: icon
			// }
		).bindPopup(popup);
		vis.acts.addLayer(marker);
	});
}
