import {SpreadsheetBaseComponent} from "../spreadsheetBaseComponent";
import {EventNames} from "../../core/resources";

/**
 * 
 */
export class Toolbar extends SpreadsheetBaseComponent {
    public static readonly componentName = "toolbar";
    public static readonly className = `spreadsheet__${Toolbar.componentName}`;

    constructor($root, options) {
        options.listeners = ["click"];
        super($root, options);
    }

    public loadState(): void {}

    public toHtml(): string {
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

    private onClick(event: PointerEvent): void {
        const buttonEl = (event.target as HTMLElement).closest(".button");
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

    private undoButtonClick(): void {
        console.log("undoButtonClick");
    }

    private redoButtonClick(): void {
        console.log("redoButtonClick");
    }

    private cutButtonClick(): void {
        this.observable.notify(EventNames.cut);
    }

    private copyButtonClick(): void{
        this.observable.notify(EventNames.copy);
    }

    private pasteButtonClick(): void {
        this.observable.notify(EventNames.paste);
    }

    private formatBoldButtonClick(): void {
        this.observable.notify(EventNames.formatBold);
    }

    private formatItalicButtonClick(): void {
        this.observable.notify(EventNames.formatItalic);
    }

    private formatUnderlinedButtonClick(): void {
        this.observable.notify(EventNames.formatUnderlined);
    }

    private alignVerticalTopButtonClick(): void {
        this.observable.notify(EventNames.alignVerticalTop);
        // cellElem.classList.remove("align-vertical-center align-vertical-bottom");
        // cellElem.classList.add("align-vertical-top");
    }

    private alignVerticalCenterButtonClick(): void {
        this.observable.notify(EventNames.alignVerticalCenter);
        // cellElem.classList.remove("align-vertical-top align-vertical-bottom");
        // cellElem.classList.add("align-vertical-center");
    }

    private alignVerticalBottomButtonClick(): void {
        this.observable.notify(EventNames.alignVerticalBottom);
        // cellElem.classList.remove("align-vertical-top align-vertical-center");
        // cellElem.classList.add("align-vertical-bottom");
    }

    private formatAlignLeftButtonClick(): void {
        this.observable.notify(EventNames.formatAlignLeft);
    }

    private formatAlignCenterButtonClick(): void {
        this.observable.notify(EventNames.formatAlignCenter);
    }

    private formatAlignRightButtonClick(): void {
        this.observable.notify(EventNames.formatAlignRight);
    }
}
