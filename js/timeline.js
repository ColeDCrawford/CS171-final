
/*
* Timeline - Object constructor function
* @param _parentElement 	-- the HTML element in which to draw the visualization
* @param _data						-- the
*/

Timeline = function(_parentElement, _data){
   this.parentElement = _parentElement;
   this.data = _data;

   // No data wrangling, no update sequence
   //this.displayData = this.data;

   //this.initVis();
   this.initVis();
}

/*
* Initialize area chart with brushing component
*/

Timeline.prototype.initVis = function(){
 var vis = this;

 vis.margin = {top: 0, right: 0, bottom: 50, left: 60};

 vis.width = 800 - vis.margin.left - vis.margin.right,
 vis.height = 200 - vis.margin.top - vis.margin.bottom;

   // SVG drawing area
 vis.svg = d3.select("#" + vis.parentElement).append("svg")
     .attr("width", vis.width + vis.margin.left + vis.margin.right)
     .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
   .append("g")
     .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

   //Area chart variation
// // Scales and axes
//    vis.x = d3.scaleTime()
//       .range([0, vis.width])
//        //.domain(d3.extent(vis.displayData, function(d) { return d.Year; }));
//
//    vis.y = d3.scaleLinear()
//       .range([vis.height, 0])
//       //.domain([0, d3.max(vis.displayData, function(d) { return d.Expenditures; })]);
//
//    vis.xAxis = d3.axisBottom()
//        .scale(vis.x);
//
//    vis.yAxis = d3.axisLeft()
//       .scale(vis.y);
//
//    vis.svg.append("g")
// 			.attr("class", "y-axis axis");
//
// 	vis.svg.append("text")
// 		.attr("transform", "rotate(-90)")
// 		.attr("y", 0 - (vis.margin.left/2))
// 		.attr("x", 0 - (vis.height / 2))
// 		.attr("text-anchor", "middle")
// 		.text("Number of plunder acts");
//
//
//    // Area layout
//    vis.area = d3.area()
//      .x(function(d) { return vis.x(d.key)})
//      .y0(vis.height)
//      .y1(function(d){ return vis.y(d.value)});
//
//
//  // // TO-DO: Initialize brush component
//  // vis.brush = d3.brushX()
//  //   .extent([[0,0], [vis.width, vis.height]])
//  //   .on("brush", brushed);
//  //
//  // // TO-DO: Append brush component here
//  // vis.svg.append("g")
//  //   .attr("class", "x brush")
//  //   .call(vis.brush)
//  //   .selectAll("rect")
//  //     .attr("y", -6)
//  //     .attr("height", vis.height + 7);
//  //
//  // //Append x axis
//  // vis.svg.append("g")
//  //     .attr("class", "x-axis axis")
//  //     .attr("transform", "translate(0," + vis.height + ")")
//  //     .call(vis.xAxis);

   //Line chart variation
   vis.x = d3.scaleTime()
      .range([0, vis.width])

   vis.y = d3.scaleLinear()
      .range([vis.height, 0])

   vis.line = d3.line()
      .x(function(d){ return vis.x(d.key)})
      .y(function(d){ return vis.y(d.value)});
      //.curve(d3.curveMonotoneX);
   vis.xAxis = d3.axisBottom()
       .scale(vis.x)
       .tickFormat(d3.timeFormat("%Y-%m"))
       .ticks(20);

   vis.yAxis = d3.axisLeft()
      .scale(vis.y);

   vis.svg.append("g")
			.attr("class", "y-axis axis");

	vis.svg.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 0 - (vis.margin.left/2))
		.attr("x", 0 - (vis.height / 2))
		.attr("text-anchor", "middle")
		.text("Plunder acts");

    vis.svg.append("g")
        .attr("class", "x-axis axis")
        .attr("transform", "translate(0," + vis.height + ")");


   vis.wrangleData();
}

/*
 *  Data wrangling
 */
 Timeline.prototype.wrangleData = function () {
    var vis = this;
    vis.dataGrouping = $('#map-data-grouping').val();

    // (1) Group data by date and count
    function nest(data){
      var result = d3.nest()
        .key(function(d){
           //return d.date;
           return new Date(d.date_year, d.date_month)
           //return new Date(d.date_year, 0);
        })
        .rollup(function(leaves){
           return leaves.length;
        })
        .entries(data);
     	result.sort(function(a,b){
     		return new Date(a.key) - new Date(b.key);
     	});
     	result.forEach(function(d){
     		d.key = new Date(d.key);
     	})
      return result;
    }

    vis.nestedObjects = nest(vis.data.individualObjects);
    vis.nestedPlunders = nest(vis.data.plunders);

    if(vis.dataGrouping == 'individual'){
		vis.displayData = vis.nestedObjects;
    } else {
      vis.displayData = vis.nestedPlunders;
    }

    vis.updateVis();
 }

/*
 *  Draw it
 */
Timeline.prototype.updateVis = function(){
   var vis = this;
   vis.dataGrouping = $('#map-data-grouping').val();
   if(vis.dataGrouping == 'individual'){
     vis.displayData = vis.nestedObjects;
   } else {
     vis.displayData = vis.nestedPlunders;
   }
   console.log(vis.displayData);

   // // Update domains
	// vis.y.domain([
	// 	0,
	// 	d3.max(vis.displayData, function(d){
	// 		return d.value;
	// 	})
	// ]);
	// vis.x.domain(d3.extent(vis.displayData, function(d){ return new Date(d.key);}));
   //
   // var area = vis.svg.selectAll(".area")
   //    .data([vis.displayData]);
   // area.enter()
   //    .append("path")
   //    .attr("class", "area")
   //    .merge(area)
   //       .attr("d", function(d){
   //          return vis.area(d);}
   //       );
   //
   // // Call axis functions with the new domains
   // vis.svg.select(".x-axis").call(vis.xAxis);
   // vis.svg.select(".y-axis").call(vis.yAxis);

   //Line chart variation
   vis.y.domain([0, d3.max(vis.displayData, function(d){ return d.value; })]);
   vis.x.domain(d3.extent(vis.displayData, function(d){ return new Date(d.key)}))

   vis.svg.append("path")
      .datum(vis.displayData)
      .attr("class", "line")
      .attr("d", vis.line);

   // Call axis functions with the new domains
   vis.svg.select(".x-axis")
      .call(vis.xAxis)
      .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");
   vis.svg.select(".y-axis").call(vis.yAxis);


}
