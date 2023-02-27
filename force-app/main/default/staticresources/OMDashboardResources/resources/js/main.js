$(document).ready(function(){
    var canInteract = true;
    var activeItem = '';

    var chart = c3.generate({
        bindto: '#chart',
        data: {
            x : 'x',
            columns: [
                ['x', 'Asia', 'Brazil', 'Developed Markets', 'DRC', 'West Africa', 'Nigeria', 'South Africa'],

                ['data1', 30, 200, 200, 400, 150, 250, 200],
                ['data2', 130, 100, 100, 200, 150, 50, 130],
                ['data3', 230, 200, 200, 300, 250, 250, 200],
            ],
            colors: {
                data1: '#39adbc',
                data2: '#2dcce2',
                data3: '#da8b03',
                data4: '#ffb22e'
            },
            type: 'bar',
            onclick: function() {
                //console.log(chart);
                if(activeItem == '' && canInteract == true) {
                    canInteract = false;
                    chart.data.colors({
                        data1: '#428bca',
                        data2: '#5cb85c',
                        data3: '#5bc0de',
                        data4: '#f0ad4e',
                        data5: '#d9534f'
                    });
                    setTimeout(function(){
                        chart.load({
                            columns: [
                                ['data1', 300, 2000, 2000, 4000, 1050, 2500],
                                ['data2', 1300, 1000, 1000, 2000, 1500, 500],
                                ['data3', 2300, 2000, 2000, 3000, 2500, 2050],
                                ['data4', 1000, 5000, 1500, 2000, 3000, 1000],                          
                                ['data5', 5000, 5600, 6500, 8000, 6000, 5500]
                            ]
                        });
                        chart.groups([['data1', 'data2', 'data3', 'data4', 'data5']]);
                        activeItem = 'first';
                        canInteract = true;
                    },500);
                } else if(activeItem == 'first' && canInteract == true) {
                    canInteract = false;
                    chart.unload({
                        ids: ['data4', 'data5']
                    });
                    setTimeout(function(){
                        chart.data.colors({
                            data1: '#ff7f0e',
                            data2: '#1f77b4',
                            data3: '#2ca02c'
                        });
                        chart.load({
                            columns: [
                                ['data1', 30, 200, 200, 400, 150, 250],
                                ['data2', 130, 100, 100, 200, 150, 50],
                                ['data3', 230, 200, 200, 300, 250, 250]
                            ]
                        });
                        activeItem = '';
                        canInteract = true;
                    },1000);
                }
            }
        },
        axis: {
            x: {
                type: 'category' // this needed to load string x value
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

    var legend = d3.select('#chart').append('div', '.chart').attr('class', 'legend');
    legend.append('div').attr('data-id', 'data1').html('<span></span>'+'Pipeline');
    legend.append('div').attr('data-id', 'data2').html('<span></span>'+'Closed - Won');
    legend.append('div').attr('data-id', 'data3').html('<span></span>'+'Closed - Lost');

    d3.selectAll('.legend div')
    .each(function () {
        var id = d3.select(this).attr('data-id');
        d3.select(this).selectAll('span').style('background-color', chart.color(id));
    })
    .on('mouseover', function () {
        var id = d3.select(this).attr('data-id');
        chart.focus(id);
    })
    .on('mouseout', function () {
        var id = d3.select(this).attr('data-id');
        chart.revert();
    })
    .on('click', function () {
        var id = d3.select(this).attr('data-id');
        chart.toggle(id);
    });

    $('#toggle-chart').on('click', function() {
        var _this = $(this);
        var _chart = $('#chart-container');
        if(_chart.is(':visible')) {
            $('#chart-container').slideUp();
            _this.addClass('collapsed');
        } else {
            $('#chart-container').slideDown();
            _this.removeClass('collapsed');
        }
    });
});