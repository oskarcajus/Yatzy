let yatzy = new Yatzy()

const spanTurn = document.querySelector('#spanTurn')
const h4Round = document.querySelector('#h4Round')
const diceArray = Array.from(document.querySelectorAll(".dice"))
const pointsOutPutArray = Array.from(document.querySelectorAll('.checkboxPointOutput'))
const btnRoll = document.querySelector("#btnRoll")

const questionMarkImgUrl = "../img/question-mark.png"

const diceImgURL = new Map()
diceImgURL.set(1, "../img/dice-1.png")
diceImgURL.set(2, "../img/dice-2.png")
diceImgURL.set(3, "../img/dice-3.png")
diceImgURL.set(4, "../img/dice-4.png")
diceImgURL.set(5, "../img/dice-5.png")
diceImgURL.set(6, "../img/dice-6.png")


//Onclick actions ------------------------------------------------------------------
const diceOnClickAction = (e) => {
  if (e.target.checked) {
    yatzy.dice.get(parseInt(e.target.value)).hold = true
    e.target.nextElementSibling.style.background = "lightGrey"
  } else {
    yatzy.dice.get(parseInt(e.target.value)).hold = false
    e.target.nextElementSibling.style.background = "white"
  }
}
diceArray.forEach((d) => d.onclick = diceOnClickAction)

const pointsOutputOnClickAction = (e) => {
  if (!e.target.disabled) {
    disableChosenPointsOutputCheckbox(e.target)
    yatzy.chosenPoints.set(e.target.id, parseInt(e.target.nextElementSibling.innerHTML))
    yatzy.updateSumAndBonusAndTotalPoints()
    updateSumAndBonusAndTotalFrontEnd()
    takeRound()
  }
}
pointsOutPutArray.forEach((p) => p.onclick = pointsOutputOnClickAction)

const onRollAction = () => {
  try {
    yatzy.rollDice()

    //Update
    for (const d of diceArray) {
      updateDieImage(d)
      updateBlinkAnimationOnDie(d)
    }
    updatePointOutputs(yatzy.getResultsFromDiceThrow())
    updateTurnAndRound()
  } catch (e) {
    window.alert(e)
  }
}
btnRoll.onclick = onRollAction

//----------------------------------------------------------------------------------

//Update ---------------------------------------------------------------------------

const updatePointOutputs = (array) => {
  for (let i in pointsOutPutArray) {
    if (!pointsOutPutArray[i].checked) {
      pointsOutPutArray[i].nextElementSibling.innerHTML = array[i].toString()
    }
  }
}

const updateTurnAndRound = () => {
  spanTurn.innerHTML = "Turn: " + yatzy.currentTurn + "/3"
  h4Round.innerHTML = "Round: " + yatzy.currentRound + "/15"
}

const updateSumAndBonusAndTotalFrontEnd = () => {
  document.querySelector('#sum-output').innerHTML = "Sum: " + yatzy.sumPoints
  document.querySelector('#bonus-output').innerHTML = "Bonus: " + yatzy.bonusPoints
  document.querySelector('#total-output').innerHTML = "Total: " + yatzy.totalPoints
}

const updateBlinkAnimationOnDie = (die) => {
  if ((!yatzy.dice.get(parseInt(die.value)).hold)) {
    die.nextElementSibling.classList.add("blink")
    die.nextElementSibling.onanimationend = () => die.nextElementSibling.classList.remove("blink")
  }
}

const updateDieImage = (die) => {
  die.nextElementSibling.lastChild.src = diceImgURL.get(yatzy.dice.get(parseInt(die.value)).diceValue)
}

//-----------------------------------------------------------------------------------

const takeRound = () => {
  try {
    yatzy.takeRound()
    updateTurnAndRound()
    resetDice()
    resetPointOutPuts()
  } catch (e) {
    let result = window.confirm(e.message + "\n\n" +
      "Do you want to play again?")
    if (result) {
      yatzy = new Yatzy()
      resetGame()
    } else {
      //do nothing
    }
  }
}

const resetDice = () => {
  yatzy.resetDice()
  diceArray.forEach((d) => {
    d.nextElementSibling.lastChild.src = questionMarkImgUrl
    d.checked = false
    d.nextElementSibling.style.background = "white"
  })
  window.scrollTo({top: 0, behavior: 'smooth'});
}

const resetPointOutPuts = () => {
  pointsOutPutArray.forEach((p) => {
    if (!p.checked) {
      p.nextElementSibling.innerHTML = '0'
    }
  })
}

const disableChosenPointsOutputCheckbox = (checkbox) => {
  checkbox.nextElementSibling.style.backgroundColor = "lightGrey"
  checkbox.disabled = true
}

const resetGame = () => {
  resetDice()
  updateTurnAndRound()
  updateSumAndBonusAndTotalFrontEnd()
  pointsOutPutArray.forEach((p) => {
    p.disabled = false
    p.checked = false
    p.nextElementSibling.innerHTML = '0'
    p.nextElementSibling.style.backgroundColor = 'white'
  })
}