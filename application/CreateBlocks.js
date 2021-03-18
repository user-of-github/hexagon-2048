import {CONFIGURATION} from './configuration.js'

const CreateHexagonContainer = (appContainer) => {
    const hexagonContainer = document.createElement('div')
    hexagonContainer.classList.add('hexagon-container')
    hexagonContainer.classList.add('small-in')
    hexagonContainer.style.width = `${(CONFIGURATION.sideLength * 5 + CONFIGURATION.generalPadding * 2)}px`
    hexagonContainer.style.height =
        `${(CONFIGURATION.sideLength * Math.cos(Math.PI / 6) * 6 + CONFIGURATION.generalPadding * 2)}px`

    appContainer.appendChild(hexagonContainer)
    window.setTimeout(() => {
        hexagonContainer.classList.remove('small-in')
    }, 500)
    return hexagonContainer
}

const CreateHexagonBlocks = (hexagonContainer) => {
    const hexagonBlocks = []
    for (let counter = 0; counter < CONFIGURATION.amountOfHexagons; ++counter) {
        const newHexagonBlock = document.createElement('div')
        newHexagonBlock.classList.add('hexagon-block')
        hexagonBlocks.push(newHexagonBlock)
    }

    hexagonBlocks.forEach(block => hexagonContainer.appendChild(block))

    return hexagonBlocks
}

export const appContainer = document.getElementById('app')
export const hexagonContainer = CreateHexagonContainer(appContainer, CONFIGURATION.sideLength, CONFIGURATION.generalPadding)
export const hexagonBlocks = CreateHexagonBlocks(hexagonContainer, CONFIGURATION.amountOfHexagons)
export const resultBlock = document.getElementById('result')
