// jshint -W117
//@prepros-prepend partials/_photos.js
//@prepros-prepend partials/_analytics.js

$(document).ready(function() {
  $('.number-of-rounds').text(wikiHow.length);
  if(window.location.hash) {
    var hash = window.location.hash.substring(1); 
    
    if (hash < wikiHow.length) {
      getPhoto(hash);
      getChoices();
    } else {
      getPhoto();
      getChoices();
    }
  } else {
    getPhoto();
    getChoices();
  }
  
  var ua = navigator.userAgent.toLowerCase();
  console.log(ua);
  device = "";
  browser = "";
  
  if (ua.indexOf("android") > -1) {
    device = "android"
    if (ua.indexOf("firefox") > -1) {
      // Android Firefox
      browser="firefox";
    } else if (ua.indexOf("opr") > -1) {
      // Android Opera
      browser="opera";
    } else if (ua.indexOf("chrome") > -1) {
      // Android Chrome
      browser="chrome";
    }
  } else if (ua.indexOf('iphone') > -1 || ua.indexOf('ipad') > -1 || ua.indexOf('ipod') > -1) {
    device = "ios"
  } else if (ua.indexOf('windows') > -1) {
    device = "windows"
    if (ua.indexOf("edge") > -1) {
      browser = "edge";
    } else if (ua.indexOf("trident") > -1) {
      browser = "ie";
    } else if (ua.indexOf('firefox') > -1) {
      browser = "firefox";
    } else if (ua.indexOf('opr') > -1) {
      browser = "opera";
    } else if (ua.indexOf('chrome') > -1) {
      browser = "chrome";
    }
  } else if (ua.indexOf('firefox') > -1) {
    browser = "firefox";
  } else if (ua.indexOf('chrome') > -1) {
    device = "unknown";
    browser = "chrome";
  }
  console.log('device: '+device+'. browser:'+browser);
  addToHomeScreen(device,browser);
});


function addToHomeScreen(device,browser) {
  if (device == "android") {
    $('#HomescreenLink').text('Add To Home Screen');
    $('#HomescreenLink, #HomescreenHolder').addClass('android').addClass(browser);
  } else if (device == "ios") {
    $('#HomescreenLink').text('Add To Home Screen');
    $('#HomescreenLink, #HomescreenHolder').addClass('ios safari');
  } else if (browser == "edge" || browser == "ie") {  
    $('#HomescreenLink').text('Pin To Start');
    $('#HomescreenLink, #HomescreenHolder').addClass('windows edge');
  } else if (browser == "opera") {
    $('#HomescreenLink').text('Add To Favorites');
    $('#HomescreenLink, #HomescreenHolder').addClass('windows opera');
  } else if (browser == "chrome") {
    $('#HomescreenLink').text('Add To Desktop');
    $('#HomescreenLink, #HomescreenHolder').addClass('desktop-chrome');
  } else if (browser == "firefox") {
    $('#AddToHomeScreen').html('Bookmark damn.dog<span class="indent">Control+D</span>');
  } else {
    $('#AddToHomeScreen').remove();
  }
}

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

if(typeof(Storage) !== "undefined") {
  
  if (localStorage.roundsPlayed === undefined || localStorage.roundsPlayed === null) {
    localStorage.setItem('roundsPlayed', '');
  } else {
    roundsPlayed = localStorage.roundsPlayed.split(',');
    for(var i=0; i<roundsPlayed.length; i++) { roundsPlayed[i] = parseInt(roundsPlayed[i], 10); }
    
    if (localStorage.playerRounds > 0) {
      player.rounds = localStorage.playerRounds;
    }
    if (localStorage.playerScore > 0) {
      player.score = localStorage.playerScore;
    }
    if (localStorage.playerCorrect > 0) {
      player.correct = localStorage.playerCorrect;
    }
    if (localStorage.playerIncorrect > 0) {
      player.incorrect = localStorage.playerIncorrect;
    }
    console.log(roundsPlayed);
    showScore();
  }
  
} else {
  // Sorry! No Web Storage support..
}

function shuffle(o){
  for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o;
}

function newRound() {
  $('[data-display="wrong"], [data-display="correct"], [data-display="play again"]').hide();
  $('[data-display="guess"]').fadeIn(600);
  choices = [];
  choiceids = [];
  getPhoto();
  getChoices();
}

function getPhoto(p) {
  var r;
  if (p) {
    r = p;
    reroll = 0;
    wiki.gid = r;
    if (!wikiHow[r].pic) {
      wiki.pic = 'img/pics/'+wikiHow[r].slug.toLowerCase()+'.jpg';
    } else {
      wiki.pic = wikiHow[r].pic;
    }
    $('#HeroPic').attr('src', wiki.pic);
    wiki.title = 'How To '+wikiHow[r].slug.replace(/-/g, " ");
    wiki.url = "http://www.wikihow.com/"+wikiHow[r].slug;
  } else {
    r = Math.floor((Math.random() * wikiHow.length));
    var a = roundsPlayed.indexOf(r);
    if (a > -1) {
      reroll++;
      if (reroll < 9) {
        getPhoto();
      } else {
        gameOver();
      }
    } else {
      reroll = 0;
      wiki.gid = r;
      if (!wikiHow[r].pic) {
        wiki.pic = 'img/pics/'+wikiHow[r].slug.toLowerCase()+'.jpg';
      } else {
        wiki.pic = wikiHow[r].pic;
      }
      $('#HeroPic').attr('src', wiki.pic);
      wiki.title = 'How To '+wikiHow[r].slug.replace(/-/g, " ");
      wiki.url = "http://www.wikihow.com/"+wikiHow[r].slug;

      history.pushState(null, null, '#'+r);
    }
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
  localStorage.playerRounds = player.rounds;
  localStorage.playerScore = player.score;
  localStorage.playerCorrect = player.correct;
  sendGA("guess", "correct", wiki.title);
}

function badGuess() {
  player.rounds++;
  player.incorrect++;
  localStorage.playerRounds = player.rounds;
  localStorage.playerIncorrect = player.incorrect;
  sendGA("guess", "incorrect", wiki.title);
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
  
  if (player.rounds >= 1) {
    $('#ScoreHeader').fadeIn(600);
  }
  if (player.percent > 0) {
    $('header .percent').fadeIn(600);
    $('#ScorePercent').text(player.percent+'%');
    
    if (player.percent < 60) {
      $('#ScorePercent').addClass('bad');
    } else {
      $('#ScorePercent').removeClass('bad');
    }
  }
}

function verifyTitle() {
  var tl = wiki.title.toLowerCase();
  var g = $('#GuessTitle').val().toLocaleLowerCase();
  roundsPlayed.push(wiki.gid);
  localStorage.setItem('roundsPlayed', roundsPlayed.toString());
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

function gameOver() {
  $('#FinalRounds').text(player.rounds);
  $('#FinalCorrect').text(player.correct);
  $('#FinalInorrect').text(player.incorrect);
  $('#FinalPercent').text(player.percent+'%');
  $('#GameOver').fadeIn(600);
  
  localStorage.removeItem("roundsPlayed");
  localStorage.removeItem("playerRounds");
  localStorage.removeItem("playerScore");
  localStorage.removeItem("playerCorrect");
  localStorage.removeItem("playerIncorrect");
  
}
$('#GuessTitle').change(function() {
  verifyTitle();
});

$('#ActualTitle').click(function() {
  var whURL = $(this).attr('href');
  sendGA('Wikihow Link', whURL);
});

$('#PlayAgain').click(function() {
  newRound();
});

$('button.hamburger').click(function() {
  $(this).toggleClass('is-active');
  $('.sidebar').toggleClass('visible');
});

$('#OpenSharebox').click(function() {
  $('.share-round-holder').show();
});

$('#HomescreenLink').click(function() {
  $('#HomescreenHolder').show();
});

$('#CloseHomeScreenHelp').click(function() {
  $('#HomescreenHolder').hide();
})

$('#CloseSharebox').click(function() {
  $('.share-round-holder').hide();
});