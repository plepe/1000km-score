const roundDef = {
  entfernung: {
    title: 'Kilometer',
  },
  truempfe: {
    title: 'Trümpfe',
    help: '100 pro',
  },
  stiche: {
    title: 'Stiche',
    help: '300 pro',
  },
  satzgewinn: {
    title: 'Satzgewinn',
    help: '400 pro',
  },
  kroenung: {
    title: 'Krönung',
    help: '300',
  },
  keine200: {
    title: 'keine 200',
    help: '300',
  },
  verlaengerung: {
    title: 'Verlängerung',
    help: '200',
  },
  schneider: {
    title: 'Schneider',
    help: '500',
  },
}

let table
let data
try {
  data = JSON.parse(global.localStorage.getItem('1000km'))
} catch (e) {}
if (!data) {
  data = {
    players: ['', ''],
    rounds: [[{}, {}]]
  }
}

window.onload = () => {
  table = document.createElement('table')
  document.body.appendChild(table)

  prevSums = showBoard(data)

  const button = document.createElement('button')
  document.body.appendChild(button)
  button.appendChild(document.createTextNode('Neue Runde'))

  button.onclick = () => {
    const round = [{}, {}]
    data.rounds.push(round)
    prevSums = showRound(round, prevSums)
  }

  const newGame = document.createElement('button')
  document.body.appendChild(newGame)
  newGame.appendChild(document.createTextNode('Neues Spiel'))

  newGame.onclick = () => {
    data.rounds = [[{}, {}]]

    while (table.lastChild) {
      table.removeChild(table.lastChild)
    }

    showBoard(data)
    saveData()
  }
}

function showBoard (data) {
  const tr = document.createElement('tr')
  table.appendChild(tr)

  const th = document.createElement('th')
  tr.appendChild(th)

  th.appendChild(document.createTextNode('Players'))

  data.players.forEach((player, i) => {
    const th = document.createElement('td')
    tr.appendChild(th)

    const input = document.createElement('input')
    input.value = player
    th.appendChild(input)

    input.onkeyup = () => {
      data.players[i] = input.value
      saveData()
    }
  })

  let prevSums = [0, 0]
  data.rounds.forEach((round) => {
    prevSums = showRound(round, prevSums)
  })

  return prevSums
}

function calcRoundSums (round, data) {
  return round.map(player => {
    let sum = 0

    Object.values(player).forEach(v => {
      sum += v ? parseInt(v) : 0
    })

    return sum
  })
}

function showRound (round, prevSums) {
  let roundSumRow
  let totalSumRow

  Object.entries(roundDef).forEach(([rowKey, rowDef]) => {
    const tr = document.createElement('tr')
    table.appendChild(tr)

    const th = document.createElement('th')
    tr.appendChild(th)
    th.appendChild(document.createTextNode(rowDef.title))

    if (rowDef.help) {
      const span = document.createElement('span')
      span.className = 'help'
      span.appendChild(document.createTextNode(rowDef.help))
      th.appendChild(span)
    }

    round.forEach((player, i) => {
      const td = document.createElement('td')
      tr.appendChild(td)

      const input = document.createElement('input')
      input.type = 'number'
      if (round[i][rowKey]) {
        input.value = round[i][rowKey]
      }

      input.onkeyup = () => {
        round[i][rowKey] = parseInt(input.value)
        updateRoundSums(round, prevSums, roundSumRow, totalSumRow, totalSums)
      }

      input.onchange = () => {
        round[i][rowKey] = parseInt(input.value)
        updateRoundSums(round, prevSums, roundSumRow, totalSumRow, totalSums)
      }

      td.appendChild(input)
    })
  })

  roundSumRow = document.createElement('tr')
  table.appendChild(roundSumRow)

  let th = document.createElement('th')
  roundSumRow.appendChild(th)
  th.appendChild(document.createTextNode('Summe Runde'))

  const sums = calcRoundSums(round)
  round.forEach((player, i) => {
    const td = document.createElement('td')
    roundSumRow.appendChild(td)

    const input = document.createElement('input')
    input.disabled = true
    if (sums[i]) {
      input.value = sums[i]
    }

    td.appendChild(input)
  })

  totalSumRow = document.createElement('tr')
  table.appendChild(totalSumRow)

  th = document.createElement('th')
  totalSumRow.appendChild(th)
  th.appendChild(document.createTextNode('Total'))

  round.forEach((player, i) => {
    const td = document.createElement('td')
    totalSumRow.appendChild(td)

    const input = document.createElement('input')
    input.disabled = true
    td.appendChild(input)
  })

  const totalSums = [0, 0]
  updateRoundSums(round, prevSums, roundSumRow, totalSumRow, totalSums)
  return totalSums
}

function updateRoundSums (round, prevSums, roundSumRow, totalSumRow, totalSums) {
  const sums = calcRoundSums(round)
  prevSums.forEach((p, i) => {
    totalSums[i] = p + sums[i]
  })

  round.forEach((player, i) => {
    const td = roundSumRow.cells[0, i + 1]
    const input = td.querySelector('input')
    input.value = sums[i]
  })

  round.forEach((player, i) => {
    const td = totalSumRow.cells[0, i + 1]
    const input = td.querySelector('input')
    input.value = totalSums[i]
  })

  saveData()
}

function saveData () {
  global.localStorage.setItem('1000km', JSON.stringify(data))
}
