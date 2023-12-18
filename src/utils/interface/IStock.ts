import type { IArticle } from "./IArticle"

export interface IStockRequest{
    article_fk     : number
    quantiteEntree : number
}

export interface IStock{
    id             : number
    article        : IArticle
    quantiteEntree : number
    quantiteSortie : number
    dateCreated    : string 
    created_at     : string
    updated_at     : string 
}
