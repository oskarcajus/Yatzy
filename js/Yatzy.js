class Yatzy {
    constructor() {
        //Points
        this.sumPoints = 0
        this.bonusPoints = 0
        this.totalPoints = 0

        this.ROUND_MAX = 15
        this.TURN_MAX = 3

        this.currentTurn = 0
        this.currentRound = 1

        //Creation of 5 dice that can be rolled and held
        this.dice = new Map()
        for (let i = 1; i < 6; i++) {
            this.dice.set(i,
                {
                    hold: false,
                    diceValue: 1
                }
            )
        }

        //Histogram for counting how many dice of a given value there was in a throw
        this.diceCounts = new Map()
        this.diceCounts.set(1, 0)
        this.diceCounts.set(2, 0)
        this.diceCounts.set(3, 0)
        this.diceCounts.set(4, 0)
        this.diceCounts.set(5, 0)
        this.diceCounts.set(6, 0)

        //Map of what point combinations has been chosen by the player
        this.chosenPoints = new Map()
        this.chosenPoints.set('ones', 0)
        this.chosenPoints.set('twos', 0)
        this.chosenPoints.set('threes', 0)
        this.chosenPoints.set('fours', 0)
        this.chosenPoints.set('fives', 0)
        this.chosenPoints.set('sixes', 0)
        this.chosenPoints.set('one-pair', 0)
        this.chosenPoints.set('two-pairs', 0)
        this.chosenPoints.set('three-same', 0)
        this.chosenPoints.set('four-same', 0)
        this.chosenPoints.set('full-house', 0)
        this.chosenPoints.set('small-straight', 0)
        this.chosenPoints.set('large-straight', 0)
        this.chosenPoints.set('chance', 0)
        this.chosenPoints.set('yatzy', 0)
    }

    updateSumAndBonusAndTotalPoints = () => {
        this.sumPoints = 0
        this.bonusPoints = 0
        this.totalPoints = 0

        let pointCounter = 0
        for (let key of this.chosenPoints.keys()) {
            this.totalPoints += this.chosenPoints.get(key)
            if (pointCounter < 6) {
                this.sumPoints += this.chosenPoints.get(key)
                pointCounter++
            }
        }
        if (this.sumPoints >= 50) {
            this.bonusPoints = 63
        }
        this.totalPoints += this.bonusPoints
    }


    rollDice = () => {
        for (let key of this.dice.keys()) {
            let currentDie = this.dice.get(key)
            if (!currentDie.hold) {
                currentDie.diceValue = this.getRandomDie()
            }
        }
        this.takeTurn()
        this.updateDiceCounts()
    }

    takeTurn = () => {
        if (this.currentTurn === this.TURN_MAX) {
            throw new Error("Choose points")
        } else {
            this.currentTurn++
        }
    }

    takeRound = () => {
        if (this.currentRound === this.ROUND_MAX) {
            throw new Error("Game is over\n" +
            "You scored: " + this.totalPoints + " points.")

        }
        else {
            this.currentRound++
            this.currentTurn = 0
        }
    }

    updateDiceCounts = () => {
        for (let e of this.diceCounts.keys()) {
            this.diceCounts.set(e, 0)
        }
        for (let key of this.dice.keys()) {
            if (this.dice.get(key).diceValue === 1) {
                this.diceCounts.set(1, this.diceCounts.get(1) + 1)
            } else if (this.dice.get(key).diceValue === 2) {
                this.diceCounts.set(2, this.diceCounts.get(2) + 1)
            } else if (this.dice.get(key).diceValue === 3) {
                this.diceCounts.set(3, this.diceCounts.get(3) + 1)
            } else if (this.dice.get(key).diceValue === 4) {
                this.diceCounts.set(4, this.diceCounts.get(4) + 1)
            } else if (this.dice.get(key).diceValue === 5) {
                this.diceCounts.set(5, this.diceCounts.get(5) + 1)
            } else if (this.dice.get(key).diceValue === 6) {
                this.diceCounts.set(6, this.diceCounts.get(6) + 1)
            }
        }
    }

    getResultsFromDiceThrow = () => {
        let resultArray = []
        let sameValuePointsArray = this.sameValuePoints()

        for (let e of sameValuePointsArray) {
            resultArray.push(e)
        }
        resultArray.push(
            this.onePairPoints(this.diceCounts),
            this.twoPairPoints(this.diceCounts),
            this.threeSamePoints(this.diceCounts),
            this.fourSamePoints(this.diceCounts),
            this.fullHousePoints(this.diceCounts),
            this.smallStraightPoints(this.diceCounts),
            this.largeStraightPoints(this.diceCounts),
            this.chancePoints(this.diceCounts),
            this.yatzyPoints(this.diceCounts)
        )
        return resultArray
    }

    sameValuePoints = () => {
        let calcCounts = []
        for (let k of this.diceCounts.keys()) {
            calcCounts.push(
                this.diceCounts.get(k) * k
            )
        }
        return calcCounts
    }

    onePairPoints = (diceCounts) => {
        let highestValue = 0

        for (let k of diceCounts.keys()) {
            if (diceCounts.get(k) >= 2) {
                highestValue = k * 2
            }
        }
        return highestValue
    }

    twoPairPoints = (diceCounts) => {
        let numberOfPairs = 0
        let sumPair = 0

        for (let k of diceCounts.keys()) {
            if (diceCounts.get(k) >= 2) {
                sumPair += 2 * k
                numberOfPairs++
            }
        }
        if (numberOfPairs === 2) {
            return sumPair
        } else {
            return 0
        }
    }

    threeSamePoints = (diceCounts) => {
        let threeSame = 0

        for (let k of diceCounts.keys()) {
            if (diceCounts.get(k) >= 3) {
                threeSame = 3 * k
            }
        }
        return threeSame
    }

    fourSamePoints = (diceCounts) => {
        let fourSame = 0
        for (let k of diceCounts.keys()) {
            if (diceCounts.get(k) >= 4) {
                fourSame = 4 * k
            }
        }
        return fourSame
    }


    fullHousePoints = (diceCounts) => {
        let threeSame = 0
        let twoSame = 0
        let fullHouseSum = 0

        for (let k of diceCounts.keys()) {
            if (diceCounts.get(k) === 3) {
                threeSame = 3 * k
            }
            if (diceCounts.get(k) === 2) {
                twoSame = 2 * k
            }
        }
        if (twoSame > 0 && threeSame > 0) {
            fullHouseSum = twoSame + threeSame
        } else {
            fullHouseSum = 0
        }
        return fullHouseSum
    }

    smallStraightPoints = (diceCounts) => {
        let straightCounter = 0

        for (let k of diceCounts.keys()) {
            if (k < 6) {
                if (diceCounts.get(k) === 1) {
                    straightCounter++
                }
            }

        }
        if (straightCounter === 5) {
            return 15
        } else {
            return 0
        }
    }

    largeStraightPoints = (diceCounts) => {
        let straightCounter = 0

        for (let k of diceCounts.keys()) {
            if (k > 1) {
                if (diceCounts.get(k) === 1) {
                    straightCounter++
                }
            }
        }
        if (straightCounter === 5) {
            return 20
        } else {
            return 0
        }
    }

    chancePoints = (diceCounts) => {
        let chanceSum = 0

        for (let k of diceCounts.keys()) {
            chanceSum = chanceSum + diceCounts.get(k) * k
        }
        return chanceSum
    }

    yatzyPoints = (diceCounts) => {
        let yatzyCounter = 0

        for (let k of diceCounts.keys()) {
            if (diceCounts.get(k) === 5) {
                yatzyCounter++
            }
        }
        if (yatzyCounter > 0) {
            return 50
        } else {
            return 0
        }
    }

    getRandomDie = () => {
        return Math.floor(Math.random() * (6 - 1 + 1) + 1)
    }

    resetDice = () => {
        this.dice.forEach((d) => {
            d.diceValue = 1
            d.hold = false
        })
    }

}

