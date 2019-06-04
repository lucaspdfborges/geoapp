var nextBlock = $("#dwnldBG").parent(".grid-container").find(".container-block").last();

if(nextBlock.is(":hidden")){
  nextBlock.fadeTo(200, 1.0);
  nextBlock.show();
  $(nextBlock)[0].scrollIntoView({ block: 'end', behavior: 'smooth' });
}
