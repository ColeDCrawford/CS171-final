
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
	vis.markers = {};
	L.AwesomeMarkers.Icon.prototype.options.prefix = 'fa';
	vis.customIcon = L.Icon.extend({
		options:{
			shadowUrl: 'js/leaflet-awesome-markers/dist/images/markers-shadow.png',
			iconSize: [35, 45],
      iconAnchor:   [17, 42],
      popupAnchor: [1, -32],
      shadowAnchor: [10, 12],
      shadowSize: [36, 16],
      markerColor: 'blue',
      iconColor: 'white'
		}
	})
	vis.markers.furniture = L.AwesomeMarkers.icon({
		icon: 'chair'
	})
	vis.markers.animal = L.AwesomeMarkers.icon({
		icon: 'horse'
	})
	// vis.markers.fodder = L.AwesomeMarkers.icon({
	// 	icon: 'wheat' //not free - FA Pro
	// })
	vis.markers.fodder = new vis.customIcon({
		iconUrl: 'img/hay-marker.png'
	})
	vis.markers.container = L.AwesomeMarkers.icon({
		icon: 'archive'
	})
	vis.markers.clothing = L.AwesomeMarkers.icon({
		icon: 'tshirt'
	})
	vis.markers.foodstuffs = L.AwesomeMarkers.icon({
		icon: 'utensils'
	})
	vis.markers.money = L.AwesomeMarkers.icon({
		icon: 'coins'
	})
	vis.markers['tools and implements'] = L.AwesomeMarkers.icon({
		icon: 'hammer'
	})
	// vis.markers.weapons = L.AwesomeMarkers.icon({
	// 	icon: 'swords' //Not free
	// })
	vis.markers.weapons = new vis.customIcon({
		iconUrl: 'img/swords-marker.png'
	})
	vis.markers.default = L.AwesomeMarkers.icon({
		icon: 'question-circle'
	})

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

	function iconType(act){
		switch(act.object_category){
			case 'furniture': return vis.markers.furniture
			case 'animal': return vis.markers.animal
			case 'container': return vis.markers.container
			case 'fodder': return vis.markers.fodder
			case 'foodstuffs': return vis.markers.foodstuffs
			case 'clothing': return vis.markers.clothing
			case 'money': return vis.markers.money
			case 'weapons': return vis.markers.weapons
			case 'tools and implements': return vis.markers['tools and implements']
			default: return vis.markers.default
		}
	}

	//Add plunder acts
	vis.displayData.forEach(function(act){
		var popup = `<strong>Town</strong>: ${act.town}<br /><strong>Object</strong>: ${act.object}<br/><strong>Category</strong>: ${act.object_category}`;
		var icon = iconType(act);
		var marker = L.marker(
			[act.lat, act.lon],
			{
				icon: icon
			}
		).bindPopup(popup);
		vis.acts.addLayer(marker);
	});
}
