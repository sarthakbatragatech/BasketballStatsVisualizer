var canvas = d3.select("body").append("svg").attr("width", 500).attr("height", 500);


d3.csv("static/shot_lebron.csv").then(function(data) {

	console.log(data);



	canvas.selectAll("circle")
		.data(data)
		.enter()
			.append("circle")
			.attr("cx", function (d) {
				return d.LOC_X;
			})
			.attr("cy", function (d) {
				return d.LOC_Y;
			})
			.attr("r", function (d) {
				return d.SHOT_DISTANCE;
			})
			.attr("fill", "blue")

var selection = d3.select("svg").selectAll("circle");

console.log(selection)
});

//d3.select("body").data(data).enter().append("p").text(data);
