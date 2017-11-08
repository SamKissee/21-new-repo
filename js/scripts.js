var masterDeck = []
resetDeck();
//Reset Deck
function resetDeck() {
  function Cards(value, face, suit) {
    this.value = value;
    this.face = face;
    this.suit = suit;
    this.image = face + suit + ".png";
  }
  // Create Deck
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
//Player Object
function Player(type, hand, hold, bust, score) {
  this.id = 0;
  this.bust = bust;
  this.hold = hold;
  this.playerType = type;
  this.playerHand = hand;
  this.playerScore = score;
}
// Reset Player
Player.prototype.resetPlayer = function() {
  this.playerHand = [];
  this.playerScore = 0;
  this.bust = false;
}
//Score Calculation
Player.prototype.scoreCalc = function() {
  var score = 0;
  for (var i = 0; i < this.playerHand.length; i++) {
    score += this.playerHand[i].value;
    if (this.playerHand[i].face === "11" && this.playerScore >= 11) {
      this.playerHand[i].value = 1;
    } else {
      this.playerHand[i].value = 11;
    }
  }
  // if (x === 2 && i === 1){
  //   console.log(this.playerHand[1].face);
  //   console.log(this.playerHand[1]);
  this.playerScore = score;
  if (score > 21) {
    this.bust = true;
  }
  return score;
}
// Deal Function
Player.prototype.deal = function(x) {
  for (var i = 0; i < x; i++) {
    var randomCard = Math.floor(Math.random() * masterDeck.length);
    // var randomCard = 12;
    var popped = masterDeck[12];
    // masterDeck.splice(randomCard, 1);
    this.playerHand.push(popped);
  }
  this.scoreCalc();
}
// Dealer AI Function
Player.prototype.artificialIntel = function() {
  while (this.playerScore <= 17) {
    this.deal(1);
    if (this.playerScore > 21) {
      this.bust = true;
    } else {
      this.hold = true;
    }
  }
}
//Front End
$(function() {
  var dealer = new Player("Dealer", [], false, false, 0);
  var newPlayer = new Player("Player", [], false, false, 0);
  // Deal Button Function
  $('#deal').click(function() {
    newPlayer.deal(2);
    dealer.deal(2);
    newPlayer.scoreCalc();
    getPlayerImgs();
    getDealerImgs();
    $('#hit, #hold').show();
    $(this).hide();
    $('#score').text(newPlayer.playerScore);
  });
  // Hit Button Functions
  $('#hit').click(function() {

    newPlayer.deal(1);

    getPlayerImgs();
    if (newPlayer.playerScore > 21) {
      newPlayer.bust = true;
      alert("BUST! Dealer Wins...");
      newPlayer.resetPlayer();
      dealer.resetPlayer();
      // $('.game-table').text('');
      $('#hit, #hold').hide();
      $('#deal').show();
    };
    newPlayer.scoreCalc();
    $('#score').text(newPlayer.playerScore);
  });
  // Dealer Image Functions
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
  };
  // Player Image Function
  function getPlayerImgs() {
    var images = ""
    newPlayer.playerHand.forEach(function(card) {
      images += "<img src='img/" + card.image + "'>";
    });
    $("#player1").html(images);
  };
  // Hold Button
  $("#hold").click(function() {
    var dealerScore = dealer.scoreCalc();
    var playerScore = newPlayer.scoreCalc();
    dealer.artificialIntel();
    winner();
  });
  // Winner Functions
  function winner() {
    getDealerImgs();
    $(".hidden").hide();
    $('#hit, #hold').hide();
    $('#deal').show();
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
