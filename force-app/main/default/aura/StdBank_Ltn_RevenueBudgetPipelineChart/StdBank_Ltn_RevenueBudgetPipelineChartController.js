({
	setup : function(component, event, helper) {
		
	    var labs = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	    
	    var getTotalPipeline = component.get("c.getTotalPipeline");
		
		var pipelinePromise = new Promise(function(resolve) {
			getTotalPipeline.setCallback(this, function(response) {
				var state = response.getState();
				if (component.isValid() && state === "SUCCESS") {
					component.set("v.totalPipeline", response.getReturnValue());
				}
				resolve();
			});
		});

		var getRevenueByMonth = component.get("c.getRevenueByMonth");
		
		var revenuePromise = new Promise(function(resolve) {
			getRevenueByMonth.setCallback(this, function(response) {
				var state = response.getState();
				if (component.isValid() && state === "SUCCESS") {
					component.set("v.revenueByMonth", response.getReturnValue());
				}
				resolve();
			});
		});

		var getBudgetByMonth = component.get("c.getBudgetByMonth");
		
		var budgetPromise = new Promise(function(resolve) {
			getBudgetByMonth.setCallback(this, function(response) {
				var state = response.getState();
				if (component.isValid() && state === "SUCCESS") {
					component.set("v.budgetByMonth", response.getReturnValue());
				}
				resolve();
			});
		});

		var getWonOppByMonth = component.get("c.getWonOppRevenueByMonth");
		
		var wonOppPromise = new Promise(function(resolve) {
			getWonOppByMonth.setCallback(this, function(response) {
				var state = response.getState();
				if (component.isValid() && state === "SUCCESS") {
					component.set("v.wonOppByMonth", response.getReturnValue());
				}
				resolve();
			});
		});

		var getUserIsoCode = component.get("c.getUserIsoCode");

		var isoCodePromise = new Promise(function(resolve) {
			getUserIsoCode.setCallback(this, function(response) {
				var state = response.getState();
				if (component.isValid() && state === "SUCCESS") {
					component.set("v.isoCode", response.getReturnValue());
				}
				resolve();
			});
		});

		Promise.all([pipelinePromise, revenuePromise, budgetPromise, wonOppPromise, isoCodePromise])
			.then($A.getCallback(function() {
				
				if (component.isValid()) {
					var revenueByMonth = component.get('v.revenueByMonth');
					var budgetByMonth = component.get('v.budgetByMonth');
					var wonOppByMonth = component.get('v.wonOppByMonth');
					var totalPipeline = component.get('v.totalPipeline');
					var isoCode = component.get('v.isoCode');
					var stepSize = 5000000;
					
					var maxIndex = Math.max(revenueByMonth.length,budgetByMonth.length, wonOppByMonth.length);
					var pipelineByMonth = new Array(maxIndex);	
					var totalBudget = new Array(maxIndex);			
					var axisLabels = [];

					for (var i = 0; i < maxIndex; i++) 
					{ 
						axisLabels.push(labs[i]);
					}
					pipelineByMonth[maxIndex-1] = totalPipeline;
					totalBudget[maxIndex.length-1] = budgetByMonth[budgetByMonth.length-1];

					var config = {
							type: 'bar',
					    	data: {
					        labels: axisLabels,
					        datasets: [
							{
					        	label: $A.get("$Label.c.Won_Opportunities_YTD"),
					        	type: 'line',
								borderWidth: 3,
								hoverBorderWidth: 5,
								backgroundColor:'rgba(255, 183, 93, 0)',
								hoverBackgroundColor : 'rgba(255, 183, 93, 0)',
								borderColor:'rgba(255, 183, 93, 0.95)',
								hoverBorderColor: 'rgba(255, 183, 93, 1)',
					            data: wonOppByMonth
					        },									        
							{
					        	label: $A.get("$Label.c.Revenue_YTD"),
					        	type: 'bar',
								borderWidth: 3,
								hoverBorderWidth: 5,
								backgroundColor:'rgba(52, 152, 219, 0.8)',
								hoverBackgroundColor : 'rgba(52, 152, 219, 1)',
								borderColor:'rgba(52, 152, 219, 0.95)',
								hoverBorderColor: 'rgba(52, 152, 219, 1)',
					            data: revenueByMonth
					        },
					        {
					        	label: $A.get("$Label.c.Budget_YTD"),
					        	type: 'bar',
								borderWidth: 3,
								hoverBorderWidth: 5,
								backgroundColor:'rgba(126, 140, 153, 0.8)',
								hoverBackgroundColor : 'rgba(126, 140, 153, 1)',
								borderColor:'rgba(126, 140, 153, 0.95)',
								hoverBorderColor: 'rgba(126, 140, 153, 1)',
					            data: totalBudget
					        },
					        {
					        	label: $A.get("$Label.c.CY_Pipeline"),
					        	type: 'bar',
								borderWidth: 3,
								hoverBorderWidth: 5,
								backgroundColor:'rgba(26, 187, 156, 0.8)',
								hoverBackgroundColor : 'rgba(26, 187, 156, 1)',
								borderColor:'rgba(26, 187, 156, 0.95)',
								hoverBorderColor: 'rgba(26, 187, 156, 1)',
					            data: pipelineByMonth
					        }]
					    },

					    options: {
						    scales: {
						        yAxes: [
						            {
						                ticks: {
						                	beginAtZero: true,
						                	maxTicksLimit: 10,
						                    callback: function(label, index, labels) {
						                        return Number(label/1000000).toFixed(0);
						                    }
						                },
						                scaleLabel: {
						                    display: true,
						                    labelString: '[Million '+isoCode+']'
						                }
						            }
						        ]
						    }
						}
					};
					
					var el = component.find("chart").getElement();
				    var ctx = el.getContext("2d");
				    var myLineChart = new Chart(ctx, config);
				}
			}));

		$A.enqueueAction(getRevenueByMonth);
		$A.enqueueAction(getBudgetByMonth);
		$A.enqueueAction(getTotalPipeline);
		$A.enqueueAction(getUserIsoCode);
		$A.enqueueAction(getWonOppByMonth);

		
	}
})