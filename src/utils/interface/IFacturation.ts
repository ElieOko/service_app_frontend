import type { ICodeFacture } from "./ICodeFacture"
import type { IStock } from "./IStock"
import type { ITypeVente } from "./ITypeVente"

export interface IFacturation{
    id              : number
    codes           : ICodeFacture
    quantite        : number
    stock           : IStock
    prixTotal       : number
    dateCreated     : string
    type_vente_fk   : number
    type_vente      : ITypeVente
    created_at      : string
    amount          : number
    client          : string
}
export interface IFacturationRequest{
    stock_fk        : number
    quantite        : number
    code_fk         : number
    type_vente_fk   : number
    client          : string
}