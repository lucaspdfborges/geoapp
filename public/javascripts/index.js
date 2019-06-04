
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

zoomButtons();

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
    .defer(d3.json, idRaURL)
    .awaitAll(loadedJSONs);

$("#clear-search").on("click",function(){
  clearSearch($(this));
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
  if(width<800){
    $(".grid-wrappers").first().fadeOut("fast");
    $("#container-wrapper").show();
  }
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
  originBlockClick($(this));
});

$("#destino-block").on("click", function(){
  destinyBlockClick($(this));
});

$("#origem-todos").on("change", function(){
  selectAllAsOrigin($(this));
});

$("#destino-todos").on("change", function(){
    selectAllAsDestiny($(this));
});

$("#indicadoresBox input").on("change",function(){
  indicadoresInputClick();
});

$("#indicadoresBox button").on("click", function(){
  if(width<800){
    $(".grid-wrappers").first().fadeOut("fast");
    $("#container-wrapper").show();
  }
});

$("#interesseBox input").on("change",function(){

  if(lastPlot=="interest"){
    interestPlot();
  }

 if($(this).attr("id") == "originEsp" || $(this).attr("id") == "destEsp"){
   var nextBlock = $("#zona-block");
   $(nextBlock)[0].scrollIntoView({ block: 'end', behavior: 'smooth' });
 }

});

$("#hideMenu").on("click",function(){
  if($(".grid-wrappers").is(":hidden")){
      $(".grid-wrappers").first().show();
      if(width<800){
        $("#container-wrapper").hide();
      }
  }else{
    $(".grid-wrappers").first().fadeOut("fast");
    if(width<800){
      $("#container-wrapper").show();
    }
  }
});

$("#hide-matriz").on("change", function(){
  if($(this).is(":checked")){
    hideMatrix();
  }else{
    showMatrix();
  }
});

$("#closeMatriz").on("click",function(){
  $("#table-matriz").fadeOut("fast");
});
