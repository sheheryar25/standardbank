({
	drawChart : function(component) {
		if (component.get("v.isScriptLoaded") && component.get("v.isInitialized")) {
			var width = component.get("v.width"),
				height = component.get("v.height"),
				boxWidth = component.get("v.boxWidth"),
			    boxHeight = component.get("v.boxHeight"),
			    title = component.get("v.title"),
			    colors = component.get("v.colors"),
			    legends = component.get("v.legends"),
			    values = component.get("v.values"),
			    circleText = component.get("v.circleText"),
			    circleLegend = component.get("v.circleLegend");

			var canvas = d3.select(component.getElement());

			canvas.selectAll("svg").remove();

			var svg = canvas.append("svg")
			    .attr("width", width)
			    .attr("height", height)
			    .attr("viewBox", "0 0 " + boxWidth + " " + boxHeight);

			var shadow = svg.append("defs")
				.append("filter")
				.attr("id", component.getGlobalId() + "_drop-shadow");

			shadow.append("feGaussianBlur")
				.attr("in", "SourceAlpha")
				.attr("stdDeviation", 5)

			shadow.append("feComponentTransfer")
				.append("feFuncA")
					.attr("type", "linear")
					.attr("slope", 0.5);

			shadow.append("feOffset")
				.attr("dx", 0)
				.attr("dy", 2);

			var merge = shadow.append("feMerge");
			merge.append("feMergeNode");
			merge.append("feMergeNode")
				.attr("in", "SourceGraphic");

			var header = svg.append("g");

			var group = svg.append("g")
			    .attr("transform", "translate(" + boxWidth / 2 + "," + (240 + 50 * values.length) + ")");

			function legend(x, value, text, color) {
				header.append("circle")
					.attr("cx", x - 14)
					.attr("cy", 80)
					.attr("r", 6)
					.attr("fill", color);
			  	header.append("text")
					.attr("x", x)
					.attr("y", 90)
			  		.style("fill", "#000")
			  		.style("font-family", "Arial")
			  		.style("font-size", "20px")
			  		.text(value);
			  	header.append("text")
					.attr("x", x)
					.attr("y", 115)
			  		.style("fill", "#9199a7")
			  		.style("font-family", "Arial")
			  		.style("font-size", "20px")
			  		.style("text-anchor", "middle")
			  		.text(text);
			}

			function gauge(radius, color, value) {
			  	var background = d3.arc()
			  		.outerRadius(radius - 0)
			  		.innerRadius(radius - 20)
			  		.startAngle(-2)
			  		.endAngle(2);

			  	var progress = d3.arc()
			  		.outerRadius(radius - 0)
			  		.innerRadius(radius - 20)
			  		.startAngle(-2)
			  		.endAngle(-2 + value * 4);

			  	group.append("path")
			  		.attr("d", background)
			  		.style("fill", "#DAEBF7");
			  	group.append("path")
			  		.attr("d", progress)
			  		.style("fill", color)
			  		.style("filter", "url(#" + component.getGlobalId() + "_drop-shadow)");
			}

		  	header.append("text")
				.attr("x", boxWidth / 2)
				.attr("y", 40)
		  		.style("fill", "#000")
		  		.style("font-family", "Arial")
		  		.style("font-weight", "normal")
		  		.style("font-size", "30px")
		  		.style("text-anchor", "middle")
		  		.text(title);

		  	var step = boxWidth / legends.length;

		  	if (colors.length === 1) {
		  		colors = colors.concat(colors);
		  	}

		  	var colorScale = d3.scaleLinear()
		  		.domain(d3.range(0, colors.length, 1).map(function(d) { return d * (values.length - 1) / (colors.length - 1)}))
		  		.range(colors);

		  	legends.forEach(function(d, i) {
		    	legend(step / 2 + step * i, d[0], d[1], colorScale(i));
		  	});

		  	values.forEach(function(d, i) {
		  		gauge(140 + 50 * i, colorScale(i), d);
		  	});

		  	group.append("circle")
		  		.attr("cx", 0)
		  		.attr("cy", 0)
		  		.attr("r", 110)
		  		.attr("fill", "#7CD22A");
		  	group.append("circle")
		  		.attr("cx", 0)
		  		.attr("cy", -5)
		  		.attr("r", 110)
		  		.attr("fill", "#fff");
		  	group.append("text")
		  		.attr("dy", "15px")
		  		.style("fill", "#7CD22A")
		  		.style("font-family", "Arial")
		  		.style("font-weight", "bold")
		  		.style("font-size", "60px")
		  		.style("text-anchor", "middle")
		  		.text(circleText);
		  	group.append("text")
		  		.attr("dy", "40px")
		  		.style("fill", "#7CD22A")
		  		.style("font-family", "Arial")
		  		.style("font-weight", "normal")
		  		.style("font-size", "20px")
		  		.style("text-anchor", "middle")
		  		.text(circleLegend);
		}
	}
}
})