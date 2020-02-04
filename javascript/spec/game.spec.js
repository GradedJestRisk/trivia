'use strict'

const expect = require('chai').expect
const Game = require('../game.js')

describe('BUG ?!', () => {

  it('should not allow single player (isPlayable not used) - bug ?', () => {
    var game = new Game();
    game.add('Chet');
    game.roll(12)

    // Then
    const messages = game.getMessages()
    expect(messages[1]).to.equal("They are player number 1")
  })

  it("should not to roll 0 ", ()=>{
    var game = new Game();
    game.add('Chet')
    game.add('Suzan')

    game.roll(0)
    expect(true).to.be(true)
  })
})

describe('playing', () => {

  it('template', () => {
    var game = new Game();
    game.add('Chet');
    game.roll(12)

    const situation =  game.wasCorrectlyAnswered()
    const messages = game.getMessages()

    expect(messages[0]).to.equal("Chet was added")
  })

  describe('after dice have been rolled', () => {
    it(' should go to position N if N is rolled', () => {
      var game = new Game();
      game.add('Chet')
      game.add('Suzan')

      game.roll(2)
      const messages = game.getMessages()
      console.log(messages)

      const positionMessage = messages[messages.length - 3]
      expect(positionMessage).to.equal("Chet's new location is 2")
    })
    it('should go to position 0 if 12 is rolled', () => {
      var game = new Game();
      game.add('Chet')
      game.add('Suzan')

      game.roll(12)
      const messages = game.getMessages()
      console.log(messages)

      const positionMessage = messages[messages.length - 3]
      expect(positionMessage).to.equal("Chet's new location is 0")
    })
    it('the final position is the dice rolled result minus 12 if the result is more than 12', () => {
      var game = new Game();
      game.add('Chet')
      game.add('Suzan')

      game.roll(13)
      const messages = game.getMessages()
      console.log(messages)

      const positionMessage = messages[messages.length - 3]
      expect(positionMessage).to.equal("Chet's new location is 1")
    })
    it(' should ask a question', () => {
      var game = new Game();
      game.add('Chet')
      game.add('Suzan')

      game.roll(2)
      const messages = game.getMessages()
      //console.log(messages)

      const questionMessage = messages[messages.length - 1]
      expect(questionMessage).to.match(/Question/)
    })
  })

  describe('when a player answers a question', ()=>{
    let game;
    beforeEach(() => {
      game = new Game();
      game.add('Chet')
      game.add('Suzan')
    })
    describe('if the answer is wrong', ()=>{
      it("should go to the penalty box", ()=>{
        game.roll(1)
        game.wrongAnswer()
        const messages = game.getMessages()
        const penaltyMessage = messages[messages.length - 1]
        expect(penaltyMessage).to.equal('Chet was sent to the penalty box')
      })
    })
    describe('if the answer is right', ()=>{
      it("should gain 1 coin", ()=>{
        game.roll(1)
        game.wasCorrectlyAnswered()
        const messages = game.getMessages()
        const penaltyMessage = messages[messages.length - 1]
        expect(penaltyMessage).to.equal('Chet now has 1 Gold Coins.')
      })
    })
  })

  describe('when the player is in the penalty box', ()=>{
    let game;
    beforeEach(() => {
      game = new Game();
      game.add('Chet')
      game.roll(1)
      game.wrongAnswer()
    })
    describe('when the player rolls an odd value', () =>{
      it('should get out of the penalty box', () => {
        game.roll(5)
        const messages = game.getMessages()
        expect(messages[messages.length - 4]).to.equal('Chet is getting out of the penalty box')
      })
      it('should move from its previous position', () => {
        game.roll(5)
        const messages = game.getMessages()
        expect(messages[messages.length - 3]).to.equal("Chet\'s new location is 6")
      })
    })
    describe('when the player rolls an even value', () =>{
      it('should stay in the penalty box', () => {
        game.roll(2)
        const messages = game.getMessages()
        expect(messages[messages.length-1]).to.equal('Chet is not getting out of the penalty box')
      })
    })
  })

  /*
  0 Chet was added',
  1 'They are player number 1',
  2 'Suzan was added',
  3 'They are player number 2',
  4 'Chet is the current player',
  5 'They have rolled a 2',      -3
  6 "Chet's new location is 2",  -2
  7 'The category is Sports',     -1
  8 'Sports Question 0'           0
  */



})

describe("according to position, should determine the question's category", () => {
  describe("Pop category",() =>{
    let game;
    beforeEach(() => {
      game = new Game();
      game.add('Chet')
      game.add('Suzan')
    })

    it("when the position is 0 ", ()=>{
      game.roll(0) // BUG
      const messages = game.getMessages()
      const questionMessage = messages[messages.length - 1]
      expect(questionMessage).to.match(/Pop Question/)
    })

    it("when the position is 4", ()=>{
      game.roll(4)
      const messages = game.getMessages()
      const questionMessage = messages[messages.length - 1]
      expect(questionMessage).to.match(/Pop Question/)
    })

    it("when the position is 8", ()=>{
      game.roll(8)
      const messages = game.getMessages()
      const questionMessage = messages[messages.length - 1]
      expect(questionMessage).to.match(/Pop Question/)
    })
  })

  describe("Science category",() =>{
    let game;
    beforeEach(() => {
      game = new Game();
      game.add('Chet')
      game.add('Suzan')
    })

    it("when the position is 1 ", ()=>{
      game.roll(1)
      const messages = game.getMessages()
      const questionMessage = messages[messages.length - 1]
      expect(questionMessage).to.match(/Science Question/)
    })

    it("when the position is 5", ()=>{
      game.roll(5)
      const messages = game.getMessages()
      const questionMessage = messages[messages.length - 1]
      expect(questionMessage).to.match(/Science Question/)
    })

    it("when the position is 9", ()=>{
      game.roll(9)
      const messages = game.getMessages()
      const questionMessage = messages[messages.length - 1]
      expect(questionMessage).to.match(/Science Question/)
    })
  })

  describe("Sport category",() =>{
    let game;
    beforeEach(() => {
      game = new Game();
      game.add('Chet')
      game.add('Suzan')
    })

    it("when the position is 2 ", ()=>{
      game.roll(2)
      const messages = game.getMessages()
      const questionMessage = messages[messages.length - 1]
      expect(questionMessage).to.match(/Sports Question/)
    })

    it("when the position is 6", ()=>{
      game.roll(6)
      const messages = game.getMessages()
      const questionMessage = messages[messages.length - 1]
      expect(questionMessage).to.match(/Sports Question/)
    })

    it("when the position is 10", ()=>{
      game.roll(10)
      const messages = game.getMessages()
      const questionMessage = messages[messages.length - 1]
      expect(questionMessage).to.match(/Sports Question/)
    })
  })
  describe("Rock category",() => {
    let game;
    beforeEach(() => {
      game = new Game();
      game.add('Chet')
      game.add('Suzan')
    })

    it("when the position is 3 ", () => {
      game.roll(3)
      const messages = game.getMessages()
      const questionMessage = messages[messages.length - 1]
      expect(questionMessage).to.match(/Rock Question/)
    })

    it("when the position is 7", () => {
      game.roll(7)
      const messages = game.getMessages()
      const questionMessage = messages[messages.length - 1]
      expect(questionMessage).to.match(/Rock Question/)
    })
  })
})
