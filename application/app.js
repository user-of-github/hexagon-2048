import {hexagonBlocks, resultBlock} from './createBlocks.js'
import {ArrangeBlocks, RenderSVGHexagons, UpdateCurrentMaximumElement, UpdatePolygon} from './rendering.js'
import {ComputeKey, CreateGameArray, currentMaximum, IsLoss} from './gameData.js'

const RunApplication = () => {

    ArrangeBlocks(hexagonBlocks)

    const game = CreateGameArray()

    RenderSVGHexagons(hexagonBlocks)

    game.forEach((position, index, array) => game[index] !== undefined && UpdatePolygon(index, array))

    UpdateCurrentMaximumElement(resultBlock, currentMaximum)

    const Game = (event) => {
        ComputeKey(event, game, currentMaximum)
        if (IsLoss(game)) {
            alert('Game over')
            document.removeEventListener('keydown', Game)
        }

    }
    document.addEventListener('keydown', Game)
}

document.addEventListener('DOMContentLoaded', RunApplication)
