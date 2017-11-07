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
  this.playerType = type;
  this.playerHand = hand;
  this.playerScore = scoreCalc();
}

Player.prototype.resetPlayer = function(){
  this.playerActive = false;
  this.playerHand = [];
  this.playerScore = 0;
}

Player.prototype.scoreCalc = function(){
  var score = 0;
  for (var i = 0; i < this.playerHand.length; i++) {
    score += this.playerHand[i].number;
  }
  if (score <= 21) {
    return score;
  } else {
    return "bust";
  }

}

$(function(){
  // var players = [];
  var Dealer = new Player("Dealer", true, [], 0);
  var newPlayer = new Player("Player", false, [(5, "hearts"), (10, "spades")], 0);
  // var howMany = parseInt($('#how-many').val());
  // for (var i = 0; i < howMany; i++) {
  //   players.push(newPlayer)
  //   players[i].id = i;
  // }
  console.log(newPlayer.playerScore);
});
