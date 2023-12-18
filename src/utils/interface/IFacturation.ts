export interface IFacturation{
    id          : number
    code        : string
    quantite    : number
    stock_fk    : number
    prixTotal   : number
    dateCreated : string
}
export interface IFacturationRequest{
    stock_fk     : number
    quantite     : number
    code_fk      : number
}