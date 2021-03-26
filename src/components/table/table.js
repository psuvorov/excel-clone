import {SpreadsheetComponent} from "@core/spreadsheetComponent";
import {createTable} from "@/components/table/table.template";

/**
 * 
 */
export class Table extends SpreadsheetComponent {
    static className = "spreadsheet__table";
    
    /**
     *
     * @return {string}
     */
    toHtml() {
        return createTable();
    }

    /**
     * 
     * @param {{}} event
     */
    onClick(event) {
        console.log("Table: onClick", event);
    }
}
