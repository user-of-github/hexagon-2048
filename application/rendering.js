import {CONFIGURATION} from './configuration.js'
import {hexagonBlocks} from './createBlocks.js'

export const ArrangeBlocks = (blocks) => {

    const SetBlock = (block, top, left, padding) => {
        block.style.top = `${top + padding}px`
        block.style.left = `${left + padding}px`
    }


    SetBlock(blocks[0], CONFIGURATION.halfOfHexagonHeight, 0, CONFIGURATION.generalPadding)
    SetBlock(blocks[1], 0, (CONFIGURATION.sideLength / 2) * 3, CONFIGURATION.generalPadding)
    SetBlock(blocks[2], CONFIGURATION.halfOfHexagonHeight, 3 * CONFIGURATION.sideLength, CONFIGURATION.generalPadding)
    SetBlock(blocks[3], CONFIGURATION.halfOfHexagonHeight * 3, 0, CONFIGURATION.generalPadding)
    SetBlock(blocks[4], CONFIGURATION.halfOfHexagonHeight * 2, (CONFIGURATION.sideLength / 2) * 3, CONFIGURATION.generalPadding)
    SetBlock(blocks[5], CONFIGURATION.halfOfHexagonHeight * 3, 3 * CONFIGURATION.sideLength, CONFIGURATION.generalPadding)
    SetBlock(blocks[6], CONFIGURATION.halfOfHexagonHeight * 4, (CONFIGURATION.sideLength / 2) * 3, CONFIGURATION.generalPadding)

    blocks.forEach(block => {
        block.style.width = `${2 * CONFIGURATION.sideLength + CONFIGURATION.generalPadding / 6}px`
        block.style.height = `${CONFIGURATION.halfOfHexagonHeight * 2 + CONFIGURATION.generalPadding / 6}px`
    })
}

export const RenderSVGHexagons = (blocks) => {
    let index = 0
    blocks.forEach((block) => {
        const margin = CONFIGURATION.outlineWidth * Math.sin(Math.PI / 6)
        const specialMarginYtext = 10
        const newSVG =
            `
<svg 
width="${2 * CONFIGURATION.sideLength + CONFIGURATION.generalPadding / 6}" 
height="${CONFIGURATION.halfOfHexagonHeight * 2 + CONFIGURATION.generalPadding / 6}">
    <polygon class="${CONFIGURATION.classBackground}undefined"
     points="${margin} ${CONFIGURATION.halfOfHexagonHeight + margin}, ${CONFIGURATION.sideLength / 2 + margin} ${margin}, 
            ${CONFIGURATION.sideLength + CONFIGURATION.sideLength / 2 + margin} ${margin}, 
            ${2 * CONFIGURATION.sideLength + margin} ${CONFIGURATION.halfOfHexagonHeight + margin}, 
            ${CONFIGURATION.sideLength + CONFIGURATION.sideLength / 2 + margin} ${CONFIGURATION.halfOfHexagonHeight * 2 + margin}, 
            ${CONFIGURATION.sideLength / 2 + margin} ${CONFIGURATION.halfOfHexagonHeight * 2 + margin}" 
     stroke-width="${CONFIGURATION.outlineWidth}"/>
    <text class="hexagon-block-text" 
    text-anchor="middle"  
    x="${CONFIGURATION.sideLength + margin / 2}" 
    y="${CONFIGURATION.halfOfHexagonHeight + margin / 2 + specialMarginYtext}">
    </text>
</svg>`
        block.insertAdjacentHTML('beforeend', newSVG)
        ++index
    })
}


export const UpdatePolygon = (index, game, newOne = false) => {


    const polygon = (hexagonBlocks[index].getElementsByTagName('polygon'))[0],
        polygonText = (hexagonBlocks[index].getElementsByTagName('text'))[0]

    polygonText.textContent = game[index] !== undefined ? game[index] : ''
    polygon.classList.remove(...Array.from(polygon.classList).join(' ').split(' '))

    polygonText.classList.remove(...Array.from(polygonText.classList).join(' ').split(' '))
    polygonText.classList.add(CONFIGURATION.classTextColor + (game[index] !== undefined && game[index] > 16 ? '-light' :
        ''))

    polygon.classList.add(CONFIGURATION.classBackground + (game[index] !== undefined ? game[index] : 'undefined'))

    if (newOne === true)
    {
        polygon.classList.add('small-new')
        window.setTimeout(() => polygon.classList.remove('small-new'), 250)
        return
    }
    if (game[index] !== undefined) {
        polygon.classList.add('small')
        window.setTimeout(() => polygon.classList.remove('small'), 250)
    }
}

export const UpdateCurrentMaximumElement = (resultBlock, currentMaximum) => resultBlock.textContent = currentMaximum
