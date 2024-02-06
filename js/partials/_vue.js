// jshint -W117
var app = new Vue({
  el: '#app',
  data: {
    drawings: wikiHow,
    averagePercent: 56,
    roundsThisSession: -1,
    device: '',
    browser: '',
    standalone: false,
    current: {
      slug: '',
      pic: '',
      title: '',
      url: '',
      guess: '',
      choices: [],
      correct: null
    },
    drawerOpen: false,
    bannerVisible: false,
    gameOverScreen: false,
    help: false,
    player: {
      rounds:0,
      score:0,
      correct:0,
      incorrect:0
    },
    roundsPlayed: [],
    
    // PWA stuff
    installEvent: null
  },
  computed: {
    scorePercent: function() {
      var self = this;
      if (self.player.correct === 0) {
        return 0;
      } else if (self.player.incorrect === 0) {
        return 100;
      } else {
        return Math.floor((self.player.correct / self.player.rounds ) * 100);
      }
    }
  },
  
  methods: {
    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // NEW ROUND
    newRound: function(r) {
      var self = this;
      self.current.correct = null;
      self.current.choices = [];
      reroll = 0;
      //alert(wikiHow.length);
      if (r && r <= wikiHow.length) {

        self.getPic(r);
      } else {
        self.getPic();
      }
      
      self.getChoices();
      
      self.roundsThisSession++;
      
      if (self.roundsThisSession == 3) {
        new Audio('audio/bylemon.mp3').play();
        setTimeout(function(){ 
          self.bannerVisible = true;
        }, 800);
      }
      
    },
    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // GET PHOTO
    getPic: function(p) {
      var self = this;
      var r;
      self.current.guess = '';
      if (p) {
        r = p;
        wiki.gid = r;
        if (!wikiHow[r].pic) {
          self.current.pic = 'img/pics/'+self.drawings[r].slug.toLowerCase()+'.jpg';
        } else {
          self.current.pic = self.drawings[r].pic;
        }
        self.current.slug = self.drawings[r].slug;
        self.current.title = 'How To '+self.drawings[r].slug.replace(/-/g, " ");
        self.current.url = "http://www.wikihow.com/"+self.drawings[r].slug;
      } else {
        r = Math.floor((Math.random() * self.drawings.length));
        var a = self.roundsPlayed.indexOf(r);
        if (a > -1) {
          reroll++;
          if (reroll < 9) {
            self.getPic();
          } else {
            self.gameOver();
          }
        } else {
          reroll = 0;
          wiki.gid = r;
          if (!wikiHow[r].pic) {
            self.current.pic = 'img/pics/'+self.drawings[r].slug.toLowerCase()+'.jpg';
          } else {
            self.current.pic = self.drawings[r].pic;
          }
          self.current.slug = self.drawings[r].slug;
          self.current.title = 'How To '+self.drawings[r].slug.replace(/-/g, " ");
          self.current.url = "http://www.wikihow.com/"+self.drawings[r].slug;
          self.roundsPlayed.push(r);
          history.pushState(null, null, '#'+r);
        }
      }
    },
    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // GET CHOICES
    getChoices: function() {
      var self = this;
      var i = 0;
      while (i < 3) {
        var r = Math.floor((Math.random() * self.drawings.length));
        if (self.drawings[r].slug == self.current.slug) {
          // do nothing
        } else if (-2 > -1) {
          // do nothing
        } else {
          i++;
          var choice = {
            title: 'How To '+self.drawings[r].slug.replace(/-/g, " "),
            slug: self.drawings[r].slug
          };
          self.current.choices.push(choice);
        }
      }
      self.current.choices.push({
        title:self.current.title,
        slug:self.current.slug
      });
      shuffle(self.current.choices);
    },
    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // CHECK GUESS
    checkGuess: function(g) {
      var self = this;
      if (g == self.current.title) {
        self.goodGuess();
      } else {
        self.badGuess();
      }
    },
    
    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // GOOD GUESS
    goodGuess: function() {
      var self = this;
      self.player.rounds++;
      self.player.score++;
      self.player.correct++;
      localStorage.roundsPlayed = self.roundsPlayed;
      localStorage.playerRounds = self.player.rounds;
      localStorage.playerScore = self.player.score;
      localStorage.playerCorrect = self.player.correct;
      sendEvent("guess", "correct", self.current.title);

      self.current.correct = "right";
    },
    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // BAD GUESS
    badGuess: function() {
      var self = this;
      self.player.rounds++;
      self.player.incorrect++;
      localStorage.roundsPlayed = self.roundsPlayed;
      localStorage.playerRounds = self.player.rounds;
      localStorage.playerIncorrect = self.player.incorrect;

      sendEvent("guess", "wrong", self.current.title);

      self.current.correct = "wrong";
    },
    
    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // CLICK ON A WIKIHOW LINK
    wikiClick: function(u,t) {
      var self = this;
      sendEvent('Wikihow Link', u, t);
    },
    
    gameOver: function() {
      var self = this;
      self.gameOverScreen = true;
      
      // Clear out local storage.
      localStorage.removeItem("roundsPlayed");
      localStorage.removeItem("playerRounds");
      localStorage.removeItem("playerScore");
      localStorage.removeItem("playerCorrect");
      localStorage.removeItem("playerIncorrect");
      
      sendEvent("GAME OVER", 
                self.player.correct + ' CORRECT | ' + self.player.incorrect + ' WRONG | ' + self.player.rounds + ' ROUNDS',
                self.scorePercent + '%');
    },
    
    clearScores: function() {
      var self = this;
      self.player.correct = 0;
      self.player.incorrect = 0;
      self.player.rounds = 0;
      self.player.score = 0;
      self.roundsPlayed = [];
      
      self.gameOverScreen = false;
      reroll = 0;
      self.getPic();
    
    },
    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // SHARE THIS ROUND

    shareThisRound: function() {
      const self = this;
      const currentUrl = window.location.href;
      if (navigator.share) {
        navigator.share({
          title: 'DAMN DOG',
          text: 'What is the title of this wikiHow article?',
          url: currentUrl,
        })
        .then(() => {
          sendEvent('share round', currentUrl)
        })
        .catch((error) => {
          // This seems to happen regardless.
        });
      }
      
    },

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Install This
    installPWA: function() {
      const self = this;
      self.installEvent.prompt();
    },

    checkIfStandalone: function() {
      var self = this;
      if (window.matchMedia('(display-mode: standalone)').matches) {
        self.standalone = true;
      }
    },
    
  },
  mounted: function() {

    var self = this;

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // LOAD IN DATA FROM LOCALSTORAGE
    if(typeof(Storage) !== "undefined") {
      if (localStorage.roundsPlayed === undefined || localStorage.roundsPlayed === null) {
        localStorage.setItem('roundsPlayed', '');
      } else {
        self.roundsPlayed = localStorage.roundsPlayed.split(',');
        for(var i=0; i<self.roundsPlayed.length; i++) { 
          self.roundsPlayed[i] = parseInt(self.roundsPlayed[i]); 
          if (isNaN(self.roundsPlayed[i])) {
            self.roundsPlayed.splice(i,1);
          }
        }

        if (localStorage.playerRounds > 0) {
          self.player.rounds = parseInt(localStorage.playerRounds);
        }
        if (localStorage.playerScore > 0) {
          self.player.score = parseInt(localStorage.playerScore);
        }
        if (localStorage.playerCorrect > 0) {
          self.player.correct = parseInt(localStorage.playerCorrect);
        }
        if (localStorage.playerIncorrect > 0) {
          self.player.incorrect = parseInt(localStorage.playerIncorrect);
        }
        console.log(self.roundsPlayed);

        sendEvent("Returning Player", 
                  self.player.correct + ' CORRECT | ' + self.player.incorrect + ' WRONG | ' + self.player.rounds + ' ROUNDS',
                  self.player.rounds + ' ROUNDS PLAYED');

      }
    } else {
      // Sorry! No Web Storage support..
    }
    
    this.checkIfStandalone();

    /////////////////////////////////////
    // Let's look at the install event.
    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      self.installEvent = event;
    });

    if (window.location.hash) {
      var r = window.location.hash.replace('#','');
      self.newRound(r);
    } else {
      self.newRound();
    }

    
  }
});