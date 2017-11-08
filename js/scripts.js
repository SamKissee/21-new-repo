//----------------BACK END LOGIC------------------
var masterDeck;
resetDeck();

//create and reset deck of cards
function resetDeck() {
  masterDeck = [];

  function Cards(value, face, suit) {
    this.value = value;
    this.face = face;
    this.suit = suit;
    this.image = face + suit + ".png";
  }
  var suits = ["hearts", "spades", "diamonds", "clubs"]
  suits.forEach(function(suit) {
    for (var i = 2; i <= 11; i++) {
      if (i === 10) {
        masterDeck.push(new Cards(10, "10", suit));
        masterDeck.push(new Cards(10, "J", suit));
        masterDeck.push(new Cards(10, "Q", suit));
        masterDeck.push(new Cards(10, "K", suit));
      } else {
        masterDeck.push(new Cards(i, "" + i + "", suit));
      }
    }
  });
}

//Player/Dealer Object
function Player(type, hand, hold, bust, score) {
  this.id = 0;
  this.bust = bust;
  this.hold = hold;
  this.playerType = type;
  this.playerHand = hand;
  this.playerScore = score;
}

//reset players hand
Player.prototype.resetPlayer = function() {
  this.playerHand = [];
  this.playerScore = 0;
  this.bust = false;
  this.hold = false
  resetDeck();
}

//calculate Score and detect aces
Player.prototype.scoreCalc = function() {
  var score = 0;
  var hasAce = false;
  for (var i = 0; i < this.playerHand.length; i++) {
    score += this.playerHand[i].value;
    //check to see if there is at least one ace in the hand
    if (this.playerHand[i].value === 11) {
      hasAce = true;
    }
  }
  //if there is an ace and the score is currently over 21, run the scoreMod function
  if (hasAce === true && score > 21) {
    score = this.scoreMod(score);
    this.playerScore = score;
  } else {
    // if not, keep the ace value at 11 and move on as usual
    this.playerScore = score;
  }
  if (score > 21) {
    this.bust = true;
  }
}

//calculate new score if aces value need to be changed
Player.prototype.scoreMod = function(oldScore) {
  //create a new variable to hold the modified total score value (starting at the old value)
  var newScore = oldScore;
  var numAces = 0;
  //count the number of aces in the hand
  this.playerHand.forEach(function(card) {
    if (card.value === 11) {
      numAces++;
    }
  });
  var i = 0;
  //minus 10 from new score for each ace in the hand until the score is no longer over 21 or there are no more aces to account for.
  //this keeps the highest possible score while not going over at least until all aces are a value of 1.
  while (newScore > 21 && i < numAces) {
    newScore -= 10;
    i++;
  }
  //return the new modified score, if it is still above 21, the rest of the scoreCalc function will report a bust.
  return newScore;
}

//deal cards to players and call score calculate
Player.prototype.deal = function(x) {
  for (var i = 0; i < x; i++) {
    var randomCard = Math.floor(Math.random() * masterDeck.length);
    var popped = masterDeck[randomCard];
    masterDeck.splice(randomCard, 1);
    this.playerHand.push(popped);
  }
  this.scoreCalc();
}

//AI which runs after user holds
Player.prototype.artificialIntel = function() {

  while (this.playerScore < 17) {
    this.deal(1);
    if (this.playerScore > 21) {
      this.bust = true;
    } else {
      this.hold = true;
    }
  }
}


//---------------FRONT END LOGIC----------------------

$(function() {

  var dealer = new Player("Dealer", [], false, false, 0);
  var newPlayer = new Player("Player", [], false, false, 0);
  var players = [];

  var howMany = parseInt($('#how-many').val());
  for (var i = 0; i < howMany; i++) {
    players.push(newPlayer)
    players[i].id = i;
  }

  //deal button
  $('#deal').click(function() {
    newPlayer.deal(2);
    dealer.deal(2);
    newPlayer.scoreCalc();
    $('#p1-score').text(newPlayer.playerScore);
    $('#dealer-score').text(dealer.playerHand[0].value + " - ???");
    getPlayerImgs();
    getDealerImgs();

    $('#hit, #hold').show();
    $(this).hide()
  });

  //hit button
  $('#hit').click(function() {
    newPlayer.deal(1);
    getPlayerImgs();
    newPlayer.scoreCalc();
    $('#p1-score').text(newPlayer.playerScore);
    if (newPlayer.bust === true) {
      newPlayer.resetPlayer();
      dealer.resetPlayer();
      alert("BUST!");
      $('#hit, #hold').hide();
      $('#deal').show()
    };
  });

  //Hold button
  $("#hold").click(function() {
    var dealerScore = dealer.scoreCalc();
    var playerScore = newPlayer.scoreCalc();
    dealer.artificialIntel();
    $('#dealer-score').text(dealer.playerScore);
    winner();
  });

  //Dealer card images with hidden card
  function getDealerImgs() {
    var images = "";
    for (var i = 0; i < dealer.playerHand.length; i++) {
      if (i === 0) {
        images += "<img src='img/" + dealer.playerHand[i].image + "'><img class='hidden' src='img/1card-back.png'>";
      } else {
        images += "<img src='img/" + dealer.playerHand[i].image + "'>";
      }
    }
    $("#dealer").html(images);

  }

  //Player card images
  function getPlayerImgs() {
    var images = ""
    newPlayer.playerHand.forEach(function(card) {
      images += "<img src='img/" + card.image + "'>";
    });
    $("#player1").html(images);
  }

  //Decide winner
  function winner() {
    getDealerImgs();
    $(".hidden").hide();
    $('#hit, #hold').hide();
    $('#deal').show()
    if (dealer.bust === true || dealer.playerScore < newPlayer.playerScore) {
      alert("Player wins");
      newPlayer.resetPlayer();
    } else if (dealer.playerScore === newPlayer.playerScore) {
      alert("Push");
    } else {
      alert("Dealer wins");
    }
    newPlayer.resetPlayer();
    dealer.resetPlayer();
  }
});


//-----------------HELPER FUNCTIONS---------------------
