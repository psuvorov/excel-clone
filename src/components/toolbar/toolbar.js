import {SpreadsheetBaseComponent} from "@/components/spreadsheetBaseComponent";
import {EventNames} from "@core/resources";

/**
 * 
 */
export class Toolbar extends SpreadsheetBaseComponent {
    static componentName = "toolbar";
    static className = `spreadsheet__${Toolbar.componentName}`;

    /**
     *
     * @param {DomWrapper} $root
     * @param {any} options
     */
    constructor($root, options) {
        options.listeners = ["click"];
        super($root, options);
    }

    /**
     * 
     */
    loadState() {
        super.loadState();
    }

    /**
     *
     * @return {string}
     */
    toHtml() {
        return `<div class="button undo">
                    <i class="material-icons">undo</i>
                </div>
                <div class="button redo">
                    <i class="material-icons">redo</i>
                </div>
                <div class="separator"></div>
                <div class="button content_cut">
                    <i class="material-icons">content_cut</i>
                </div>
                <div class="button content_copy">
                    <i class="material-icons">content_copy</i>
                </div>
                <div class="button content_paste">
                    <i class="material-icons">content_paste</i>
                </div>
                <div class="separator"></div>
                <div class="button format_bold">
                    <i class="material-icons">format_bold</i>
                </div>
                <div class="button format_italic">
                    <i class="material-icons">format_italic</i>
                </div>
                <div class="button format_underlined">
                    <i class="material-icons">format_underlined</i>
                </div>
                <div class="separator"></div>
                <div class="button align_vertical_top">
                    <i class="material-icons">align_vertical_top</i>
                </div>
                <div class="button align_vertical_center">
                    <i class="material-icons">align_vertical_center</i>
                </div>
                <div class="button align_vertical_bottom">
                    <i class="material-icons">align_vertical_bottom</i>
                </div>
                <div class="separator"></div>
                <div class="button format_align_left">
                    <i class="material-icons">format_align_left</i>
                </div>
                <div class="button format_align_center">
                    <i class="material-icons">format_align_center</i>
                </div>
                <div class="button format_align_right">
                    <i class="material-icons">format_align_right</i>
                </div>`;
    }

    /**
     * 
     * @param {PointerEvent} event
     */
    onClick(event) {
        const buttonEl = event.target.closest(".button");
        if (!buttonEl)
            return;
        
        
        if (buttonEl.classList.contains("undo"))
            this.undoButtonClick();
        else if (buttonEl.classList.contains("redo"))
            this.redoButtonClick();
        else if (buttonEl.classList.contains("content_cut"))
            this.cutButtonClick();
        else if (buttonEl.classList.contains("content_copy"))
            this.copyButtonClick();
        else if (buttonEl.classList.contains("content_paste"))
            this.pasteButtonClick();
        else if (buttonEl.classList.contains("format_bold"))
            this.formatBoldButtonClick();
        else if (buttonEl.classList.contains("format_italic"))
            this.formatItalicButtonClick();
        else if (buttonEl.classList.contains("format_underlined"))
            this.formatUnderlinedButtonClick();
        else if (buttonEl.classList.contains("align_vertical_top"))
            this.alignVerticalTopButtonClick();
        else if (buttonEl.classList.contains("align_vertical_center"))
            this.alignVerticalCenterButtonClick();
        else if (buttonEl.classList.contains("align_vertical_bottom"))
            this.alignVerticalBottomButtonClick();
        else if (buttonEl.classList.contains("format_align_left"))
            this.formatAlignLeftButtonClick();
        else if (buttonEl.classList.contains("format_align_center"))
            this.formatAlignCenterButtonClick();
        else if (buttonEl.classList.contains("format_align_right"))
            this.formatAlignRightButtonClick();
    }

    /**
     * 
     */
    undoButtonClick() {
        console.log("undoButtonClick");
    }

    /**
     *
     */
    redoButtonClick() {
        console.log("redoButtonClick");
    }

    /**
     *
     */
    cutButtonClick() {
        console.log("cutButtonClick");
    }

    /**
     *
     */
    copyButtonClick() {
        console.log("copyButtonClick");
    }

    /**
     *
     */
    pasteButtonClick() {
        console.log("pasteButtonClick");
    }

    /**
     *
     */
    formatBoldButtonClick() {
        console.log("formatBoldButtonClick");
    }

    /**
     *
     */
    formatItalicButtonClick() {
        console.log("formatItalicButtonClick");
    }

    /**
     *
     */
    formatUnderlinedButtonClick() {
        console.log("formatUnderlinedButtonClick");
    }

    /**
     * @param {HTMLElement} cellElem
     */
    alignVerticalTopButtonClick(cellElem) {
        cellElem.classList.remove("align-vertical-center align-vertical-bottom");
        cellElem.classList.add("align-vertical-top");
    }

    /**
     * @param {HTMLElement} cellElem
     */
    alignVerticalCenterButtonClick(cellElem) {
        cellElem.classList.remove("align-vertical-top align-vertical-bottom");
        cellElem.classList.add("align-vertical-center");
    }

    /**
     * @param {HTMLElement} cellElem
     */
    alignVerticalBottomButtonClick(cellElem) {
        cellElem.classList.remove("align-vertical-top align-vertical-center");
        cellElem.classList.add("align-vertical-bottom");
    }

    /**
     *
     */
    formatAlignLeftButtonClick() {
        console.log("formatAlignLeftButtonClick");
    }

    /**
     *
     */
    formatAlignCenterButtonClick() {
        console.log("formatAlignCenterButtonClick");
    }

    /**
     *
     */
    formatAlignRightButtonClick() {
        console.log("formatAlignRightButtonClick");
    }
}
