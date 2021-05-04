import {SpreadsheetBaseComponent} from "@/components/spreadsheetBaseComponent";

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
        return `<div class="button">
                    <i class="material-icons">undo</i>
                </div>
                <div class="button">
                    <i class="material-icons">redo</i>
                </div>
                <div class="separator"></div>
                <div class="button">
                    <i class="material-icons">content_cut</i>
                </div>
                <div class="button">
                    <i class="material-icons">content_copy</i>
                </div>
                <div class="button">
                    <i class="material-icons">content_paste</i>
                </div>
                <div class="separator"></div>
                <div class="button">
                    <i class="material-icons">format_bold</i>
                </div>
                <div class="button">
                    <i class="material-icons">format_italic</i>
                </div>
                <div class="button">
                    <i class="material-icons">format_underlined</i>
                </div>
                <div class="separator"></div>
                <div class="button">
                    <i class="material-icons">format_align_left</i>
                </div>
                <div class="button">
                    <i class="material-icons">format_align_center</i>
                </div>
                <div class="button">
                    <i class="material-icons">format_align_center</i>
                </div>`;
    }

    /**
     * 
     * @param {PointerEvent} event
     */
    onClick(event) {
        console.log("Toolbar: onClick", event.target);
    }
}
