import type { IStock } from "./IStock"

export interface IHistoriqueStockSortie{
    id           : number
    stocks       : IStock
    quantite     : number
    prixUnitaire : number
    prixTotal    : number
    created_at  : string
}

export interface IHistoriqueStockSortieRequest{
    stock_fk     : number
    quantite     : number
    code_fk      : number
}