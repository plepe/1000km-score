const roundDef = {
  entfernung: {
    title: 'Entfernung',
  },
  truempfe: {
    title: 'Trümpfe',
  },
  stiche: {
    title: 'Stiche',
  },
}

let table
window.onload = () => {
  table = document.createElement('table')
  document.body.appendChild(table)

  showBoard({
    players: ['Skunk', 'Sub'],
    rounds: [[
      {
        entfernung: 250,
        truempfe: 200,
        stiche: 100
      },
      {
        entfernung: 700,
        truempfe: 100,
        stiche: 0
      }
    ], [
      {
        entfernung: 250,
        truempfe: 200,
        stiche: 100
      },
      {
        entfernung: 700,
        truempfe: 100,
        stiche: 0
      }
    ]]
  })
}

function showBoard (data) {
  const tr = document.createElement('tr')
  table.appendChild(tr)

  const th = document.createElement('th')
  tr.appendChild(th)

  th.appendChild(document.createTextNode('Players'))

  data.players.forEach(player => {
    const th = document.createElement('th')
    tr.appendChild(th)

    const input = document.createElement('input')
    input.value = player
    th.appendChild(input)
  })

  let prevSums = [0, 0]
  data.rounds.forEach((round) => {
    prevSums = showRound(round, prevSums)
  })
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

    round.forEach((player, i) => {
      const td = document.createElement('td')
      tr.appendChild(td)

      const input = document.createElement('input')
      if (round[i][rowKey]) {
        input.value = round[i][rowKey]
      }

      input.onkeyup = () => {
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
}
