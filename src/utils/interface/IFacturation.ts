import type { ICodeFacture } from "./ICodeFacture"
import type { IStock } from "./IStock"

export interface IFacturation{
    id           : number
    codes        : ICodeFacture
    quantite     : number
    stocks       : IStock
    prixTotal    : number
    dateCreated  : string
}
export interface IFacturationRequest{
    stock_fk     : number
    quantite     : number
    code_fk      : number
}