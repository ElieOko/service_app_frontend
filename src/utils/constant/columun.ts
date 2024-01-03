export const columnsStock = [
    { field: 'id',title:"N",editable: false},
    { field:'article.nom',title:"Nom Article",filter:'text',editable: false},                 
    { field:"quantiteEntree", title : "Quantité Entrée", editable: false,filter:'text',editor: false}, 
    { field:"contenant", title : "Recipient", editable: false,filter:'text',editor: false},
    { field:"quantiteSortie",title:"Quantité Sortie",editable: false},
    { field:"date_creation", title:"Date des Entrées récents",filter: "date",editable: false},
    // { field:"dateSortie", title:"Date de Sortie récents",filter: "date",editable: false}
];
export const columnsStockEntree = [
    { field: 'id',title:"N",editable: false,width: '90px',resizable: false},
    { field:'article.nom',title:"Nom Article",filter:'text',editable: false},
    { field:'quantite',title:"Quantité Entrée",filter:'number',editable: false},
    // { field:'type',title:"Recipient",filter:'number',editable: false},
    { field:'created_at',title:"Date des Entrées",filter:'date',editable: false},
];

export const columnsArticle = [
    { field: 'id',title:"N",editable: false,width: '140px',resizable: false},
    {
       title: 'Informatiom Marchandise',
       children:[
        { field:'nom',title:"Nom Article",filter:'text',editor: "text",width: '140px',resizable: false},
        {field:"type_article.nom",title:"Type Article",filter:'text',editable: false,width: '145px',resizable: false},
       ]
    },
    {
       title:'Prix de Vente',
       children: [
        { field:'prixUnitaire',title:"Prix de Vente D(fc)",filter:'number',editable: true,width: '155px',resizable: false},
        { field:'price_usd_short',title:"Prix de Vente D($)",filter:'number',editable: true,editor: "text",width: '150px',resizable: false},
        { field:'price_big',title:"Prix de Vente G(fc)",filter:'number',editable: true,width: '150px',resizable: false},
        { field:'price_usd_big',title:"Prix de Vente G($)",filter:'number',editable: true,editor: "text",width: '150px',resizable: false},
       ]
    },
];
/**
 * 
 * 


id                  : number;
    code_fk             : number;
    stock_fk            : number;
    marketeur_fk        : number;
    type_vente_fk       : number;
    status_fk           : number;
    note                : string;
    observation         : string;
    date_creation       : string;
    code                : ICodeFacture;
    type_ventes         : ITypeVente;
 */
export const columnsDette = [
    { field: 'id',title:"N",editable: false,width: '90px',resizable: false},
    { field:'marketeur.nom',title:"Marketeur",filter:'text',editor: "text",resizable: false,width: '120px',},
    { field:'stock.article.nom',title:"Marchandise",filter:'number',editable: false,width: '120px',resizable: false},
    {title:'Quantité',
    children: [
        { field:'quantite_emprunter',title:"Quantité Empruntée",filter:'number',editable: false,width: '158px',resizable: false},
        { field:'quantite_restante',title:"Quantité Restante",filter:'number',editable: true,editor: "text",width: '145px',resizable: false},
        { field:'quantite_vendu',title:"Quantité Vendu",filter:'number',editable: false,width: '130px',resizable: false}
    ]
    },
    {title:"Versenent Montant",
    children: [
        {field:"montant_final",title:"Montant à payer",filter:'number',editable: false,width: '158px',resizable: false},
        {field:"montant_restant",title:"Montant restant",filter:'number',editable: false,width: '158px',resizable: false},
        {field:"montant_payer",title:"Montant versé",filter:'number',editable: false,width: '158px',resizable: false},
    ]
    },
    {title:"Autres",
    children: [
    {field:"type_ventes.nom",title:"Type de vente",filter:'text',editable: true,editor: "text",width: '120px',resizable: false},
    { field:'status',title:"Status",filter:'text',editable: true,editor: "text",width: '100px',resizable: false},
    { field:'note',title:"Note",filter:'text',editable: true,editor: "text",width: '190px',resizable: false},
    { field:'observation',title:"Observation",filter:'text',editable: true,editor: "text",width: '190px',resizable: false},
    { field:'date_creation',title:"Date Création",filter:'text',editable: true,editor: "text",width: '190px',resizable: false}
    ]},
];// 

export const columnsStockSortie = [
    { field: 'id',title:"N",editable: false},
    { field:'stock.article.nom',title:"Nom Article",filter:'text',editable: false},
    { field:'quantite',title:"Quantité Sortie",filter:'number',editable: false},
    { field:'prixUnitaire',title:"Prix Unitaire",filter:'number',editable: false},
    { field:'prixTotal',title:"Prix de Vente total",filter:'number',editable: false}
];

export const columnsFacturation = [
    { field: 'id',title:"N",editable: false},
    { field:'code.nom',title:"Code Facturation",filter:'text',editable: false},
    { field:'stock.article.nom',title:"Marchandise",filter:'number',editable: false},
    { field:'quantite',title:"Quantité",filter:'number',editable: false},
    { field:'stock.article.prixUnitaire',title:"Prix Unitaire",filter:'number',editable: false},
    { field:'prixTotal',title:"Prix Total",filter:'number',editable: false},
    { field:'created_at',title:"Date de création",filter:'date',editable: false},
];

export const columnsMarketeur = [
    { field: 'id',title:"N",editable: false},
    { field:'nom',title:"Nom Complet Marketeur",filter:'text',editable: false},
    { field:'action',title:"Action",filter:'text',editable: false},
];


// id          : number
// code        : string
// quantite    : number
// article  : number
// prixTotal   : number
// dateCreated : string