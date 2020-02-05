const Player = require('./player')

const Game = function () {

  const messages = []

  const console_wrapper = {

    log: function (message) {
      messages.push(message)
      //console.log("message => ", message)
    }
  }

  this.getMessages = function(){
    return messages
  }

  var players = new Array()

  var popQuestions = new Array()
  var scienceQuestions = new Array()
  var sportsQuestions = new Array()
  var rockQuestions = new Array()

  var currentPlayerPosition = 0
  var isGettingOutOfPenaltyBox = false

  var didPlayerWin = function () {
    return players[currentPlayerPosition].purse === 6
  }

  var questionCategory = function () {
    const currentPosition = players[currentPlayerPosition].position
    if (currentPosition == 0)
      return 'Pop'
    if (currentPosition == 4)
      return 'Pop'
    if (currentPosition == 8)
      return 'Pop'
    if (currentPosition == 1)
      return 'Science'
    if (currentPosition == 5)
      return 'Science'
    if (currentPosition == 9)
      return 'Science'
    if (currentPosition == 2)
      return 'Sports'
    if (currentPosition == 6)
      return 'Sports'
    if (currentPosition == 10)
      return 'Sports'
    return 'Rock'
  }

  function createQuestions() {
    for (var i = 0; i < 50; i++) {
      popQuestions.push('Pop Question ' + i)
      scienceQuestions.push('Science Question ' + i)
      sportsQuestions.push('Sports Question ' + i)
      rockQuestions.push('Rock Question ' +  i)
    }
  }

  createQuestions.call(this);

  this.canGameStart = function (howManyPlayers) {
    return howManyPlayers >= 2
  }

  this.addPlayer = function (playerName) {

    const player = new Player(playerName)
    players.push(player)

    console_wrapper.log(player.name + ' was added')
    console_wrapper.log('They are player number ' + players.length)

    return true
  }

  this.howManyPlayers = function () {
    return players.length
  }

  var askQuestion = function () {
    if (questionCategory() == 'Pop')
      console_wrapper.log(popQuestions.shift())
    if (questionCategory() == 'Science')
      console_wrapper.log(scienceQuestions.shift())
    if (questionCategory() == 'Sports')
      console_wrapper.log(sportsQuestions.shift())
    if (questionCategory() == 'Rock')
      console_wrapper.log(rockQuestions.shift())
  }

  function movePlayer(roll) {
    players[currentPlayerPosition].position += roll

    if (players[currentPlayerPosition].position > 11) {
       players[currentPlayerPosition].position -=  12
    }
  }

  this.roll = function (roll) {
    console_wrapper.log(players[currentPlayerPosition].name + ' is the current player')
    console_wrapper.log('They have rolled a ' + roll)

    if (players[currentPlayerPosition].isInPenaltyBox) {
      if (roll % 2 != 0) {
        isGettingOutOfPenaltyBox = true

        console_wrapper.log(players[currentPlayerPosition].name + ' is getting out of the penalty box')
        movePlayer(roll);


        const message = players[currentPlayerPosition].name + '\'s new location is ' + players[currentPlayerPosition].position

        console_wrapper.log(message)
        console_wrapper.log('The category is ' + questionCategory())
        askQuestion()
      } else {
        console_wrapper.log(players[currentPlayerPosition].name + ' is not getting out of the penalty box')
        isGettingOutOfPenaltyBox = false
      }
    } else {

      movePlayer(roll);

      console_wrapper.log(players[currentPlayerPosition].name + '\'s new location is ' + players[currentPlayerPosition].position)
      console_wrapper.log('The category is ' + questionCategory())
      askQuestion()
    }
  }

  this.wasCorrectlyAnswered = function () {
    if (players[currentPlayerPosition].isInPenaltyBox) {
      if (isGettingOutOfPenaltyBox) {
        console_wrapper.log('Answer was correct!!!!')
        players[currentPlayerPosition].purse += 1
        console_wrapper.log(players[currentPlayerPosition].name + ' now has ' +
            players[currentPlayerPosition].purse + ' Gold Coins.')

        var winner = didPlayerWin()
        currentPlayerPosition += 1
        if (currentPlayerPosition == players.length)
          currentPlayerPosition = 0

        return winner
      } else {
        currentPlayerPosition += 1
        if (currentPlayerPosition == players.length)
          currentPlayerPosition = 0
        return true
      }


    } else {

      console_wrapper.log('Answer was correct!!!!')

      players[currentPlayerPosition].purse += 1
      console_wrapper.log(players[currentPlayerPosition].name + ' now has ' +
          players[currentPlayerPosition].purse + ' Gold Coins.')

      var winner = didPlayerWin()

      currentPlayerPosition += 1
      if (currentPlayerPosition == players.length)
        currentPlayerPosition = 0

      return winner
    }
  }

  this.wrongAnswer = function () {
    console_wrapper.log('Question was incorrectly answered')
    console_wrapper.log(players[currentPlayerPosition].name + ' was sent to the penalty box')
    players[currentPlayerPosition].isInPenaltyBox = true

    currentPlayerPosition += 1
    if (currentPlayerPosition == players.length)
      currentPlayerPosition = 0
    return true
  }
}

module.exports = Game
