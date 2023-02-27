//object which will hold all the data required for each graph and table            
    
function HomeCtrl($scope, $rootScope, AngularForce, $location, $route, $filter) {
    $scope.data = {};

    $scope.init = {};
        
    var headings = {
        allfranco : "All Opportunities per Franco ('000)",
        allsector : "All Opportunities per Sector ('000)",
        pipelinefranco : "All Pipeline Opportunities per Franco ('000)",
        pipelinesector : "All Pipeline Opportunities per Sector ('000)",
        closedfranco : "All Closed Opportunities per Franco ('000)",
        closedsector : "All Closed Opportunities per Sector ('000)"
    };

    var legends = {};
    // legends for various tabs
    legends['all'] = {
        'Pipeline' : 'pipeLineRev',
        'Closed - Won' : 'ClosedWonRev',
        'Closed - Lost' : 'ClosedLostRev'
    };

    legends['pipeline'] = {
        'C Cov' : 'cCovRev',
        'GM': 'gmRev',
        'IB' : 'ibRev',
        'TPS' : 'tpsRev',
        'RE' : 'reRev',
        'BE' : 'beRev',
        'GMGT' : 'glmRev'
    };

    legends['closed'] = {
        'Closed - Won - PY' : 'WonPY',
        'Closed - Won - CY' : 'WonCY',
        'Closed - Lost - PY' : 'LostPY',
        'Closed - Lost - CY': 'LostCY'
    };

    $scope.activeDFIcon = 'map';
    $scope.filtered = false;
    $scope.drilledDown = false;
    $scope.activeView = 'chart';

    $scope.authenticated = AngularForce.authenticated();
    
    AngularForce.inVisualforce = true;

    if (!$scope.authenticated) {
        if (AngularForce.inVisualforce) {
            AngularForce.login();
        } else {    
            return $location.path('/login');
        }
    }
    
    $scope.logout = function () {
        AngularForce.logout();
        $location.path('/login');
    }

   
    /*
    All
    */
    $scope.init.all = function(grouped,type,filter) {

        if($scope.activeDSF == 'sector') {
            type = 'sector';
        }

        // top tabs data       
        var allOpportunitiesCYRev = 0;
        var allOpportunitiesTotalRev = 0;

        // franco data
        var allOpportunitiesPipeline = ['Pipeline'];
        var allOpportunitiesClosedWon = ['Closed - Won'];
        var allOpportunitiesClosedLost = ['Closed - Lost'];
        var oppList = ['x'];
        var oppCount = 0;
        
        if(type == 'sector') {
            var allOpportunities = $rootScope.allOpportunitiesSector;
        } else {
            var allOpportunities = $rootScope.allOpportunitiesFranco;
        }

        $scope.allOpportunities = allOpportunities;
        if($scope.activeDF == 'all') {
            $scope.activeTabFranco = allOpportunities;
        }
            
        for (var i = 0; i < allOpportunities.length; i++) {
            if(filter && allOpportunities[i].oppFranco == filter || filter && allOpportunities[i].oppSector == filter || !filter) {

                allOpportunitiesCYRev += (allOpportunities[i].ClosedWonRev + allOpportunities[i].ClosedLostRev);
                allOpportunitiesTotalRev += (allOpportunities[i].totalRev);

                if(type == 'sector') {
                    oppList.push(allOpportunities[i].oppSector);
                } else {
                    oppList.push(allOpportunities[i].oppFranco);
                }

                oppCount += allOpportunities[i].oppCount;
                allOpportunitiesPipeline.push(allOpportunities[i].pipeLineRev);
                allOpportunitiesClosedWon.push(allOpportunities[i].ClosedWonRev);
                allOpportunitiesClosedLost.push(allOpportunities[i].ClosedLostRev);
            }
        };

        $scope.graphDataAll = oppList;
        
        $scope.allOpportunitiesCYRev = $filter('number')(allOpportunitiesCYRev, 0);                
        $scope.allOpportunitiesTotalRev = $filter('number')(allOpportunitiesTotalRev, 0);  
        $scope.oppNumber = oppCount;

        if(grouped == false) {
            $scope.data.all = {
                columns : [
                    oppList,            
                    allOpportunitiesPipeline,
                    allOpportunitiesClosedWon,
                    allOpportunitiesClosedLost
                ],
                groups : [
                    ['Pipeline'],
                    ['Closed - Won'],
                    ['Closed - Lost']
                ]
            };
        } else {
            $scope.data.all = {
                columns : [
                    oppList,            
                    allOpportunitiesPipeline,
                    allOpportunitiesClosedWon,
                    allOpportunitiesClosedLost
                ],
                groups : [
                    'Pipeline',
                    'Closed - Won',
                    'Closed - Lost'
                ]
            };
        }
    }
    
    /*
    AllOpportunityPipelineDivlst
    */
    $scope.init.pipeline = function(grouped,type,filter) {

        if($scope.activeDSF == 'sector') {
            type = 'sector';
        }

        var allOpportunityPipelineDivlstCYRev = 0;
        var allOpportunityPipelineDivlstCYTotalRev = 0;
        var pipeOpCount = 0;
        var pipelineList = ['x'];
        var ccon = ['C Cov'];
        var gm = ['GM'];
        var ib = ['IB'];
        var tps = ['TPS'];
        var re = ['RE'];
        var be = ['BE'];
        var glm = ['GMGT'];

        if(type == 'sector') {
            var allOpportunityPipelineDivlst = $rootScope.allOpportunityPipelineSectorDivlst;
            var topOpp = $rootScope.sectorTopOpp;
            $scope.selectedItem = 'Sector';
        } else {
            var allOpportunityPipelineDivlst = $rootScope.allOpportunityPipelineDivlst;
            var topOpp = $rootScope.topOpp;
            $scope.selectedItem = 'Franco';
        }

        $scope.allOpportunityPipelineDivlst = allOpportunityPipelineDivlst;
        if($scope.activeDF == 'pipeline') {
            $scope.activeTabFranco = allOpportunityPipelineDivlst;
        }
        $scope.topOpp = topOpp;

        for (var i = 0; i < allOpportunityPipelineDivlst.length; i++) {
            if(filter && allOpportunityPipelineDivlst[i].oppFranco == filter || filter && allOpportunityPipelineDivlst[i].oppSector == filter || !filter) {  
                allOpportunityPipelineDivlstCYRev += allOpportunityPipelineDivlst[i].currYearRev;
                allOpportunityPipelineDivlstCYTotalRev += allOpportunityPipelineDivlst[i].totalRev;
                pipeOpCount += allOpportunityPipelineDivlst[i].oppPipelineCount;

                if(type == 'sector') {
                    pipelineList.push(allOpportunityPipelineDivlst[i].oppSector);
                } else {
                    pipelineList.push(allOpportunityPipelineDivlst[i].oppFranco);
                }
                
                ccon.push(allOpportunityPipelineDivlst[i].cCovRev);
                gm.push(allOpportunityPipelineDivlst[i].gmRev);
                ib.push(allOpportunityPipelineDivlst[i].ibRev);
                tps.push(allOpportunityPipelineDivlst[i].tpsRev);
                re.push(allOpportunityPipelineDivlst[i].reRev);
                be.push(allOpportunityPipelineDivlst[i].beRev);
                glm.push(allOpportunityPipelineDivlst[i].glmRev);
            }
        };

        $scope.graphDataPipeline = pipelineList;
        
        $scope.allOpportunityPipelineDivlstCYRev = $filter('number')(allOpportunityPipelineDivlstCYRev, 0);                
        $scope.allOpportunityPipelineDivlstCYTotalRev = $filter('number')(allOpportunityPipelineDivlstCYTotalRev, 0);
        $scope.pipeOpCount = pipeOpCount;

        if(grouped == false) {
            $scope.data.pipeline = {
                columns : [
                    pipelineList,
                    ccon,
                    gm,
                    ib,
                    tps,
                    re,
                    be,
                    glm
                ],
                groups : [
                    ['C Cov'],
                    ['GM'],
                    ['IB'],
                    ['TPS'],
                    ['RE'],
                    ['BE'],
                    ['GMGT']
                ]
            };
        } else {
            $scope.data.pipeline = {
                columns : [
                    pipelineList,
                    ccon,
                    gm,
                    ib,
                    tps,
                    re,
                    be,
                    glm
                ],
                groups : ['C Cov','GM','IB','TPS','RE','BE','GMGT']
            };
        }
    }

    /*
    ClosedOpportunityPipelineDivlst
    */
    $scope.init.closed = function(grouped,type,filter) { 

        if($scope.activeDSF == 'sector') {
            type = 'sector';
        }

        var allClosedOpportunitylstCYWonRev = 0;
        var allClosedOpportunitylstCYLostRev = 0;
        var closedOpCount = 0;
        var oppListClosed = ['x'];
        var ClosedWonPY = ['Closed - Won - PY'];
        var ClosedWonCY = ['Closed - Won - CY'];
        var ClosedLostPY = ['Closed - Lost - PY'];
        var ClosedLostCY = ['Closed - Lost - CY'];
        var ClosedWonCYRevTotal = 0;
        var ClosedLostCYRevTotal = 0;


        if(type == 'sector') {
            var allClosedOpportunitylst = $rootScope.allClosedOpportunitySeclst;
        } else {
            var allClosedOpportunitylst = $rootScope.allClosedOpportunitylst;
        }

        $scope.allClosedOpportunitylst = allClosedOpportunitylst;
        if($scope.activeDF == 'closed') {
            $scope.activeTabFranco = allClosedOpportunitylst;
        }
        
        for (var i = 0; i < allClosedOpportunitylst.length; i++) {
            allClosedOpportunitylstCYWonRev += allClosedOpportunitylst[i].ClosedWonCYRev;
            allClosedOpportunitylstCYLostRev += allClosedOpportunitylst[i].ClosedLostCYRev;
            if(type == 'sector') {
                oppListClosed.push(allClosedOpportunitylst[i].oppSector);
            } else {
                oppListClosed.push(allClosedOpportunitylst[i].oppFranco);
            }
                
            ClosedWonPY.push(allClosedOpportunitylst[i].ClosedWonPYRev);
            ClosedWonCY.push(allClosedOpportunitylst[i].ClosedWonCYRev);
            ClosedLostPY.push(allClosedOpportunitylst[i].ClosedLostPYRev);
            ClosedLostCY.push(allClosedOpportunitylst[i].ClosedLostCYRev);
        }

        closedOpCount = allClosedOpportunitylstCYWonRev / ( allClosedOpportunitylstCYWonRev + allClosedOpportunitylstCYLostRev) * 100;
        $scope.graphDataClosed = oppListClosed;
        
        $scope.allClosedOpportunitylstCYWonRev = $filter('number')(allClosedOpportunitylstCYWonRev, 0);
        $scope.allClosedOpportunitylstCYLostRev = $filter('number')(allClosedOpportunitylstCYLostRev, 0);  
        $scope.closedOpCount = (isNaN(closedOpCount))?"N/A":$filter('number')(closedOpCount, 0) + "%";

        if(grouped == false) {
            $scope.data.closed = {
                columns : [
                    oppListClosed,
                    ClosedWonPY,
                    ClosedWonCY,
                    ClosedLostPY,
                    ClosedLostCY
              ],
              groups : [
                    ['Closed - Won - PY'],
                    ['Closed - Won - CY'],
                    ['Closed - Lost - PY'],
                    ['Closed - Lost - CY']
                ]
            };
        } else {
            $scope.data.closed = {
                columns : [
                    oppListClosed,
                    ClosedWonPY,
                    ClosedWonCY,
                    ClosedLostPY,
                    ClosedLostCY
                ],
                groups : ['Closed - Won - PY','Closed - Won - CY','Closed - Lost - PY','Closed - Lost - CY']
            };
        }
    }

    $scope.drillDownGraph = function(element,currentElement) {
        
        // set default vars
        var dataSource = {};
        var drillDown = {};
        var dataLegends = [];
        var dataLegendsGrouped = [];
        var francolist = ['x'];
        var sectorlist = ['x'];
        var allOpportunityPipelineDivlstCYRev = 0;
        var allOpportunityPipelineDivlstCYTotalRev = 0;
        var pipeOpCount = 0;
        var topOppFiltered = [];
        var closedOpCount = 0;

        // set datasource
        if(element != 'All') {
            if($scope.activeDF == 'pipeline') {
                dataSource = $scope.allOpportunityPipelineFrancolst;
            } else if($scope.activeDF == 'closed') {
                dataSource = $scope.allOpportunityClosedFrancolst;
            }

            // check if an element exists in array using a comparer function
            // comparer : function(currentElement)
            Array.prototype.inArray = function(comparer) { 
                for(var i=0; i < this.length; i++) { 
                    if(comparer(this[i])) return true; 
                }
                return false; 
            }; 

            // adds an element to the array if it does not already exist using a comparer function
            Array.prototype.pushIfNotExist = function(element, comparer) { 
                if (!this.inArray(comparer)) {
                    this.push(element);
                }
            }; 
            // set drill down
            if ($scope.activeDSF == "franco") {
                drillDown = $filter('filter')(dataSource, {oppFranco: element}, true);
                for (var i = 0; i < drillDown.length; i++) {
                    sectorlist.pushIfNotExist(drillDown[i].oppSector, function(e) { 
                        return e === drillDown[i].oppSector; 
                    });
                }
                var targetList = sectorlist;
            } else {
                drillDown = $filter('filter')(dataSource, {oppSector: element}, true);
                for (var i = 0; i < drillDown.length; i++) {
                    francolist.pushIfNotExist(drillDown[i].oppFranco, function(e) { 
                        return e === drillDown[i].oppFranco; 
                    });
                }
                var targetList = francolist;
            }

            console.log(sectorlist);
                
            // build legend groups    
            $.each(Object.keys(legends[$scope.activeDF]), function(k, v) {
                dataLegends.push([v]);
                dataLegendsGrouped.push(v);
            }); 

            // duplicate legends array to insert column data
            var columnData = $.extend(true,[],dataLegends);
                    console.log(columnData);

            // check if data is available
            if(drillDown.length > 0) {
                $scope.selectedItem = element;
        
                // update navigation active state
                $('#chart-container nav button.active').removeClass('active');
                $('#chart-container nav button').each(function(){
                    if($(this).text().trim() == element) {
                        $(this).addClass('active');
                    }
                });

                // flag that graph is in drilled down state 
                $scope.drilledDown = true;
                
                // check for active section
                if($scope.activeDF == 'pipeline') {
                    // filter table data according to selected franco
                    if($scope.activeDSF == "franco") {
                        $scope.topOpp = $filter('filter')($scope.topOppPipelineDrillDownFranco, {oppFranco: element}, true);
                    } else {
                        $scope.topOpp = $filter('filter')($scope.topOppPipelineDrillDownSector, {oppSector: element}, true);
                    }
                    
                    // update top blocks data
                    for (var i = 0; i < drillDown.length; i++) {
                        allOpportunityPipelineDivlstCYRev += drillDown[i].currYearRev;
                        allOpportunityPipelineDivlstCYTotalRev += drillDown[i].totalRev;
                        pipeOpCount += drillDown[i].oppPipelineCount;
                    }

                    $scope.allOpportunityPipelineDivlstCYRev = $filter('number')(allOpportunityPipelineDivlstCYRev, 0);
                    $scope.allOpportunityPipelineDivlstCYTotalRev = $filter('number')(allOpportunityPipelineDivlstCYTotalRev, 0);
                    $scope.pipeOpCount = pipeOpCount;

                } else if($scope.activeDF == 'closed') {

                    // reset top blocks data
                    $scope.allClosedOpportunitylstCYWonRev = 0;
                    $scope.allClosedOpportunitylstCYLostRev = 0;
                    $scope.closedOpCount = 0;

                    // update top blocks data
                    for (var i = 0; i < drillDown.length; i++) {
                        $scope.allClosedOpportunitylstCYWonRev += drillDown[i].WonCY;
                        $scope.allClosedOpportunitylstCYLostRev += drillDown[i].LostCY;
                    }

                    closedOpCount = $scope.allClosedOpportunitylstCYWonRev / ( $scope.allClosedOpportunitylstCYWonRev + $scope.allClosedOpportunitylstCYLostRev) * 100;

                    // update top blocks data
                    $scope.allClosedOpportunitylstCYWonRev = $filter('number')($scope.allClosedOpportunitylstCYWonRev, 0);
                    $scope.allClosedOpportunitylstCYLostRev = $filter('number')($scope.allClosedOpportunitylstCYLostRev, 0);
                    $scope.closedOpCount = (isNaN(closedOpCount))?"N/A":$filter('number')(closedOpCount, 0) + "%";

                    // set table data for top 5 won opportunities
                    if($scope.activeDSF == "franco") {
                        if($filter('filter')($scope.topOppClosedWonDrillDownFranco, {oppFranco: element}, true) != null) {
                            $scope.top5WonClosedOpportunitylst = $filter('filter')($scope.topOppClosedWonDrillDownFranco, {oppFranco: element}, true);
                        } else {
                            $scope.top5WonClosedOpportunitylst = '';
                        }
                    } else {
                        if($filter('filter')($scope.topOppClosedWonPipelineDrillDownSector, {oppSector: element}, true) != null) {
                            $scope.top5WonClosedOpportunitylst = $filter('filter')($scope.topOppClosedWonPipelineDrillDownSector, {oppSector: element}, true);
                        } else {
                            $scope.top5WonClosedOpportunitylst = '';
                        }
                    }

                    // set table data for top 5 lost opportunities
                    if($scope.activeDSF == "franco") {
                        if($filter('filter')($scope.topOppClosedLostDrillDownFranco, {oppFranco: element}, true) != null) {
                            $scope.top5LostClosedOpportunitylst = $filter('filter')($scope.topOppClosedLostDrillDownFranco, {oppFranco: element}, true);
                        } else {
                            $scope.top5LostClosedOpportunitylst = '';
                        }
                    } else {
                         if($filter('filter')($scope.topOppClosedLostPipelineDrillDownSector, {oppSector: element}, true) != null) {
                            $scope.top5LostClosedOpportunitylst = $filter('filter')($scope.topOppClosedLostPipelineDrillDownSector, {oppSector: element}, true);
                        } else {
                            $scope.top5LostClosedOpportunitylst = '';
                        }
                    }
                    
                }

                var hasChartData = false;

                // looping through sectors, finding sector data by oppSec name
                for (var i = 0; i < dataLegends.length; i++) {
                    var source = null;
                    $.each(targetList, function(k, v) {
                        // looping through sectors, but skipping first element required by c3
                        if (v != "x")  {
                            if($scope.activeDSF == "franco") {
                                source = $filter('filter')(drillDown, {oppSector: v}, true);
                            } else {
                                source = $filter('filter')(drillDown, {oppFranco: v}, true);
                            }

                            var aggregatedDataValues = 0;
                            for (var m = 0; m < source.length; m++) {
                                aggregatedDataValues += (source[m][legends[$scope.activeDF][dataLegends[i][0]]]);
                            }

                            if(aggregatedDataValues > 0) {
                                hasChartData = true;
                    console.log('more than 0');
                            }

                            columnData[i].push(aggregatedDataValues);
                        }
                    });
                    
                };

                // build up data structure for graph 
                if (typeof(columnData) != 'undefined') {
                    columnData.unshift(targetList);
                    var data = {
                        columns : columnData,
                        groups : dataLegendsGrouped
                    };

                    // update UI
                    console.log(hasChartData);
                    if(hasChartData == true) {
                        $scope.initGraph(data);
                        $scope.initLegend(data);
                    } else {
                        $('#chart').html('<p class="notice">There is currently no detailed graph data available for '+element+'</p>');
                    }
                    $scope.heading = headings[$scope.activeDF + $scope.activeDSF] + ' - ' + element;
                    $scope.$apply();
                }
            } else {
                $('#main-modal .modal-title').html('No data');
                $('#main-modal .modal-body').html('No Data available for ' + element);
                $('#main-modal').modal({
                    show: true,
                    backdrop: 'static'
                });
            }
        } else {
            // update navigation active state
            $('#chart-container nav button.active').removeClass('active');
            $('#chart-container nav button:first-child').addClass('active');

            $scope.init[$scope.activeDF](true,$scope.activeDSF);
            $scope.initGraph($scope.data[$scope.activeDF]);
            $scope.initLegend($scope.data[$scope.activeDF]);
            $scope.drilledDown = false;
            $scope.filtered = false;
            $scope.heading = headings[$scope.activeDF + $scope.activeDSF];
        }
    }

    function addHammer() {
        if($scope.drilledDown == false && $scope.activeDF != 'all') {
            $('rect.c3-event-rect').off().hammer().on('doubletap', function() {
                if($scope.activeDF == 'all') {
                    var _filter = $scope.graphDataAll[$(this).index() + 1];
                } else if($scope.activeDF == 'pipeline') {
                    var _filter = $scope.graphDataPipeline[$(this).index() + 1];
                } else if($scope.activeDF == 'closed') {
                    var _filter = $scope.graphDataClosed[$(this).index() + 1];
                }

                $scope.drillDownGraph(_filter);
            });
        }
    }
    
    var chart = null;
    var canInteract = true;
    var activeItem = '';
    $scope.initGraph = function(data) {
        chart = c3.generate({
            bindto: '#chart',
            color: { pattern: ['#1996D0', '#6BD0FF', '#1FB8FF', '#3E6B7F', '#1993CC', '#9324A6', '#C46DD2', '#B22CC9', '#45264A', '#852196' ] },
            data: {
                x : 'x',
                columns:  data.columns,
                groups: [
                    data.groups
                ],
                type: 'bar'
            },
            axis: {
                x: {
                    type: 'category',
                    tick: {
                        rotate: 70
                        
                    },
                    height: 130
                },
                y: {
                    tick: {
                        format: function (d) { return "R" + (d / 1000).formatMoney(2,','); }
                    }
                }
            },
            grid: {
                y: {
                    show: true
                }
            },
            legend: {
                show: false
            }
        });
        
        setTimeout(function(){
            addHammer();
        },1050);
    }

    $scope.updateGraph = function(data,unload) {
        if(unload == true){
            chart.unload();
        }

        chart.load({
            columns: data.columns
        }); 
                
        chart.groups([
            data.groups
        ]);
        
        setTimeout(function(){
            addHammer();
        },1050);
    }
    
    $scope.initLegend = function(data) {
        if($('#chart .legend').length) {
            $('#chart .legend').html('');
            var legend = d3.select('#chart .legend');
        } else {
            var legend = d3.select('#chart').append('div', '.chart').attr('class', 'legend');
        }
        
        $.each(data.groups, function(index,val) {
           legend.append('div').attr('data-id', val).html('<span></span>'+val);
        });
        
        d3.selectAll('.legend div').each(function () {
           var id = d3.select(this).attr('data-id');
           d3.select(this).selectAll('span').style('background-color', chart.color(id));
        })
        .on('click', function () {
            var id = d3.select(this).attr('data-id');
            var _this = $(this);
            chart.toggle(id);
            if(_this.hasClass('inactive')) {
                _this.removeClass('inactive');
            } else {
                _this.addClass('inactive');
            }
            addHammer();
        });
        
        if(!/iPhone|iPad|iPod/i.test(navigator.userAgent) && !/Android/i.test(navigator.userAgent)) {
            d3.selectAll('.legend div')
            .on('mouseover', function () {
                var id = d3.select(this).attr('data-id');
                chart.focus(id);
            })
            .on('mouseout', function () {
                var id = d3.select(this).attr('data-id');
                chart.revert();
            });
        }             
    }
     
    $scope.toggleChart = function() {
        var _this = $('#toggle-chart');
        var _chart = $('#chart-container');
        var _img = _this.find('img');
        if(_chart.is(':visible')) {
            $('#chart-container').slideUp();
            _img.attr('src',_img.attr("src").replace("minus.png", "plus.png"));
        } else {
            $('#chart-container').slideDown();
            _img.attr('src',_img.attr("src").replace("plus.png", "minus.png"));
        }
    }

    $scope.handleToggle = function(element) {
        $scope.drilledDown =  false;
        $("#top-tabs .col").removeClass("active");                    
        $(element.currentTarget).addClass("active");
        var activeTab = $(element.currentTarget).attr('id');
        $(".gridData").addClass("hidden");
        $("#" + activeTab + "Tab").removeClass("hidden");

        switch (activeTab) {
            case "all":
                $scope.activeDSF = 'franco';
                $scope.activeDFIcon = 'map';
                $("#toggleFrancoSector").parent().find('.h4.active').removeClass('active').parent().find('.h4:last-child').addClass('active');
                break;
        }

        $scope.activeDF = activeTab;
        $scope.activeDataFeed = $scope.data[activeTab];
        $.each($scope.init, function(key, val) {
            val();
        });
        $scope.initGraph($scope.data[activeTab]);
        $scope.initLegend($scope.data[activeTab]);
        $scope.filtered = false;

        $scope.heading = headings[activeTab + $scope.activeDSF];

        $('#chart-container nav button.active').removeClass('active');
        $('#chart-container nav button:first-child').addClass('active');
    }

    $scope.toggleFrancoSector = function(element) {
         var destinationSegment = '';
        $(element.currentTarget).parent().find('.h4').each(function() {
            var _this = $(this);
            if(!_this.hasClass('active')) {
                destinationSegment = _this.text();
            }
            _this.toggleClass('active');
        });

        if(destinationSegment == 'Franco') {
            $scope.activeDSF = 'franco';
            $scope.activeDFIcon = 'map';
        } else {
            $scope.activeDSF = 'sector';
            $scope.activeDFIcon = 'cog';
        }

        $.each($scope.init, function(key, val) {
            val();
        });
        if($scope.drilledDown == true) {
            $scope.initGraph($scope.data[$scope.activeDF]);
            $scope.initLegend($scope.data[$scope.activeDF]);
            $scope.drilledDown = false;
        } else {
            $scope.updateGraph($scope.data[$scope.activeDF]);
        }
        $scope.heading = headings[$scope.activeDF + $scope.activeDSF];

        $('#chart-container nav button:first-child').addClass('active');
    }
    
/*    setTimeout(function(){
        $('body').width($(window).innerWidth());
    }, 4000);*/
    
    $scope.openInternalLink = function(object) {
        if( (typeof sforce != 'undefined') && (sforce != null) ) {
            sforce.one.navigateToSObject(object);
        } else {
            window.location.href = '/'+object;
        }
    }

    $scope.activeDF = 'all';
    $scope.activeDSF = 'franco';

    $scope.heading = headings[$scope.activeDF + $scope.activeDSF];

    $.each($scope.init, function(key, val) {
        val();
    });
    $scope.activeTabFranco = $rootScope.allOpportunitiesFranco;

    $scope.$on('$viewContentLoaded', function(){
        setTimeout(function(){
            $scope.initGraph($scope.data.all);
            $scope.initLegend($scope.data.all);
        },1000);
    });

    $scope.hideToolTip = function($event) {
        $(".c3-tooltip").hide();
    }
}

function LoginCtrl($scope, AngularForce, $location) {
    $scope.login = function () {
        AngularForce.login();
    }

    if (AngularForce.inVisualforce) {
        AngularForce.login();
        console.log("LoginCtrl just authenticated go to /");
        $location.path('/');
    }
}