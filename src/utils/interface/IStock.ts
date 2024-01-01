import type { IArticle } from "./IArticle"

export interface IStockRequest{
    article_fk     : number
    quantiteEntree : number
    contenant      : string
}

export interface IStock{
    id             : number
    article        : IArticle
    quantiteEntree : number
    quantiteSortie : number
    contenant      : string
    dateCreated    : string 
    created_at     : string
    updated_at     : string
}
