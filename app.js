const CONFIGURATION = {
    SIDE_SIZE: 90,
    NUMBER_OF_HEXAGONS: 7,
    HALF_HEIGHT: null,
    HEXAGON_FRAME_THICKNESS: 8,
    PADDING_CONTAINER: 60,
    AMOUNT_START_VALUES: 3,
    CLASS_POLYGON_FILL: 'hexagon-block-fill-',
    CLASS_POLYGON_TXT: 'hexagon-block-text'
}
CONFIGURATION.HALF_HEIGHT = Math.floor(CONFIGURATION.SIDE_SIZE * Math.cos(Math.PI / 6))

const CreateHexagonContainer = (appContainer, sideSize, padding) => {
    const hexagonContainer = document.createElement('div')
    hexagonContainer.classList.add('hexagon-container')

    hexagonContainer.style.width = `${(sideSize * 5 + padding * 2)}px`
    hexagonContainer.style.height = `${(sideSize * Math.cos(Math.PI / 6) * 6 + padding * 2)}px`

    appContainer.appendChild(hexagonContainer)

    return hexagonContainer
}

const CreateHexagonBlocks = (hexagonContainer, amount) => {
    const hexagonBlocks = []
    for (let counter = 0; counter < amount; ++counter) {
        const newHexagonBlock = document.createElement('div')
        newHexagonBlock.classList.add('hexagon-block')
        hexagonBlocks.push(newHexagonBlock)
    }

    hexagonBlocks.forEach(block => hexagonContainer.appendChild(block))

    return hexagonBlocks
}

const ArrangeBlocks = (blocks, halfHeight, sideSize) => {

    const SetBlock = (block, top, left, padding, dataNumber) => {
        block.style.top = `${top + padding}px`
        block.style.left = `${left + padding}px`
        block.setAttribute('data-number', dataNumber.toString())
    }


    SetBlock(blocks[0], halfHeight, 0, CONFIGURATION.PADDING_CONTAINER, 0)
    SetBlock(blocks[1], 0, (sideSize / 2) * 3, CONFIGURATION.PADDING_CONTAINER, 1)
    SetBlock(blocks[2], halfHeight, 3 * sideSize, CONFIGURATION.PADDING_CONTAINER, 3)
    SetBlock(blocks[3], halfHeight * 3, 0, CONFIGURATION.PADDING_CONTAINER, 4)
    SetBlock(blocks[4], halfHeight * 2, (sideSize / 2) * 3, CONFIGURATION.PADDING_CONTAINER, 5)
    SetBlock(blocks[5], halfHeight * 3, 3 * sideSize, CONFIGURATION.PADDING_CONTAINER, 6)
    SetBlock(blocks[6], halfHeight * 4, (sideSize / 2) * 3, CONFIGURATION.PADDING_CONTAINER, 7)

    blocks.forEach(block => {
        block.style.width = `${2 * sideSize + CONFIGURATION.PADDING_CONTAINER / 6}px`
        block.style.height = `${halfHeight * 2 + CONFIGURATION.PADDING_CONTAINER / 6}px`
    })
}

const RenderSVGHexagons = (blocks, sideSize, halfHeight, lineWidth) => {
    let index = 0
    blocks.forEach((block) => {
        const margin = lineWidth / 2
        const specialMarginYtext = 10
        const newSVG =
            `
<svg 
width="${2 * sideSize + CONFIGURATION.PADDING_CONTAINER / 6}" 
height="${halfHeight * 2 + CONFIGURATION.PADDING_CONTAINER / 6}">
    <polygon class="${CONFIGURATION.CLASS_POLYGON_FILL}undefined"
     points="${margin} ${halfHeight + margin}, ${sideSize / 2 + margin} ${margin}, 
            ${sideSize + sideSize / 2 + margin} ${margin}, 
            ${2 * sideSize + margin} ${halfHeight + margin}, 
            ${sideSize + sideSize / 2 + margin} ${halfHeight * 2 + margin}, 
            ${sideSize / 2 + margin} ${halfHeight * 2 + margin}" 
     stroke-width="${lineWidth}"/>
    <text class="hexagon-block-text" 
    text-anchor="middle"  
    x="${sideSize + margin / 2}" 
    y="${halfHeight + margin / 2 + specialMarginYtext}">
    </text>
</svg>`
        block.insertAdjacentHTML('beforeend', newSVG)
        ++index
    })
}

const CreateGameArray = (amount_hexagons, amount_start_values) => {
    const game = []
    for (let counter = 0; counter < amount_hexagons; ++counter)
        game.push(undefined)

    let counter = 0
    while (counter < 3) {
        const index = Math.floor(Math.random() * amount_hexagons)
        if (game[index] === undefined) {
            game[index] = 2
            ++counter
        }
    }

    return game
}

const PossibleMovements = {
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

const UpdatePolygon = (index, game) => {
    const polygon = (hexagonBlocks[index].getElementsByTagName('polygon'))[0],
        polygonText = (hexagonBlocks[index].getElementsByTagName('text'))[0]

    polygonText.textContent = game[index] !== undefined ? game[index] : ''
    polygon.classList.remove(...Array.from(polygon.classList).join(' ').split(' '))

    polygonText.classList.remove(...Array.from(polygonText.classList).join(' ').split(' '))
    polygonText.classList.add(CONFIGURATION.CLASS_POLYGON_TXT + (game[index] !== undefined && game[index] > 16 ? '-light' : ''))

    polygon.classList.add(CONFIGURATION.CLASS_POLYGON_FILL + (game[index] !== undefined ? game[index] : 'undefined'))
}

const MoveNumbers = (indexFrom, indexTo, game) => {
    if (game[indexFrom] === undefined && game[indexTo] === undefined)
        return

    if (game[indexFrom] !== undefined) {
        game[indexTo] = game[indexTo] !== undefined ? game[indexFrom] * 2 : game[indexFrom]
        game[indexFrom] = undefined
    }

    UpdatePolygon(indexFrom, game)
    UpdatePolygon(indexTo, game)
}

const PerformMovements = (movement, game) => {
    const steps = PossibleMovements[movement]
    let wasMovement = false
    for (const step in steps) {
        const fromIndex = Number.parseInt(step),
            toIndexArray = Array.from(steps[step]).map(item => Number.parseInt(item))

        if (toIndexArray.length === 1) {
            if (game[toIndexArray[0]] === undefined || game[fromIndex] === game[toIndexArray[0]]) {
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
                    wasMovement = false
                }
            }
        }
    }
    return wasMovement
}

const GenerateOneMoreNumber = (game) => {
    if (game.every(position => position !== undefined))
        return

    let index = Math.floor(Math.random() * game.length)
    while (game[index] !== undefined)
        index = Math.floor(Math.random() * game.length)

    game[index] = 2

    UpdatePolygon(index, game)
}

const ComputeKey = (event, game) => {
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
    if (PerformMovements(movement, game))
        window.setTimeout(() => GenerateOneMoreNumber(game), 500)
}

const appContainer = document.getElementById('app')
const hexagonContainer = CreateHexagonContainer(appContainer, CONFIGURATION.SIDE_SIZE, CONFIGURATION.PADDING_CONTAINER)
const hexagonBlocks = CreateHexagonBlocks(hexagonContainer, CONFIGURATION.NUMBER_OF_HEXAGONS)

const RunApplication = () => {
    ArrangeBlocks(hexagonBlocks, CONFIGURATION.HALF_HEIGHT, CONFIGURATION.SIDE_SIZE)

    const game = CreateGameArray(CONFIGURATION.NUMBER_OF_HEXAGONS, CONFIGURATION.AMOUNT_START_VALUES)

    RenderSVGHexagons(hexagonBlocks, CONFIGURATION.SIDE_SIZE, CONFIGURATION.HALF_HEIGHT, CONFIGURATION.HEXAGON_FRAME_THICKNESS)
    game.forEach((position, index, array) => UpdatePolygon(index, array))
    document.addEventListener('keydown', (event) => ComputeKey(event, game))
}


document.addEventListener('DOMContentLoaded', RunApplication)


