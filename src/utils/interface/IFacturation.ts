import type { ICodeFacture } from "./ICodeFacture"
import type { IStock } from "./IStock"
import type { ITypeVente } from "./ITypeVente"

export interface IFacturation{
    id           : number
    codes        : ICodeFacture
    quantite     : number
    stocks       : IStock
    prixTotal    : number
    dateCreated  : string
    type_vente   : ITypeVente
}
export interface IFacturationRequest{
    stock_fk      : number
    quantite      : number
    code_fk       : number
    type_vente_fk : number
}