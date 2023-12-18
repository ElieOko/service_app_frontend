import type { INiveauAction } from "./INiveauAction"

export interface ITrace{
    id          : number
    user_fk     : number
    action      : string
    niveau      : INiveauAction
    dateCreated : string
}