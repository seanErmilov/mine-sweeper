'use strict'

function createMat(size) {
  const mat = []
  for (var i = 0; i < size; i++) {
    const row = []
    for (var j = 0; j < size; j++) {
      row.push('')
    }
    mat.push(row)
  }
  return mat
}

function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min)
  const maxFloored = Math.floor(max)
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled) // The maximum is exclusive and the minimum is inclusive
}

function getRandomIntInclusive(min, max) {
  const minCeiled = Math.ceil(min)
  const maxFloored = Math.floor(max)
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled) // The maximum is inclusive and the minimum is inclusive
}

function findEmptyPos() {
  //emptyPoss will be [{i:0,j:0},{i:0,j:1}]
  var emptyPoss = []
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard.length; j++) {
      var cell = gBoard[i][j]
      if (!cell.isMine && !cell.isShown && !cell.isMarked) {
        var pos = { i: i, j: j }
        emptyPoss.push(pos)
      }
    }
  }
  var randIdx = getRandomInt(0, emptyPoss.length) // 0 , 1
  var randPos = emptyPoss[randIdx] //{}
  return randPos
}

function copyMat(mat) {
  var newMat = []
  for (var i = 0; i < mat.length; i++) {
    newMat[i] = []
    for (var j = 0; j < mat[0].length; j++) {
      newMat[i][j] = mat[i][j]
    }
  }
  return newMat
}

function getRandomColor() {
  var letters = '0123456789ABCDEF'
  var color = '#'
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

function makeId(length = 6) {
  var txt = ''
  var possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (var i = 0; i < length; i++) {
    txt += possible.charAt(Math.floor(Math.random() * possible.length))
  }

  return txt
}

//timer - needs mins and secs class in index.html

function setTime() {
  var elMins = document.querySelector(`.mins`)
  var elSecs = document.querySelector(`.secs`)
  ++gTotalSeconds
  elSecs.innerHTML = pad(gTotalSeconds % 60)
  elMins.innerHTML = pad(parseInt(gTotalSeconds / 60))
}

function pad(val) {
  var str = val + ''
  if (str.length < 2) return '0' + str
  else return str
}
