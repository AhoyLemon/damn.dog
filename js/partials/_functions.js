function shuffle(o){
  for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o;
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