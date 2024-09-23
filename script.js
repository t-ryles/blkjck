// Dealers variables
let dealerSum = 0;
let dealerAceCount = 0;
let dealerHand = [];

// Player(s) variables
let players = [];
let playersAceCounts = [];

// Global variables
let hidden;
let deck;
let stayCount;


window.onload = function initializeGame() {
  
  let numOfPlayers = parseInt(prompt("Please enter the number of players  between 1 and 4: "));

  while (numOfPlayers < 0 ||  numOfPlayers > 4 || isNaN(numOfPlayers)) {
    numOfPlayers = parseInt(prompt('Invalid input. Enter a number between 1 and 4: '))
  }

  for (let i = 0; i < numOfPlayers; i++) {
    players.push([]);
    playersAceCounts.push(0);
  }
  
  stayCount = players.length;

  let numOfDecks = parseInt(prompt("Please enter the number of decks: "));

  buildDeck(numOfDecks);
  shuffleDeck();
  buildPlayers(numOfPlayers);
  dealersHand();
  dealCards();
  startGame();

}

function startGame() {
  document.getElementById('newGame').addEventListener("click", newGame);
}

export function buildDeck(numofDeck) {
  let values = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"];
  let suites = ["C", "D", "H", "S"];
  deck = [];

  for (let i = 0 ; i < numofDeck; i++) {
    let subDeck = []
    
    for (let s = 0; s < suites.length; s++) {
      for (let v = 0; v < values.length; v++ ) {
        subDeck.push(values[v] + "-" + suites[s]);
      }
    }
    deck = deck.concat(subDeck);
  } 
  return deck;
}

export function shuffleDeck() {
  for (let i = 0; i < deck.length; i++) {
    let j = Math.floor(Math.random() * deck.length);

    let temp = deck[i];
    deck[i] = deck[j];
    deck[j] = temp;
  }
}

// Funtion to check if card is an ace
export function checkAce(card) {
  if (card[0] == "A"){
    return 1;
  }
  return 0;
}

// Funtion to reduce player some when sum is less than 21 and they have an ace in hand
export function reduceAce(playerSum, playerAceCount) {
  while ( playerSum > 21 && playerAceCount > 0 ) {
    playerSum -= 10;
    playerAceCount -= 1;
  }
  return playerSum;
}

// Geting the card value
export function getValue(card){
  let total = 0;
  let data = card.split("-");
  let value = data[0];

if (isNaN(value)) { // Checking for A, J, Q, K
  if (value === "A") {
    total += 11;
  } else {
    total += 10;
  }
} else {
  total += parseInt(value); // Return int of value
}
return total;
}

export function clearCardImgs() {

  let dealersImg = document.getElementById('dealer-cards');
  while (dealersImg.firstChild) {
    dealersImg.removeChild(dealersImg.firstChild);
  }

for (let i = 0; i < players.length; i++) {
  const playerImg = document.getElementById(`player-${i+1}-cards`);
  while (playerImg.firstChild) {
    playerImg.removeChild(playerImg.firstChild);
  }
}
}

function dealersHand() {

  let hiddenCardImg = document.createElement("img");
  hiddenCardImg.src = `./cards/BACK.png`;
  hiddenCardImg.setAttribute("id", `hidden`);
  document.getElementById("dealer-cards").append(hiddenCardImg);

  hidden = deck.shift();
  dealerSum += getValue(hidden);
  dealerAceCount += checkAce(hidden);

  while (dealerSum < 17) {
    // Dealer cards
    let cardImg = document.createElement("img");
    let card = deck.shift();
    
    dealerHand.push(card);

    cardImg.src = `./cards/${card}.png`
    // Adding to dealer sum
    dealerSum += getValue(card);
    // Adding to ace count
    dealerAceCount += checkAce(card);
    // Adding card to display
    cardImg.setAttribute("class", `dealersCards`);
    document.getElementById("dealer-cards").append(cardImg);
  }
  //soft17();
}

function soft17(){
  let randomNum = Math.floor(Math.random()* 10) + 1;

  if (dealerSum === 17 && dealerAceCount > 1 && randomNum % 3 == 0) {
    dealerAceCount -= 1;
    dealerSum -= 10;

    let cardImg = document.createElement("img");
    let card = deck.shift();
    dealerHand.push(card);
    cardImg.src = `./cards/${card}.png`
    dealerSum += getValue(card);
    dealerAceCount += checkAce(card);
    document.getElementById("dealer-cards").append(cardImg);
  }
}

// Hit funtion when user clicks button
function hit(index) {

  let playerSumSpan = document.getElementById(`player-${index+1}-sum`);

    let cardImg = document.createElement("img");
    let card = deck.shift();
    cardImg.src = `./cards/${card}.png`;
    
    players[index].push(card);

    playerSumSpan = document.getElementById(`player-${index+1}-sum`);
    let currentValue = parseInt(playerSumSpan.textContent);
    
    playerSumSpan.textContent = currentValue + getValue(card);

    // Checking and updating players ace count
    playersAceCounts[index] += checkAce(card);

    let playerSum = playerSumSpan.innerHTML

    cardImg.setAttribute("class", `card-img`);
    document.getElementById(`player-${index + 1}-cards`).append(cardImg);

    playerSum = reduceAce(playerSum, playersAceCounts[index]);
    playerSumSpan.textContent = playerSum;

  checkPlayerSum();
}

// Stay funtion when user clicks button
function stay(){
  dealerSum = reduceAce(dealerSum, dealerAceCount);  

  document.getElementById('hidden').src = `./cards/${hidden}.png`;

  let playersSpan = document.querySelectorAll('.player-sum');

  playersSpan.forEach((span, i) => {

    let playerSum = parseInt(span.textContent);
    playerSum = reduceAce(playerSum, playersAceCounts[i]);
    span.textContent = playerSum;

    let playerMessageTag = document.querySelector(`#player-${i+1}-message`);

    if ( playerSum > 21) {
      playerMessageTag.textContent = "You lose."
    }
    else if ( dealerSum > 21) {
      playerMessageTag.textContent = "You win!"
    }
    else if ( dealerSum == playerSum) {
      playerMessageTag.textContent = "House wins!"
    }
    else if ( playerSum > dealerSum ) {
      playerMessageTag.textContent = "You win!"
    } 
    else if ( playerSum < dealerSum ) {
      playerMessageTag.textContent = "You lose."
    }

  })

  document.getElementById('dealer-sum').innerHTML = dealerSum;
}

// Deals cards to players from top of deck
function dealCards() {

  for ( let i = 0; i < players.length; i++) {
    // Get player span ID
    let playerSumSpan = document.getElementById(`player-${i+1}-sum`);

    (function dealToPlayer(i, delay) {
      for ( let cards = 0; cards < 2; cards++) {
        setTimeout(() => {
          let card = deck.shift();
          players[i].push(card);

          let playerTotal = 0;
          for (let j = 0; j < players[i].length; j++) {
          playerTotal += getValue(players[i][j])
      }
      // Setting player card sum
      playerSumSpan.innerHTML = playerTotal;

      let cardImg = document.createElement("img");
      // Adding card CSS class
      cardImg.setAttribute("class", `card-img`);
      cardImg.src = `./cards/${card}.png`

      // Checking and updating players ace count
      playersAceCounts[i] += checkAce(card);

      // Adding card to display
      document.getElementById(`player-${i+1}-cards`).append(cardImg);
    }, cards * delay);
    }
  })(i, 1000);
    }

    checkDeck();
}

// Building HTML for X number of player
function buildPlayers(numOfPlayers) {
  for (let i = 0; i < numOfPlayers; i++) {
    // Getting Div for players 
    let playersBox = document.getElementById('playersBox');
    // Building a player's div
    let playerDiv = document.createElement("div");
    // Setting id to player DIV
    playerDiv.setAttribute("id", `player-${i+1}-div`);
    // Building H2 for player DIV
    let playerH2 = document.createElement("h2");
    // Setting H2 ID
    playerH2.setAttribute("id", `player-${i+1}-h2`);
    // Appending h2 to the playerDiv
    playerDiv.appendChild(playerH2);
    // Build span for H2
    let playerSpan = document.createElement("span");
    // Setting ID for player span
    playerSpan.setAttribute('id', `player-${i+1}-sum`);

    playerSpan.setAttribute('class', `player-sum`);


    // Append span to H2
    playerH2.appendChild(playerSpan);
    // Building Div for cards
    let playerCardDiv = document.createElement("div");
    // Setting id to player card DIV
    playerCardDiv.setAttribute("id", `player-${i+1}-cards`);
    // Append playerCardDiv to playerDiv
    playerDiv.appendChild(playerCardDiv);

    let playerHitBTN = document.createElement("button");
    playerHitBTN.setAttribute("id", `player-${i+1}-hit`);
    playerHitBTN.setAttribute("class", `button`);
    playerHitBTN.setAttribute("class", `hit`);
    playerHitBTN.textContent = 'Hit';

    let playerStayBTN = document.createElement("button");
    playerStayBTN.setAttribute("id", `player-${i+1}-stay`);
    playerStayBTN.setAttribute("class", `button`);
    playerStayBTN.setAttribute("class", `stay`);
    playerStayBTN.textContent = 'Stay';

    playerDiv.appendChild(playerHitBTN);
    playerDiv.appendChild(playerStayBTN);
    playersBox.appendChild(playerDiv);

    let playerMessage = document.createElement('p');
    playerMessage.setAttribute('id', `player-${i+1}-message`);
    playerMessage.setAttribute('class', `playerMessage`);
    playerMessage.textContent = "";
    playerDiv.appendChild(playerMessage);

    playerHitBTN.addEventListener('click', function() {
      let index = parseInt(`${i}`);
      hit(index);
    });

    playerStayBTN.addEventListener('click', function(){
      stayCount--;
      console.log(`Stay count = ${stayCount}`);
      
      if (stayCount <= 0) {
        stay();
      }
    });
  }
}

// Dealing a new hand without restarting the game
function newHand() {  
  // Clearing dealer hand
  while(dealerHand.length > 0) {
    dealerHand.pop();
  }

  // Clearing player(s) hand
  for ( let i = 0; i < players.length; i++) {
    while (players[i].length > 0) {
      players[i].pop();
    }
    // Reseting ace count
    playersAceCounts[i] = 0;
  }

  // Clearing player(s) messgae
  for ( let i = 0; i < players.length; i++) {
    let message = document.getElementById(`player-${i+1}-message`);
    message.textContent = "";
  } 
}

function checkDeck() {
  if (deck.length < 65) {
    buildDeck(numOfDecks);
    shuffleDeck();
  }
}

function checkPlayerSum(){
  
  for (let i = 0; i < players.length; i++) {
    let playerHitBTN = document.getElementById(`player-${i+1}-hit`)
    let playerSumSpan = document.getElementById(`player-${i+1}-sum`);
    let playerSum = playerSumSpan.innerHTML;

    if (reduceAce(playerSum, playersAceCounts[i]) > 21 ) {
      playerHitBTN.classList.add('disabled');
      stayCount--;
    }
  }
}

function removeDisableClass(){
  for ( let i = 0; i < players.length; i++ ) {
    let playerHitBTN = document.getElementById(`player-${i+1}-hit`)
    playerHitBTN.classList.remove('disabled');
  }
}

function newGame() {
  document.getElementById('dealer-sum').innerHTML = "";
  dealerSum = 0;
  dealerAceCount = 0;
  stayCount = players.length;
  
  clearCardImgs();
  newHand();
  dealersHand();
  dealCards();
  removeDisableClass();
  checkDeck();
}