'use strict'

const expect = require('chai').expect
const Game = require('../game.js')

describe('BUG ?!', () => {
  it('allow single player (isPlayable not used)', () => {
    var game = new Game();
    game.add('Chet');
    game.roll(12)

    // Then
    const messages = game.getMessages()
    expect(messages[1]).to.equal("They are player number 1")
  })
  it("roll 0 is allowed ", ()=>{
    var game = new Game();
    game.add('Chet')
    game.add('Suzan')

    game.roll(0)
    expect(true).to.equal(true)
  })
  it("should change player if the current player is still in the penalty box", ()=>{
      const game = new Game();
      game.add('Chet')
      game.add('Henry')
      //chet qui joue
      game.roll(3)
      game.wrongAnswer()
      //henry qui joue
      game.roll(1)
      game.wasCorrectlyAnswered()
      // chet qui essaye de sortir
      game.roll(2)
      //chet failed
      // henry joue
      game.roll(3)
      const messages = game.getMessages()
      expect(messages[messages.length-4]).to.equal('Chet is getting out of the penalty box')
  })
  describe('winning or losing; wasCorrectlyAnswered', ()=>{
    it("returns true when the player does not win ", ()=>{
      const game = new Game();
      game.add('Jackie')
      game.roll(5)
      const finalResult = game.wasCorrectlyAnswered()
      expect(finalResult).to.equal(true)
    })
    it("returns false when the player does win ", ()=>{
      const game = new Game();
      game.add('Jackie')
      game.roll(5)
      game.wasCorrectlyAnswered()
      game.roll(3)
      game.wasCorrectlyAnswered()
      game.roll(3)
      game.wasCorrectlyAnswered()
      game.roll(3)
      game.wasCorrectlyAnswered()
      game.roll(3)
      game.wasCorrectlyAnswered()
      game.roll(3)
      const finalResult = game.wasCorrectlyAnswered()
      expect(finalResult).to.equal(false)
    })
  })
  describe('a player can join the game anytime', ()=>{
    it("returns true when the player does not win ", ()=>{
      const game = new Game();
      game.add('Jackie')
      game.roll(5)
      game.add('Susie')
      const finalResult = game.wasCorrectlyAnswered()
     const messages = game.getMessages()

      const playerAddedMessage = messages[messages.length - 4]
      expect(playerAddedMessage).to.equal("Susie was added")

    })
  })
})

describe('playing', () => {
  describe('after dice have been rolled', () => {
    it(' should go to position N if N is rolled', () => {
      var game = new Game();
      game.add('Chet')
      game.add('Suzan')

      game.roll(2)
      const messages = game.getMessages()

      const positionMessage = messages[messages.length - 3]
      expect(positionMessage).to.equal("Chet's new location is 2")
    })
    it('should go to position 0 if 12 is rolled', () => {
      var game = new Game();
      game.add('Chet')
      game.add('Suzan')

      game.roll(12)
      const messages = game.getMessages()

      const positionMessage = messages[messages.length - 3]
      expect(positionMessage).to.equal("Chet's new location is 0")
    })
    it('the final position is the dice rolled result minus 12 if the result is more than 12', () => {
      var game = new Game();
      game.add('Chet')
      game.add('Suzan')

      game.roll(13)
      const messages = game.getMessages()

      const positionMessage = messages[messages.length - 3]
      expect(positionMessage).to.equal("Chet's new location is 1")
    })
    it(' should ask a question', () => {
      var game = new Game();
      game.add('Chet')
      game.add('Suzan')

      game.roll(2)
      const messages = game.getMessages()
      const questionMessage = messages[messages.length - 1]
      expect(questionMessage).to.match(/Question/)
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
      describe('should move from its previous position', () => {

        it('if previous + rolls < 12, go to previous + roll', () => {
          game.roll(5)
          const messages = game.getMessages()
          expect(messages[messages.length - 3]).to.equal("Chet\'s new location is 6")
        })

        it('if previous + rolls > 12, go to previous + roll modulo 12', () => {
          game.roll(15)
          const messages = game.getMessages()
          expect(messages[messages.length - 3]).to.equal("Chet\'s new location is 4")
        })

        describe('and answered correctly to the question', () => {
          let messages;
          beforeEach(() => {
            game.roll(15)
            game.wasCorrectlyAnswered()
            messages = game.getMessages()

          })
          it('returns the correct answer message', () => {
            expect(messages[messages.length - 2]).to.equal("Answer was correct!!!!")
          })
          it('and update its purse', () => {
            expect(messages[messages.length - 1]).to.equal("Chet now has 1 Gold Coins.")
          })
        })
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
  describe('joining game', ()=>{
    describe('after a player has ben added', () =>{
      it('should mention the player', () => {
        let game = new Game();
        game.add('Chet');
        const messages = game.getMessages()
        expect(messages[0]).to.equal('Chet was added')
      })
    })
  })
  describe('multi-player rules', ()=>{
    let game;
    describe('after a player has played', () =>{
      beforeEach(() => {
        game = new Game();
        const firstPlayer = 'Chet';
        const nextPlayer = 'Rosie';
        game.add(firstPlayer)
        game.add(nextPlayer)
        game.roll(1)
        game.wrongAnswer()
      })
      it('should set current player to next player', () => {
        game.roll(5)
        const messages = game.getMessages()
        expect(messages[messages.length - 5]).to.equal('Rosie is the current player')
      })
    })
  })
})

describe("questions", () => {
  describe("according to position, should determine the question's category", () => {
    describe("Pop category", () => {
      let game;
      beforeEach(() => {
        game = new Game();
        game.add('Chet')
        game.add('Suzan')
      })

      it("when the position is 0 ", () => {
        game.roll(0) // BUG
        const messages = game.getMessages()
        const questionMessage = messages[messages.length - 1]
        expect(questionMessage).to.match(/Pop Question/)
      })

      it("when the position is 4", () => {
        game.roll(4)
        const messages = game.getMessages()
        const questionMessage = messages[messages.length - 1]
        expect(questionMessage).to.match(/Pop Question/)
      })

      it("when the position is 8", () => {
        game.roll(8)
        const messages = game.getMessages()
        const questionMessage = messages[messages.length - 1]
        expect(questionMessage).to.match(/Pop Question/)
      })
    })
    describe("Science category", () => {
      let game;
      beforeEach(() => {
        game = new Game();
        game.add('Chet')
        game.add('Suzan')
      })

      it("when the position is 1 ", () => {
        game.roll(1)
        const messages = game.getMessages()
        const questionMessage = messages[messages.length - 1]
        expect(questionMessage).to.match(/Science Question/)
      })

      it("when the position is 5", () => {
        game.roll(5)
        const messages = game.getMessages()
        const questionMessage = messages[messages.length - 1]
        expect(questionMessage).to.match(/Science Question/)
      })

      it("when the position is 9", () => {
        game.roll(9)
        const messages = game.getMessages()
        const questionMessage = messages[messages.length - 1]
        expect(questionMessage).to.match(/Science Question/)
      })
    })
    describe("Sport category", () => {
      let game;
      beforeEach(() => {
        game = new Game();
        game.add('Chet')
        game.add('Suzan')
      })

      it("when the position is 2 ", () => {
        game.roll(2)
        const messages = game.getMessages()
        const questionMessage = messages[messages.length - 1]
        expect(questionMessage).to.match(/Sports Question/)
      })

      it("when the position is 6", () => {
        game.roll(6)
        const messages = game.getMessages()
        const questionMessage = messages[messages.length - 1]
        expect(questionMessage).to.match(/Sports Question/)
      })

      it("when the position is 10", () => {
        game.roll(10)
        const messages = game.getMessages()
        const questionMessage = messages[messages.length - 1]
        expect(questionMessage).to.match(/Sports Question/)
      })
    })
    describe("Rock category", () => {
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
})

describe("purse persistence", ()=> {
  describe('when the player already has 1 coin and won another one',()=>{
    it("should mention the player has 2 coins", ()=>{
      const game = new Game();
      game.add('Jackie')
      game.roll(5)
      game.wasCorrectlyAnswered()
      game.roll(3)
      game.wasCorrectlyAnswered()

      const messages = game.getMessages()
      expect(messages.pop()).to.equal("Jackie now has 2 Gold Coins.")
    })
  })
})