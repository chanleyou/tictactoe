var playerOne = {name: "Player One", symbol: "X", score: 0};
var playerTwo = {name: "Player Two", symbol: "O", score: 0};

var gameBoard = document.querySelector("#game-board");
var turnStatement = document.querySelector("#whose-turn");
var playerOneScore = document.querySelector("#player-one");
var playerTwoScore = document.querySelector("#player-two");
var startButton = document.querySelector("#start-button");
var newGameButton = document.querySelector("#new-game-button");
var setupStuff = document.querySelector("#setup-stuff");
var aiCheckbox = document.querySelector("#ai-checkbox");
var c4Checkbox = document.querySelector("#c4-checkbox");

var playerOneStarts;
var gamePaused;
var turnOrder;
var squaresClicked;
var totalSquares;
var matchesToWin;

var boardArray = [];

// [y][x]
var createBoard = function (columns, rows) {
  for (var y = 0; y < rows; y++) {
    var newDiv = document.createElement("div");
    gameBoard.appendChild(newDiv);
    newArray = [];
    for (var x = 0; x < columns; x++) {
      var newButton = document.createElement("button");
      newDiv.appendChild(newButton);
      newArray.push(newButton);
      newButton.addEventListener("click", gameLogic);
      newButton.classList.add("game-square");

      if (y === 0) {
        newButton.classList.add("top");
      } else if (y === rows - 1) {
        newButton.classList.add("bottom");
      }
      if (x === 0) {
        newButton.classList.add("left");
      } else if (x === columns - 1) {
        newButton.classList.add("right");
      }

    }
    boardArray.push(newArray);
  }
  totalSquares = boardArray.length * boardArray[0].length;
}

var gameLogic = function (event) {
  if (this.textContent || gamePaused) {
    return;
  }
  if (c4Checkbox.checked) {
    connectFourGravity(event.target);
  } else {
    this.textContent = turnOrder;
  }

  if (checkWin(turnOrder)) {
    return;
  }

  squaresClicked++;
  if (squaresClicked >= totalSquares) {
    draw ();
    return;
  }

  if (turnOrder === playerOne.symbol) {
    turnOrder = playerTwo.symbol;
    if (aiCheckbox.checked) {
      aiScript();
      return;
    }
  } else if (turnOrder === playerTwo.symbol) {
    turnOrder = playerOne.symbol;
  }
  updateTurn();
}

var win = function (turnOrder) {
  if (turnOrder === playerOne.symbol) {
    turnStatement.textContent = `${playerOne.name} won!`;
    playerOne.score++;
  } else if (turnOrder === playerTwo.symbol) {
    turnStatement.textContent = `${playerTwo.name} won!`;
    playerTwo.score++;
  }
  gamePaused = true;
  updateScores();
  newGameButton.style.display = "inline-block";
}

var draw = function () {
  gamePaused = true;
  turnStatement.textContent = `It's a draw.`;
  newGameButton.style.display = "inline-block";
}

var updateTurn = function () {
  turnStatement.textContent = `It's ${turnOrder}'s turn.`;
}

var updateScores = function () {
  playerOneScore.innerHTML = `${playerOne.name}<br>Symbol: ${playerOne.symbol}<br>Score: ${playerOne.score}`;
  playerTwoScore.innerHTML = `${playerTwo.name}<br>Symbol: ${playerTwo.symbol}<br>Score: ${playerTwo.score}`;
}

var checkWin = function (turnOrder) {
  rows = boardArray.length;
  columns = boardArray[0].length;
  var offset = matchesToWin - 1;

  // check horizontal
  for (var y = 0; y < rows; y++) {
    for (var x = 0; x < columns - offset; x++) {
      if (boardArray[y][x].textContent === turnOrder) {
        var winCounter = 1;
        for (var z = 1; z <= offset; z++) {
          if (boardArray[y][x + z].textContent === turnOrder) {
            winCounter++;
            if (winCounter >= matchesToWin) {
              win(turnOrder);
              return true;
            }
          } else {
            break;
          }
        }
      }
    }
  }

  //check vertical
  for (var y = 0; y < rows - offset; y++) {
    for (var x = 0; x < columns; x++) {
      if (boardArray[y][x].textContent === turnOrder) {
        var winCounter = 1;
        for (var z = 1; z <= offset; z++) {
          if (boardArray[y + z][x].textContent === turnOrder) {
            winCounter++;
            if (winCounter >= matchesToWin) {
              win(turnOrder);
              return true;
            }
          } else {
            break;
          }
        }
      }
    }
  }

  //check diagonal down
  for (var y = 0; y < rows - offset; y++) {
    for (var x = 0; x < columns - offset; x++) {
      if (boardArray[y][x].textContent === turnOrder) {
        var winCounter = 1;
        for (var z = 1; z <= offset; z++) {
          if (boardArray[y + z][x + z].textContent === turnOrder) {
            winCounter++;
            if (winCounter >= matchesToWin) {
              win(turnOrder);
              return true;
            }
          } else {
            break;
          }
        }
      }
    }
  }

  //check diagonal up
  for (y = offset; y < rows; y++) {
    for (x = 0; x < columns - offset; x++) {
      if (boardArray[y][x].textContent === turnOrder) {
        var winCounter = 1;
        for (z = 1; z <= offset; z++) {
          if (boardArray[y - z][x + z].textContent === turnOrder) {
            winCounter++;
            if (winCounter >= matchesToWin) {
              win(turnOrder);
              return true;
            }
          } else {
            break;
          }
        }
      }
    }
  }
  return false;
}

var newGame = function () {
  for (var y = 0; y < boardArray.length; y++) {
    for (var x = 0; x < boardArray[0].length; x++) {
      boardArray[y][x].textContent = "";
    }
  }

  playerOneStarts = !playerOneStarts;
  if (playerOneStarts) {
    turnOrder = playerOne.symbol;
  } else {
    turnOrder = playerTwo.symbol;
  }

  updateTurn();

  squaresClicked = 0;
  gamePaused = false;
  newGameButton.style.display = "none";

  if (aiCheckbox.checked && turnOrder === playerTwo.symbol) {
    aiScript();
  }
}

window.onload  = function () {
  startButton.addEventListener("click", setupGame);
  newGameButton.addEventListener("click", newGame);
}

var setupGame = function () {

  if (c4Checkbox.checked) {
    createBoard(7,6);
    matchesToWin = 4;
  } else {
    var rows = document.querySelector("#rows").value;
    var columns = document.querySelector("#columns").value;
    var matches = document.querySelector("#matches-needed").value;

    createBoard(columns, rows);
    matchesToWin = matches;
  }

  playerOne.name = document.querySelector("#p1-name").value;
  playerOne.symbol = document.querySelector("#p1-symbol").value;
  if (aiCheckbox.checked) {
    playerTwo.name = "The AI";
    playerTwo.symbol = "+_+";
  } else {
    playerTwo.name = document.querySelector("#p2-name").value;
    playerTwo.symbol = document.querySelector("#p2-symbol").value;
  }

  turnOrder = playerOne.symbol;
  squaresClicked = 0;
  playerOneStarts = true;
  gamePaused = false;
  setupStuff.style.display = "none";

  updateTurn();
  updateScores();
}

var aiScript = function () {

  if (!defensiveAI()) {
    var gameSquares = document.querySelectorAll(".game-square");
    var emptySquares = [];

    for (var i = 0; i < gameSquares.length; i++) {
      if (!gameSquares[i].textContent) {
        emptySquares.push(gameSquares[i]);
      }
    }

    var random = Math.floor(Math.random()*emptySquares.length);
    if (c4Checkbox.checked) {
      connectFourGravity(emptySquares[random]);
    } else {
      emptySquares[random].textContent = turnOrder;
    }
  }

  if (checkWin(turnOrder)) {
    return;
  }

  squaresClicked++;
  if (squaresClicked >= totalSquares) {
    draw ();
    return;
  }

  turnOrder = playerOne.symbol;
  updateTurn();
}

var connectFourGravity = function (input) {
  var thisColumn;
  for (var y = 0; y < boardArray.length; y++) {
    for (var x = 0; x < boardArray[0].length; x++) {
      if (input === boardArray[y][x]) {
        thisColumn = x;
        break;
      }
    }
  }

  for (var z = boardArray.length - 1; z >= 0; z--) {
    if (!boardArray[z][thisColumn].textContent) {
      boardArray[z][thisColumn].textContent = turnOrder;
      break;
    }
  }
}

// incomplete
var defensiveAI = function () {
  rows = boardArray.length;
  columns = boardArray[0].length;
  var offset = matchesToWin - 1;

  // check horizontal
  for (var y = 0; y < rows; y++) {
    for (var x = 0; x < columns - offset; x++) {
      if (boardArray[y][x].textContent === playerOne.symbol) {
        if (boardArray[y][x + 1].textContent === playerOne.symbol) {
          if (!boardArray[y][x + 2].textContent) {
            if (c4Checkbox.checked) {
              connectFourGravity(boardArray[y][x + 2]);
            } else {
              boardArray[y][x + 2].textContent = turnOrder;
            }
            return true;
          }
        }
      }
    }
  }

  //check vertical
  for (var y = 0; y < rows - offset; y++) {
    for (var x = 0; x < columns; x++) {
      if (boardArray[y][x].textContent === playerOne.symbol) {
        if (boardArray[y + 1][x].textContent === playerOne.symbol) {
          if (!boardArray[y + 2][x].textContent) {
            if (c4Checkbox.checked) {
              connectFourGravity(boardArray[y + 2][x]);
            } else {
              boardArray[y + 2][x].textContent = turnOrder;
            }
              return true;
          }
        }
      }
    }
  }

  //check diagonal down
  for (var y = 0; y < rows - offset; y++) {
    for (var x = 0; x < columns - offset; x++) {
      if (boardArray[y][x].textContent === playerOne.symbol) {
        if (boardArray[y + 1][x + 1].textContent === playerOne.symbol) {
          if (!boardArray[y + 2][x + 2].textContent) {
            if (c4Checkbox.checked) {
              connectFourGravity(boardArray[y + 2][x + 2]);
            } else {
              boardArray[y + 2][x + 2].textContent = turnOrder;
            }
            return true;
          }
        }
      }
    }
  }

  //check diagonal up
  for (var y = offset; y < rows; y++) {
    for (var x = 0; x < columns - offset; x++) {
      if (boardArray[y][x].textContent === playerOne.symbol) {
        if (boardArray[y - 1][x + 1].textContent === playerOne.symbol) {
          if (!boardArray[y - 2][x + 2].textContent) {
            if (c4Checkbox.checked) {
              connectFourGravity(boardArray[y - 2][x + 2]);
            } else {
              boardArray[y - 2][x + 2].textContent = turnOrder;
            }
            return true;
          }
        }
      }
    }
  }
  return false;
}
