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
function Player(type, hand, score){
  this.id = 0;
  this.playerType = type;
  this.playerHand = hand;
  this.playerScore = score;
}

Player.prototype.resetPlayer = function(){
  this.playerHand = [];
  this.playerScore = 0;
}

Player.prototype.deal = function(x) {
  var hand = [];
  for (var i = 0; i < x; i++) {
    var randomCard = Math.floor(Math.random() * masterDeck.length);
    var popped = masterDeck[randomCard];
    masterDeck.splice(randomCard,1);
    hand.push(popped);
  }
  return hand;
}

//Frontend logic
$(function(){
  // var players = [];
  var Dealer = new Player("Dealer", true, [], 0);
  var newPlayer = new Player("Player", false, [], 0);

  $("#deal").click(function() {
    console.log(newPlayer.deal(2));
    console.log(masterDeck);
  });
  // var howMany = parseInt($('#how-many').val());
  // for (var i = 0; i < howMany; i++) {
  //   players.push(newPlayer)
  //   players[i].id = i;
  // }
});
