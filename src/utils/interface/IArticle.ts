import type { IDevise } from "./IDevise"

export interface IArticle{
    id?              : number
    nom              : string
    prixUnitaire     : number
    price_big?       : number
    devise           : IDevise
    type_article_fk? : number
    price_usd_short? : number
    price_usd_big?   : number
    created_at       : string

}

export interface IArticleRequest{
    nom             : string
    prixUnitaire    : number | any
    price_big       : number | any
    devise_fk       : number | any
    type_article_fk : number | any
}

export interface IArticlePatch{
    nom?             : string
    price_usd_short?    : number | any
    price_usd_big?       : number | any
}