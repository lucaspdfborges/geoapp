
var graticule = d3.geo.graticule();

var tooltip = d3
.select("#container")
.append("div")
.attr("class", "tooltip hidden");

var tooltipZone = tooltip
                .append("p")
                .attr("class","tooltipZone");

var tooltipMunicipio = tooltip
                .append("p")
                .attr("class","tooltipMunicipio");

var tooltipNum = tooltip
                .append("p")
                .attr("class","tooltipNum");

setup(width, height);

setupGradients(listColors);

d3.queue(2)
    .defer(d3.json, areaVerdeURL)
    .defer(d3.json, manchaUrbanaURL)
    .defer(d3.json, eixosViariosURL)
    .defer(d3.json, zonasURL)
    .defer(d3.json, lagosURL)
    .defer(d3.json, origemOdURL)
    .defer(d3.json, destinoOdURL)
    .defer(d3.json, nomeIdZonaCenterURL)
    .awaitAll(loadedJSONs);

$("#clear-search").on("click",function(){
  clearSearch();
});

$("#centerMap").on("click", function(){
  centerMap();
});

(function($) {
  $.fn.goTo = function() {
    $("html, body").animate(
      {
        scrollTop: $(this).offset().top + "px"
      },
      "fast"
    );
    return this; // for chaining...
  };
})(jQuery);

$("#flowODBtn").click(function() {
  plotFlowOD();
});

$(".resetBtn").click(function() {
  clearAll();
});

$("#downloadOD").click(function() {
  downloadOD();
});

$("#interestBtn").click(function() {
  interestPlot();
});

$("#selectedBtn").click(function() {
  plotMatrix();
});

$(".container-title").on("click",function(){
    containerTitleClick($(this));
});

document.querySelector(".table-scroll").addEventListener("scroll", function(e) {
  this.querySelector(".thead-col").style.left = this.scrollLeft + "px";
  this.querySelector(".thead-row").style.top = this.scrollTop + "px";
  this.querySelector(".thead-corner").style.top = this.scrollTop + "px";
  this.querySelector(".thead-corner").style.left = this.scrollLeft + "px";
});

//container blocks

$(".container-block").find("input").on("click", function(){
  containerInputClick($(this));
});

$("#downloadSvg").on("click",function(){
  var svgEl = document.getElementById("svgChart");
  saveSvg(svgEl, "mapa.svg");
});

$("#heatMapBtn").change(function(){
  heatMapPlot($(this));
});

$("#origem-block").on("click", function(){
  originBlockClick();
});

$("#destino-block").on("click", function(){
  destinyBlockClick();
});

$("#origem-todos").on("change", function(){
  selectAllAsOrigin($(this));
});

$("#destino-todos").on("change", function(){
    selectAllAsDestiny($(this));
});

$(".scroll-pad-left").first().height($("#container").height());
$(".scroll-pad-right").first().height($("#container").height());

$("#indicadoresBox input").on("change",function(){
  indicadoresInputClick();
});

$("#interesseBox input").on("change",function(){
  interesseInputClick();
});
