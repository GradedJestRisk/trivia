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
  var places = new Array(6)
  var inPenaltyBox = new Array(6)

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
    if (places[currentPlayerPosition] == 0)
      return 'Pop'
    if (places[currentPlayerPosition] == 4)
      return 'Pop'
    if (places[currentPlayerPosition] == 8)
      return 'Pop'
    if (places[currentPlayerPosition] == 1)
      return 'Science'
    if (places[currentPlayerPosition] == 5)
      return 'Science'
    if (places[currentPlayerPosition] == 9)
      return 'Science'
    if (places[currentPlayerPosition] == 2)
      return 'Sports'
    if (places[currentPlayerPosition] == 6)
      return 'Sports'
    if (places[currentPlayerPosition] == 10)
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
    places[this.howManyPlayers() - 1] = 0
    inPenaltyBox[this.howManyPlayers() - 1] = false

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

  this.roll = function (roll) {
    console_wrapper.log(players[currentPlayerPosition].name + ' is the current player')
    console_wrapper.log('They have rolled a ' + roll)

    if (inPenaltyBox[currentPlayerPosition]) {
      if (roll % 2 != 0) {
        isGettingOutOfPenaltyBox = true

        console_wrapper.log(players[currentPlayerPosition].name + ' is getting out of the penalty box')
        places[currentPlayerPosition] = places[currentPlayerPosition] + roll
        if (places[currentPlayerPosition] > 11) {
          places[currentPlayerPosition] = places[currentPlayerPosition] - 12
        }

        console_wrapper.log(players[currentPlayerPosition].name + '\'s new location is ' + places[currentPlayerPosition])
        console_wrapper.log('The category is ' + questionCategory())
        askQuestion()
      } else {
        console_wrapper.log(players[currentPlayerPosition].name + ' is not getting out of the penalty box')
        isGettingOutOfPenaltyBox = false
      }
    } else {

      places[currentPlayerPosition] = places[currentPlayerPosition] + roll
      if (places[currentPlayerPosition] > 11) {
        places[currentPlayerPosition] = places[currentPlayerPosition] - 12
      }

      console_wrapper.log(players[currentPlayerPosition].name + '\'s new location is ' + places[currentPlayerPosition])
      console_wrapper.log('The category is ' + questionCategory())
      askQuestion()
    }
  }

  this.wasCorrectlyAnswered = function () {
    if (inPenaltyBox[currentPlayerPosition]) {
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
    inPenaltyBox[currentPlayerPosition] = true

    currentPlayerPosition += 1
    if (currentPlayerPosition == players.length)
      currentPlayerPosition = 0
    return true
  }
}

module.exports = Game
