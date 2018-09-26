//Select the SVG container
var svgContainer = d3.select("body").select("svg");
var statsContainer = d3.select("body").select("#stats");


//Use d3.csv (to read the csv file)
d3.csv("static/shot_lebron.csv").then(function(data) {
	


	console.log(data);
	//console.log(data.LOC_X, " , ", data.LOC_Y);

	//Adding a group 'shots' which will hold all the SVG circles
	//Each data node will represent one shot
	var shots = svgContainer.append("g")
						.attr("class", "shot_group")
						//Transforming the group by translating all shots (to display shots with negative x-coordinate)
						.attr("transform", "translate(400,0)");

	//Binding shot data to SVG Circles
	var circles = shots.selectAll("circle")
						.data(data)
						.enter()
						.append("circle");

	//Adding attributes to each circle/shot based on values from the dataset
	var circleAttributes = circles
							.attr("r", 5)
							//Adding position based on shot X-Y coordinates
							.attr("cx", function(d) {
								return 1.6*parseInt(d.LOC_X);
							}) 
							.attr("cy", function(d) {
								return 1.2*parseInt(d.LOC_Y);
							}) 
							//Adding color based on shot result
							.attr("fill", function(d) {
								if (d.SHOT_RESULT == "made") {
									return "green";
								}
								else {
									return "red";
								}
							})
							.attr("class", "shot")
							//On Mouseover: increase size, display shot information
							.on("mouseover", function(d) {
								d3.select(this).raise()
								.attr("r", 5)
								.attr("stroke", "black")								
								statsContainer.append("p")
								.attr("class", "description")
								.attr("align", "center")
								.text(d.ACTION_TYPE + " " + d.SHOT_RESULT + " by " + d.PLAYER_NAME + " from a distance of " + d.SHOT_DISTANCE + " feet" + " on " + d.MATCHUP);
							})
							//On Mouseout: decrease size, remove shot information
							.on("mouseout", function(d) {
								d3.select(this)
									.attr("r", 2)
								d3.selectAll("p.description").remove()
							});

    //Group all the players in the dataset using d3.nest
    //Rollup is storing the total number of shots taking by a player
    var players = d3.nest()
    				.key(function(d) {
    					return d.PLAYER_NAME;
    				})
    				.rollup(function(a) {
    					return a.length;
    				})
    				.entries(data);

    //console.log(players)
    console.log(players);

    //For initial selection, introduce a key-value pair, "ALL". This represents all the shots.
    players.unshift({"key": "ALL", "value": d3.sum(players, function(d) {
					 	return d.value;
					 })
					})

    //Select the HTML Select tag
   	var selector = d3.select("#selector");

   	//Bind the players array to the selector
   	selector
   		.selectAll("option")
   		.data(players)
   		.enter()
   		.append("option")
   			.text(function(d) {
   				return d.key + " : " + d.value;
   			})
   			.attr("value", function(d) {
   				return d.key;
   			});

   	//This code segment will turn shots taken by all players, except the user selected player, to turn opaque.
   	selector
   		.on("change", function(){
   			//Before displaying shots for new selection, reset opacity for all shots to 1
   			d3.selectAll(".shot")
   				.attr("opacity", 1.0);
   			//Get the current value from the HTML select tag
   			var value = selector.property("value");
   			if (value != "ALL") {
   				d3.selectAll(".shot")
   					//Filter all the current shots and select all the ones that are not equal to the user chosen player
   					.filter(function(d) {
   						return d.PLAYER_NAME != value;
   					})
   					//Set opacity of all undesired shots to low
   					.attr("opacity", 0.01);
   			}
   		});
 });