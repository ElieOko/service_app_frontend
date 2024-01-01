import type { ICodeFacture } from "./ICodeFacture";
import type { IMarketeur } from "./IMarketeur";
import type { IStock } from "./IStock";
import type { ITypeVente } from "./ITypeVente";

export interface IDette{
    id                  : number;
    code_fk             : number;
    stock_fk            : number;
    marketeur_fk        : number;
    type_vente_fk       : number;
    quantite_emprunter  : number;
    quantite_restante   : number;
    quantite_vendu      : number;
    montant_final       : number;
    montant_restant     : number;
    montant_payer       : number;
    status_fk           : number;
    note                : string;
    observation         : string;
    date_creation       : string;
    code                : ICodeFacture;
    type_ventes         : ITypeVente;
    marketeurs          : IMarketeur;
    stocks              : IStock 
}

export interface IDetteRequest{
    id                  : number;
    code_fk             : number;
    stock_fk            : number;
    marketeur_fk        : number;
    type_vente_fk       : number;
    quantite_emprunter  : number;
    note ?              : string;
    observation?        : string;
}