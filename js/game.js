'use strict'

var gBoard
var gLevel
var gIsFirstClick
var gCountMarkedMines //needs better name

const SMILEY = '😊'
const ANGEL = '😇'
const BLOWN = '🤯'
const FLAG = '🚩'
const EMPTY = ''

var gDifficlty = {
  boardSize: 4,
  mines: 2,
}

var gGame

function onInIt() {
  gBoard = buildBoard()
  gIsFirstClick = true
  resetScore()
  gDifficlty = { boardSize: 4, mines: 2 }
  gCountMarkedMines = gDifficlty.mines
  renderBoard(gBoard)
  console.log('gBoard :', gBoard)
}

function buildBoard() {
  var board = []
  for (var i = 0; i < gDifficlty.boardSize; i++) {
    board[i] = []
    for (var j = 0; j < gDifficlty.boardSize; j++) {
      board[i][j] = createCell()
    }
  }
  return board
}

function createCell() {
  return {
    mineAroundCount: 0,
    isShown: false,
    isMine: false,
    isMarked: false,
  }
}

function getMineNegs(cellI, cellJ) {
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i > gBoard.length - 1) continue
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (j < 0 || j > gBoard[0].length - 1) continue
      if (i === cellI && j === cellJ) continue
      var cell = gBoard[i][j]

      if (cell.isMine) {
        // console.log('i , j:', i, j)
        // console.log('cell:', cell)

        // Update model:
        gBoard[cellI][cellJ].mineAroundCount++

        // Update dom:
      }
    }
  }
}

function setMinesNegsCount(board) {
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board.length; j++) {
      getMineNegs(i, j)
    }
  }
}

function renderBoard(board) {
  var strHTML = ''
  for (var i = 0; i < board.length; i++) {
    strHTML += '<tr>'
    for (var j = 0; j < board[0].length; j++) {
      const cell = board[i][j]
      var className = `cell cell-${i}-${j}`
      //   if (!cell.isShown) className += ' hide'
      strHTML += `<td class="${className}"onmousedown="onCellClicked(event,this,${i},${j})"></td>`
    }
    strHTML += '</tr>'
  }

  const elContainer = document.querySelector('.board')
  elContainer.innerHTML = strHTML
}

function disableRightClickMenu(event) {
  if (event.button == 2) {
    event.preventDefault() // Prevent the default right-click behavior
    // alert('Right click !')
    return true
  }
}

function onCellClicked(event, elcell, indexI, indexj) {
  if (!gGame.isOn) return

  var curCell = gBoard[indexI][indexj]
  var pos = { i: indexI, j: indexj }

  if (curCell.isShown) return

  //mark cell
  if (event.button === 2) {
    onCellMarked(curCell, pos)
    return
  }

  if (gIsFirstClick) onFirstClick(curCell)

  if (curCell.isMine) {
    onCellMine(curCell, pos)
    return
  }

  onCellNumber(curCell, pos)
}

function onCellNumber(curCell, pos) {
  var countOfMine = curCell.mineAroundCount
  if (curCell.isMarked) {
    gGame.markedCount--
    curCell.isMarked = false
  }
  curCell.isShown = true
  gGame.shownCount++
  renderCell(pos, countOfMine)
}

function onCellMine(curCell, pos) {
  gGame.lives--
  updateLives()

  if (curCell.isMarked) {
    curCell.isMarked = false
    gGame.markedCount--
  }
  curCell.isShown = true
  gGame.shownCount++

  if (!curCell.isMarked) gCountMarkedMines--
  gDifficlty.mines--
  checkGameOver()
  renderCell(pos, '💣')
}

function onFirstClick(curCell) {
  curCell.isShown = true
  gGame.shownCount++
  gGame.markedCount = 0
  // placeMinesAtRandom()
  gBoard[0][0].isMine = true
  gBoard[0][1].isMine = true
  setMinesNegsCount(gBoard)
  renderBoard(gBoard)
  gIsFirstClick = false
}

function renderCell(location, value) {
  // Select the elCell and set the value
  const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
  elCell.innerHTML = value
}

function onCellMarked(curCell, pos) {
  var value
  if (curCell.isMarked) {
    value = EMPTY
    gGame.markedCount--
    if (curCell.isMine) gCountMarkedMines++
  } else {
    value = FLAG
    gGame.markedCount++
    if (curCell.isMine) gCountMarkedMines--
  }
  checkGameOver()
  renderCell(pos, value)
  curCell.isMarked = !curCell.isMarked
}

function placeMinesAtRandom() {
  for (var i = 0; i < gDifficlty.mines; i++) {
    var pos = findEmptyPos()
    console.log('pos :', pos)
    gBoard[pos.i][pos.j].isMine = true
  }
}

function updateLives() {
  // update model and dom
  document.querySelector('h2 span').innerText = gGame.lives
}

function resetScore() {
  gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    lives: 2,
  }
  document.querySelector('.smile-face').innerText = SMILEY
  updateLives()
}

function checkGameOver() {
  if (gGame.lives === 0) {
    gameOver(false)
  } else if (
    gCountMarkedMines === 0 &&
    gGame.markedCount === gDifficlty.mines
  ) {
    gameOver(true)
  }
}

function gameOver(isVictory) {
  gGame.isOn = false
  var elsmile = document.querySelector('.smile-face')
  isVictory ? (elsmile.innerText = ANGEL) : (elsmile.innerText = BLOWN)
}

function expandShown(board, elCell, i, j) {}
