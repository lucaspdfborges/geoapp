

function selectAsOrigin(node){

   node.attr("isOrigin", 1-node.attr("isOrigin"));

   let isDestiny =  node.attr("isDestiny")>0;
   let isOrigin =  node.attr("isOrigin")>0;

    if(isDestiny && !isOrigin){
      node.style("fill", "url(#svgGradient1)");
    } else if(!isDestiny && isOrigin){
      node.style("fill", "url(#svgGradient2)");
    } else if(isDestiny && isOrigin){
       node.style("fill", "url(#svgGradient3)");
    } else{
      node.style("fill", "rgba(219,220,222,0.5)");
    }

    var nextBlock = $("#destino-block");
    if(nextBlock.is(":hidden")){
      nextBlock.fadeTo(200, 1.0);
      nextBlock.show();
    }
}

function selectAsDestiny(node){

   node.attr("isDestiny", 1-node.attr("isDestiny"));

   let isDestiny =  node.attr("isDestiny")>0;
   let isOrigin =  node.attr("isOrigin")>0;

    if(isDestiny && !isOrigin){
      node.style("fill", "url(#svgGradient1)");
    } else if(!isDestiny && isOrigin){
      node.style("fill", "url(#svgGradient2)");
    } else if(isDestiny && isOrigin){
       node.style("fill", "url(#svgGradient3)");
    } else{
      node.style("fill", "rgba(219,220,222,0.5)");
    }

    var nextBlock = $("#destino-block").parent(".grid-container").find(".container-block").last();
    if(nextBlock.is(":hidden")){
      nextBlock.fadeTo(200, 1.0);
      nextBlock.show();
    }
}


function generateOriginList(jsonFile){
  var block = d3.select('#origem-url');
  var list =  block.selectAll('li')
  .data(jsonFile.data)
  .enter()
  .append('li');

  list
  .append('input')
  .attr("type", "checkbox")
  .on("click", function(d,i){
    var node =  d3.select("#MZ_"+d.ID);
    selectAsOrigin(node);

    // free the next block
    var thisBlock = $("#origem-block");
    thisBlock.css("border-left","2px solid #e6e4ec");

  })
  .attr("id", function(d,i){
    return "MZ_O_" + d.MACROZONA;
  });

  list
  .append('label')
  .attr("for", function(d,i){
    return "MZ_O_" + d.MACROZONA;
  })
  .html(function(d){
    var text = d.RA_NOME + " : " + d.MACROZONA;
    return text;
  });
}

function generateDestinyList(jsonFile){

  var block = d3.select('#destino-url');

  var list =  block.selectAll('li')
  .data(jsonFile.data)
  .enter()
  .append('li');

  list
  .append('input')
  .attr("type", "checkbox")
  .on("click", function(d,i){
    var node =  d3.select("#MZ_"+d.ID);
    selectAsDestiny(node);

    // free the next block
    var thisBlock = $("#destino-block");
    thisBlock.css("border-left","2px solid #e6e4ec");

  })
  .attr("id", function(d,i){
    return "MZ_D_" + d.MACROZONA;
  });

  list
  .append('label')
  .attr("for", function(d,i){
    return "MZ_D_" + d.MACROZONA;
  })
  .html(function(d){
    var text = d.RA_NOME + " : " + d.MACROZONA;
    return text;
  });
}


function createOD(testData) {
  // set up the table
  var table = d3.select("#results").append("table");
  var thead = table
  .append("thead")
  .attr("class", "thead-row")
  .append("tr");
  var thead2 = table.append("thead").attr("class", "thead-col");
  var thead3 = table.append("thead").attr("class", "thead-corner");
  var tbody = table.append("tbody");
  $("#ODtitle").css("visibility", "visible");
  $("#table-wrapper").css("visibility", "visible");

  var colData = testData.slice();
  colData.shift();

  var rowData = testData.slice();
  var roeDataLine = rowData[0];
  roeDataLine.shift();

  var cornerData = ["OD"];

  var tr0 = thead
  .selectAll("tr")
  .data(roeDataLine)
  .enter()
  .append("th")
  .append("div")
  .attr("class","table-cell")
  .text(function(d) {
    return d;
  });

  var tr1 = thead2
  .selectAll("thead")
  .data(colData)
  .enter()
  .append("tr")
  .append("th")
  .append("div")
  .attr("class","table-cell")
  .text(function(d) {
    return d[0];
  });

  var tr2 = thead3
  .selectAll("thead")
  .data(cornerData)
  .enter()
  .append("tr")
  .append("th")
  .append("div")
  .attr("class","table-cell")
  .text(function(d) {
    return d;
  });

  // first create the table rows (3 needed)

  var bodyData = testData.slice();
  bodyData.shift();
  bodyData.map(x => x.shift());

  var tr = tbody
  .selectAll("tr")
  .data(bodyData)
  .enter()
  .append("tr");

  // Now create the table cells

  var td = tr
  .selectAll("td")
  .data(function(d) {
    return d;
  })
  .enter()
  .append("td")
  .append("div")
  .attr("class","table-cell")
  .html(function(d) {
    return d;
  });
}


function downloadOD(){
  const rows = matODdownload;

  let csvContent = "data:text/csv;charset=utf-8,";

  rows.forEach(function(rowArray) {
    let row = rowArray.join(",");
    csvContent += row + "\r\n";
  });

  var encodedUri = encodeURI(csvContent);
  var link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "Matriz_OD.csv");
  document.body.appendChild(link); // Required for FF

  link.click();
}


function arrayOD(originArray, destinyArray, odJson) {
  matODdownload = [];

  totalSum = 0;

  var matrixOD = [];

  for (var i = 0; i < originArray.length + 1; i++) {
    var origin = originArray[i - 1];
    var lineOD = [];

    if (i == 0) {
      lineOD = destinyArray.slice();
      lineOD.unshift("");
    } else {
      lineOD.push(originArray[i - 1]);
      for (var j = 0; j < destinyArray.length; j++) {
        var destiny = destinyArray[j];
        if (origin != "" && destiny != "") {
          if (
            odJson[origin] != undefined &&
            odJson[origin][destiny] != undefined
          ) {
            var value = 0;

            if ($("#coletivo").is(":checked")) {
              if ($("#horapico").is(":checked")) {
                value += odJson[origin][destiny].TC_PPM;
              } else {
                value += odJson[origin][destiny].TC_total;
              }
            }
            if ($("#individual").is(":checked")) {
              if ($("#horapico").is(":checked")) {
                value += odJson[origin][destiny].TI_PPM;
              } else {
                value += odJson[origin][destiny].TI_total;
              }
            }

            lineOD.push(Math.round(value));
            totalSum += value;
          } else {
            lineOD.push(0);
          }
        } else {
          lineOD.push(0);
        }

      }
    }
    matrixOD.push(lineOD);
    if (i == 0) {
      matODdownload.push(["OD"]);
      matODdownload[0].push(destinyArray);
    } else {
      matODdownload.push([].concat(lineOD));
    }
  }

  $("#ODtotal").html("Total: " + Math.round(totalSum));
  return matrixOD;
}


function plotMatrix(){
  if ($("table").length != 0) {
    $("table").remove();
  }

  let selectedArray = [];
  let originArray = [];
  let destinyArray = [];

  $(".macrozona").each(function() {
    var id = $(this).attr("macrozona");
    var node = d3.select(this);

      if (node.attr("isOrigin")>0) {
        selectedArray.push(id);
        originArray.push(id);
      };

      if(node.attr("isDestiny")>0) {
        selectedArray.push(id);
        destinyArray.push(id);
      };
  });

  originArray.join("").split("");
  destinyArray.join("").split("");

  fetchJSONFile(macrozonaOdURL,
    function(data) {
      var matOD = [];
      matOD = arrayOD(originArray, destinyArray, data);
      createOD(matOD);
      $("#results").goTo();
    }
  );
  $("#table-matriz").show();
}


function heatMapPlot(element){
  var matOD = [];
  var max = 0;

    if (element.is(":checked")){

      $("td").each(function(){
        var value = $(this).find("div").first().html();
        matOD.push(value);
      });

      max = Math.max(...matOD);

      $("td").each(function(){
         var value = $(this).find("div").first().html();
        var color = "rgba(220,80,50,"+(0.6*value/max)+")";
        $(this).find("div").first().css("background-color", color);
      });

    }else{
         $("td").each(function(){
            var color = "rgba(250,250,250,0)";
            $(this).find("div").first().css("background-color", color);
          });
    }
}
