import {Spreadsheet} from "@/components/spreadsheet/spreadsheet";
import {Header} from "@/components/header/header";
import {Toolbar} from "@/components/toolbar/toolbar";
import {Formula} from "@/components/formula/formula";
import {Table} from "@/components/table/table";
import {createStore} from "redux";
import {rootReducer} from "@/redux/rootReducer";
import "./scss/index.scss";

const getApplicationState = () => {
    const state = localStorage.getItem("appState");
    if (state)
        return JSON.parse(state);

    return {
        table: {
            columnWidths: {},
            rowHeights: {}
        }
    };
};

const store = createStore(rootReducer, getApplicationState());

store.subscribe(() => {
    const appState = store.getState();
    localStorage.setItem("appState", JSON.stringify(appState));
});

const spreadsheet = new Spreadsheet("#app", {
    components: [Header, Toolbar, Formula, Table],
    store
});

spreadsheet.render();
