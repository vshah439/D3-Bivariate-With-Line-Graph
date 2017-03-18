Files

1) index.html - contains html code
2) graph.js - contains d3 code to generate graphs.
3) data.js - contains sample data provided in document (data for 3 graph example)
4) Style.css - contains styling for the graph.


Configurations-
1) data - JSON data to be used. Initialized at the begining.
2) year_min - starting point for x axis
3) year_max - ending point for x axis

Logic- 
1) data needs to be split into two 
	1- for Solid lines
	2- for Dashed lines 

splitData() method does this job

2) x and y axis properties
3) Draw solid line
4) Draw dashed line
5) Draw data value circle 
6) Add Area graph with respective low and high value

