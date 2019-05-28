
function legendCircle(colorArray, max, title){

  var legendSVG = d3.select('#container-legend')
                      .append("svg")
                      .attr("width", 325)
                      .attr("height", 80);

  var legend = legendSVG.append("g");

  legend.selectAll("circle")
  .data(colorArray)
  .enter()
  .append("circle")
  .attr("cx", function(d,i){
    return (51*i);
  })
  .attr("cy", 35)
  .attr("r", function(d,i){
    return(16*(i/5))
  })
  .style("stroke", "#ccc")
  .style("fill", function(d){
    return d;
  });

  legend.selectAll("text")
  .data(colorArray)
  .enter()
  .append("text")
  .attr("font-size", "0.75em")
  .attr("x", function(d,i){
    return (51*i - 15);
  })
  .attr("y", 65)
  .text(function(d,i){
    if(i){
      return (Math.round((i/5)*max));
    }
  })
  .style("fill",function(d,i){
    if(i%2){
      return "#888";
    }else{
      return "#666";
    }
  });

  legend
  .append("text")
  .attr("font-size", "0.775em")
  .attr("x", function(){
    return (50);
  })
  .attr("y", 15)
  .text(title)
  .style("fill","#333");
}

function legendStroke(colorArray, max, title){

    legendSVG = d3.select('#container-legend')
                      .append("svg")
                      .attr("width", 600)
                      .attr("height", height/5);

    var legend = legendSVG.append("g");

    legend.selectAll("rect")
    .data(colorArray)
    .enter()
    .append("rect")
    .attr("x", function(d,i){
      return (51*i+51);
    })
    .attr("y", 22)
    .attr("width", 50)
    .attr("height", 10)
    .style("stroke", "#ccc")
    .style("fill", function(d){
      return d;
    });

    legend.selectAll("text")
    .data(colorArray)
    .enter()
    .append("text")
    .attr("font-size", "0.75em")
    .attr("x", function(d,i){
      return (51*i+51);
    })
    .attr("y", 15)
    .text(function(d,i){
      return (Math.round((i/4)*max));
    })
    .style("fill",function(d,i){
      if(i%2){
        return "#777";
      }else{
        return "#444";
      }
    });

    legend.append("text")
    .attr("font-size", "0.75em")
    .attr("x", function(){
      return (0);
    })
    .attr("y", 30)
    .text(title)
    .style("fill","#555");

}

function zoneLegend(zoneName, legendSVG, val1, val2){

   var info = legendSVG.append("g").attr("id","mode-distribution");

    var rectData = [val1, val2];

    info.selectAll("text")
        .data(rectData)
        .enter()
        .append("text")
        .attr("font-size", "0.75em")
        .attr("x", function(d,i){
          if(d<1){
            return 28+3*d;
          }else if(d<10){
            return 21+3*d;
          }else{
            return 3*d;
          }
        })
        .attr("y", function(d,i){
          return 35+12*(i+(i/5));
        })
        .text(function(d,i){
           return d.toString()+" % "+rectText[i];
        })
        .style("fill",function(d,i){
          return rectColorsText[i];
        });

   var textLegend = zoneName ;
   if($("#destEsp").is(":checked")){
     textLegend  += " Indicador de destino: ";
   }else if($("#originEsp").is(":checked")){
     textLegend  += " Indicador de origem: ";
   }

    if ($("#coletivo").is(":checked") && !$("#individual").is(":checked")) {
      textLegend += "coletivo";
    }else if($("#individual").is(":checked") && !$("#coletivo").is(":checked")){
      textLegend += "coletivo";
    }else{
      textLegend += "coletivo e individual";
    };

    if ($("#horapico").is(":checked")) {
      textLegend += " - hora pico.";
    } else {
      textLegend += " - total.";
    }

    info.append("text")
    .attr("font-size", "0.95em")
    .attr("x", 0)
    .attr("y", 15)
    .text(textLegend)
    .style("fill","#555");

    info.selectAll("rect")
    .data(rectData)
    .enter()
    .append("rect")
    .attr("x", 0)
    .attr("y", function(d,i){
      return 25+12*(i+(i/5));
    })
    .attr("width", function(d,i){
      return 3*d;
    })
    .style("fill", function(d,i){
      return rectColors[i];
    })
    .attr("height", 12);

}

function tripsLegend(colorFunction, maxLegend){

    var colorGrad =[];

    for(var i = 0; i < 5; i++){
      var color = colorFunction(i/4);
      colorGrad.push(color);
    }

    $("#container-legend svg").remove();
    legendStroke(colorGrad, maxLegend, "viagens");
}


function legendVariableStroke(max, colorGrad, title){

        var legendSVG = d3.select('#container-legend')
                              .append("svg")
                              .attr("id","legendRight")
                              .attr("width", 325)
                              .attr("height",80);

        var legend = legendSVG.append("g");

            legend.selectAll("rect")
            .data(colorGrad)
            .enter()
            .append("rect")
            .attr("x", function(d,i){
              return (51*i);
            })
            .attr("y", 25)
            .attr("height", function(d,i){
              return(2*i)
            })
            .attr("width", 40)
            .style("fill", function(d){
              return d;
            });

            legend.selectAll("text")
            .data(colorGrad)
            .enter()
            .append("text")
            .attr("font-size", "0.75em")
            .attr("x", function(d,i){
              return (52*i);
            })
            .attr("y", 50)
            .text(function(d,i){
              if(i){
                return max*i/5;
              }
            })
            .style("fill",function(d,i){
              if(i%2){
                return "#777";
              }else{
                return "#666";
              }
            });

            legend
            .append("text")
            .attr("font-size", "0.775em")
            .attr("x", 50 )
            .attr("y", 15)
            .text(title)
            .style("fill","#333");
}
