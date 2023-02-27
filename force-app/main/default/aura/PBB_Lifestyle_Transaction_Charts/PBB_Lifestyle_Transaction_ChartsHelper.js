/**
 * Created by Mykhailo Reznyk on 14.11.2019.
 * Edited by Maria Pszonka on 28.08.2020 US-SGPRT-1463
 */
({
    fetchRollUpTransactions : function(component) {
        const action = component.get('c.fetchRollUpTransactionsInfo');
        action.setParams({ clientId : component.get('v.recordId') });
        this.buildEmptyBalancesAndCashFlowCharts(component);
        this.showSpinnerForRollup(component);
        action.setCallback(this, function(response) {
            const state = response.getState();
            if (state === "SUCCESS") {
                let transactions = response.getReturnValue();
                this.buildRollUpTransactionsCharts(transactions, component);
            } 
            else {
                this.showUnableToGetDataMessageForRollup(component);
            }
            this.hideSpinnerForRollup(component);
        });
        $A.enqueueAction(action);
    },

    fetchNarrativeTransactions : function(component) {
        const action = component.get('c.fetchNarrativeTransactionInfo');
        action.setParams({ clientId : component.get('v.recordId') });
        this.buildEmptyInflowAndOutflowCharts(component);
        this.showSpinnerForNarrative(component);
        action.setCallback(this, function(response) {
            const state = response.getState();
            if (state === "SUCCESS") {
                const transactionsData = response.getReturnValue();
                this.buildNarrativeTransactionsCharts(transactionsData, component);
            }
            else {
                this.showUnableToGetDataMessageForNarrative(component);
            }
            this.hideSpinnerForNarrative(component);
        });
        $A.enqueueAction(action);
    },

    buildRollUpTransactionsCharts: function(transactions, component) {
        if (!transactions) {
            this.buildEmptyBalancesAndCashFlowCharts(component);
            this.showNoDataMessageForRollup(component);
            return; 
        }

        transactions.sort((a, b) => new Date(a.period) - new Date(b.period));

        const labels = [];
        const balancesData = {
            maxBalances: [],
            minBalances: [],
            balanceLimits: [],
        };
        const cashFlowData = {
            inflow: [],
            outflow: [],
            inflowVolume: [],
            outflowVolume: [],
        };

        transactions.forEach( transaction => {
            if (transaction.period) {
                let formattedPeriod = transaction.period.substr(0, 4) + '/' + transaction.period.substr(4, 5);
                if (!labels.includes(formattedPeriod)) {
                    labels.push(formattedPeriod);
                }
                if (transaction.flagPosTransAmt === 0) {
                    cashFlowData.outflow.push(Math.abs(transaction.transactionAmount));
                    cashFlowData.outflowVolume.push(transaction.transactionCount);
                    balancesData.minBalances.push(transaction.accountBalance);
                    balancesData.balanceLimits.push(transaction.accountODLimit);
                }
                else if (transaction.flagPosTransAmt === 1) {
                    cashFlowData.inflow.push(transaction.transactionAmount);
                    cashFlowData.inflowVolume.push(transaction.transactionCount);
                    balancesData.maxBalances.push(transaction.accountBalance);
                }
            }
        })

        balancesData.labels = labels;
        cashFlowData.labels = labels;

        this.buildBalancesChart(component, balancesData);
        this.buildCashFlowChart(component, cashFlowData);
    },

    buildNarrativeTransactionsCharts : function(transactions, component) {
        if (!transactions) {
            this.showNoDataMessageForNarrative(component);
            return;
        }
        const inflowTransactions = transactions.inflowTransactions;
        const outflowTransactions = transactions.outflowTransactions;

        this.buildInflowChart(inflowTransactions, component);
        this.buildOutflowChart(outflowTransactions, component);
    },

    buildBalancesChart: function (component, data) {
        const { labels, maxBalances, minBalances, balanceLimits } = data;
        new Chart(component.find('balancesCanvas').getElement(), {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                     label: 'Max Balances',
                     fill: false,
                     borderColor: 'rgb(8,165,226)',
                     pointStyle: 'line',
                     data: maxBalances
                },
                {
                     label: 'Min Balances',
                     fill: false,
                     borderColor: 'rgb(118, 222, 217)',
                     pointStyle: 'line',
                     data: minBalances
                },
                {
                     label: 'Limit',
                     fill: false,
                     borderColor: 'rgb(22,50,92)',
                     pointStyle: 'line',
                     data: balanceLimits
                }]
            },
            options: {
                 responsive: true,
                 title: {
                     display: true,
                     text: 'Balances',
                     fontSize: 20
                 },
                 legend: {
                       position: 'right',
                       labels: {
                           usePointStyle: true
                       }
                 },
                 scales: {
                     yAxes: [{
                         ticks: {
                             suggestedMax: maxBalances.length < 1 ? 100000 : null
                         }
                     }]
                 }
            }
        });
    },

    buildCashFlowChart: function(component, data) {
        const {labels, inflow, outflow, inflowVolume, outflowVolume} = data;
        new Chart(component.find('cashFlowCanvas').getElement(), {
            type: 'bar',
            data: {
                    labels: labels,
                    datasets: [{
                        type: 'line',
                        label: 'Inflow',
                        fill: false,
                        borderColor: 'rgb(8,165,226)',
                        data: inflow
                    },
                    {
                        type: 'line',
                        label: 'Outflow',
                        fill: false,
                        borderColor: 'rgb(118, 222, 217)',
                        data: outflow
                    },
                    {
                        label: 'Inflow Volume',
                        backgroundColor: 'rgba(8,165,226,0.7)',
                        borderColor: 'rgb(0,191,255)',
                        yAxisID: 'y-axis-2',
                        data: inflowVolume
                    },
                    {
                        label: 'Outflow Volume',
                        backgroundColor: 'rgba(118, 222, 217,0.7)',
                        borderColor: 'rgb(118, 222, 217)',
                        yAxisID: 'y-axis-2',
                        data: outflowVolume
                    }]
                },
            options: {
                    animation: {
                       onComplete: function (e) {

                            var chartInstance = this.chart,
                            ctx = chartInstance.ctx;

                            if( inflow.length > 0){

                                ctx.textAlign = 'center';
                                ctx.fillStyle = "rgba(0, 0, 0, 1)";
                                ctx.textBaseline = 'bottom';

                                this.data.datasets.forEach(function (dataset, i) {
                                      var meta = chartInstance.controller.getDatasetMeta(i);
                                      meta.data.forEach(function (bar, index) {
                                          if(dataset.type != 'line'){
                                               var data = dataset.data[index];
                                               ctx.fillText(data, bar._model.x, bar._model.y - 5);
                                          }
                                      });
                                });

                            }
                       }
                    },
                    responsive: true,
                    title: {
                        display: true,
                        text: 'Cash Flow',
                        fontSize: 20
                    },
                    legend: {
                      position: 'bottom'
                    },
                    scales: {
                        yAxes: [{
                            id: 'y-axis-1',
                            ticks: {
                                suggestedMax: inflow.length < 1 ? 100000 : null
                            }
                        },
                        {
                            id: 'y-axis-2',
                            position: 'right',
                            gridLines:{
                                drawOnChartArea: false
                            },
                            ticks: {
                                suggestedMax: inflow.length < 1 ? 100 : null
                            }
                        }]
                    }
                }
        });
    },

    buildInflowChart : function(inflowTransactions, component) {
        var labels = [];
        var transactionAmounts = [];
        var transactionCounts = [];

        for (let i = 0; i < inflowTransactions.length; i++) {
            labels.push(inflowTransactions[i].creditor);
            transactionAmounts.push(inflowTransactions[i].transactionAmount);
            transactionCounts.push(inflowTransactions[i].transactionCount);
        }

        new Chart(component.find('inflowCanvas').getElement(), {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        type: 'line',
                        label: 'Transaction Count',
                        fill: false,
                        borderColor: 'rgb(8,165,226)',
                        yAxisID: 'y-axis-2',
                        data: transactionCounts
                    },
                     {
                        label: 'Transaction Amount',
                        backgroundColor: 'rgba(8,165,226,0.7)',
                        borderColor: 'rgb(0,191,255)',
                        yAxisID: 'y-axis-1',
                        data: transactionAmounts
                    },

               ]
            },
            options: {
                responsive: true,
                title: {
                    display: true,
                    text: 'Inflow Transactions by Narrative',
                    fontSize: 20
                },
                legend: {
                    position: 'bottom'
                },
                scales: {
                    yAxes: [{
                        id: 'y-axis-1',
                        ticks: {
                            suggestedMax: inflowTransactions.length < 1 ? 100000 : null
                        }
                    },
                     {
                         id: 'y-axis-2',
                         position: 'right',
                         gridLines:{
                             drawOnChartArea: false
                         },
                         ticks: {
                             suggestedMax: inflowTransactions.length < 1 ? 100 : null,
                             precision: 0,
                             beginAtZero: true,
                         }
                     }],
                    xAxes: [{
                      ticks: {
                        autoSkip: false
                      }
                    }]
                }
            }
        });
    },

    buildOutflowChart : function(outflowTransactions, component) {
        var labels = [];
        var transactionAmounts = [];
        var transactionCounts = [];

        for (let i = 0; i < outflowTransactions.length; i++) {
            labels.push(outflowTransactions[i].debtor);
            transactionAmounts.push(outflowTransactions[i].transactionAmount);
            transactionCounts.push(outflowTransactions[i].transactionCount);
        }

        new Chart(component.find('outflowCanvas').getElement(), {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                {
                    type: 'line',
                    label: 'Transaction count',
                    fill: false,
                    borderColor: 'rgb(8,165,226)',
                    yAxisID: 'y-axis-2',
                    data: transactionCounts
                },
                {
                    label: 'Absolute value of transaction amount sum',
                    backgroundColor: 'rgba(8,165,226,0.7)',
                    borderColor: 'rgb(0,191,255)',
                    data: transactionAmounts
                },

                ]
            },
            options: { 
                responsive: true,
                title: {
                    display: true,
                    text: 'Outflow Transactions by Narrative',
                    fontSize: 20
                },
                legend: {
                    position: 'bottom'
                },
                scales: {
                    yAxes: [{
                        id: 'y-axis-1',
                        ticks: {
                            suggestedMax: outflowTransactions.length < 1 ? 100000 : null
                        }
                    },
                    {
                        id: 'y-axis-2',
                        position: 'right',
                        gridLines:{
                            drawOnChartArea: false
                        },
                        ticks: {
                            suggestedMax: outflowTransactions.length < 1 ? 100 : null,
                            precision: 0,
                            beginAtZero: true,
                        }
                    }],
                    xAxes: [{
                      ticks: {
                        autoSkip: false
                      }
                    }]
                }
            },
        });
    },

    getRollupTransactionsDefaultLabels: function() {
        const labels = [];
        var today = new Date();
        var currentYear = today.getFullYear();
        var previousYear = currentYear - 1;
        var currentMonth = today.getMonth() + 1;
        var previousMonth = currentMonth == 1 ? 12 : currentMonth - 1;
        var month = previousMonth;
        var formattedMonth = "";
        var year = currentYear;

        var iteration = 0;
        var switchToPreviousYear = false;
        while (iteration < 13) {
            if (month != 1) {
                if (switchToPreviousYear) year = previousYear;
                if (month < 10) {
                    formattedMonth = "0" + month;
                }
                else {
                    formattedMonth = month;
                }
                labels.unshift(year + '/' + formattedMonth);
                month--;
            }
            else {
                formattedMonth = "0" + month;
                labels.unshift(year + '/' + formattedMonth);
                month = 12;
                switchToPreviousYear = true;
            }
            iteration++;
        }

        return labels;
    },

    buildEmptyBalancesAndCashFlowCharts: function(component) {
        const labels = this.getRollupTransactionsDefaultLabels();
        const balancesData = {
            labels,
            maxBalances: [],
            minBalances: [],
            balanceLimits: [],
        };
        const cashFlowData = {
            labels,
            inflow: [],
            outflow: [],
            inflowVolume: [],
            outflowVolume: [],
        };
        this.buildBalancesChart(component, balancesData);
        this.buildCashFlowChart(component, cashFlowData);
    },

    buildEmptyInflowAndOutflowCharts: function(component) {
         this.buildInflowChart([], component);
         this.buildOutflowChart([], component);
    },

    showNoDataMessageForRollup: function(component) {
        component.set("v.noDataMessageRollup", true);
    },

    showNoDataMessageForNarrative: function(component) {
        component.set("v.noDataMessageNarrative", true);
    },

    showUnableToGetDataMessageForRollup: function(component) {
        component.set("v.unableToGetDataMessageRollup", true);
    },
    
    showUnableToGetDataMessageForNarrative: function(component) {
        component.set("v.unableToGetDataMessageNarrative", true);
    },

    showSpinnerForRollup: function(component) {
        component.set("v.loadingDataRollup", true);
    },

    hideSpinnerForRollup: function(component) {
        component.set("v.loadingDataRollup", false);
    },
 
    showSpinnerForNarrative: function(component) {
        component.set("v.loadingDataNarrative", true);
    },

    hideSpinnerForNarrative: function(component) {
        component.set("v.loadingDataNarrative", false);
    },

})