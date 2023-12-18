import type { IStock } from "./IStock"

export interface IHistoriqueStockEntree{
    id          : number
    stocks      : IStock
    quantite    : number
    created_at  : string
}