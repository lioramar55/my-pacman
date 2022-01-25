'use strict';
const WALL = '<img style="height:40px" src="assets/imgs/wall.png" />';
// const WALL = 'X';
const FOOD = '.';
const SUPER_FOOD = '🍖';
const EMPTY = ' ';
const CHERRY = '🍒';

var gRows = 20;
var gCols = 10;
var gBoard;
var gGame = {
  score: 0,
  isOn: false,
  foodCounter: 0,
};
var gWinScore;
var gEmptySlots;
var gCherryInterval;

var startAudio = new Audio('assets/audio/start.wav');
var loseAudio = new Audio('assets/audio/losing.wav');
var winAudio = new Audio('assets/audio/win.wav');

function init() {
  gGame.score = 0;
  gGame.foodCounter = 0;
  document.querySelector('.score').innerText = gGame.score;
  gBoard = buildBoard();
  createPacman(gBoard);
  createGhosts(gBoard);
  printMat(gBoard, '.board-container');
}

function startGame() {
  init();
  document.querySelector('.modal').style.display = 'none';
  startAudio.play();
  gGame.isOn = true;
  gCherryInterval = setInterval(cherryDropper, 15000);
}

function buildBoard() {
  var board = [];
  for (var i = 0; i < gCols; i++) {
    board.push([]);
    for (var j = 0; j < gRows; j++) {
      board[i][j] = FOOD;
      if (
        (j == 1 && (i == 1 || i === gCols - 2)) ||
        (j === gRows - 2 && (i === gCols - 2 || i === 1))
      ) {
        board[i][j] = SUPER_FOOD;
      }
      if (i === 0 || i === gCols - 1 || j === 0 || j === gRows - 1) {
        board[i][j] = WALL;
      }
      gWallsLocation.forEach((wallCoord) => {
        if (i === wallCoord.i && j === wallCoord.j) {
          board[i][j] = WALL;
        }
      });
      board[i][j] === FOOD ? gGame.foodCounter++ : '';
    }
  }
  gWinScore = gGame.foodCounter - 4 + 40;
  return board;
}

function updateScore(diff) {
  // update model and dom
  gGame.score += diff;
  document.querySelector('.score').innerText = gGame.score;
}

function cherryDropper() {
  gEmptySlots = [];
  for (var i = 1; i < gCols - 1; i++) {
    for (var j = 1; j < gCols - 1; j++) {
      var currCellContent = gBoard[i][j];
      if (currCellContent === EMPTY) {
        var location = {
          i,
          j,
        };
        gEmptySlots.push(location);
      }
    }
  }
  if (gEmptySlots.length) {
    var randLocationIdx = getRandomIntInclusive(0, gEmptySlots.length - 1);
    var randLocation = gEmptySlots[randLocationIdx];
    //update model
    gBoard[randLocation.i][randLocation.j] = CHERRY;
    //update Dom
    renderCell(randLocation, CHERRY);
  }
}

function gameOver() {
  gGame.isOn = false;
  clearInterval(gIntervalGhosts);
  clearInterval(gCherryInterval);
  var elModal = document.querySelector('.modal');
  var elBtn = elModal.querySelector('button');
  var elGreet = elModal.querySelector('h2');
  elModal.style.display = 'block';
  if (gGame.score >= gWinScore || checkVictory()) {
    elGreet.style.color = '#26a317';
    elGreet.innerText = `You Won!`;
    elBtn.style.backgroundColor = '#26a317';
    winAudio.play();
  } else {
    loseAudio.play();
    elGreet.style.color = '#b71d1d';
    elGreet.innerText = `You Lost!`;
    elBtn.style.backgroundColor = '#b71d1d';
  }
  // update the model
  gBoard[gPacman.location.i][gPacman.location.j] = EMPTY;
  // update the DOM
  renderCell(gPacman.location, EMPTY);
}

function checkVictory() {
  for (var i = 0; i < gCols; i++) {
    for (var j = 0; j < gCols; j++) {
      if (gBoard[i][j] === FOOD || gBoard[i][j] === SUPER_FOOD) return false;
    }
  }
  return true;
}
