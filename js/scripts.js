var masterDeck = []
resetDeck();
console.log(masterDeck);
function resetDeck() {
  function Cards(value, face, suit) {
    this.value = value
    this.face = face;
    this.suit = suit;
    this.image = face + suit + ".png";
  }
  var suits = ["hearts","spades", "diamonds", "clubs"]
  suits.forEach(function(suit){
    for (var i = 2; i <= 11; i++) {
      if (i === 10) {
          masterDeck.push(new Cards (10 ,"10", suit));
          masterDeck.push(new Cards (10, "J", suit));
          masterDeck.push(new Cards (10 ,"Q", suit));
          masterDeck.push(new Cards (10, "K", suit));
      } else {
          masterDeck.push(new Cards (i, "" + i + "", suit));
        }
    }
  });
}
function Player(type, hand, score){
  this.id = 0;
  this.bust = false
  this.playerType = type;
  this.playerHand = hand;
  this.playerScore = score;
}

Player.prototype.resetPlayer = function(){
  this.playerHand = [];
  this.playerScore = 0;
  this.bust = false;
}

Player.prototype.scoreCalc = function(){
  var score = 0;
  for (var i = 0; i < this.playerHand.length; i++) {
    score += this.playerHand[i].value;
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

  var dealer = new Player("Dealer", [], 0);
  var newPlayer = new Player("Player", [], 0);

  $('#deal').click(function(){
    newPlayer.deal(2);
    dealer.deal(2);
    newPlayer.scoreCalc();
    getPlayerImgs();
    getDealerImgs();
    console.log(newPlayer.playerHand);

  });
  $('#hit').click(function(){
    newPlayer.deal(1);
    newPlayer.scoreCalc();
    console.log(newPlayer.playerHand);
    if (newPlayer.bust === true){
      alert("BUST!");
      newPlayer.resetPlayer()
      $('.game-table').text('');
    };
    getPlayerImgs();
  });
function getDealerImgs(){
  var images = "";
  for (var i = 0; i < dealer.playerHand.length; i++) {
    if (i === 0) {
      images += "<img src='img/" + dealer.playerHand[i].image + "'><img class='hidden' src='img/1card-back.png'>";
    } else {
      images += "<img src='img/" + dealer.playerHand[i].image + "'>";
    }
  }
  $(".dealer").html(images);

}
function getPlayerImgs(){
  var images = ""
  newPlayer.playerHand.forEach(function(card){
    images += "<img src='img/" + card.image + "'>";
  });
  $(".playerOne").html(images);
}

});

// var players = [];
// var howMany = parseInt($('#how-many').val());
// for (var i = 0; i < howMany; i++) {
//   players.push(newPlayer)
//   players[i].id = i;
// }
