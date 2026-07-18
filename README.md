# Service App V2 — Boutique & Chambre froide

Application Vue 3 permettant de choisir entre :

- **Boutique** : module existant (facturation, stocks, dettes, marketeurs, versements)
- **Chambre froide** : nouveau module V2 de gestion complète

## Démarrage

```sh
npm install
npm run dev
```

Au lancement, l’écran de sélection propose Boutique ou Chambre froide.

## Chambre froide — multi-organisations

Chaque organisation a un **code d’accès** et ses propres données isolées
(stocks, factures, utilisateurs, fournisseurs, rapports).

### Créer une organisation

Depuis Chambre froide → **Créer une nouvelle organisation** (`/cf/register-org`).

### Organisations démo

Code org `DEMO` — **mot de passe = identifiant** :

| Identifiant   | Rôle           |
|---------------|----------------|
| `caissier`    | Caissier       |
| `superviseur` | Superviseur    |
| `directeur`   | Directeur      |
| `facturier`   | Facturier      |
| `admin`       | Administrateur |

Autre org : `FROIDPLUS` / `admin` / `admin`

Produits démo : vivres frais RDC (cuisse de poulet, poisson capitaine, tilapia, viande de bœuf, etc.)  
Fournisseurs : Aviculture Kongo Frais, Pêcherie Fleuve Congo, Boucherie Mama Nzuzi, Frigo Gombe SARL, Fermes Bateke.

## Fonctionnalités chambre froide

1. Processus de vente facturier → facture → caisse → reçu → stock
2. Gestion automatique des stocks (entrées, sorties, valeur)
3. Approvisionnement, corrections, pertes, périmés (historisés)
4. Gestion des prix (Admin / Directeur) avec historique
5. Tableau de bord temps réel
6. Rapports journalier / hebdo / mensuel / annuel (PDF & Excel)
7. Recherche globale
8. Sécurité par rôles + journal d’activité
9. Notifications (rupture, stock faible, annulation, accès refusé)
10. Sauvegardes auto / manuelles et restauration
11. Synchronisation multi-onglets (BroadcastChannel + localStorage)
12. Impression factures, reçus, rapports, états de stock

Les données du module chambre froide sont persistées localement (démo autonome). Le module boutique continue d’utiliser l’API existante.
