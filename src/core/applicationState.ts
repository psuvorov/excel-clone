export type ApplicationState = {
    header: {},
    toolbar: {},
    table: {
        columnWidths: {[key: number]: number},
        rowHeights: {[key: number]: number},
        cellContents: {[columnNumber: number]: {[rowNumber: number]: TableCell}}
    }
};

export type TableCell = {
    value?: string,
    tableCellStyle?: TableCellStyle
}

export type TableCellStyle = {
    bold?: boolean,
    italic?: boolean,
    underlined?: boolean,
    verticalAlignment?: CellContentVerticalAlignment,
    horizontalAlignment?: CellContentHorizontalAlignment
}

export enum CellContentVerticalAlignment {
    Top= "Top",
    Center = "Center",
    Bottom = "Bottom"
}

export enum CellContentHorizontalAlignment {
    Left= "Left",
    Center = "Center",
    Right = "Right"
}
