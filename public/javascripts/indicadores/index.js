
function tripsRepresentation(jsonFile,colorFunction){

    var maxLegend = 0;
    // Coloring the zones
    $(".macrozona").each(function() {
      var node = d3.select("#"+$(this).attr("id"));
      var macrozona = $(this).attr("macrozona");
      var value = 0;
      var max = 1;

      var tc_total_max = jsonFile.max.TC_total;
      var ti_total_max = jsonFile.max.TI_total;
      var tc_ppm_max = jsonFile.max.TC_PPM;
      var ti_ppm_max = jsonFile.max.TI_PPM;

      if (jsonFile[macrozona]) {
        var obj = jsonFile[macrozona];
        var tc_total = obj.TC_total;

        if ($("#coletivoInd").is(":checked")) {
          if ($("#horapicoInd").is(":checked")) {
            value += obj.TC_PPM;
            max += tc_ppm_max;
          } else {
            value += obj.TC_total;
            max += tc_total_max;
          }
        }
        if ($("#individualInd").is(":checked")) {
          if ($("#horapicoInd").is(":checked")) {
            value += obj.TI_PPM;
            max += ti_ppm_max;
          } else {
            value += obj.TI_total;
            max += ti_total_max;
          }
        }
      }

      maxLegend = max;

      var color = colorFunction(value/max);
      node.attr("plottedValue", Math.ceil(value));

      $(this).css("fill", color);
      //todo change
      $(this).css("stroke", "rgba(150,150,150,0.2)");


    });

   // LEGEND
   tripsLegend(colorFunction, maxLegend);
}

function tripsLegend(colorFunction, maxLegend){

    var colorGrad =[];

    for(var i = 0; i < 5; i++){
      var color = colorFunction(i/4);
      colorGrad.push(color);
    }

    $("#container-legend svg").remove();
    legendStroke(colorGrad, maxLegend, "N° de viagens");
}


function plotOriginTrips(){
  clearAll();
  lastPlot = "originTrips";

  tripsRepresentation(originOD, blueColorFunction);
   $("#container-legend").css('display','flex');
   $("#top-content").hide();
}

$("#originTripsBtn").click(function() {
  plotOriginTrips();
});

function plotDestinyTrips(){
  clearAll();
  lastPlot = "destinyTrips";

  tripsRepresentation(destinyOD,redColorFunction);
  $("#container-legend").css('display','flex');
  $("#top-content").hide();
}

$("#destinyTripsBtn").click(function() {
   plotDestinyTrips();
});


function flowOdData(jsonFile){

  var dataFile;

  if ($("#coletivo").is(":checked") && !$("#individual").is(":checked")) {
       if ($("#horapico").is(":checked")) {
         dataFile = jsonFile.TC_PPM;
       } else {
         dataFile = jsonFile.TC_total;
       }
     }
     else if ($("#individual").is(":checked") && !$("#coletivo").is(":checked")) {
       if ($("#horapico").is(":checked")) {
         dataFile = jsonFile.TI_PPM;
       } else {
         dataFile = jsonFile.TI_total;
       }
     } else{
       if ($("#horapico").is(":checked")) {
         dataFile = jsonFile.TCI_PPM;
       } else {
         dataFile = jsonFile.TCI_total;
       }
     }

     return dataFile
}

function createFlowOdPaths(data, max, currentZoom){

  g
    .selectAll("line")
    .data(data)
    .enter()
    .append("line")
    .attr("class", "line-centroid")
    .attr("x1", function(d) {
    return projection(d[0].originCoord)[0];
  })
    .attr("y1", function(d) {
    return projection(d[0].originCoord)[1];
  })
    .attr("x2", function(d) {
    return projection(d[0].destinyCoord)[0];
  })
    .attr("y2", function(d) {
    return projection(d[0].destinyCoord)[1];
  })
    .attr("stroke-linecap", "round")
    .attr("stroke-width", function(d,i) {
    var ratio = d[1]/max;
    return ( (10 * ratio)/currentZoom);
  })
  .on("mousemove", function(d, i) {

    var mouse = d3.mouse(svg.node()).map(function(d) {
      return parseInt(d);
    });

    tooltip
      .classed("hidden", false)
      .attr(
      "style",
      "left:" +
      (mouse[0] + offsetL) +
      "px;top:" +
      (mouse[1] + offsetT) +
      "px"
    );

    tooltipNum
      .html("nº de viagens: <i style='color:#2a2559;'>"+ d[1]+"</i>");

    tooltipMunicipio.classed("hidden", true);
    tooltipZone.classed("hidden", true);

  })
    .on("mouseout", function(d, i) {
    tooltip.classed("hidden", true);
  })
    .attr("stroke", function(d,i) {
    var ratio = d[1]/max;
    var color = baseColorFunctionMin(300, ratio);
    return color;
  })
    .attr("ratio", function(d,i) {
    var ratio = d[1]/max;
    return (ratio || 0);
  });
}

function createFlowOdCentroids(data, max, currentZoom){

      var centroids = g
                      .selectAll("circle")
                      .data(data, function(d){return d})
                      .enter();

      centroids
          .append("circle")
          .attr("class", "centroid")
          .attr("cx", function(d) {
          return projection(d[0].originCoord)[0];
        })
          .attr("cy", function(d) {
          return projection(d[0].originCoord)[1];
        })
          .attr("r", function(d,i) {
          var ratio = d[1]/max;
          var radius =((16 * ratio/currentZoom));
          return (radius||0);
        })
          .attr("fill",function(d,i) {
          var ratio = d[1]/max;
          var color = baseColorFunctionMin(300, ratio);
          return color;
        })
          .attr("ratio", function(d,i) {
          var ratio = d[1]/max;
          return (ratio || 0);
        });

        centroids
          .append("circle")
          .attr("class", "centroid")
          .attr("cx", function(d) {
          return projection(d[0].destinyCoord)[0];
        })
          .attr("cy", function(d) {
          return projection(d[0].destinyCoord)[1];
        })
          .attr("r", function(d,i) {
          var ratio = d[1]/max;
          var radius = ((16* ratio)/currentZoom);
          return (radius||0);
        })
          .attr("fill",function(d,i) {
          var ratio = d[1]/max;
          var color = baseColorFunctionMin(300, ratio);
          return color;
        })
        .on("mousemove", function(d, i) {

          var mouse = d3.mouse(svg.node()).map(function(d) {
            return parseInt(d);
          });

          tooltip
            .classed("hidden", false)
            .attr(
            "style",
            "left:" +
            (mouse[0] + offsetL) +
            "px;top:" +
            (mouse[1] + offsetT) +
            "px"
          );

          tooltipNum
            .html("nº de viagens: <i style='color:#2a2559;'>"+ d[1]+"</i>");

          tooltipMunicipio.classed("hidden", true);
          tooltipZone.classed("hidden", true);

        })
          .on("mouseout", function(d, i) {
          tooltip.classed("hidden", true);
        })
          .attr("ratio", function(d,i) {
          var ratio = d[1]/max;
          return (ratio || 0);
        });
}


function plotFlowOD(){

  clearAll();
  lastPlot = "flowOD";

  d3.json(flowOdURL,
    function(error, jsonFile) {

      var dataFile = flowOdData(jsonFile);
      var shortData = dataFile.slice();
      var max = shortData[0][1];

      createFlowOdPaths(shortData, max, currentZoom);
      createFlowOdCentroids(shortData, max, currentZoom);

      var colorGrad = baseColorArray();

      legendCircle(colorGrad, max, "n° de viagens intra-zonal")
      legendVariableStroke(max, colorGrad, "n° de viagens entre zonas");
  });

  $("#container-legend").css('display','flex');
  $("#top-content").hide();
}
