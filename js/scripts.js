//----------------BACK END LOGIC------------------
var masterDeck;
resetDeck();
console.log(masterDeck);
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
  for (var i = 0; i < 5; i++) {
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
}

//Player/Dealer Object
function Player( type, hand, hold, bust, score, bet) {
  this.id = 0;
  this.bust = bust;
  this.hold = hold;
  this.playerType = type;
  this.playerHand = hand;
  this.playerScore = score;
  this.bet = bet;
  this.wallet = 100;
}

Player.prototype.playerHtml = function(){
  return `
  <div class="player" id="` + this.id + `">
    <h3>` + this.playerType + `</h3>
    <div class="score-box" id="p` + this.id + `-score">0</div>
    <div id="player` + this.id + `" class="game-table"></div>
    <div class="betting">
    <h5 class="first">PLACE YOUR BET</h5>
    <h5 class="again">BET AGAIN</h5>
    <button type="button" class="btn btn-warning bets" value="5">$5</button>
    <button type="button" class="btn btn-warning bets" value="10">$10</button>
    <button type="button" class="btn btn-warning bets" value="25">$25</button>
    </div>
    <div class="buttons">
      <button type="button" id="hit` + this.id + `" class="btn btn-danger" style="display:none;">Hit</button>
      <button type="button" id="hold` + this.id + `" class="btn btn-dark" style="display:none;">Hold</button>
    </div>

    <div class="wallet"><img src="img/1-chip.png"><span id="wallet` + this.id + `">$` + this.wallet + `</span></div>
    <div class="bet-ammt"><img src="img/chip2.png"><span class="player-bets"></span></div>

    <button id="remove` + this.id + `" class="quit btn btn-dark">Leave Game</button>

  </div>`
}

//reset players hand
Player.prototype.resetPlayer = function() {
  this.playerHand = [];
  this.playerScore = 0;
  this.bust = false;
  this.hold = false;
  resetDeck();
  this.bet = 0;
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

  $('#how-many').change(function(){
    var thisMany = $(this).val();
    var inputs = "";
    for (var i = 0; i < thisMany; i++) {
      inputs += "<input type='text' id='p-" + i + "-name' placeholder='Player " + (i + 1)+ "'>";
    }
    $('#names').html(inputs);
  })

//---------------Start game----------------

  $('#number-form').submit(function(event){
    event.preventDefault();
    $('.title-img').hide();
    $('.dealer').addClass('show');
    var howMany = $('#how-many').val();
    var playerNames = [];
  $("#names input").each(function(){
    playerNames.push($(this).val());
  })
    for (var i = 0; i < howMany; i++) {

      (function(i){
          setTimeout(function(){
            var newPlayer = new Player( playerNames[i], [], false, false, 0, 0);
            players.push(newPlayer);
            players[i].id = i + 1;
            var html = players[i].playerHtml();
            // $('.players').append(html);
            $('.players').append(html).delay(10).queue(function(next){
              $('.player').addClass('show');
              next();
            });
          }, 200 * i);
        }(i));
    }

    $('.player').delay(500).queue(function(next){
      $(this).addClass('show');
      next();
    });
    $(this).hide();
  });

//bet button ----------------
  $(".players").on("click", "button.bets",function() {
    var bet = parseInt($(this).val());
    var index = parseInt($(this).parents('.player').attr('id')) - 1;
    players[index].bet = bet;
    betsPlaced++;
    $(this).parent().hide();
    if (betsPlaced === players.length) {
      $(".deal-btn").addClass('show');
    }
    $(this).parent().siblings('.bet-ammt').children('.player-bets').text("$" + bet);
    console.log(betsPlaced);

  });//click end
  //deal button
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

    dealer.deal(2);
    getDealerImgs();
    $('#dealer-score').text(dealer.playerHand[0].value + " - ???");
    $(this).parent().removeClass('show');

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
        $(this).parent().hide();
        $(this).parents('.player').addClass('busted');
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

    $('.quit').off("click").on("click", function(){
      var removeThis = parseInt($(this).parent().attr('id')) - 1;
      players.splice(removeThis, 1);

      $(this).parent().remove();

      for (var i = 0; i < players.length; i++) {
        players[i].id = i;
      }
      var x = 1;
      $('.player').each(function(){
        $(this).attr("id", x);
        x++;
      });
    });
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
        player.wallet += player.bet;
        player.resetPlayer();
      } else if (dealer.playerScore === player.playerScore && player.bust === false) {
        $("#" + player.id + "").addClass('push');
      } else {
        $("#" + player.id + "").addClass('lost');
        player.wallet -= player.bet
      }
      $('#hit' + player.id + ', #hold' + player.id + '').parent().hide();
      player.resetPlayer();
      $('#wallet' + player.id).text("$" + player.wallet);
      $('player' + player.id + ' .player-bets').text("0");
    });
    $('.player-bets').text("0");
    $('.betting').show().addClass('new-game');
    $(".hidden").hide();
    holds = 0;
    busted = 0;
    betsPlaced = 0;
    dealer.resetPlayer();
  }
});
