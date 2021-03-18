export const CONFIGURATION = {
    sideLength: 90,
    amountOfHexagons: 7,
    halfOfHexagonHeight: null,
    outlineWidth: 8,
    generalPadding: 60,
    startAmountOfValues: 3,
    classBackground: 'hexagon-block-fill-',
    classTextColor: 'hexagon-block-text',
    probabilityOfGenerating2: 0.82
}
CONFIGURATION.halfOfHexagonHeight = Math.floor(CONFIGURATION.sideLength * Math.cos(Math.PI / 6))
