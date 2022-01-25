'use strict';
// const PACMAN = '🤪';
const PACMAN = `<img style="height:30px" src="assets/imgs/pacman.png" />`;

var gPacman;
var gElPacmanHTML = `<div>${PACMAN}</div>`;
var superAudio = new Audio('assets/audio/super.wav');

function createPacman(board) {
  gPacman = {
    location: {
      i: 5,
      j: 1,
    },
    isSuper: false,
  };
  board[gPacman.location.i][gPacman.location.j] = PACMAN;
}

function movePacman(ev) {
  if (!gGame.isOn) return;

  var nextLocation = getNextLocation(ev);
  var nextCell = gBoard[nextLocation.i][nextLocation.j];
  var isNextCellAGhost = gGhostsImgs.indexOf(nextCell) !== -1;
  // return if cannot move
  if (nextCell === WALL) return;
  // hitting a ghost?  call gameOver
  if (isNextCellAGhost && !gPacman.isSuper) {
    gameOver();
    return;
  }
  if (nextCell === FOOD) {
    updateScore(1);
  }

  if (nextCell === SUPER_FOOD && gPacman.isSuper) return;
  if (nextCell === CHERRY) updateScore(10);
  if (nextCell === SUPER_FOOD && !gPacman.isSuper) {
    updateScore(10);
    superAudio.play();
    gPacman.isSuper = true;
    gPacman.currCellContent = SUPER_FOOD;
    gBoard[gPacman.location.i][gPacman.location.j] = EMPTY;

    renderCell(gPacman.location, EMPTY);

    setTimeout(() => (gPacman.isSuper = false), 5000);
  }
  if (isNextCellAGhost && gPacman.isSuper) {
    killGhost(nextLocation);
  }

  // moving from corrent position:
  // update the model
  // // update the DOM
  gBoard[gPacman.location.i][gPacman.location.j] = EMPTY;
  renderCell(gPacman.location, EMPTY);
  // Move the pacman to new location
  // update the model
  gPacman.location = {
    i: nextLocation.i,
    j: nextLocation.j,
  };
  gBoard[gPacman.location.i][gPacman.location.j] = PACMAN;
  // update the DOM
  renderCell(gPacman.location, gElPacmanHTML);
  if (gGame.score >= gWinScore || checkVictory()) {
    gameOver();
    return;
  }
}

function getNextLocation(keyboardEvent) {
  var nextLocation = {
    i: gPacman.location.i,
    j: gPacman.location.j,
  };
  var deg = '';
  switch (keyboardEvent.code) {
    case 'ArrowUp':
      deg = '270';

      nextLocation.i--;
      break;
    case 'ArrowDown':
      deg = '90';

      nextLocation.i++;
      break;
    case 'ArrowLeft':
      deg = '180';

      nextLocation.j--;
      break;
    case 'ArrowRight':
      deg = '0';

      nextLocation.j++;
      break;
    default:
      return null;
  }
  deg += 'deg';
  gElPacmanHTML = `<div style="transform: rotate(${deg})">${PACMAN}</div>`;
  return nextLocation;
}
