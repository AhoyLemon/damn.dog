// jshint -W117
//@prepros-prepend partials/_photos.js
//@prepros-prepend partials/_analytics.js

$(document).ready(function() {
  newRound();
});


var wiki = {
  pic:'',
  title:'',
  url:'',
  gid: ''
};

var player = {
  rounds:0,
  score:0,
  correct:0,
  incorrect:0,
  percent:0
};
var roundsPlayed = [];
var reroll = 0;
var choices = [];
var choiceids = [];

function shuffle(o){
  for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o;
}

function newRound() {
  $('[data-display="wrong"], [data-display="correct"], [data-display="play again"]').hide();
  $('[data-display="guess"]').fadeIn(600);
  $('#GuessTitle').focus();
  choices = [];
  choiceids = [];
  getPhoto();
  getChoices();
  console.log(choices);
  console.log(choiceids);
}

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
    wiki.gid = r;
    wiki.pic = wikiHow[r].pic;
    $('#HeroPic').attr('src', wiki.pic);
    wiki.title = 'How To '+wikiHow[r].slug.replace(/-/g, " ");
    wiki.url = "http://www.wikihow.com/"+wikiHow[r].slug;
  }
}

function getChoices() {
  var i = 0;
  while (i < 3) {
    var r = Math.floor((Math.random() * wikiHow.length));
    var a = choiceids.indexOf(r);
    if (r == wiki.gid) {
      // do nothing
    } else if (a > -1) {
      // do nothing
    } else {
      i++;
      var choice = {
        title: 'How To '+wikiHow[r].slug.replace(/-/g, " "),
        guid: r
      };
      choiceids.push(r);
      choices.push(choice);
    }
  }
  choices.push({
    title:wiki.title,
    gid:wiki.gid
  });
  shuffle(choices);
  $('#GuessTitle').empty();
  $('#GuessTitle').append('<option value="default" selected disabled hidden>How To</option>');
  $.each(choices, function(idx, obj){ 
    $('#GuessTitle').append('<option>'+obj.title+'</option>');
  });
}

function goodGuess() {
  player.rounds++;
  player.score++;
  player.correct++;
  sendGA("guess", "correct");
}

function badGuess() {
  player.rounds++;
  player.incorrect++;
  sendGA("guess", "incorrect");
}

function calculatePercent() {
  if (player.correct > 0 && player.incorrect > 0) {
    player.percent = Math.floor((player.correct / player.rounds ) * 100);
  }
}

function showScore() {
  calculatePercent();
  $('#ScoreNumber').text(player.score);
  $('#ScorePercent').text(player.percent);
  
  if (player.rounds == 1) {
    $('#ScoreHeader').fadeIn(600);
  }
  if (player.percent > 0) {
    $('header .percent').fadeIn(600);
    $('#ScorePercent').text(player.percent+'%');
    
    if (player.percent < 50) {
      $('#ScorePercent').addClass('bad');
    } else {
      $('#ScorePercent').removeClass('bad');
    }
  }
}

function verifyTitle() {
  var tl = wiki.title.toLowerCase();
  var g = $('#GuessTitle').val().toLocaleLowerCase();
  if (g == tl) {
    $('#ActualTitle').text(wiki.title);
    $('#ActualTitle').attr('href',wiki.url);
    $('[data-display="guess"]').hide();
    $('[data-display="correct"], [data-display="play again"]').fadeIn(600);
    goodGuess();
  } else {
    $('#CorrectTitle').text(wiki.title);
    $('#CorrectTitle').attr('href',wiki.url);
    $('[data-display="guess"]').hide();
    $('[data-display="wrong"], [data-display="play again"]').fadeIn(600);
    badGuess();
  }
  showScore();
}

/**
$('#GuessTitle').keyup(function(e) {
  if(e.keyCode == 13){
    verifyTitle();
  }
});
**/
$('#GuessTitle').change(function() {
  verifyTitle();
});

$('#PlayAgain').click(function() {
  newRound();
});