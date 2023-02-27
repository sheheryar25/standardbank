({
	drawChart : function(component) {
		if (component.get("v.isScriptLoaded") && component.get("v.isInitialized")) {
			var height = component.get("v.height"),
		    	width = component.get("v.width"),
		    	boxHeight = component.get("v.boxHeight"),
		    	boxWidth = component.get("v.boxWidth"),
		    	title = component.get("v.title"),
		    	values = component.get("v.values"),
		    	tooltips = component.get("v.tooltips"),
		    	labels = component.get("v.labels"),
		    	legends = component.get("v.legends"),
				colors = component.get("v.colors"),
		    	padding = 50,
		    	legendHeight = 50;

		  	if (colors.length === 1) {
		  		colors = colors.concat(colors);
		  	}

			var canvas = d3.select(component.getElement());

			var colorScale = d3.scaleLinear()
				.domain(d3.range(0, colors.length, 1).map(
					function(d) { 
						return d * (d3.max(values.map(function(a) { return a.length; })) - 1) / (colors.length - 1)
					}))
				.range(colors);

			canvas.selectAll("svg").remove();
			var svg = canvas.append("svg")
				.attr("width", width)
				.attr("height", height)
			    .attr("viewBox", "0 0 " + boxWidth + " " + boxHeight);

			var defs = svg.append("defs");

			var shadow = defs.append("filter")
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

			var grad = defs.append("linearGradient")
				.attr("id", "grad")
				.attr("x1", "0%")
				.attr("y1", "0%")
				.attr("x2", "100%")
				.attr("y2", "100%");

			var chartWidth = Math.max(0, boxWidth - 2 * padding);
			var chartHeight = Math.max(0, boxHeight - legendHeight);

			function flatMap(acc, value) {
				if (Array.isArray(value)) {
					value.forEach(function(element) {
						flatMap(acc, element);
					});
				}
				else {
					acc.push(value);
				}
			}

			var flat = [0];
			flatMap(flat, values);
			var min = d3.min(flat);
			var max = d3.max(flat);

			var scale = d3.scaleLinear()
				.domain([min, max])
				.range([chartHeight - 100, 100])
				.nice()

			var axis = d3.axisRight()
				.scale(scale)
				.ticks(chartHeight / 100)
				.tickSize(chartWidth)
				.tickPadding(20);

			var axisGroup = svg.append("g")
				.attr("transform", "translate(" + padding + ", " + legendHeight + ")")
				.attr("class", "axis-vertical")

			function customAxis(g) {
			  	g.call(axis);
			  	g.select(".domain").remove();
			  	g.selectAll(".tick text").attr("x", 4).attr("dy", -8);
			}

			customAxis(axisGroup);
			var chart = svg.append("g")
				.attr("transform", "translate(" + padding + "," + legendHeight + ")");

			function verticalBar(x, value, color, tooltipValue) {
				var box = textBox(tooltipValue);

				chart.append("rect")
					.attr("x", x)
					.attr("y",  scale(value))
					.attr("width", 30)
					.attr("height", scale(0) - scale(value) + 1)
					.attr("fill", color)
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

			function verticalBarGroup(x, values, tooltipValues) {
				values.forEach(function(value, index) {
					var tooltipValue = Array.isArray(tooltipValues) ? tooltipValues[index] : undefined;
					verticalBar(x + 40 * index, value, colorScale(index), tooltipValue);
				});
			}

			var groupLength = values.reduce(function(acc, value) {
				return Math.max(acc, value.length);
			}, 0);
			var groupWidth = 40 * groupLength - 10;
			var clearence = 100;
			var distance = (chartWidth - clearence) / values.length;
			var offset = clearence + (distance - groupWidth) / 2;
			function verticalBarGroups(values, tooltips) {
				values.forEach(function(value, index) {
					var tooltipValues = Array.isArray(tooltips) ? tooltips[index] : undefined;
					verticalBarGroup(offset + distance * index, value, tooltipValues);
				});
			}

			var x = 100;
			var text = "PARTNERS"
			function label(x, text) {
				chart.append("text")
					.attr("x", x)
					.attr("y", chartHeight - 50)
			  		.style("fill", "#9199a7")
			  		.style("font-family", "Arial")
			  		.style("font-size", "20px")
			  		.style("text-anchor", "middle")
			  		.text(text);
		  	}

		  	labels.forEach(function(text, index) {
		  		label(clearence + distance * index + distance / 2, text);
		  	});

			verticalBarGroups(values, tooltips);

			var legendGroup = svg.append("g")
				.attr("transform", "translate(" + padding + ", 30)");

			function legend(x, color, text) {
				legendGroup.append("rect")
					.attr("x", x)
					.attr("y", 50)
					.attr("width", 30)
					.attr("height", 50)
					.style("fill", color)
					.style("filter", "url(#" + component.getGlobalId() + "_drop-shadow)");
				legendGroup.append("text")
					.attr("x", x + 50)
					.attr("y", 70)
			  		.style("fill", "#9199a7")
			  		.style("font-family", "Arial")
			  		.style("font-size", "20px")
			  		.text(text[0]);
				legendGroup.append("text")
					.attr("x", x + 50)
					.attr("y", 100)
			  		.style("fill", "#9199a7")
			  		.style("font-family", "Arial")
			  		.style("font-size", "20px")
			  		.text(text[1]);
			}

			var flatText = [];
			flatMap(flatText, legends);

			var textWidths = flatText.map(function(value) {
				var textSizeContainer = component.get("v.textSizeContainer");
				var textCanvas = canvas;
				if (textSizeContainer) {
					textCanvas = d3.select("#" + textSizeContainer);
				}
			    var container = textCanvas.append("svg");
			    var textElement = container.append("text")
			    	.attr("x", -99999)
			    	.attr("y", -99999)
			    	.attr("font-family", "Arial")
			    	.attr("font-size", "20px")
			    	.text(value);
			    var width = textElement.node().getComputedTextLength();
			    container.remove();
			    return width;
			});

			var distance = d3.max(textWidths) + 70;
			var start = chartWidth - distance * legends.length + 20
			legends.forEach(function(value, index) {
				legend(start + distance * index, colorScale(index), value);
			});

			var titleGroup = svg.append("g");
		  	titleGroup.append("text")
				.attr("x", boxWidth / 2)
				.attr("y", 40)
		  		.style("fill", "#000")
		  		.style("font-family", "Arial")
		  		.style("font-weight", "normal")
		  		.style("font-size", "30px")
		  		.style("text-anchor", "middle")
		  		.text(title);

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

			var tooltip = svg.append("g")
				.attr("transform", "translate(-9999, -9999)")
				.style("opacity", 0)
			var tooltipRect = tooltip.append("rect")
				.attr("width", 20 + box.width)
				.attr("height", 20 + box.height)
				.attr("x", 50)
				.attr("y", 0)
				.style("opacity", 0.5);
			var tooltipText = tooltip.append("text")
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