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
			    legendText = component.get("v.legendText"),
			    labels = component.get("v.labels"),
			    values = component.get("v.values"),
			    tooltips = component.get("v.tooltips");

			var chartWidth = boxWidth - 100;

			if (colors.length === 1) {
				colors = colors.concat(colors);
			}

			var canvas = d3.select(component.getElement());

			canvas.selectAll("svg").remove();
			var svg = canvas.append("svg")
			    .attr("width", width)
			    .attr("height", height)
			    .attr("viewBox", "0 0 " + boxWidth + " " + boxHeight);

			var tooltip;
			var tooltipRect;
			var tooltipText;

			var group = svg.append("g");

			var shadow = svg.append("defs")
				.append("filter")
				.attr("id", component.getGlobalId() + "_drop-shadow")
				.attr("height", "130%");

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

			function legend(x, value, text, color) {
				group.append("circle")
					.attr("cx", x - 14)
					.attr("cy", 80)
					.attr("r", 6)
					.attr("fill", color);
			  	group.append("text")
					.attr("x", x)
					.attr("y", 90)
			  		.style("fill", "#9199a7")
			  		.style("font-family", "Arial")
			  		.style("font-size", "20px")
			  		.text(value);
			  	group.append("text")
					.attr("x", x)
					.attr("y", 115)
			  		.style("fill", "#9199a7")
			  		.style("font-family", "Arial")
			  		.style("font-size", "20px")
			  		.text(text);
			}

			function horizontalBar(text, y, start, end, color, tooltipValue) {
				var box = textBox(tooltipValue);

				var x = Math.min(start, end);
				var width = Math.abs(start - end);
			  	group.append("text")
					.attr("x", 40)
					.attr("y", y + 19)
			  		.style("fill", "#9199a7")
			  		.style("font-family", "Arial")
			  		.style("font-size", "20px")
			  		.style("text-anchor", "end")
			  		.text(text);

				group.append("rect")
					.attr("x", 50)
					.attr("y", y)
					.attr("rx", 5)
					.attr("ry", 10)
					.attr("width", boxWidth - 100)
					.attr("height", 20)
					.style("fill", "#F5F5F6")

				group.append("rect")
					.attr("x", 50 + x)
					.attr("y", y )
					.attr("rx", 5)
					.attr("ry", 10)
					.attr("width", width)
					.attr("height", 20)
					.style("fill", color)
			  		.style("filter", "url(#" + component.getGlobalId() + "_drop-shadow)")
			  		.on("mouseover", function() {
			  			if (tooltipValue) {
		  			        tooltip.style("opacity", 1);
							tooltipRect
								.attr("width", 20 + box.width)
								.attr("height", 20 + box.height)
							tooltipText
								.text(tooltipValue);
						}
			  		})
			  		.on("mousemove", function() {
			  			if (tooltipValue) {
					        var mouseCoords = d3.mouse(tooltip.node().parentElement);
					        tooltip.attr("transform", "translate("
					                  + (mouseCoords[0]-10) + "," 
					                  + (mouseCoords[1] - 10) + ")");
					    }
			  		})
			  		.on("mouseout", function() {
			  			if (tooltipValue) {
				  			tooltip.attr("transform", "translate(-9999, -9999)")
				  				.style("opacity", 0);
			  			}
			  		});
			}

			function line(y) {
			  	group.append("line")
			  		.attr("x1", 50)
			  		.attr("y1", y)
			  		.attr("x2", boxWidth - 50)
			  		.attr("y2", y)
			  		.style("stroke", "rgba(0, 0, 0, 0.1)");
			}

		  	group.append("text")
				.attr("x", boxWidth / 2)
				.attr("y", 40)
		  		.style("fill", "#000")
		  		.style("font-family", "Arial")
		  		.style("font-weight", "normal")
		  		.style("font-size", "30px")
		  		.style("text-anchor", "middle")
		  		.text(title);

			var colorScale = d3.scaleLinear()
				.domain(d3.range(0, colors.length, 1).map(
					function(d) { 
						return d * (values.length - 1) / (colors.length - 1) 
					}))
				.range(colors);

		  	legends.forEach(function(data, index) {
		  		legend(50 + (boxWidth - 100) * index / (legends.length + 1), data[0], data[1], colorScale(index));
		  	});

		  	group.append("text")
				.attr("x", 50 + chartWidth)
				.attr("y", 90)
		  		.style("fill", "rgb(124, 210, 42)")
		  		.style("font-family", "'Salesforce Sans',Arial,sans-serif")
		  		.style("font-size", "30px")
		  		.style("text-anchor", "end")
		  		.text(legendText);

		  	var flat = values.map(function(e) { return e; });
		  	flat.push(0);
		  	var min = d3.min(flat);
		  	var max = d3.max(flat);
		  	var maxTicks = chartWidth / 100;
			var scale = d3.scaleLinear()
				.domain([min, max])
				.range([0, chartWidth])
				.nice();

		  	values.forEach(function(data, index) {
		  		line(160 + 60 * index);
		  		horizontalBar(labels[index], 180 + 60 * index, scale(0), scale(data), colorScale(index), tooltips[index]);
		  	});

			var axis = d3.axisBottom()
				.scale(scale)
				.tickSize(0)
				.ticks(maxTicks)
				.tickFormat(function(d) {
					if (d < 1000) {
						return d;
					}
					else if (d < 1000000) {
						return (d / 1000) + "k";
					}
					else {
						return (d / 1000000) + "M";
					}
				})
				.tickPadding(20);

			svg.append("g")
				.attr("transform", "translate(50, " + (160 + 60 * values.length) + ")")
				.attr("class", "axis")
				.call(axis);

	        function textBox(value) {
				var textSizeContainer = component.get("v.textSizeContainer");
				var textCanvas = canvas;
				if (textSizeContainer) {
					textCanvas = d3.select("#" + textSizeContainer);
				}
				var container = textCanvas.append("svg");
			    container.append("text")
			    	.attr("x", -99999)
			    	.attr("y", -99999)
			    	.attr("font-family", "Arial")
			    	.attr("font-size", "20px")
			    	.text(value);
			    var size = container.node().getBBox();
			    container.remove();
			    return size;
			}

			var box = textBox("Mouse-tracking");

			tooltip = svg.append("g")
				.attr("transform", "translate(-9999, -9999)")
				.style("opacity", 0)
			tooltipRect = tooltip.append("rect")
				.attr("width", 20 + box.width)
				.attr("height", 20 + box.height)
				.attr("x", 50)
				.attr("y", 0)
				.style("opacity", 0.5);
			tooltipText = tooltip.append("text")
				.attr("x", 60)
				.attr("y", 30)
				.attr("fill", "#fff")
		    	.attr("font-family", "Arial")
		    	.attr("font-size", "20px")
				.attr("text-acnhor", "left")
				.text("Mouse-tracking");

		}
	}
})