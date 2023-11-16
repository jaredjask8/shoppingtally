import { ListItemInterface } from "./ListItemInterface";

export interface CompleteItemResponse{
    list:ListItemInterface[],
    completed:ListItemInterface[]
}