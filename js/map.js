
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
	vis.markers.linens = new vis.customIcon({
		iconUrl: 'img/linens-marker.png'
	})
	vis.markers.containers = L.AwesomeMarkers.icon({
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
	vis.dataGrouping = $('#map-data-grouping').val();

	if(vis.dataGrouping == 'individual'){
		vis.displayData = vis.data.individualObjects;
	} else {
		vis.displayData = vis.data.plunders;
	}


	// Update the visualization
	vis.updateVis();
}

/*
 *  The drawing function
 */

PlunderMap.prototype.updateVis = function() {
	var vis = this;
	console.log(`updateVis(): ${vis.dataGrouping}`)

	function iconType(act){
		var category = '';
		if(vis.dataGrouping == 'individual'){
			category = act.object_category;
		} else {
			// var categories = [];
			// act.objects.forEach(function(object){
			// 	categories.push(object.object_category);
			// })
			// category = getHighestCount(countArray(categories))[0];
			category = act.displayCategory;
		}
		switch(category){
			case 'furniture': return vis.markers.furniture
			case 'animal': return vis.markers.animal
			case 'containers': return vis.markers.containers
			case 'fodder': return vis.markers.fodder
			case 'foodstuffs': return vis.markers.foodstuffs
			case 'clothing': return vis.markers.clothing
			case 'money': return vis.markers.money
			case 'weapons': return vis.markers.weapons
			case 'tools and implements': return vis.markers['tools and implements']
			case 'linens': return vis.markers.linens
			default: return vis.markers.default
		}
	}

	// function getHighestCount(obj){
	// 	var highestVal = 0;
	// 	var highestKey = '';
	// 	for(key in obj){
	// 		if(obj[key] > highestVal){
	// 			highestVal = obj[key];
	// 			highestKey = key;
	// 		}
	// 	}
	// 	return [highestKey, highestVal]
	// }
	//
	// function countArray(arr){
	// 	result = {};
	// 	arr.forEach(function(d){
	// 		if(!result[d]){
	// 			result[d] = 0
	// 		}
	// 		result[d]++;
	// 	})
	// 	return result;
	// }
	//
	// function countArrToString(obj, counts=true){
	// 	var result = '';
	// 	var keys = Object.keys(obj);
	// 	keys.forEach(function(key){
	// 		if(obj[key] > 1 && counts){
	// 			result += (`${key} (${obj[key]}), `)
	// 		} else {
	// 			result += `${key}, `
	// 		}
	// 	})
	// 	return result.substr(0,result.length-2);
	// }

	function getLabel(act){
		if(vis.dataGrouping == 'plunder'){
			// var objects = [];
			// var categories = [];
			// act.objects.forEach(function(object){
			// 	objects.push(object.object);
			// 	categories.push(object.object_category);
			// })
			return `<strong>Town</strong>: ${act.town}<br /><strong>Objects</strong>: ${act.objectsString}<br/><strong>Categories</strong>: ${act.categoriesString}`;
		} else {
			return `<strong>Town</strong>: ${act.town}<br /><strong>Object</strong>: ${act.object}<br/><strong>Category</strong>: ${act.object_category}`
		}
	}

	//add plunders / objects to map
	console.log(vis);
	vis.acts.clearLayers();
	vis.displayData.forEach(function(act){
		var popup = getLabel(act);
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
