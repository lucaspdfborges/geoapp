
/*
  Variables
*/

var zoom = d3.zoom()
.scaleExtent([1, maxZoom])
.on("zoom", zoomed);

var drag = d3.drag()
           .subject(function (d) { return d; })
           .on("start", dragstarted)
           .on("drag", dragged)
           .on("end", dragended);

var width = document.getElementById("container").offsetWidth;
var height = width * 0.55;

var lastPlot = "none";
var lastZone = "none";

var scaleResize = 1;
var currentZoom = 1;
var clickZoomDelta = 0;

// Origin or Destiny selector
var mouseSelectorOD = "origin";

var gradientsArray = [];

let totalSum = 0;
let matODdownload;
var topo,
lagosTopo,
manchaTopo,
eixosTopo,
originOD,
destinyOD,
idRa,
nomeIdZonaCenter,
projection,
path,
svg,
svgScale,
g,
legendSVGright,
legendSVGleft,
gLegend,
defs;

/*
Functions
*/

function setup(width, height) {

  var translateX, translateY, zoomScale;

  translateX = 39.78 * width;
  translateY = -23.3* height;
  zoomScale = 47*width;

  projection = d3.geoMercator()
  .translate([translateX, translateY])
  .scale(zoomScale);

  path = d3.geoPath().projection(projection);

  svg = d3
  .select("#container")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .call(responsivefy)
  .attr("id","svgChart")
  .call(zoom)
  .call(drag)
  .on("click", click);

  g = svg.append("g")
          .attr("height","100vh");

  createScale();

  if(width<1200){

      var s =4;

      var kx = 0; // 2;
      var ky = 0;

      var lx = 0.995;
      var ly = 1;

      var tx = -1.5*width;
      var ty = -1.55*height;

      svg.transition()
          .duration(750)
          .call(zoom.transform, d3.zoomIdentity.translate(tx, ty).scale(s));

      currentZoom = s;
      rescaleStroke();
      createScale();
  }
}

function scaleData(){
  var data = {};

  var scaleCorrection = document.getElementById("container").offsetWidth/1853;

  if(currentZoom < 1.65){
    data["baseValue"] = 10;
    data["rectWidth"] = 38*currentZoom*scaleCorrection;
    data["unit"] = "km";
  }else if(currentZoom < 2.5){
    data["baseValue"] = 6;
    data["rectWidth"] = 38*(currentZoom - 0.65)*scaleCorrection;
    data["unit"] = "km";
  }else if(currentZoom < 3.33){
    data["baseValue"] = 4;
    data["rectWidth"] = 38*(currentZoom - 1.5)*scaleCorrection;
    data["unit"] = "km";
  }else if(currentZoom < 4){
    data["baseValue"] = 3000;
    data["rectWidth"] = 38*(currentZoom - 2.33)*scaleCorrection;
    data["unit"] = "m";
  }else if(currentZoom < 5){
    data["baseValue"] = 2500;
    data["rectWidth"] = 38*(currentZoom - 3)*scaleCorrection;
    data["unit"] = "m";
  }else  if(currentZoom < 5.56){
    data["baseValue"] = 2000;
    data["rectWidth"] = 38*(currentZoom - 4)*scaleCorrection;
    data["unit"] = "m";
  }else  if(currentZoom < 6.25){
    data["baseValue"] = 1800;
    data["rectWidth"] = 38*(currentZoom - 4.56)*scaleCorrection;
    data["unit"] = "m";
  }else  if(currentZoom < 6.67){
    data["baseValue"] = 1600;
    data["rectWidth"] = 38*(currentZoom - 5.25)*scaleCorrection;
    data["unit"] = "m";
  }else {
    data["baseValue"] = 1500;
    data["rectWidth"] = 38*(currentZoom - 5.67)*scaleCorrection;
    data["unit"] = "m";
  }

  return data
}

function createScale(){

  var width = document.getElementById("container").offsetWidth;

  $("#svgScale").remove();

  var value = scaleData().baseValue;

  var data = [0,  Math.round(10*value/4)/10, Math.round(10*value/2)/10,  Math.round(10*3*value/4)/10,  Math.round(10*value)/10];
  var rectData = [...Array(4).keys()];
  var rectWidth = scaleData().rectWidth;

  if(width > 1200){

    svgScale = d3.select("#top-content")
                 .append("svg")
                 .attr("width", 290)
                 .attr("height", 30)
                 .attr("id","svgScale");

    svgScale.selectAll('rect')
            .data(rectData)
            .enter()
            .append('rect')
            .attr('width', rectWidth)
            .attr('height', 10)
            .attr('x', function(d,i){
              return (rectWidth+2)*i + 5;
            })
            .attr('y', 15)
            .style("stroke", "#ccc")
            .attr('fill',function(d,i){
              return (i%2 >0 ? "#fcfcff" : "#335");
            });

    svgScale.selectAll('text')
            .data(data)
            .enter()
            .append('text')
            .attr("font-size", "0.75em")
            .attr('x', function(d,i){
              var backshift = 2*(d.toString().length - 1);
              return (rectWidth+2)*i - backshift;
            })
            .attr('y', 10)
            .text(function(d,i){
              return d;
            })
            .attr('fill',function(d,i){
              return (i%2 >0 ? "#557" : "#002");
            });

      svgScale.append('text')
              .attr("font-size", "0.75em")
              .attr('x', 15+rectWidth*4)
              .attr('y', 25)
              .text(scaleData().unit)
              .attr('fill',"#002");
    }else{



      svgScale = d3.select("#top-content")
                   .append("svg")
                   .attr("width", function(){
                     return 200*width/1200;
                   })
                   .attr("height", 30)
                   .attr("id","svgScale");

      svgScale.append('line')
              .attr('height', 10)
              .attr('x1', 5)
              .attr('x2', 4*rectWidth)
              .attr('y1', 18)
              .attr('y2', 18)
              .style("stroke", "#335")
              .attr('fill', "white");

      svgScale.append('line')
              .attr('height', 10)
              .attr('x1', 5)
              .attr('x2', 5)
              .attr('y1', 15)
              .attr('y2', 18)
              .style("stroke", "#335")
              .attr('fill', "white");

      svgScale.append('line')
              .attr('height', 10)
              .attr('x1', 4*rectWidth)
              .attr('x2', 4*rectWidth)
              .attr('y1', 15)
              .attr('y2', 18)
              .style("stroke", "#335")
              .attr('fill', "white");

      svgScale.append('text')
              .attr("font-size", "0.75em")
              .attr('x', 5 )
              .attr('y', 10)
              .text(value + " " + scaleData().unit)
              .attr('fill', "#002");
    }
}

function focusArea(width, height, d) {

  var lnCenter = d.center;
  var bbox = d.bbox;

  bounds = [projection([bbox[0],bbox[1]]), projection([bbox[2],bbox[3]])];

  var dx = bounds[1][0] - bounds[0][0],
       dy = bounds[1][1] - bounds[0][1],
       x = (bounds[0][0] + bounds[1][0]) / 2,
       y = (bounds[0][1] + bounds[1][1]) / 2,
       scale = Math.max(1, Math.min(8, 0.85 / Math.max(dx / width, dy / height))),
       translate = [width / 2 - scale * x, height / 2 - scale * y];

  svg.transition()
      .duration(750)
      .call(zoom.transform, d3.zoomIdentity.translate(translate[0],translate[1]).scale(scale));

  currentZoom = scale;
  rescaleStroke();
  createScale();
}

function rescaleStroke(){

  //adjust the trafficZone hover stroke width based on zoom level
  d3.selectAll(".macrozona").style("stroke-width", 2 / (scaleResize *currentZoom));
  d3.selectAll(".verde").style("stroke-width", 1.5 / (scaleResize *currentZoom));
  d3.selectAll(".lagos").style("stroke-width", 1.5 / (scaleResize *currentZoom));

  d3.selectAll(".centroid").attr("r", function() {
    let node = d3.select(this);
    let ratio = node.attr("ratio");
    let radius = 16 / (scaleResize *currentZoom) * ratio;
    return radius;
  });

  d3.selectAll(".line-centroid").style("stroke-width", function() {
    let node = d3.select(this);
    let ratio = node.attr("ratio");
    return 10 * ratio / (scaleResize *currentZoom);
  });

  d3.selectAll(".eixo").style("stroke-width", function() {
    return 1  / (scaleResize *currentZoom);
  });

  d3.selectAll(".centroid").style("stroke-width", function() {
    return 1  / (scaleResize *currentZoom);
  });
}

function zoomButtons(){

  d3.select("#clear-map")
  .append("button")
  .attr("id","zoomin")
  .attr("class","reverse-colors")
  .attr("title","Zoom In")
  .on('click', function(){
    zoom.scaleBy(svg.transition().duration(250), 1.1);
  })
  .append("i")
  .attr("class","fas fa-plus");

  d3.select("#clear-map")
  .append("button")
  .attr("id","zoomout")
  .attr("title","Zoom Out")
  .attr("class","reverse-colors")
  .on('click', function(){
    zoom.scaleBy(svg.transition().duration(250), 0.9);
  })
  .append("i")
  .attr("class","fas fa-minus");
}

function setupGradients(listColors){

  //listColors is an array like: [[initial_color_1, final_color_1], [initial_color_2, final_color_2], . . . ]
  defs = svg.append("defs");

  for(var i = 0; i < listColors.length; i++){

    var gradient = defs
    .append("linearGradient")
    .attr("id", "svgGradient"+(i+1).toString())
    .attr("x1", "0%")
    .attr("x2", "100%")
    .attr("y1", "0%")
    .attr("y2", "100%");

    gradient
    .append("stop")
    .attr("class", "start")
    .attr("offset", "0%")
    .attr("stop-color", listColors[i][0])
    .attr("stop-opacity", 1);

    gradient
    .append("stop")
    .attr("class", "end")
    .attr("offset", "100%")
    .attr("stop-color", listColors[i][1])
    .attr("stop-opacity", 1);

    gradientsArray.push(gradient);
  }
}

function loadedJSONs(error, results){
   if (error) throw error;

   ambienteTopo = topojson.feature(results[0], results[0].objects.verde).features;
   manchaTopo = topojson.feature(results[1], results[1].objects.manchaurbana).features;
   eixosTopo = topojson.feature(results[2], results[2].objects.eixo).features;
   topo = topojson.feature(results[3], results[3].objects.MacrozonasDF).features;
   lagosTopo = topojson.feature(results[4], results[4].objects.Lagos).features;
   originOD = results[5];
   destinyOD = results[6];
   nomeIdZonaCenter = results[7];
   idRa = results[8];

   ambiente(ambienteTopo);
   mancha(manchaTopo);
   eixo(eixosTopo);
   draw(topo);
   lagos(lagosTopo);
   generateZoneLists(nomeIdZonaCenter);

   if(width<1200){
     rescaleStroke();
   }

   $("#loader").hide();
}

function generateSearchList(jsonFile){

        var ul = d3.select('#search-wrapper').append('ul').attr("id","search-url");

        ul.selectAll('li')
        .data(jsonFile.data)
        .enter()
        .append('li')
        .attr("id", function(d,i){
          return "search_ID_" + d.ID;
        })
        .on("mousemove", function(d,i){
          let node = d3.select("#MZ_"+d.ID);

          //TODO implement
          node.style("stroke","#779");
          node.style("stroke-width","3");
        })
        .on("mouseout", function(d, i) {
          let node = d3.select("#MZ_"+d.ID);
          node.style("stroke","");
          node.style("stroke-width","");
        })
        .on("click",function(d){

          $("#search").val(d.RA_NOME + " : " + d.MACROZONA);
          $("#search-wrapper li").hide();

          width = document.getElementById("container").offsetWidth;
          height = width * 0.55;
          focusArea(width, height, d);

          d3.selectAll(".eixo").style("stroke-width", 0.3);

          var mzID = "#MZ_"+d.ID;
          //TODO implement rest
          $(".macrozona").each(function() {
            $(this).css("stroke", "");
            $(this).css("stroke-width", "");
          });

          $(mzID).attr("stroke","#335");
          $(mzID).attr("stroke-width","0.67");

        })
        .append('a')
        .html(function(d){
          var text = d.RA_NOME + " : " + d.MACROZONA;
          return text;
        });
}

function generateZoneLists(jsonFile){

      generateInterestList(jsonFile);
      generateOriginList(jsonFile);
      generateDestinyList(jsonFile);
      generateSearchList(jsonFile)
}

function clearSearch(element){
  $("#search").val('');
  $("#search-url li").hide();
  element.css('opacity','0');

   $(".macrozona").each(function() {
     node = d3.select("#"+ $(this).attr("id"));
     node.attr("stroke","");
     node.attr("stroke-width","");
  });
}

function searchFunction(){
  var input, filter, ul, li, a, i, txtValue;

  input = document.getElementById("search");
  filter = input.value.toUpperCase();
  ul = document.getElementById("search-url");
  li = ul.getElementsByTagName("li");

  if(filter.length){
   $("#clear-search").css('opacity','1');
  }else{
    $("#clear-search").css('opacity','0');
    $(".macrozona").each(function() {
     node = d3.select("#"+ $(this).attr("id"));
     node.attr("stroke","");
     node.attr("stroke-width","");
    });
  }

  for (i = 0; i < li.length; i++) {
    a = li[i].getElementsByTagName("a")[0];
    txtValue = a.textContent || a.innerText;
    if (filter.length && txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "block";
    } else {
      li[i].style.display = "none";
    }
  }
}

function eixo(jsonFile) {
  var eixoviario = g.selectAll(".eixo").data(jsonFile);

  eixoviario
  .enter()
  .insert("path")
  .attr("class", "eixo")
  .attr("d", path)
  .attr("stroke", "#ccc")
  .attr("stroke-width", "1")
  .style("fill", "none");
}


function ambiente(jsonFile) {

  var verde = g.selectAll(".verde").data(jsonFile);

  verde
  .enter()
  .insert("path")
  .attr("class", "verde")
  .attr("d", path)
  .style("fill", "#c7e5d8");
}

function mancha(jsonFile) {
  var urban = g.selectAll(".urban").data(jsonFile);

  urban
  .enter()
  .insert("path")
  .attr("class", "urban")
  .attr("d", path)
  .style("fill", "#999");
}

function lagos(jsonFile) {
  var lakes = g.selectAll(".lagos").data(jsonFile);

  lakes
  .enter()
  .insert("path")
  .attr("class", "lagos")
  .attr("d", path)
  .style("fill", "#bcd8e8");
}

function zoneMouseMove(node,d){

    var mouse = d3.mouse(svg.node()).map(function(dMouse) {
      return parseInt(dMouse*scaleResize);
    });

    if(width>800){

    tooltip
    .classed("hidden", false)
    .attr(
      "style",
      "left:" +
      (mouse[0] - 4*offsetL) +
      "px;top:" +
      (mouse[1] - 30*offsetT) +
      "px"
    );

    tooltipZone
    .classed("hidden", false)
    .html(d.properties.RA_NOME);

    tooltipNum
    .classed("hidden", false)
    .html("zona: <i style='color:#2a2559;'>#"+ d.properties.MACROZONA+"</i> | Área <i style='color:#2a2559;'>"+ Math.round(d.properties.AREA) +"</i> km²");

    }

    let nodeValue = node.attr("plottedValue");

    if(lastPlot=="destinyTrips" || lastPlot=="originTrips"){
      if(width>800){
        tooltipMunicipio
        .classed("hidden", false)
        .html("nº de viagens: <i style='color:#2a2559;'>"+ nodeValue +"</i> ");
      }
    }else{
      if(width>800){
        tooltipMunicipio
        .classed("hidden", false)
        .html(d.properties.MUNICIPIO_);
      }
    }
}

function zoneMouseOut(){
  tooltip.classed("hidden", true);
}

function zoneClickOdBox(node, d){
  if($("#horapico").is(":checked") || $("#total").is(":checked")){

    if(mouseSelectorOD=="origin"){

      if(!$("#MZ_O_"+d.properties.MACROZONA).is(":checked")){
           $("#MZ_O_"+d.properties.MACROZONA).prop( "checked", true );
            scrollToLi("MZ_O_"+d.properties.MACROZONA);
          }else{
          $("#MZ_O_"+d.properties.MACROZONA).prop( "checked", false );
       }

      selectAsOrigin(node);

    } else if(mouseSelectorOD=="destiny"){
      if(!$("#MZ_D_"+d.properties.MACROZONA).is(":checked")){
           $("#MZ_D_"+d.properties.MACROZONA).prop( "checked", true );
           scrollToLi("MZ_D_"+d.properties.MACROZONA);
          }else{
          $("#MZ_D_"+d.properties.MACROZONA).prop( "checked", false );
       }

      selectAsDestiny(node);
    }
  }
}

function zoneClickInteresseBox(node, d){
  selectAsZone(node);
  scrollToLi("MZ_Z_"+d.properties.MACROZONA);
  lastZone = "#MZ_" + d.properties.ID;

  //TODO change
  if(lastPlot=="interest" && !isPlottingInterest){
    interestPlot();
    var inputID = "#MZ_Z_"+node.attr("macrozona");
    $(inputID).prop( "checked", true );
  }
}

function zoneClick(node, d){

    let nodeClicked = node.attr("clicked");

    if($("#origemDestinoBox").attr("class")=="grid-container"){
      zoneClickOdBox(node, d);

    }else if($("#interesseBox").attr("class")=="grid-container" && width>800){
      zoneClickInteresseBox(node, d);

    } else if($("#indicadoresBox").attr("class")=="grid-container"){
      //zoneClickIndicadoresBox(node);
    }

    node.attr("clicked", 1 - nodeClicked);
}

function draw(topo) {

  var trafficZone = g.selectAll(".macrozona").data(topo);

  trafficZone
  .enter()
  .insert("path")
  .attr("class", "macrozona")
  .attr("d", path)
  .attr("checked", 0)
  .attr("isDestiny",0)
  .attr("isOrigin",0)
  .attr("plottedValue",0)
  .attr("macrozona", function(d) {
    return d.properties.MACROZONA;
  })
  .attr("id", function(d) {
    return ("MZ_"+d.properties.ID);
  })
  .attr("title", function(d, i) {
    return d.properties.RA_NOME;
  })
  .style("fill", function(d, i) {
    //todo modify
    return "rgba(219,220,222,0.5)";
  })
  .on("mousemove", function(d, i) {
    let node = d3.select(this);
    zoneMouseMove(node, d);
  })
  .on("mouseout", function(d, i) {
    zoneMouseOut();
  })
  .on("click", function(d) {
    let node = d3.select(this);
    zoneClick(node, d);
  });
}

function centerMap(){

  svg.transition()
      .duration(500)
      .call(zoom.transform, d3.zoomIdentity);
  //console.log("currentTransform",currentTransform);
  currentZoom =1;
  rescaleStroke();
  createScale();
}

function dragstarted(d) {
     d3.event.sourceEvent.stopPropagation();
     d3.select(this).classed("dragging", true);
 }

function dragged(d) {
   d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
}

function dragended(d) {
   d3.select(this).classed("dragging", false);
}

function zoomed() {
         const currentTransform = d3.event.transform;
         g.attr("transform", currentTransform);
         //console.log("currentTransform",currentTransform);
         currentZoom =currentTransform.k;
         rescaleStroke();
         createScale();
}

//geo translation on mouse click in map
function click() {
  var latlon = projection.invert(d3.mouse(this));
}

function fetchJSONFile(path, callback) {
  var httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = function() {
    if (httpRequest.readyState === 4) {
      if (httpRequest.status === 200) {
        var data = JSON.parse(httpRequest.responseText);
        if (callback) callback(data);
      }
    }
  };
  httpRequest.open("GET", path);
  httpRequest.send();
}

function clearAll(){

  $("#table-matriz").hide();
  $(".macrozona").css("stroke","");
  $("#container-legend").hide();
  $('#heatMapBtn').prop('checked', false);
  $("#origem-block").css("background-image", "linear-gradient( rgba(100,250,250,0.1), rgba(255, 255, 255,0))");
  $("#destino-block").css("background-image", "none");

  $(".macrozona").each(function() {
    $(this).css("fill", "rgba(219,220,222,0.5)");

    var node = d3.select("#"+$(this).attr("id"));
    node.attr("isOrigin", 0);
    node.attr("isDestiny", 0);

    $(this).css("stroke", "rgba(255,255,255,0)");
  });

  matODdownload = [];

  if ($("table").length != 0) {
    $("table").remove();
  }

  $("#ODtitle").css("visibility", "hidden");
  $("#table-wrapper").css("visibility", "hidden");
  $("#container-legend svg").fadeOut(200, function() { $(this).remove(); });
  $( ".centroid" ).remove();
  $( ".line-centroid" ).remove();

  $("#origem-block li input").each(function(){
     $(this).prop( "checked", false );
  });

  $("#destino-block li input").each(function(){
     $(this).prop( "checked", false);
  });

    $("#zona-block li input").each(function(){
     $(this).prop( "checked", false);
  });

  lastPlot = "none";
}

function turnBoxOn(idString){
  $('#'+idString).height('inherit');
  $("#"+idString+" :button").attr("disabled", false);
  $("#"+idString+" :input").attr("disabled", false);
  $("#"+idString).addClass('grid-container').removeClass('grid-container-blocked');

  $('#'+idString+" div.container-block").first().fadeTo(200, 1.0);
  $('#'+idString+" div.container-block").first().show();
  $('#'+idString+" div.container-title h3").first().css("color","#2a2559");
  $('#'+idString+" div.container-title").first().css("background","repeating-linear-gradient(45deg,#e6e4ec,#e6e4ec 10px,#f5f5f5 10px,#f5f5f5 20px)");
}

function turnBoxOff(idString){
  $('#'+idString).height('3.5em');
  $("#"+idString+" :button").attr("disabled", true);
  $("#"+idString+" :input").attr("disabled", true);
  $("#"+idString).addClass('grid-container-blocked').removeClass('grid-container');
  $('#'+idString+" div.container-title h3").first().css("color","#7b7887");
  $('#'+idString+" div.container-title").first().css("background","#fff");
  $('#'+idString+" div.container-block").each(function(){
    $(this).hide();
  });
  $('#'+idString+" input").each(function(){
    $(this).prop( "checked", false );
  });
}

function containerTitleClick(element){
  //Turning off all active boxes
  var isOn = element.parent().attr("class") == "grid-container-blocked";
  var boxesOn = $(".grid-container");
  for(var i = 0; i < boxesOn.length; i++){
      var boxID = boxesOn.attr('id');
      turnBoxOff(boxID);
  }

  //Turning On/Off the clicked box
  var thisBoxID = element.parent().attr('id');
  if(isOn){
    turnBoxOn(thisBoxID);
  }else{
    turnBoxOff(thisBoxID);
  }

  clearAll();
}

function containerInputClick(element){
  var thisBlock = element.closest(".container-block");

 if(element.is(":checked")){
  thisBlock.css("border-left","2px solid #e6e4ec");
 }

  var nextBlock = $(".container-block").eq( $(".container-block").index(thisBlock) + 1 );

  nextBlock.fadeTo(200, 1.0);
  nextBlock.show();
}

//Download SVG
function saveSvg(svgEl, name) {
  svgEl.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  var svgData = svgEl.outerHTML;
  var preface = '<?xml version="1.0" standalone="no"?>\r\n';
  var svgBlob = new Blob([preface, svgData], {type:"image/svg+xml;charset=utf-8"});
  var svgUrl = URL.createObjectURL(svgBlob);
  var downloadLink = document.createElement("a");
  downloadLink.href = svgUrl;
  downloadLink.download = name;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}


function originBlockClick(element){
  mouseSelectorOD = "origin";
  element.find("h4").css("color","#167");
  element.css("background-image","linear-gradient( rgba(100,250,250,0.1), rgba(255, 255, 255,0))");
  $("#destino-block").css("background-image","none");
  $("#destino-block").find("h4").css("color","#2a2559");
  var nextBlock = $("#destino-block");
  if(nextBlock.is(":visible")){
    nextBlock.fadeTo(200, 1.0);
    nextBlock.show();
    $(nextBlock)[0].scrollIntoView({ block: 'end', behavior: 'smooth' });
  }
}

function destinyBlockClick(element){
  mouseSelectorOD = "destiny";
  $("#origem-block").css("background-image","none");
  $("#origem-block").find("h4").css("color","#2a2559");
  element.find("h4").css("color","#A55");
  element.css("background-image","linear-gradient( rgba(250,120,150,0.1), rgba(255, 255, 255,0))");

  var nextBlock = $("#destino-block").parent(".grid-container").find(".container-block").last();
  if(nextBlock.is(":visible")){
    nextBlock.fadeTo(200, 1.0);
    nextBlock.show();
    $(nextBlock)[0].scrollIntoView({ block: 'end', behavior: 'smooth' });
  }
  console.log("hey");
}

function selectAllAsOrigin(thisElement){

  $("#origem-url li").each(function(index, element){
    var newState = thisElement.is(":checked");
    $(element).find("input").prop("checked", newState);
 });

  $(".macrozona").each(function(){
    var node = d3.select("#"+$(this).attr("id"));
    selectAsOrigin(node);
  });
}

function selectAllAsDestiny(thisElement){

  $("#destino-url li").each(function(index, element){
    var newState = thisElement.is(":checked");
    $(element).find("input").prop("checked", newState);
 });

  $(".macrozona").each(function(){
    var node = d3.select("#"+$(this).attr("id"));
    selectAsDestiny(node);
  });
}

function scrollToLi(elementID) {
  var elmnt = document.getElementById(elementID);
  elmnt.scrollIntoView({ block: 'end', behavior: 'smooth' });
}

function scrollToBlock(elmnt) {
  elmnt.scrollIntoView({ block: 'end', behavior: 'smooth' });
}

function indicadoresInputClick(){
  if(lastPlot=="originTrips"){
    plotOriginTrips();
  } else if (lastPlot=="destinyTrips"){
    plotDestinyTrips();
  } else if (lastPlot=="flowOD"){
      plotFlowOD();
  }
}

function interesseInputClick(inputID){
  if(lastPlot=="interest"){

    var node = d3.select(lastZone);
    node.attr("clicked", 1);

    interestPlot();

    $(inputID).prop( "checked", true );
  }
}

function responsivefy(svg) {

  var oldWidth = $("#container").width();

  const container = d3.select(svg.node().parentNode),
      width = parseInt(svg.style('width'), 10),
      height = parseInt(svg.style('height'), 10),
      aspect = width / height;

  svg.attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMinYMid')
      .call(resize);

  d3.select(window).on(
      'resize.' + container.attr('id'),
      resize
  );

  function resize() {
      const w = parseInt(container.style('width'));

      scaleResize = w/oldWidth;
      svg.attr('width', w);
      svg.attr('height', Math.round(w / aspect));

      d3.selectAll(".macrozona").style("stroke-width", 2/(scaleResize * currentZoom) );
      d3.selectAll(".verde").style("stroke-width", 1.5/(scaleResize * currentZoom));
      d3.selectAll(".lagos").style("stroke-width", 1.5/(scaleResize * currentZoom));

      d3.selectAll(".eixo").style("stroke-width", function() {
        return 1/(scaleResize * currentZoom);
      });

      createScale();


  }
}
