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
    roundsPlayed: []
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
          //$('#HeroPic').attr('src', wiki.pic);
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
      sendEvent("guess", "incorrect", self.current.title);
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
    // CHECK BROWSER
    checkBrowser: function() {
      var ua = navigator.userAgent.toLowerCase();
      //console.log(ua);
      if (ua.indexOf("android") > -1) {
        this.device = "android";
        if (ua.indexOf("firefox") > -1) {
          // Android Firefox
          this.browser="firefox";
        } else if (ua.indexOf("opr") > -1) {
          // Android Opera
          this.browser="opera";
        } else if (ua.indexOf("chrome") > -1) {
          // Android Chrome
          this.browser="chrome";
        }
      } else if (ua.indexOf('iphone') > -1 || ua.indexOf('ipad') > -1 || ua.indexOf('ipod') > -1) {
        this.device = "ios";
      } else if (ua.indexOf('windows') > -1) {
        this.device = "windows";
        if (ua.indexOf("edge") > -1) {
          this.browser = "edge";
        } else if (ua.indexOf("trident") > -1) {
          this.browser = "ie";
        } else if (ua.indexOf('firefox') > -1) {
          this.browser = "firefox";
        } else if (ua.indexOf('opr') > -1) {
          this.browser = "opera";
        } else if (ua.indexOf('vivaldi') > -1) {
          this.browser = "vivaldi";
        } else if (ua.indexOf('chrome') > -1) {
          this.browser = "chrome";
        }
      } else if (ua.indexOf('mac') > -1) {
        this.device = "mac";

        if (ua.indexOf('chrome') > -1) {
          this.browser = "chrome";
        } else if (ua.indexOf('safari') > -1) {
          this.browser = "safari";
        } else if (ua.indexOf('firefox') > -1) {
          this.browser = "firefox";
        }
      } else if (ua.indexOf('cros') > -1) {
        this.device = "chrome";
        this.browser = "chrome";
      }
    },

    checkIfStandalone: function() {
      var self = this;
      //return (window.matchMedia('(display-mode: standalone)').matches);
      if (window.matchMedia('(display-mode: standalone)').matches) {
        self.standalone = true;
      }
    }
    
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
      }
    } else {
      // Sorry! No Web Storage support..
    }
    
    this.checkBrowser();
    this.checkIfStandalone();

    if (window.location.hash) {
      var r = window.location.hash.replace('#','');
      self.newRound(r);
    } else {
      self.newRound();
    }

    
  }
});