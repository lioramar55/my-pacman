'use strict';

const BLUE_GHOST = `<img style="height:25px" src="imgs/ghost-blue.png" />`;
var gGhosts;
var gDeadGhosts = [];
var gIntervalGhosts;
var gGhostsImgs = [];
var ghostsJCoord;

function createGhost(board, i) {
  var ghost = {
    location: {
      i: 2,
      j: ghostsJCoord++,
    },
    img: `<img style="height:25px" src="assets/imgs/ghost${i + 1}.png" />`,
    currCellContent: FOOD,
    color: randomColor(),
  };
  gGhosts.push(ghost);
  gGhostsImgs.push(ghost.img);
  board[ghost.location.i][ghost.location.j] = ghost.img;
}

function createGhosts(board) {
  // 3 ghosts and an interval
  ghostsJCoord = 8;
  gGhosts = [];
  for (var i = 0; i < 4; i++) {
    createGhost(board, i);
  }

  gIntervalGhosts = setInterval(moveGhosts, 1000);
}

function moveGhosts() {
  for (var i = 0; i < gGhosts.length; i++) {
    var ghost = gGhosts[i];
    moveGhost(ghost, i);
  }
}

function moveGhost(ghost) {
  var moveDiff = getMoveDiff();
  var nextLocation = {
    i: ghost.location.i + moveDiff.i,
    j: ghost.location.j + moveDiff.j,
  };

  var nextCell = gBoard[nextLocation.i][nextLocation.j];
  if (nextCell === WALL) return moveGhost(ghost);
  if (gGhostsImgs.indexOf(nextCell) !== -1) return moveGhost(ghost);
  if (nextCell === PACMAN && !gPacman.isSuper) {
    gameOver();
    return;
  }
  if (nextCell === PACMAN && gPacman.isSuper) return;
  // moving from current position:
  // update the model
  gBoard[ghost.location.i][ghost.location.j] = ghost.currCellContent;
  // update the DOM
  renderCell(ghost.location, ghost.currCellContent);

  // Move the ghost to new location
  // update the model
  ghost.location = {
    i: nextLocation.i,
    j: nextLocation.j,
  };
  ghost.currCellContent = nextCell;
  gBoard[ghost.location.i][ghost.location.j] = ghost.img;
  // update the DOM
  renderCell(ghost.location, getGhostHTML(ghost));
}

function killGhost(location) {
  for (var i = 0; i < gGhosts.length; i++) {
    if (gGhosts[i].location.i === location.i && gGhosts[i].location.j === location.j) {
      if (gGhosts[i].currCellContent === FOOD) updateScore(1);
      if (gGhosts[i].currCellContent === SUPER_FOOD) updateScore(10);
      if (gGhosts[i].currCellContent === CHERRY) updateScore(10);
      gDeadGhosts.push(gGhosts.splice(i, 1));
    }
  }
  setTimeout(() => gGhosts.push(...gDeadGhosts.shift()), 5000);
}

function getMoveDiff() {
  var randNum = getRandomIntInclusive(1, 100);
  if (randNum <= 25) {
    return { i: 0, j: 1 };
  } else if (randNum <= 50) {
    return { i: -1, j: 0 };
  } else if (randNum <= 75) {
    return { i: 0, j: -1 };
  } else {
    return { i: 1, j: 0 };
  }
}

function getGhostHTML(ghost) {
  return gPacman.isSuper ? BLUE_GHOST : ghost.img;
}
