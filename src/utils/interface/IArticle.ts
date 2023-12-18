import type { IDevise } from "./IDevise"

export interface IArticle{
    id?             : number
    nom             : string
    prixUnitaire    : number
    devise          : IDevise
    created_at      : string
}

export interface IArticleRequest{
    nom             : string
    prixUnitaire    : number | any
    devise_fk       : number | any
}