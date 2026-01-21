/**
 * Vue application setup for DAMN DOG game
 */

import { wikiHow, type WikiHowArticle } from './_drawings.js';
import { shuffle, sendEvent } from './_functions.js';

// Import Vue from CDN (loaded in HTML)
declare const Vue: any;

interface CurrentRound {
  slug: string;
  pic: string;
  title: string;
  url: string;
  guess: string;
  choices: Choice[];
  correct: 'right' | 'wrong' | null;
}

interface Choice {
  title: string;
  slug: string;
}

interface Player {
  rounds: number;
  score: number;
  correct: number;
  incorrect: number;
}

interface AppData {
  drawings: WikiHowArticle[];
  averagePercent: number;
  roundsThisSession: number;
  device: string;
  browser: string;
  standalone: boolean;
  current: CurrentRound;
  drawerOpen: boolean;
  bannerVisible: boolean;
  gameOverScreen: boolean;
  help: boolean;
  player: Player;
  roundsPlayed: number[];
  installEvent: any;
}

// Global reroll counter
let reroll = 0;

// Global wiki object for compatibility
const wiki = {
  gid: 0
};

const app = new Vue({
  el: '#app',
  data: (): AppData => ({
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
      rounds: 0,
      score: 0,
      correct: 0,
      incorrect: 0
    },
    roundsPlayed: [],
    installEvent: null
  }),

  computed: {
    scorePercent(): number {
      const self = this as any;
      if (self.player.correct === 0) {
        return 0;
      } else if (self.player.incorrect === 0) {
        return 100;
      } else {
        return Math.floor((self.player.correct / self.player.rounds) * 100);
      }
    }
  },

  methods: {
    newRound(r?: number): void {
      const self = this as any;
      self.current.correct = null;
      self.current.choices = [];
      reroll = 0;

      if (r && r <= wikiHow.length) {
        self.getPic(r);
      } else {
        self.getPic();
      }

      self.getChoices();
      self.roundsThisSession++;

      if (self.roundsThisSession === 3) {
        new Audio('audio/bylemon.mp3').play();
        setTimeout(() => {
          self.bannerVisible = true;
        }, 800);
      }
    },

    getPic(p?: number): void {
      const self = this as any;
      let r: number;
      self.current.guess = '';

      if (p) {
        r = p;
        wiki.gid = r;
        if (!wikiHow[r].pic) {
          self.current.pic = 'img/pics/' + self.drawings[r].slug.toLowerCase() + '.jpg';
        } else {
          self.current.pic = self.drawings[r].pic;
        }
        self.current.slug = self.drawings[r].slug;
        self.current.title = 'How To ' + self.drawings[r].slug.replace(/-/g, " ");
        self.current.url = "http://www.wikihow.com/" + self.drawings[r].slug;
      } else {
        r = Math.floor(Math.random() * self.drawings.length);
        const a = self.roundsPlayed.indexOf(r);
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
            self.current.pic = 'img/pics/' + self.drawings[r].slug.toLowerCase() + '.jpg';
          } else {
            self.current.pic = self.drawings[r].pic;
          }
          self.current.slug = self.drawings[r].slug;
          self.current.title = 'How To ' + self.drawings[r].slug.replace(/-/g, " ");
          self.current.url = "http://www.wikihow.com/" + self.drawings[r].slug;
          self.roundsPlayed.push(r);
          history.pushState(null, "", '#' + r);
        }
      }
    },

    getChoices(): void {
      const self = this as any;
      let i = 0;
      while (i < 3) {
        const r = Math.floor(Math.random() * self.drawings.length);
        if (self.drawings[r].slug !== self.current.slug) {
          i++;
          const choice: Choice = {
            title: 'How To ' + self.drawings[r].slug.replace(/-/g, " "),
            slug: self.drawings[r].slug
          };
          self.current.choices.push(choice);
        }
      }
      self.current.choices.push({
        title: self.current.title,
        slug: self.current.slug
      });
      self.current.choices = shuffle(self.current.choices);
    },

    checkGuess(g: string): void {
      const self = this as any;
      if (g === self.current.title) {
        self.goodGuess();
      } else {
        self.badGuess();
      }
    },

    goodGuess(): void {
      const self = this as any;
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

    badGuess(): void {
      const self = this as any;
      self.player.rounds++;
      self.player.incorrect++;
      localStorage.roundsPlayed = self.roundsPlayed;
      localStorage.playerRounds = self.player.rounds;
      localStorage.playerIncorrect = self.player.incorrect;
      sendEvent("guess", "wrong", self.current.title);
      self.current.correct = "wrong";
    },

    wikiClick(u: string, t: string): void {
      sendEvent('Wikihow Link', u, t);
    },

    gameOver(): void {
      const self = this as any;
      self.gameOverScreen = true;

      localStorage.removeItem("roundsPlayed");
      localStorage.removeItem("playerRounds");
      localStorage.removeItem("playerScore");
      localStorage.removeItem("playerCorrect");
      localStorage.removeItem("playerIncorrect");

      sendEvent("GAME OVER",
        self.player.correct + ' CORRECT | ' + self.player.incorrect + ' WRONG | ' + self.player.rounds + ' ROUNDS',
        self.scorePercent + '%');
    },

    clearScores(): void {
      const self = this as any;
      self.player.correct = 0;
      self.player.incorrect = 0;
      self.player.rounds = 0;
      self.player.score = 0;
      self.roundsPlayed = [];
      self.gameOverScreen = false;
      reroll = 0;
      self.getPic();
    },

    shareThisRound(): void {
      const currentUrl = window.location.href;
      if (navigator.share) {
        navigator.share({
          title: 'DAMN DOG',
          text: 'What is the title of this wikiHow article?',
          url: currentUrl,
        })
          .then(() => {
            sendEvent('share round', 'shared', currentUrl);
          })
          .catch(() => {
            // Silently handle share errors
          });
      }
    },

    installPWA(): void {
      const self = this as any;
      if (self.installEvent) {
        self.installEvent.prompt();
      }
    },

    checkIfStandalone(): void {
      const self = this as any;
      if (window.matchMedia('(display-mode: standalone)').matches) {
        self.standalone = true;
      }
    }
  },

  mounted(): void {
    const self = this as any;

    // Load data from localStorage
    if (typeof Storage !== "undefined") {
      if (!localStorage.roundsPlayed) {
        localStorage.setItem('roundsPlayed', '');
      } else {
        self.roundsPlayed = localStorage.roundsPlayed.split(',').map((n: string) => parseInt(n)).filter((n: number) => !isNaN(n));

        if (localStorage.playerRounds) {
          self.player.rounds = parseInt(localStorage.playerRounds);
        }
        if (localStorage.playerScore) {
          self.player.score = parseInt(localStorage.playerScore);
        }
        if (localStorage.playerCorrect) {
          self.player.correct = parseInt(localStorage.playerCorrect);
        }
        if (localStorage.playerIncorrect) {
          self.player.incorrect = parseInt(localStorage.playerIncorrect);
        }

        console.log(self.roundsPlayed);
        sendEvent("Returning Player",
          self.player.correct + ' CORRECT | ' + self.player.incorrect + ' WRONG | ' + self.player.rounds + ' ROUNDS',
          self.player.rounds + ' ROUNDS PLAYED');
      }
    }

    this.checkIfStandalone();

    // Listen for PWA install prompt
    window.addEventListener('beforeinstallprompt', (event: any) => {
      event.preventDefault();
      self.installEvent = event;
    });

    // Start the game
    if (window.location.hash) {
      const r = parseInt(window.location.hash.replace('#', ''));
      self.newRound(r);
    } else {
      self.newRound();
    }
  }
});

export default app;
