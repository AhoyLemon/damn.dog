//@prepros-prepend partials/_photos.js



$(document).ready(function() {
  getPhoto();
});


var wiki = {
  pic:'',
  title:'',
  url:''
};

function getPhoto() {
  var r = Math.floor((Math.random() * wikiHow.length));
  wiki.pic = wikiHow[r].pic;
  $('#HeroPic').attr('src', wiki.pic);
  wiki.title = wikiHow[r].slug.replace(/-/g, " ");
  wiki.url = "http://www.wikihow.com/"+wikiHow[r].slug;
}



function verifyTitle() {
  var tl = wiki.title.toLowerCase();
  var g = $('#GuessTitle').val().toLocaleLowerCase();

  if (g == tl) {

  } else {
    $('#CorrectTitle').text(wiki.title);
    $('#CorrectTitle').attr('href',wiki.url);
    $('[data-display="guess"]').hide();
    $('[data-display="wrong"], [data-display="play again"]').fadeIn(600);
  }

}

$('#GuessTitle').keyup(function(e) {
  if(event.keyCode == 13){
    verifyTitle();
  }
});

$('#PlayAgain').click(function() {
  getPhoto();
  $('#GuessTitle').val('');
  $('[data-display="wrong"], [data-display="play again"]').hide();
  $('[data-display="guess"]').fadeIn(600);
  $('#GuessTitle').focus();
});