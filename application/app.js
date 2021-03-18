import {hexagonBlocks, resultBlock} from './CreateBlocks.js'
import {ArrangeBlocks, RenderSVGHexagons, UpdateCurrentMaximumElement, UpdatePolygon} from './rendering.js'
import {ComputeKey, CreateGameArray, currentMaximum} from './gameData.js'

const RunApplication = () => {

    ArrangeBlocks(hexagonBlocks)

    const game = CreateGameArray()

    RenderSVGHexagons(hexagonBlocks)

    game.forEach((position, index, array) => UpdatePolygon(index, array))

    UpdateCurrentMaximumElement(resultBlock, currentMaximum)

    document.addEventListener('keydown', (event) => ComputeKey(event, game, currentMaximum))
}

document.addEventListener('DOMContentLoaded', RunApplication)
