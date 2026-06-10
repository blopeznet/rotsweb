import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', {
  state: () => ({
    score: 0,
    highScore: Number(localStorage.getItem('rots-highscore')) || 0,
    lives: 20,
    gameState: 'START'
  }),

  actions: {
    startGame() {
      this.score = 0
      this.lives = 20
      this.gameState = 'PLAYING'
    },

    addPoint() {
      this.score++

      if (this.score > this.highScore) {
        this.highScore = this.score
        localStorage.setItem(
          'rots-highscore',
          this.highScore
        )
      }
    },

    loseLife() {
      this.lives--

      if (this.lives <= 0) {
        this.gameState = 'GAME_OVER'
      }
    },

    resetGame() {
      this.score = 0
      this.lives = 3
      this.gameState = 'START'
    }
  }
})