'use strict'

var gBoard
var gLevel
var gIsFirstClick
var gCountMarkedMines //needs better name
var gIsHint
var gscoreBoard
var gIsSafeClick

const SMILEY = '😊'
const ANGEL = '😇'
const BLOWN = '🤯'
const FLAG = '🚩'
const EMPTY = ''
const HINT = '💡'
const MINE = '💣'
const SAFE = '✅'

var gDifficlty = {
  boardSize: 8,
  mines: 4,
}

var gGame

function onInIt() {
  gBoard = buildBoard()
  gIsFirstClick = true
  gIsHint = false
  resetScore()
  gCountMarkedMines = 0
  renderBoard(gBoard)
  console.log('gBoard :', gBoard)
  gscoreBoard = createMat(3)
  // renderScoreBoard(gscoreBoard)
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

function showNugsCell(cellI, cellJ) {
  var positnsToHide = []
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i > gBoard.length - 1) continue
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (j < 0 || j > gBoard[0].length - 1) continue
      var cell = gBoard[i][j]
      if ((cell.isMine && !gIsHint) || cell.isShown || cell.isMarked) continue

      //show nug cells
      cell.isShown = true
      gGame.shownCount++
      if (!cell.mineAroundCount && !gIsHint) showNugsCell(i, j)

      //when hint is on show mines
      var value
      cell.isMine ? (value = '💣') : (value = cell.mineAroundCount)
      renderCell({ i, j }, value)

      //when hint presserd cell dispear after 1 sec
      if (gIsHint) {
        positnsToHide.push({ i, j })
        setTimeout(() => {
          hideInPostions(positnsToHide)
        }, 1000)
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

  if (curCell.isMarked) return

  if (gIsFirstClick) {
    onFirstClick(curCell, pos)
    gIsFirstClick = false
  }

  if (gIsHint) {
    showNugsCell(pos.i, pos.j)
    gIsHint = false
    gGame.hints--
    renderCounterBoard()
    return
  }

  if (curCell.isMine) {
    onCellMine(curCell, pos)
    return
  }

  onCellNumber(curCell, pos)
}

function onCellNumber(curCell, pos) {
  var curMineCount = curCell.mineAroundCount
  if (curMineCount) {
    curCell.isShown = true
    gGame.shownCount++
    renderCell(pos, curMineCount)
  } else {
    showNugsCell(pos.i, pos.j)
  }
  checkGameOver()
}

function onCellMine(curCell, pos) {
  gGame.lives--
  renderCounterBoard()

  curCell.isShown = true
  gCountMarkedMines++
  checkGameOver()
  renderCell(pos, MINE)
}

function onCellMarked(curCell, pos) {
  var value
  if (curCell.isMarked) {
    value = EMPTY
    gGame.markedCount--
    if (curCell.isMine) gCountMarkedMines--
  } else {
    value = FLAG
    gGame.markedCount++
    if (curCell.isMine) gCountMarkedMines++
  }
  checkGameOver()
  renderCell(pos, value)
  curCell.isMarked = !curCell.isMarked
}

function onFirstClick(curCell, pos) {
  curCell.isShown = true
  gGame.markedCount = 0
  placeMinesAtRandom()
  curCell.isShown = false
  // gBoard[0][0].isMine = true
  // gBoard[0][1].isMine = true
  // gBoard[1][1].isMine = true
  // gBoard[1][0].isMine = true
  setMinesNegsCount(gBoard)
  renderBoard(gBoard)
}

function renderCell(location, value) {
  // Select the elCell and set the value
  const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
  console.log('elCell :', elCell)
  elCell.innerHTML = value
}

function hideInPostions(positnsToHide) {
  for (var i = 0; i < positnsToHide.length; i++) {
    var pos = positnsToHide.pop()
    renderCell(pos, EMPTY)
    var cell = gBoard[pos.i][pos.j]
    cell.isShown = false
    gGame.shownCount--
  }
}

function placeMinesAtRandom() {
  for (var i = 0; i < gDifficlty.mines; i++) {
    var pos = findEmptyPos()
    gBoard[pos.i][pos.j].isMine = true
  }
}

function renderCounterBoard() {
  // update model and dom
  var elScores = document.querySelector('h2')
  elScores.querySelector('.lives').innerText = gGame.lives
  var msg = HINT.repeat(gGame.hints)
  elScores.querySelector('.hints').innerText = msg
}

function resetScore() {
  gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    lives: 3,
    hints: 3,
    safeClicks: 0,
  }
  document.querySelector('.smile-face').innerText = SMILEY
  renderCounterBoard()
}

function checkGameOver() {
  var boardSize = Math.pow(gDifficlty.boardSize, 2)
  if (gGame.lives === 0) {
    gameOver(false)
  } else if (gGame.shownCount + gCountMarkedMines === boardSize) {
    gameOver(true)
  }
}

function onHint() {
  gIsHint = true
}

function setDifficulty(element) {
  var difficulty = element.getAttribute('data-difficulty')
  if (difficulty === 'beginner') {
    gDifficlty = {
      boardSize: 4,
      mines: 2,
    }
  } else if (difficulty === 'medium') {
    gDifficlty = {
      boardSize: 8,
      mines: 14,
    }
  } else if (difficulty === 'expert') {
    gDifficlty = {
      boardSize: 12,
      mines: 32,
    }
  }
  onInIt()
}

function gameOver(isVictory) {
  gGame.isOn = false
  var elsmile = document.querySelector('.smile-face')
  isVictory ? (elsmile.innerText = ANGEL) : (elsmile.innerText = BLOWN)
}

function getScoreBoard() {}

function onSafeClick() {
  if (gIsFirstClick) return
  var pos = findEmptyPos(gBoard)
  console.log('pos :', pos)
  renderCell(pos, SAFE)
  gGame.safeClicks--
  renderCounterBoard()
}
// function renderScoreBoard(board) {
//   for (var i = 0; i < board.length; i++) {
//     for (var j = 0; j < board[0].length; j++) {
//       strHTML += '<tr>'
//       for (var j = 0; j < board[0].length; j++) {
//         const cell = board[i][j]
//         var className = `cell cell-${i}-${j}`
//         strHTML += `<td class="${className}"">${score}</td>`
//       }
//       strHTML += '</tr>'
//     }
//   }
// }
function expandShown(board, elCell, i, j) {}
