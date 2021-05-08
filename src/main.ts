import {Spreadsheet} from "./core/spreadsheet";
import {Header} from "./components/header/header";
import {Toolbar} from "./components/toolbar/toolbar";
import {Formula} from "./components/formula/formula";
import {Table} from "./components/table/table";
import {createStore, Store} from "redux";
import {rootReducer} from "./redux/rootReducer";
import "./scss/index.scss";
import {ApplicationState} from "./core/applicationState";

const getApplicationState = (): ApplicationState => {
    const stateRaw = localStorage.getItem("appState");
    if (stateRaw)
        return JSON.parse(stateRaw) as ApplicationState;
    
    return {
        header: {},
        toolbar: {},
        table: {
            columnWidths: {},
            rowHeights: {},
            cellContents: {}
        }
    };
};

const store: Store<any, { type: string; data: any }> = createStore(rootReducer, getApplicationState());

store.subscribe(() => {
    const appState: ApplicationState = store.getState();
    localStorage.setItem("appState", JSON.stringify(appState));
});

new Spreadsheet("#app", {
    components: [Header, Toolbar, Formula, Table],
    store
}).render();
