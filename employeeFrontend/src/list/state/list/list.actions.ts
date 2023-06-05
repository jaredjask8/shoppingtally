import {createAction, props} from '@ngrx/store';
import { ListItem } from 'src/list/models/ListItem';

export const addItem = createAction(
    'Add',
    props<{content_name:string, content_quantity:string}>()
);

export const removeItem = createAction(
    'Remove',
    props<{content:string}>()
);

export const loadList = createAction('[Todo Page] Load Todos');

export const loadListSuccess = createAction(
  '[Todo API] Todo Load Success',
  props<{ todos: ListItem[] }>()
);

export const loadListFailure = createAction(
  '[Todo API] Todo Load Failure',
  props<{ error: string }>()
);