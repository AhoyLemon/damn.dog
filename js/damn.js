// jshint -W117
//@prepros-prepend partials/_photos.js

console.log(wikiHow);

$(document).ready(function() {
  getPhoto();
});

var wiki = {
  pic:'',
  title:'',
  url:''
};
var roundsPlayed = [];
var reroll = 0;

function getPhoto() {
  var r = Math.floor((Math.random() * wikiHow.length));
  var a = roundsPlayed.indexOf(r);
  if (a > -1) {
    reroll++;
    if (reroll < 10) {
      getPhoto();
    } else {
      alert("game over");
    }
  } else {
    reroll = 0;
    roundsPlayed.push(r);
    wiki.pic = wikiHow[r].pic;
    $('#HeroPic').attr('src', wiki.pic);
    wiki.title = 'How To '+wikiHow[r].slug.replace(/-/g, " ");
    wiki.url = "http://www.wikihow.com/"+wikiHow[r].slug;
  }
}

function verifyTitle() {
  var tl = wiki.title.toLowerCase();
  var g = "how to " + $('#GuessTitle').val().toLocaleLowerCase();

  if (g == tl) {
    $('#ActualTitle').text(wiki.title);
    $('#ActualTitle').attr('href',wiki.url);
    $('[data-display="guess"]').hide();
    $('[data-display="correct"], [data-display="play again"]').fadeIn(600);
  } else {
    $('#CorrectTitle').text(wiki.title);
    $('#CorrectTitle').attr('href',wiki.url);
    $('[data-display="guess"]').hide();
    $('[data-display="wrong"], [data-display="play again"]').fadeIn(600);
  }

}

$('#GuessTitle').keyup(function(e) {
  if(e.keyCode == 13){
    verifyTitle();
  }
});

$('#PlayAgain').click(function() {
  getPhoto();
  $('#GuessTitle').val('');
  $('[data-display="wrong"], [data-display="correct"], [data-display="play again"]').hide();
  $('[data-display="guess"]').fadeIn(600);
  $('#GuessTitle').focus();
});