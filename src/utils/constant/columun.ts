export const columnsStock = [
    { field: 'id',title:"N",editable: false},
    { field:'article.nom',title:"Nom Article",filter:'text',editable: false},
    { field:"article.prixUnitaire",title:"Prix Unitaire",filter: "numeric",editor:false},                  
    { field:"quantiteEntree", title : "Quantité Entrée", editable: false,filter:'text',editor: false}, 
    // { field:"type", title : "Recipient", editable: false,filter:'text',editor: false},
    { field:"quantiteSortie",title:"Quantité Sortie",editable: false},
    // { field:"dateEntree", title:"Date des Entrées récents",filter: "date",editable: false},
    // { field:"dateSortie", title:"Date de Sortie récents",filter: "date",editable: false}
];
export const columnsStockEntree = [
    { field: 'id',title:"N",editable: false},
    { field:'article.nom',title:"Nom Article",filter:'text',editable: false},
    { field:'quantite',title:"Quantité Entrée",filter:'number',editable: false},
    // { field:'type',title:"Recipient",filter:'number',editable: false},
    { field:'created_at',title:"Date des Entrées",filter:'date',editable: false},
];

export const columnsArticle = [
    { field: 'id',title:"N",editable: false},
    { field:'nom',title:"Nom Article",filter:'text',editable: false},
    { field:'prixUnitaire',title:"Prix Unitaire",filter:'number',editable: false},
    { field:'devise.code',title:"Devise",filter:'number',editable: false},
    { field:'created_at',title:"Date création article",filter:'date',editable: false},
];
export const columnsStockSortie = [
    { field: 'id',title:"N",editable: false},
    { field:'stock.article.nom',title:"Nom Article",filter:'text',editable: false},
    { field:'quantite',title:"Quantité Sortie",filter:'number',editable: false},
    { field:'type',title:"Recipient",filter:'text',editable: false},
    { field:'prixUnitaire',title:"Prix Unitaire",filter:'number',editable: false},
    { field:'devise',title:"Devise",filter:'text',editable: false},
    { field:'prixTotal',title:"Prix de Vente total",filter:'number',editable: false},
    { field:'dateSortie',title:"Date des Sorties",filter:'date',editable: false},
];


export const columnsFacturation = [
    { field: 'id',title:"N",editable: false},
    { field:'code',title:"Nom Article",filter:'text',editable: false},
    { field:'article.nom',title:"Devise",filter:'number',editable: false},
    { field:'quantite',title:"Quantité",filter:'number',editable: false},
    { field:'article.prixUnitaire',title:"Prix Unitaire",filter:'number',editable: false},
    { field:'prixTotal',title:"Prix Total",filter:'number',editable: false},
    { field:'dateCreation',title:"Date de création",filter:'date',editable: false},
];

// id          : number
// code        : string
// quantite    : number
// article  : number
// prixTotal   : number
// dateCreated : string