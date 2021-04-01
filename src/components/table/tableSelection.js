/**
 * 
 */
export class TableSelection {
    static selectedClassName = "selected";
    
    /**
     * 
     */
    constructor() {
        this.group = [];
    }

    /**
     * 
     * @param {DomWrapper} $cell
     */
    selectCell($cell) {
        this.clearSelection();
        this.group.push($cell);
        $cell.addClass(TableSelection.selectedClassName);
    }

    /**
     * 
     */
    clearSelection() {
        this.group.forEach($el => $el.removeClass(TableSelection.selectedClassName));
        this.group = [];
    }

    /**
     * 
     */
    selectCells() {
        
    }
}
