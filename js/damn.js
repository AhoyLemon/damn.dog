//@prepros-prepend partials/_photos.js



$(document).ready(function() {
  var r = Math.floor((Math.random() * wikiHowPics.length));
  $('#HeroPic').attr('src', wikiHowPics[r]);
});