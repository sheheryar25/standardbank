/**
 * Created by Emmanuel Mulea Nocks on 2020/02/26.
 */

({
    getEcosystemStructure:function (component,event) {

            let action = component.get('c.getEcosystemStructure');
            action.setParams({'accountId': component.get('v.recordId')});
            action.setCallback(this, function (res) {
                component.set("v.isWaiting", false);
                let state = res.getState();
                if (state === "SUCCESS") {

                    let data = res.getReturnValue();
                    component.set('v.showMindMap', data['isEcosystem']);
                    if (data['isEcosystem']) {
                        let dataSet = {
                            "name": data['ecosystemName'],
                            "Relationship_Group_Number__c": data['Relationship_Group_Number__c'],
                            "children": [{
                                "name": "Subsidiaries",
                                "bankedCount": data['banked.Subsidiary'] ? data['banked.Subsidiary'] : 0,
                                "unbankedCount": data['unbanked.Subsidiary'] ? data['unbanked.Subsidiary'] : 0
                            }, {
                                "name": "Debtors/Clients",
                                "bankedCount": data['banked.Debtor / Client'] ? data['banked.Debtor / Client'] : 0,
                                "unbankedCount": data['unbanked.Debtor / Client'] ? data['unbanked.Debtor / Client'] : 0
                            }, {
                                "name": "Creditors/Suppliers",
                                "bankedCount": data['banked.Creditor / Supplier'] ? data['banked.Creditor / Supplier'] : 0,
                                "unbankedCount": data['unbanked.Creditor / Supplier'] ? data['unbanked.Creditor / Supplier'] : 0
                            },

                                {
                                    "name": "Partners",
                                    "bankedCount": data['banked.Partner'] ? data['banked.Partner'] : 0,
                                    "unbankedCount": data['unbanked.Partner'] ? data['unbanked.Partner'] : 0
                                }, {
                                    "name": "Shareholders",
                                    "bankedCount": data['banked.Shareholder / Director'] ? data['banked.Shareholder / Director'] : 0,
                                    "unbankedCount": data['unbanked.Shareholder / Director'] ? data['unbanked.Shareholder / Director'] : 0
                                }, {
                                    "name": "Employees",
                                    "bankedCount": data['banked.Employee'] ? data['banked.Employee'] : 0,
                                    "unbankedCount": data['unbanked.Employee'] ? data['unbanked.Employee'] : 0
                                }
                            ]
                        };
                        this.drawMindmap(component, event, dataSet);
                    }
                } else if (state === 'ERROR') {

                    let errors = res.getError();
                    if (errors) {

                        if (errors[0] && errors[0].message) {
                            component.set('v.iserror', true);
                            component.set("v.isWaiting", false);
                            component.set('v.errorMsg', errors[0].message);
                        }
                    } else {
                        component.set('v.iserror', true);
                        component.set("v.isWaiting", false);
                        component.set('v.errorMsg', 'Unknown error');
                    }
                }
                else if (state === "INCOMPLETE") {
                    component.set('v.iserror', true);
                    component.set("v.isWaiting", false);
                    component.set('v.errorMsg', 'Please check your internet connection.');
                }
                });

            $A.enqueueAction(action);

        },
    drawMindmap:function (component,event,data) {

        let split_index = Math.round(data.children.length / 2)

// Left data
        let data1 = {
            "name": data.name,
            "children": JSON.parse(JSON.stringify(data.children.slice(0, split_index)))
        };

// Right data
        let data2 = {
            "name": data.name,
            "children": JSON.parse(JSON.stringify(data.children.slice(split_index)))
        };

// Create d3 hierarchies
        let right = d3.hierarchy(data1);
        let left = d3.hierarchy(data2);
        let SWITCH_CONST;
        let ISCHILD;;
        // Create new default tree layout
        let tree = d3.tree()
        let canvas = d3.select(component.getElement());
        let svg = canvas.append("svg")
                .attr("width", 550)
                .attr("height", 500),
            width = +svg.attr("width"),
            height = +svg.attr("height")
        drawTree(right, "right","rgb(0, 109, 204)");
        drawTree(left, "left","rgb(0, 109, 204)");

// draw single tree
        function drawTree(root, pos,bg) {

            SWITCH_CONST = 1;
            if (pos === "left") {
                SWITCH_CONST = -1;
            }

            // Shift the entire tree by half it's width
            let g = svg.append("g").attr("transform", "translate(" + width / 2 + ",0)");

            // Set the size
            // Remember the tree is rotated
            // so the height is used as the width
            // and the width as the height
            tree.size([height, SWITCH_CONST * (width - 150) / 2]);

            tree(root)

            let nodes = root.descendants();
            let links = root.links();
            // Set both root nodes to be dead center vertically
            nodes[0].x = height / 2

            // Create links
            let link = g.selectAll(".link")
                .data(links)
                .enter()

            link.append("path")
                .attr("class", "link")
                .attr("d", function(d) {
                    return pathCoordinates(d.target.data.name,d);

                });

            // Create nodes
            let node = g.selectAll(".node")
                .data(nodes)
                .enter()
                .append("g")
                .attr("class", function(d) {

                    return "node" + (d.children ? " node--internal2" : " node--leaf");

                })
                .attr("transform", function(d) {
                    return circleCoordinates(d.data.name,d);

                })

            if(pos=='left') {
                node.append("circle")
                    .attr("stroke-width", function (d, i) {
                        return (d.children ? 12 : 0);

                    })
                    .attr("fill", function (d, i) {

                        if(d.data.name=='Partners'){
                            return '#76dcfa';
                        }
                        else if(d.data.name=='Shareholders') {
                            return '#7BADE5';
                        }
                        else if(d.data.name=='Employees') {
                            return '#6593F5';
                        }


                    })
                    .attr("stroke",  function (d, i) {
                        return (d.children ? bg : "none");

                    })
                    .attr("r", function (d, i) {
                        return (d.children ? 85 : 65);

                    });
            }else {
                node.append("circle")
                    .attr("stroke-width", function (d, i) {
                        return (d.children ? 12 : 0);

                    })
                    .attr("stroke",  function (d, i) {
                        return (d.children ? "none" : "none");

                    })
                    .attr("r", function (d, i) {
                        return (d.children ? 85 : 65);

                    })
                    .attr("fill", function (d, i) {

                        if(d.data.name=='Debtors/Clients') {
                            return '#B4CFEC';
                        }
                        else if(d.data.name=='Creditors/Suppliers') {
                            return '#95c8d8';
                        }
                        else if(d.data.name=='Subsidiaries') {
                            return '#37B8FA';
                        }

                    })

            }
            node.append("text")
                .attr("y",function (d) {
                    return d.children ? -15:-40;
                })
                .attr("x",function (d) {
                    return d.children ? 0:0;
                })
                .attr("dy", function (d) {
                    return d.children ? 3:-35;
                })
                .style("text-anchor", function (d) {
                    return d.children ? "middle":"middle";
                })
                .style("font-size","8pt")
                .style("font-weight",function (d) {

                    return d.children? 'bold':'';
                })
                .text(function(d) {

                    ISCHILD = d.children?0:1;
                    if(SWITCH_CONST==1){

                        return  d.children ? '':d.data.name;
                    }
                    else {
                        return d.data.name;
                    }

                })
                .call(wrap,150);

            node.append("text")
                .attr("dy", function (d) {
                    return d.children ? 3:-4;
                })
                .attr("dx", function (d) {
                    return d.children ? 0:-44;
                })
                .style("text-anchor", function (d) {
                    return d.children ? "middle":"right";
                })
                .text(function(d) {
                    return d.children ? '' :'Known Banked   : '+d.data.bankedCount;
                });

            node.append("text")
                .attr("dy", function (d) {
                    return d.children ? 3:10;
                })
                .attr("dx", function (d) {
                    return d.children ? 0:-44;
                })
                .style("text-anchor", function (d) {
                    return d.children ? "middle":"right";
                })
                .text(function(d) {
                    return d.children ? '' :'Known Unbanked : '+d.data.unbankedCount;
                });
            node.on("click", click);
        }

        function pathCoordinates(nameOfCircle,d) {
            /*
            xt = x Axis to Target
            yt = y Axis to Target
            ys = y Axis from source
            xs = x Axis from source
            ts = target plus source
             */
            let yt=  parseInt(d.target.y);
            let ys=  parseInt(d.source.y);
            let ts = (d.target.y + d.source.y);
            let xt = parseInt(d.target.x);
            let xs = d.source.x;
            switch (nameOfCircle) {

                case 'Partners':
                    yt=yt+105;
                    ts =ts+105
                    xt =xt+16;
                    xs=xs;
                    return "M" + yt+ "," + xt + "C" + ts  + "," + xt + " " + ts / 6 + "," + xs + " " + ys + "," + xs;
                    break;
                case 'Subsidiaries':
                    yt=yt-105;
                    ts =ts-105
                    xt =xt+16;
                    xs=xs;
                    return "M" + yt+ "," + xt + "C" + ts  + "," + xt + " " + ts / 6 + "," + xs + " " + ys + "," + xs;
                    break;
                case 'Debtors/Clients':
                    return "M" + yt+ "," + xt + "C" + ts / 1 + "," + xt + " " + ts / 6 + "," + xs + " " + ys+ "," + xs;
                    break;
                case 'Creditors/Suppliers':
                    yt=yt-105;
                    ts =ts-105
                    xt =xt-16;
                    return "M" + yt+ "," + xt + "C" + ts / 1 + "," + xt + " " + ts / 6 + "," + xs + " " + ys+ "," + xs;
                    break;
                case 'Employees':
                    yt=yt+105;
                    ts =ts+105
                    xt =xt+16;
                    return "M" + yt+ "," + xt + "C" + ts / 1 + "," + xt + " " + ts / 6 + "," + xs + " " + ys+ "," + xs;
                    break;
                case 'Shareholders':
                    return "M" + yt+ "," + xt + "C" + ts / 1 + "," + xt + " " + ts / 6 + "," + xs + " " + ys+ "," + xs;
                    break;
            }

        }

        function circleCoordinates(nameOfCircle,d) {

            let y =d.y;
            let x = d.x;

            switch (nameOfCircle) {

                case 'Partners':
                    y=y+100;
                    x =x+17
                    return "translate(" + y + "," + x + ")";
                    break;
                case 'Subsidiaries':
                    y=y-100;
                    x =x+17
                    return "translate(" + y + "," + x + ")";
                    break;
                case 'Debtors/Clients':
                    y=y-20;
                    return "translate(" + y + "," + x + ")";
                    break;
                case 'Creditors/Suppliers':
                    y=y-100;
                    x =x-17
                    return "translate(" + y + "," + x + ")";
                    break;
                case 'Employees':
                    y=y+100;
                    x =x-17
                    return "translate(" + y + "," + x + ")";
                    break;
                case 'Shareholders':
                    y=y+20;
                    return "translate(" + y + "," + x + ")";
                    break;
                default:
                    return "translate(" + y + "," + x + ")";
            }

        }
        function wrap(text, width) {

            text.each(function () {
                let text = d3.select(this),
                    words = text.text().split(/\s+/).reverse(),
                    word,
                    line = [],
                    lineNumber = 0,
                    lineHeight = 1.0, // ems
                    x = text.attr("x"),
                    y = text.attr("y"),
                    dy = 1.0,
                    tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
                while (word = words.pop()) {
                    line.push(word);
                    tspan.text(line.join(" "));
                    if (tspan.node().getComputedTextLength() > width) {
                        line.pop();
                        tspan.text(line.join(" "));
                        line = [word];
                        tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                    }
                }
            });

        }
        // Toggle children on click.
        function click(d) {

            d3.select(this).select("circle").text(function(dv) {

                if(dv.children ){
                let navigate = $A.get("e.force:navigateToComponent");
                if (navigate) {
                    navigate.setParams({
                        "componentDef": "c:EcosystemTab",
                        "componentAttributes": {
                            "groupNumber": data['Relationship_Group_Number__c']
                        }
                    });
                    navigate.fire();
                }}
            })


        }

    }
});