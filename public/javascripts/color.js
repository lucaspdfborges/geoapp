
function baseColorFunction(baseColor, ratio){
  var color =
  "hsla(" +
  (baseColor - 44 * Math.pow(ratio, 0.4)) +
  ",41%," +
  100 * (0.75 - 0.5 * Math.pow(ratio, 0.4)) +
  "%," +
  Math.pow(ratio, 0.4) +
  ")";

  return color;
}

function baseColorFunctionMin(baseColor, ratio){
  var color =
  "hsla(" +
  (baseColor - 44 * Math.pow(ratio, 0.4)) +
  ",41%," +
  100 * (0.85 - 0.5 * Math.pow(ratio, 0.4)) +
  "%," +
  Math.pow(ratio, 0.1) +
  ")";

  return color;
}

function blueColorFunction(ratio){
  var color =
  "hsla(" +
  (130 + 110 * Math.pow(ratio, 0.4)) +
  ",25%," +
  100 * (0.99 - 0.5 * Math.pow(ratio, 0.4)) +
  "%,1)";

  return color;
}

function redColorFunction(ratio){
  var color =
  "hsla(" +
  (60 - 50 * Math.pow(ratio, 0.4)) +
  ",40%," +
  100 * (0.99 - 0.6 * Math.pow(ratio, 0.4)) +
  "%,1)";

  return color;
}

function baseColorArray(){
  var colorGrad =[];

  for(var i = 0; i < 6; i++){
    var color = baseColorFunctionMin(300, i/5);
    colorGrad.push(color);
  }
  return colorGrad;
}
