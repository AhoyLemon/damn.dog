// jshint -W117

/*
function addToHomeScreen(device,browser) {
  if (device == "android") {
    $('#HomescreenLink').text('add to home screen');
    $('#HomescreenLink, #HomescreenHolder').addClass('android').addClass(browser);
  } else if (device == "ios") {
    $('#HomescreenLink').text('add to home screen');
    $('#HomescreenLink, #HomescreenHolder').addClass('ios safari');
  } else if (browser == "edge" || browser == "ie") {  
    $('#HomescreenLink').text('pin to start');
    $('#HomescreenLink, #HomescreenHolder').addClass('windows edge');
  } else if (browser == "opera") {
    $('#HomescreenLink').text('add to favorites');
    $('#HomescreenLink, #HomescreenHolder').addClass('windows opera');
  } else if (browser == "chrome") {
    $('#HomescreenLink').text('add to desktop');
    $('#HomescreenLink, #HomescreenHolder').addClass('desktop-chrome');
  } else if (browser == "firefox") {
    $('#AddToHomeScreen').html('<span class="label">bookmark damn.dog</span><span class="indent">Control+D</span>');
  } else {
    $('#AddToHomeScreen').remove();
  }
}
*/

function shuffle(o){
  for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o;
}

/*
function newRound() {
  $('[data-display="wrong"], [data-display="correct"], [data-display="play again"]').hide();
  $('[data-display="guess"]').fadeIn(600);
  choices = [];
  choiceids = [];
  getPhoto();
  getChoices();
}
*/

/*
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
*/

/*
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
  //$('#GuessTitle').append('<optgroup label="How To"></optgroup>');
  $.each(choices, function(idx, obj){ 
    $('#GuessTitle').append('<option>'+obj.title+'</option>');
  });
}
*/

/*
function goodGuess() {
  player.rounds++;
  player.score++;
  player.correct++;
  localStorage.playerRounds = player.rounds;
  localStorage.playerScore = player.score;
  localStorage.playerCorrect = player.correct;
  sendGA("guess", "correct", wiki.title);
}
*/

/*
function badGuess() {
  player.rounds++;
  player.incorrect++;
  localStorage.playerRounds = player.rounds;
  localStorage.playerIncorrect = player.incorrect;
  sendGA("guess", "incorrect", wiki.title);
}
*/

/*
function calculatePercent() {
  if (player.correct > 0 && player.incorrect > 0) {
    player.percent = Math.floor((player.correct / player.rounds ) * 100);
  }
}
*/

/*
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
    
    if (player.percent < 63) {
      $('#ScorePercent').addClass('bad');
    } else {
      $('#ScorePercent').removeClass('bad');
    }
  }
}
*/

/*
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
*/

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