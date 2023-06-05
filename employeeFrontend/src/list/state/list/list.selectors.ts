import { createSelector } from "@ngrx/store";
import { AppState } from "src/global/state/app.state";
import { ListState } from "./list.reducer";

export const selectList = (state:AppState) => state.list;
export const selectFullList = createSelector(
    selectList,
    (state:ListState) => state.list
);