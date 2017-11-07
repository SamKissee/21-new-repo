var masterDeck = []
resetDeck();
console.log(masterDeck);
function resetDeck() {
  function Cards(number, suit) {
    this.number = number;
    this.suit = suit;
    this.image = number + suit + ".png";
  }
  var suits = ["hearts","spades", "diamonds", "clubs"]
  suits.forEach(function(suit){
    for (var i = 2; i <= 11; i++) {
      if (i === 10) {
        for (var x = 0; x < 4; x++) {
          masterDeck.push(new Cards (10, suit));
        }
      } else {
          masterDeck.push(new Cards (i, suit));
        }
    }
  });
}
function Player(type, hand){
  this.id = 0;
  this.bust = false
  this.playerType = type;
  this.playerHand = hand;
  this.playerScore = 0;
}

Player.prototype.resetPlayer = function(){
  this.playerActive = false;
  this.playerHand = [];
  this.playerScore = 0;
  this.bust = false
}

Player.prototype.scoreCalc = function(){
  var score = 0;
  for (var i = 0; i < this.playerHand.length; i++) {
    score += this.playerHand[i].number;
  }
  if (score > 21) {
    this.bust = true;
  }
  this.playerScore = score;
  // return score;
}

Player.prototype.deal = function(x) {
  for (var i = 0; i < x; i++) {
    var randomCard = Math.floor(Math.random() * masterDeck.length);
    var popped = masterDeck[randomCard];
    masterDeck.splice(randomCard, 1);
    this.playerHand.push(popped);
  }

}

$(function(){
  // var players = [];
  var Dealer = new Player("Dealer", []);
  var newPlayer = new Player("Player", []);
  // var howMany = parseInt($('#how-many').val());
  // for (var i = 0; i < howMany; i++) {
  //   players.push(newPlayer)
  //   players[i].id = i;
  // }
  $('#deal').click(function(){
    newPlayer.deal(2);
    newPlayer.scoreCalc();
    console.log(newPlayer.playerHand);
    console.log(newPlayer.playerScore);
    if (newPlayer.bust === true){
      console.log("BUST!");
    };
  });
  $('#hit').click(function(){
    newPlayer.deal(1);
    newPlayer.scoreCalc();
    console.log(newPlayer.playerHand);
    console.log(newPlayer.playerScore);
    if (newPlayer.bust === true){
      console.log("BUST!");
    };
  });


});
