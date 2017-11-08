var masterDeck = []
resetDeck();



function resetDeck() {
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

function Player(type, hand, hold, bust, score) {
  this.id = 0;
  this.bust = bust;
  this.hold = hold;
  this.playerType = type;
  this.playerHand = hand;
  this.playerScore = score;
}

Player.prototype.resetPlayer = function() {
  this.playerHand = [];
  this.playerScore = 0;
  this.bust = false;
}

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

Player.prototype.scoreMod = function(oldScore){
	//create a new variable to hold the modified total score value (starting at the old value)
  var newScore = oldScore;
  numAces = 0;
	//count the number of aces in the hand
  this.playerHand.forEach(function(card){
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

Player.prototype.deal = function(x) {
  for (var i = 0; i < x; i++) {
    var randomCard = Math.floor(Math.random() * masterDeck.length);
    var popped = masterDeck[randomCard];
    masterDeck.splice(randomCard, 1);
    this.playerHand.push(popped);
  }
  this.scoreCalc();
}

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

$(function() {

  var dealer = new Player("Dealer", [], false, false, 0);
  var newPlayer = new Player("Player", [], false, false, 0);

  $('#deal').click(function() {
    newPlayer.deal(2);
    console.log(newPlayer.playerHand);
    dealer.deal(2);
    newPlayer.scoreCalc();
    console.log(newPlayer.playerScore);

    getPlayerImgs();
    getDealerImgs();

  });
  $('#hit').click(function() {
    newPlayer.deal(1);
    console.log(newPlayer.playerHand);
    newPlayer.scoreCalc();
    console.log(newPlayer.playerScore);
    if (newPlayer.bust === true) {
      alert("BUST!");
      newPlayer.resetPlayer();
      dealer.resetPlayer();
      $('.game-table').text('');
    };
    getPlayerImgs();
  });

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

  function getPlayerImgs() {
    var images = ""
    newPlayer.playerHand.forEach(function(card) {
      images += "<img src='img/" + card.image + "'>";
    });
    $("#player1").html(images);
  }
  $("#hold").click(function() {
    var dealerScore = dealer.scoreCalc();
    var playerScore = newPlayer.scoreCalc();
    dealer.artificialIntel();
    winner();
  });

  function winner() {
    getDealerImgs();
    $(".hidden").hide();
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

// var players = [];
// var howMany = parseInt($('#how-many').val());
// for (var i = 0; i < howMany; i++) {
//   players.push(newPlayer)
//   players[i].id = i;
// }
