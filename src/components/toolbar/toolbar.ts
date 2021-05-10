import {SpreadsheetBaseComponent} from "../spreadsheetBaseComponent";
import {EventNames} from "../../core/resources";
import {isInit} from "../../core/utils";
import {ApplicationState, TableCell, TableCellStyle} from "../../core/applicationState";
import {$, DomWrapper} from "../../core/domWrapper";

/**
 * 
 */
export class Toolbar extends SpreadsheetBaseComponent {
    public static readonly componentName = "toolbar";
    public static readonly className = `spreadsheet__${Toolbar.componentName}`;

    private currentTableCellStyle: TableCellStyle;
    private buttons: { 
        boldButton: DomWrapper,
        italicButton: DomWrapper,
        underlinedButton: DomWrapper,
        alignVerticalTopButton: DomWrapper,
        alignVerticalCenterButton: DomWrapper,
        alignVerticalBottomButton: DomWrapper,
        formatAlignLeftButton: DomWrapper,
        formatAlignCenterButton: DomWrapper,
        formatAlignRightButton: DomWrapper
    };

    constructor($root, options) {
        options.listeners = ["click"];
        super($root, options);
    }

    init() {
        super.init();
        
        const toolbarElem = this.$root;
        this.buttons = {
            boldButton: $(toolbarElem.find(".format_bold")),
            italicButton: $(toolbarElem.find(".format_italic")),
            underlinedButton: $(toolbarElem.find(".format_underlined")),
            alignVerticalTopButton: $(toolbarElem.find(".align_vertical_top")),
            alignVerticalCenterButton: $(toolbarElem.find(".align_vertical_center")),
            alignVerticalBottomButton: $(toolbarElem.find(".align_vertical_bottom")),
            formatAlignLeftButton: $(toolbarElem.find(".format_align_left")),
            formatAlignCenterButton: $(toolbarElem.find(".format_align_center")),
            formatAlignRightButton: $(toolbarElem.find(".format_align_right"))
        }
        
        this.observable.subscribe(EventNames.SingleCellSelected, ({columnNumber, rowNumber}) => {
            let appState: ApplicationState = this.store.getState();
            
            const resetCellStyleButtons = () => {
                this.buttons["boldButton"].removeClass("active");
                this.buttons["italicButton"].removeClass("active");
                this.buttons["underlinedButton"].removeClass("active");
                this.buttons["alignVerticalTopButton"].removeClass("active");
                this.buttons["alignVerticalCenterButton"].removeClass("active");
                this.buttons["alignVerticalBottomButton"].addClass("active");
                this.buttons["formatAlignLeftButton"].removeClass("active");
                this.buttons["formatAlignCenterButton"].removeClass("active");
                this.buttons["formatAlignRightButton"].removeClass("active");
            };
            
            if (!isInit(appState.table.cellContents[columnNumber]) || !isInit(appState.table.cellContents[columnNumber][rowNumber])) {
                resetCellStyleButtons();
                return;
            }

            const cellContent: TableCell = appState.table.cellContents[columnNumber][rowNumber];
            if (!isInit(cellContent.tableCellStyle)) {
                resetCellStyleButtons();
                return;
            }
                

            if (cellContent.tableCellStyle.bold === true)
                this.buttons["boldButton"].addClass("active");
            else
                this.buttons["boldButton"].removeClass("active");
            
            if (cellContent.tableCellStyle.italic === true)
                this.buttons["italicButton"].addClass("active");
            else
                this.buttons["italicButton"].removeClass("active");
            
            if (cellContent.tableCellStyle.underlined === true)
                this.buttons["underlinedButton"].addClass("active");
            else
                this.buttons["underlinedButton"].removeClass("active");
            
            
            
            // if (isInit(appState.table.cellContents[columnNumber]) && ) {
            //     let cellContent: TableCell = appState.table.cellContents[columnNumber][rowNumber];
            //     if (!isInit(cellContent) || !isInit(cellContent.tableCellStyle)) {
            //         this.buttons["boldButton"].removeClass("active");
            //         //
            //         //
            //         //
            //         return;
            //     }
            //    
            //     this.currentTableCellStyle = cellContent.tableCellStyle;
            //    
            //     if (isInit(cellContent.tableCellStyle.bold) && cellContent.tableCellStyle.bold === true) {
            //         this.buttons["boldButton"].addClass("active");
            //     } else {
            //         this.buttons["boldButton"].removeClass("active");
            //     }
            //    
            // } else {
            //     this.buttons["boldButton"].removeClass("active");
            //     this.buttons["italicButton"].removeClass("active");
            //     this.buttons["underlinedButton"].removeClass("active");
            //     //
            //     //
            //     //
            // }
        });
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
        this.observable.notify(EventNames.CutButtonClicked);
    }

    private copyButtonClick(): void{
        this.observable.notify(EventNames.CopyButtonClicked);
    }

    private pasteButtonClick(): void {
        this.observable.notify(EventNames.PasteButtonClicked);
    }

    private formatBoldButtonClick(): void {
        this.buttons["boldButton"].toggleClass("active");
        this.observable.notify(EventNames.FormatBoldButtonClicked);
    }

    private formatItalicButtonClick(): void {
        this.buttons["italicButton"].toggleClass("active");
        this.observable.notify(EventNames.FormatItalicButtonClicked);
    }

    private formatUnderlinedButtonClick(): void {
        this.buttons["underlinedButton"].toggleClass("active");
        this.observable.notify(EventNames.FormatUnderlinedButtonClicked);
    }

    private alignVerticalTopButtonClick(): void {
        this.observable.notify(EventNames.AlignVerticalTopButtonClicked);
        // cellElem.classList.remove("align-vertical-center align-vertical-bottom");
        // cellElem.classList.add("align-vertical-top");
    }

    private alignVerticalCenterButtonClick(): void {
        this.observable.notify(EventNames.AlignVerticalCenterButtonClicked);
        // cellElem.classList.remove("align-vertical-top align-vertical-bottom");
        // cellElem.classList.add("align-vertical-center");
    }

    private alignVerticalBottomButtonClick(): void {
        this.observable.notify(EventNames.AlignVerticalBottomButtonClicked);
        // cellElem.classList.remove("align-vertical-top align-vertical-center");
        // cellElem.classList.add("align-vertical-bottom");
    }

    private formatAlignLeftButtonClick(): void {
        this.observable.notify(EventNames.FormatAlignLeftButtonClicked);
    }

    private formatAlignCenterButtonClick(): void {
        this.observable.notify(EventNames.FormatAlignCenterButtonClicked);
    }

    private formatAlignRightButtonClick(): void {
        this.observable.notify(EventNames.FormatAlignRightButtonClicked);
    }
}
