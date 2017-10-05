// jshint -W117

$(document).ready(function() {
  $('.number-of-rounds').text(wikiHow.length);
  $('a.correct-title').attr('target','_blank');
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
    device = "android";
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
    device = "ios";
  } else if (ua.indexOf('windows') > -1) {
    device = "windows";
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
});

$('#CloseSharebox').click(function() {
  $('.share-round-holder').hide();
});