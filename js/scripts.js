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
function Player( type, hand, hold, bust, score, bet) {
  this.id = 0;
  this.bust = bust;
  this.hold = hold;
  this.playerType = type;
  this.playerHand = hand;
  this.playerScore = score;
  this.bank = 100;
}
function Bank(bank, bet){
  this.bank = 100;
  this.bet = 0;
}
Player.prototype.playerHtml = function(){
  return `<div class="player" id="` + this.id + `">
    <h3>Player ` + this.id + `</h3>
    <div class="score-box" id="p` + this.id + `-score"></div>
    <div id="player` + this.id + `" class="game-table"></div>
    <div class="buttons">
      <button type="button" id="hit` + this.id + `" class="btn btn-danger" style="display:none;">Hit</button>
      <button type="button" id="hold` + this.id + `" class="btn btn-dark" style="display:none;">Hold</button>
    </div>
    <div id="betting">
      <h5>PICK YOUR BET</h5>
      <button type="button" class="btn btn-warning bets" value="5">$5</button>
      <button type="button" class="btn btn-warning bets" value="10">$10</button>
      <button type="button" class="btn btn-warning bets" value="25">$25</button>
    </div>
    <h4> Your Bank: </h4>
    <h5> `+ this.bank +`</>
  </div>`
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
  var players = [];
  var holds = 0;
  var busted = 0;
  var betsPlaced = 0;
  var dealer = new Player("Dealer", [], false, false, 0);

  $('#number-form').submit(function(event){
    event.preventDefault();
    var howMany = $('#how-many').val();
    for (var i = 0; i < howMany; i++) {
      var newPlayer = new Player( "Player", [], false, false, 0, 0);
      players.push(newPlayer);
      players[i].id = i + 1;
      var html = players[i].playerHtml();
      console.log(players[i].bank);
      $('.players').append(html);
    }
    $('.deal-btn').show();
    $(this).hide();
    $(".bets").show();

  });

  //deal button
  // $(".players").on("click", "bnk-button",function() {
  // var bet = parseInt($(this).val());
  //   var index = parseInt($(this).parents('.player').attr('id')) - 1;
  //   players[index].bet = bet;
  //   players[index].wallet = players[index].wallet - players[index].bet;
  //   betsPlaced++;
  //   $(this).parent().hide();
  //   if (betsPlaced === players.length) {
  //     $("#deal").show();
  //   }
  // });
  $('#deal').off("click").on('click', function() {

    $('.player').removeClass("win");
    $('.player').removeClass("lost");
    $('.player').removeClass("busted");
    $('.player').removeClass("push");
    getDealerImgs();
    players.forEach(function(player) {
      $(".buttons").show();
      console.log(player);
      getPlayerImgs();
    });
    // players.forEach(function(player) {
    // });
    dealer.deal(2);
    getDealerImgs();
    $('#dealer-score').text(dealer.playerHand[0].value + " - ???");
    $(this).hide();

    players.forEach(function(player){
      player.deal(2);
      player.scoreCalc();
      $('#p' + player.id + '-score').text(player.playerScore);
      getPlayerImgs();

      $('.buttons button').show();
    });

    //hit button
    $('.btn-danger').off("click").on('click', function() {
      var thisID = parseInt($(this).parent().parent().attr("id")) - 1;

      players[thisID].deal(1);
      getPlayerImgs();
      players[thisID].scoreCalc();
      $(this).parent().siblings('.score-box').text(players[thisID].playerScore);
      if (players[thisID].bust === true) {
        busted++;
        if (holds + busted === players.length){
          compare();
        };
        console.log(busted);
        // players[thisID].resetPlayer();
        // alert("BUST!");
        $(this).parent().hide();
        $(this).parents('.player').addClass('busted');
        // $('#deal').show()
      };
    });
// hold button
    $(".btn-dark").off("click").on('click', function() {
      holds++;
      console.log(holds);
      if (holds + busted === players.length){
        compare();
      };
      $(this).parent().hide();
    });


    // $('button').off("click").on('click', function(){
    //   console.log(players);
    //   console.log(dealer);
    // });
  });

  function compare() {
      var dealerScore = dealer.scoreCalc();
      players.forEach(function(player) {
        var playerScore = player.scoreCalc();
      });
    dealer.artificialIntel();
    $('#dealer-score').text(dealer.playerScore);
    winner();
  }

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
    players.forEach(function(player){
      var images = ""
      player.playerHand.forEach(function(card) {
        images += "<img src='img/" + card.image + "'>";
      });
      $("#player" + player.id + "").html(images);
    });
  }

  //Decide winner
  function winner() {
    getDealerImgs();
    players.forEach(function(player){
      if ((dealer.bust === true || dealer.playerScore < player.playerScore) && player.bust === false) {
        $("#" + player.id + "").addClass('win');
        player.resetPlayer();
      } else if (dealer.playerScore === player.playerScore) {
        $("#" + player.id + "").addClass('push');
      } else {
        $("#" + player.id + "").addClass('lost');
      }
      $('#hit' + player.id + ', #hold' + player.id + '').parent().hide();
      player.resetPlayer();
    })
    $(".hidden").hide();

    $('#deal').show()
    holds = 0;
    busted = 0;
    dealer.resetPlayer();
  }

});


//-----------------HELPER FUNCTIONS---------------------
