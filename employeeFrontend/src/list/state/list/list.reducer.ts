import { createReducer,on } from "@ngrx/store";
import { ListItem } from "src/list/models/ListItem";
import { addItem, loadList, loadListFailure, loadListSuccess, removeItem } from "./list.actions";

export interface ListState {
    list: ListItem[];
    error:string;
    status:'pending' | 'loading' | 'error' | 'success';
}

export const initialState: ListState = {
    list: [],
    error:null,
    status:'pending'
};

export const listReducer = createReducer(
    initialState,
    on(addItem, (state, {content_name, content_quantity}) => ({
        ...state,
        list:[...state.list,{name:content_name,quantity:content_quantity}],
    })),
    on(removeItem, (state, {content}) => ({
        ...state,
        list:state.list.filter( item => item.name !== content)
    })),
    on(loadList, (state) => ({ ...state, status: 'loading' })),
  // Handle successfully loaded todos
  on(loadListSuccess, (state, { todos }) => ({
    ...state,
    todos: todos,
    error: null,
    status: 'success',
  })),
  // Handle todos load failure
  on(loadListFailure, (state, { error }) => ({
    ...state,
    error: error,
    status: 'error',
  }))

);