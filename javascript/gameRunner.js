'use strict'

const Game = require('./game.js')

var notAWinner = false

var game = new Game()

game.addPlayer('Chet')
game.addPlayer('Pat')
game.addPlayer('Sue')

do {

  game.roll(Math.floor(Math.random() * 6) + 1)

  if (Math.floor(Math.random() * 10) == 7) {
    notAWinner = game.wrongAnswer()
  } else {
    notAWinner = game.wasCorrectlyAnswered()
  }

} while (notAWinner)
