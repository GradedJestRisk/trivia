'use strict'

const expect = require('chai').expect
const Game = require('../game.js')

describe('setting up', () => {

  it('should not allow single player (isPlayable not used) - bug ?', () => {
    var game = new Game();
    game.add('Chet');
    game.roll(12)

    // Then
    const messages = game.getMessages()
    expect(messages[1]).to.equal("They are player number 1")
  })

})

describe('playing', () => {

  it('template', () => {
    var game = new Game();
    game.add('Chet');
    game.roll(12)
    //game.wrongAnswer()
   // game.roll(2)
    const situation =  game.wasCorrectlyAnswered()
    const messages = game.getMessages()

    expect(messages[0]).to.equal("Chet was added")
  })

  describe('after dice have been rolled', () => {
    it(' should go forward according to the dice result', () => {
      var game = new Game();
      game.add('Chet')
      game.add('Suzan')

      game.roll(2)
      const messages = game.getMessages()
      console.log(messages)

      const positionMessage = messages[messages.length - 3]
      expect(positionMessage).to.equal("Chet's new location is 2")
    })
  })

  /*
  0 Chet was added',
  1 'They are player number 1',
  2 'Suzan was added',
  3 'They are player number 2',
  4 'Chet is the current player',
  5 'They have rolled a 2',      -2
  6 "Chet's new location is 2",  -1
  7 'The category is Sports',     0
  8 'Sports Question 0'          +1
  */


})
