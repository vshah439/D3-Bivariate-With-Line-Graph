	//************************************************************
	// Data - loads hardcored data from data.js
	//************************************************************
	var data=graph_data1; 

	//************************************************************
	// Configuraddtion 
	//************************************************************

	var year_min = 2013,year_max = 2023,highlight_year="2015";

	var margin = {
		top : 20,
		right : 20,
		bottom : 70,
		left : 40
	}, 
	width = 600 - margin.left - margin.right, 
	height = 300 - margin.top - margin.bottom;
	//Parse the year / time
	var parseDate = d3.time.format("%Y").parse;
	var years = getYearsFromRange(year_min, year_max);

	
	//************************************************************
	// Data Conversion part - 
	// # Split data into two line datas - 1) Solid line 2) Dashed line
	// # Convert Year into date object for X axis
	// # Finding Max of Y axis
	//************************************************************
	var solid_line=[],dashed_line=[];
	  splitData(data);
	  data.forEach(function(d) {
			d.year = parseDate(d.year + "");
			//for area graph
			if(d.low)
			    d.low = +d.low;
			if(d.high)
			    d.high = +d.high;
		});
	 var y_max = Number(d3.max([ d3.max(data, function(d) {return Number(d.high);}), d3.max(data, function(d) {return Number(d.mean)}) ]));
	 var y_min = Number(d3.min([ d3.min(data, function(d) {return Number(d.low);}),0]));
	
	 //************************************************************
	// D3 Axis properties
	//************************************************************
	var x = d3.scale.ordinal().rangeRoundBands([ 0, width ], 0.6);
	var y = d3.scale.linear().range([ height, 0 ]);
	var xAxis = d3.svg.axis()
				.scale(x)
				.orient("bottom")
				.innerTickSize(-height)
				.outerTickSize(0)
				.tickFormat(d3.time.format("%Y"));
	
	var yAxis = d3.svg.axis()
				.scale(y)
				.orient("left")
				.innerTickSize(-width)
				.outerTickSize(0).ticks(10);
	
	x.domain(years.map(function(d) {return d;}));
	y.domain([ y_min, y_max * 1.2 ]);
	//************************************************************
	// SVG and add axis 
	//************************************************************
	var svg = d3.select("#graph").append("svg").attr("width",
			width + margin.left + margin.right).attr("height",
			height + margin.top + margin.bottom).append("g").attr("transform",
			"translate(" + margin.left + "," + margin.top + ")");
	svg.append("g")
			 .attr("class", "x axis")
			 .attr("transform","translate(0," + height + ")")
			 .call(xAxis)
			 .selectAll("text")
			 .style("text-anchor", "end")
			 .attr("dx", "1em")
			 .attr("dy", "1em")
			 .attr("transform", "rotate(0)");
	
	
	svg.append("g")
			.attr("class", "y axis")
			.call(yAxis);
	 
	// Define 'div' for tooltips
	var tooltip = d3.select("#graph").append("div");// declare the tooltip div 


	//************************************************************
	// Adding Solid Line
	//************************************************************
	var line = d3.svg.line()
				.x(function(d) {return x(d.year) + x.rangeBand() / 2;})
				.y(function(d) {return y(d.mean);});

	var path = svg.append("path").attr("d", line(solid_line))

	path.attr('fill', 'none')
		.attr('stroke', "steelblue")
		.attr('stroke-width',"2px");

	
	//************************************************************
	// Adding Dashed Line
	//************************************************************	
	var dashed_path = svg.append("path").attr("d", line(dashed_line))

	dashed_path.attr('fill', 'none')
		.attr('stroke', "steelblue")
		.attr('stroke-width',"2px")
		.style("stroke-dasharray", ("3, 3"));

	
		


	
	
	//************************************************************
	// Adding data value text over circle points
	//************************************************************	
	svg.append('g')
	.classed('labels-group', true)
	.selectAll('text')
	.data(data)
	.enter()
	.append('text')
	.transition().delay(function(d, i) {return i * (250);})
	.duration(3000)
	.attr({
	  'x': function(d, i) {
	    return x(d.year);
	  },
	  'y': function(d, i) {
	    return y(d.mean)-20;
	  }
	})
	.text(function(d, i) {
	  return Number(d.mean).toFixed(1);
	});
	
	//************************************************************
	// Area graph
	//************************************************************	
	
	
	var area = d3.svg.area()
    .x(function(d) {  return x(d.year)+ x.rangeBand() / 2;; })
    .y0(function(d) { return y(d.low); })
    .y1(function(d) { return y(d.high); });
	
	svg.append("path")
    .datum(data)
    .attr("class", "area")
    .attr("d", area);
	
	//************************************************************
	// Adding Data value circles
	//************************************************************	
	d3.select("body").select("g").selectAll("circle").remove();

	var circle = svg.selectAll("circle").data(data);

	circle.enter()
		.append("circle")
		.on("mouseover", function(d){
			  tooltip.attr("class", "tooltip");
			  tooltip.style("left", x(d.year)+"px");
			  tooltip.style("top", y(d.mean)+40+"px");
			  tooltip.style("display", "inline-block");
			  tooltip.html("<div class='tooltip-title'>"+
					  		d.year.getFullYear()+
					  		"</div>" +
					  		"<div class='tooltip-count'>"+
					  		"Max - "+Number(d.high).toFixed(1)+"</br>" +
					  		"Mean - "+Number(d.mean).toFixed(1)+"</br>" +
					  		"Min - "+Number(d.low).toFixed(1)+"</br>" +
					  		"</div>");})
		.on("mouseout", function(d){
			  tooltip.style("display", "none");
		})
		.transition().delay(function(d, i) {return i * (250);})
		.duration(3000)
		.attr("class", function(d) {return "dot";})
		.attr("cx", function(d) {return x(d.year) + x.rangeBand() / 2;})
		.attr("cy", line.y()).attr("r", function(d) {return 2;});
	
	circle.exit().remove();
		//************************************************************
		// Util Methods
		//************************************************************	
		//genrates years array from min and max configured variable
		function getYearsFromRange(min, max) {
			var years = [];
			for (var x = min; x <= max; x++) {
				years.push(parseDate(x + ""));
			}
			return years;
		}
		//Method to split data into solid line and dashed line data
		function splitData(data) {
			data.forEach(function(d) {
				if(Number(d.year) < Number(highlight_year)){
					solid_line.push(d);
				}
				else if(Number(d.year) == Number(highlight_year)){
					solid_line.push(d);
					dashed_line.push(d);
				} else {
					dashed_line.push(d);
				}
			})
		};
		