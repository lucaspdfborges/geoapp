
var isPlottingInterest = false;

function selectAsZone(node){

  if($("#originEsp").is(":checked")  || $("#destEsp").is(":checked") ){

  var inputID = "#MZ_Z_"+node.attr("macrozona");

  $("#zona-url input").each(function(){
    $(this).prop( "checked", false );
  });

  $(inputID).prop( "checked", true );

  nodeClicked = node.attr("clicked")>0;

   $(".macrozona").each(function() {
        $(this).attr("clicked", 0);
        $(this).css("fill", "rgba(219,220,222,0.5)");
      });

      if(nodeClicked == 0){
        node.style("fill", "#779");
      }else{
        node.style("fill", "rgba(219,220,222,0.5)");
      }

      node.attr("clicked", 1);

   var nextBlock = $("#dv-rep");
      nextBlock.fadeTo(200, 1.0);
      nextBlock.show();
  }
}


function generateInterestList(jsonFile){
  var block = d3.select('#zona-url');

  var list =  block.selectAll('li')
  .data(jsonFile.data)
  .enter()
  .append('li');

  list
  .append('input')
  .attr("type", "radio")
  .attr("name", "zn")
  .on("click", function(d,i){
    var node =  d3.select("#MZ_"+d.ID);
    selectAsZone(node);

    // free the next block
    var thisBlock = $("#zona-block");
    thisBlock.css("border-left","2px solid #e6e4ec");

    if(lastPlot=="interest" && !isPlottingInterest){
      interestPlot();
    }

  })
  .attr("id", function(d,i){
    return "MZ_Z_" + d.MACROZONA;
  });

  list
  .append('label')
  .attr("for", function(d,i){
    return "MZ_Z_" + d.MACROZONA;
  })
  .html(function(d){
    var text = d.RA_NOME + " : " + d.MACROZONA;
    return text;
  });

}


function interestPlotParams(mz){

  var filePath;
  var baseColor;
  var val1;

  if ($("#destEsp").is(":checked")) {

    var destiny = destinyOD[mz];

    if ($("#horapicoDV").is(":checked")) {
      val1 = Math.round(100*destiny.TC_total/(destiny.TC_total + destiny.TI_total));
    } else {
      val1 = Math.round(100*destiny.TC_PPM/(destiny.TC_PPM + destiny.TI_PPM));
    }

     baseColor = 380;
     filePath = zonaOdURL;

   }else{

     var origin = originOD[mz];

     if ($("#horapicoDV").is(":checked")) {
       val1 = Math.round(100*origin.TC_total/(origin.TC_total + origin.TI_total));
     } else {
       val1 = Math.round(100*origin.TC_PPM/(origin.TC_PPM + origin.TI_PPM));
     }

     baseColor = 250;
     filePath = zonaArrayURL;
   }

   return [filePath, baseColor, val1]
}

function interestPaths(mz, data, max, coords, ratios, baseColor){

  g
  .selectAll("line")
  .data(data)
  .enter()
  .append("line")
  .attr("class", "line-centroid")
  .attr("x1", function(d) {
    return projection(coords)[0];
  })
  .attr("y1", function(d) {
    return projection(coords)[1];
  })
  .attr("x2", function(d) {
    if (d.destiny != "self" && d.coordinates) {
      return projection(d.coordinates)[0];
    }
  })
  .attr("y2", function(d) {
    if (d.destiny != "self" && d.coordinates) {
      return projection(d.coordinates)[1];
    }
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
      .html("nº de viagens: <i style='color:#2a2559;'>"+ Math.round(ratios[i]*max)+"</i>");

    tooltipMunicipio.classed("hidden", true);
    tooltipZone.classed("hidden", true);

  })
    .on("mouseout", function(d, i) {
    tooltip.classed("hidden", true);
  })
  .attr("stroke-linecap", "round")
  .attr("stroke-width", function(d,i) {
    return (10 * ratios[i] / currentZoom);
  })
  .attr("stroke", function(d,i) {
    var color = baseColorFunction(baseColor, ratios[i]);
    return color;
  })
  .attr("ratio", function(d,i) {
    return (ratios[i] || 0);
  });
}

function interestCentroids(mz, data, max, coords, ratios, baseColor){

    g
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "centroid")
    .attr("cx", function(d) {
      if (d.destiny != "self" && d.coordinates) {
        return projection(d.coordinates)[0];
      }
    })
    .attr("cy", function(d) {
      if (d.destiny != "self" && d.coordinates) {
        return projection(d.coordinates)[1];
      }
    })
    .attr("r", function(d,i) {
      var radius = 16 * ratios[i] / currentZoom;
      return (radius||0);
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
        .html("nº de viagens: <i style='color:#2a2559;'>"+ Math.round(ratios[i]*max)+"</i>");

      tooltipMunicipio.classed("hidden", true);
      tooltipZone.classed("hidden", true);

    })
      .on("mouseout", function(d, i) {
      tooltip.classed("hidden", true);
    })
    .attr("fill",function(d,i) {
        var color = baseColorFunction(baseColor, ratios[i]);
        if(mz == d.destiny){
             color = "url(#svgGradient4)"
          }
        return color;
    })
    .style("stroke", function(d,i){
      if(mz == d.destiny){
             return baseColorFunction(baseColor, ratios[i]);
          }
    })
    .style("stroke-width", function(d,i){
        if(mz == d.destiny){
               return 1;
            }
    })
    .attr("ratio", function(d,i) {
        return (ratios[i] || 0);
    });
}


function interestPlot(){

  if(!isPlottingInterest){
    console.log(isPlottingInterest);
  isPlottingInterest = true;
  clearAll();

  var fileURL = "";
  $(".macrozona").each(function() {
    if ($(this).attr("clicked") > 0) {

      var mz = $(this).attr("macrozona").toString();
      var inputID = "#MZ_Z_" + mz;
      var mzName = " "+$(this).attr("title").toString()+" : "+ $(this).attr("macrozona").toString();
      var interestParams = interestPlotParams(mz);
      var filePath = interestParams[0];
      var baseColor = interestParams[1];
      var val1 = interestParams[2] || 0;

      $(inputID).prop( "checked", true );

      if($("#container-legend svg").length){
        $("#container-legend svg").remove();
      }

      var val2 = 100-val1;

      d3.json(filePath, function(error, jsonFile) {

          var dataFile = jsonFile[mz];

          var coords = dataFile[0].coordinates;

          var tc_total_max = dataFile[0].TC_total_max;
          var ti_total_max = dataFile[0].TI_total_max;
          var tc_ppm_max = dataFile[0].TC_PPM_max;
          var ti_ppm_max = dataFile[0].TI_PPM_max;

          var max = 0;
          var ratios = [];

          if ($("#coletivoDV").is(":checked")) {
            if ($("#horapicoDV").is(":checked")) {
              max += tc_ppm_max;
            } else {
              max += tc_total_max;
            }
          }
          if ($("#individualDV").is(":checked")) {
            if ($("#horapicoDV").is(":checked")) {
              max += ti_ppm_max;
            } else {
              max += ti_total_max;
            }
          }

          for(var i=1; i < dataFile.length; i++){

            var obj = dataFile[i];
            var value = 0;

            if ($("#coletivoDV").is(":checked")) {
              if ($("#horapicoDV").is(":checked")) {
                value += obj.TC_PPM;
              } else {
                value += obj.TC_total;
              }
            }
            if ($("#individualDV").is(":checked")) {
              if ($("#horapicoDV").is(":checked")) {
                value += obj.TI_PPM;
              } else {
                value += obj.TI_total;
              }
            }

            var ratio  = value/max;
            ratios.push(ratio);
          }

          //correcting an error
          dataFile.shift();

          interestPaths(mz, dataFile, max, coords, ratios, baseColor);
          interestCentroids(mz, dataFile, max, coords, ratios, baseColor);

          var colorGrad =[];

          for(var i = 0; i < 6; i++){
            var color = baseColorFunction(baseColor, i/5);
            colorGrad.push(color);
          }

          legendCircle(colorGrad, max, "N° de viagens");
          zoneLegend(mzName, val1, val2);

        });
      }
    });

  $("#container-legend").css('display','flex');
  $("#top-content").hide();

  lastPlot = "interest";
  isPlottingInterest = false;

 }
}
