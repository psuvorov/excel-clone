import {CellContentVerticalAlignment, CellContentHorizontalAlignment} from "./applicationState";

export function getClassNameForVerticalAlignment(verticalAlignment?: CellContentVerticalAlignment): string {
    if (verticalAlignment) {
        switch (verticalAlignment) {
            case CellContentVerticalAlignment.Top:
                return "align-vertical-top";
            case CellContentVerticalAlignment.Center:
                return "align-vertical-center";
            case CellContentVerticalAlignment.Bottom:
                return "align-vertical-bottom";
            default:
                return "";
        }
    }
}

export function getClassNameForHorizontalAlignment(horizontalAlignment?: CellContentHorizontalAlignment): string {
    if (horizontalAlignment) {
        switch (horizontalAlignment) {
            case CellContentHorizontalAlignment.Left:
                return "format-align-left";
            case CellContentHorizontalAlignment.Center:
                return "format-align-center";
            case CellContentHorizontalAlignment.Right:
                return "format-align-right";
            default:
                return "";
        }
    }
}

export function isInit(...value: any[]): boolean {
    for (let i = 0; i < value.length; i++) {
        if (typeof value[i] === "undefined" || value[i] === null) 
            return false;
    }
    return true;
}
