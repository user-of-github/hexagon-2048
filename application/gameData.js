import {CONFIGURATION} from './configuration.js'
import {UpdateCurrentMaximumElement, UpdatePolygon} from './rendering.js'
import {resultBlock} from './CreateBlocks.js'

export const CreateGameArray = () => {
    const game = []
    for (let counter = 0; counter < CONFIGURATION.amountOfHexagons; ++counter)
        game.push(undefined)

    let counter = 0
    while (counter < CONFIGURATION.startAmountOfValues) {
        const index = Math.floor(Math.random() * CONFIGURATION.amountOfHexagons)
        if (game[index] === undefined) {
            game[index] = 2
            ++counter
        }
    }

    return game
}

export const PossibleMovements = {
    "Up": {
        "3": [0],
        "5": [2],
        "6": [4, 1]
    },
    "Down": {
        "0": [3],
        "2": [5],
        "1": [4, 6]
    },
    "UpRight": {
        "0": [1],
        "6": [5],
        "3": [4, 2]
    },
    "UpLeft": {
        "2": [1],
        "6": [3],
        "5": [4, 0]
    },
    "DownRight": {
        "1": [2],
        "3": [6],
        "0": [4, 5]
    },
    "DownLeft": {
        "1": [0],
        "2": [4, 3],
        "5": [6]
    }
}


export const MoveNumbers = (indexFrom, indexTo, game) => {
    if (game[indexFrom] === undefined && game[indexTo] === undefined)
        return

    if (game[indexFrom] !== undefined) {
        game[indexTo] = game[indexTo] !== undefined ? game[indexFrom] * 2 : game[indexFrom]
        game[indexFrom] = undefined
    }

    UpdatePolygon(indexFrom, game)
    UpdatePolygon(indexTo, game)
}

export const PerformMovements = (movement, game) => {
    const steps = PossibleMovements[movement]
    let wasMovement = false
    for (const step in steps) {
        const fromIndex = Number.parseInt(step),
            toIndexArray = Array.from(steps[step]).map(item => Number.parseInt(item))

        if (toIndexArray.length === 1) {
            if (game[fromIndex] !== undefined && (game[toIndexArray[0]] === undefined || game[fromIndex] === game[toIndexArray[0]])) {
                MoveNumbers(fromIndex, toIndexArray[0], game)
                wasMovement = true
            }
        } else if (toIndexArray.length === 2) {
            const preLastIndex = toIndexArray[0],
                lastIndex = toIndexArray[1]

            if (game[preLastIndex] === game[lastIndex] && game[lastIndex] !== undefined) {
                MoveNumbers(preLastIndex, lastIndex, game)
                MoveNumbers(fromIndex, preLastIndex, game)
                wasMovement = true
            } else if (game[fromIndex] === game[preLastIndex] && game[fromIndex] !== undefined) {
                MoveNumbers(fromIndex, preLastIndex, game)
                wasMovement = true
                if (game[lastIndex] === undefined) {
                    MoveNumbers(preLastIndex, lastIndex, game)
                    wasMovement = true
                }
            } else if (game[lastIndex] === game[fromIndex] && game[preLastIndex] === undefined) {
                MoveNumbers(fromIndex, lastIndex, game)
                wasMovement = true
            } else {
                if (game[fromIndex] !== undefined && game[preLastIndex] === undefined && game[lastIndex] === undefined) {
                    MoveNumbers(fromIndex, lastIndex, game)
                    wasMovement = true
                }
                if (game[lastIndex] === undefined && game[preLastIndex] !== undefined) {
                    MoveNumbers(preLastIndex, lastIndex, game)
                    wasMovement = true
                }
                if (game[preLastIndex] === undefined && game[fromIndex] !== undefined) {
                    MoveNumbers(fromIndex, preLastIndex, game)
                    wasMovement = true
                }
            }
        }
    }
    return wasMovement
}

export const GenerateOneMoreNumber = (game) => {
    if (game.every(position => position !== undefined))
        return

    const temp = []
    game.forEach((positionState, index) => ((positionState === undefined) && temp.push(index)))

    const index = temp[Math.floor(Math.random() * temp.length)]
    game[index] = Math.random() <= CONFIGURATION.probabilityOfGenerating2 ? 2 : 4

    UpdatePolygon(index, game)
}

export const ComputeKey = (event, game, currentMaximum) => {
    let movement = ""
    switch (event.code) {
        case 'KeyQ': {
            movement = 'UpLeft'
            break
        }
        case 'KeyW': {
            movement = 'Up'
            break
        }
        case 'KeyE': {
            movement = 'UpRight'
            break
        }
        case 'KeyA': {
            movement = 'DownLeft'
            break
        }
        case 'KeyS': {
            movement = 'Down'
            break
        }
        case 'KeyD': {
            movement = 'DownRight'
            break
        }
        default:
            return
    }
    if (PerformMovements(movement, game) === true) {
        window.setTimeout(() => GenerateOneMoreNumber(game), 500)
        currentMaximum = Math.max(...game.filter(positionState => positionState !== undefined))
        UpdateCurrentMaximumElement(resultBlock, currentMaximum)
    }
}

export let currentMaximum = 2

