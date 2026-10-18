[ 🌐 عربي ](README.ar.md) | [ 🇩🇪 Deutsch ](README.de.md) | [ 🇫🇷 Français ](README.fr.md) | [ 🇳🇱 Nederlands ](README.nl.md) | [ 🇪🇸 Español ](README.sp.md) | [ 🇬🇧 English ](README.md)

# Transformez des opérations logistiques fragmentées en une vue de profit unique

![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)
![Platform](https://img.shields.io/badge/Platform-Browser%20%2B%20Excel-green.svg)
![Tool](https://img.shields.io/badge/Type-Decision%20Support-orange.svg)

**Suivez le dédouanement, l'exécution de la flotte et la rentabilité des conteneurs dans un espace de travail léger—gratuit, sans installation, au format navigateur ou tableur.**

**Pas d'inscription. Pas d'installation. Gratuit dans votre navigateur.**

Essayez la version navigateur gratuitement. Si vous avez besoin de la version Excel, vous pouvez l'acheter avec une garantie de remboursement de 30 jours sans questions.
>
> 🌐 Ouvrir dans le navigateur → [*ici*](https://hyvoid.github.io/cross-entity-logistics-console/)  
> 📥 Télécharger Excel → *bientôt disponible*

---

## Ce qu'il vous aide à suivre

- Le profit total généré par le dédouanement et les opérations de flotte depuis une vue unique.
- Les conteneurs libérés par la douane mais encore en attente d'expédition.
- La rentabilité de chaque conteneur plutôt que des résultats départementaux déconnectés.
- Les classements de contribution des clients basés sur le profit réel de bout en bout.
- Les tendances de rentabilité des véhicules sur plusieurs affectations de transport.
- Les expéditions déficitaires avant qu'elles ne disparaissent dans les chiffres agrégés.

---

## Pourquoi je l'ai construit

Beaucoup d'entreprises logistiques opèrent selon deux réalités séparées.

L'équipe douanière suit les déclarations, les libérations et les revenus d'agence.

L'équipe de transport suit les expéditions, les chauffeurs et les frais de livraison.

La direction reçoit des rapports séparés de chaque côté et suppose que l'activité globale est saine.

Le problème est que la rentabilité n'existe pas au sein des départements. Elle existe au niveau du conteneur.

Un conteneur qui génère d'excellentes marges douanières peut ensuite absorber des frais de carburant inattendus, des indemnités de chauffeur et des retards de livraison qui éliminent entièrement le profit. Inversement, un travail douanier apparemment médiocre peut devenir hautement rentable après une exécution de transport efficace.

J'ai construit cela parce que l'échec analytique était récurrent :

- Les équipes optimisaient leurs propres indicateurs.
- Les dirigeants prenaient des décisions avec des chiffres incomplets.
- Les pertes restaient invisibles jusqu'au rapprochement de fin de mois.

Avant :

> "L'activité de dédouanement a gagné de l'argent."
>
> "L'activité de flotte s'est plutôt bien comportée."

Après :

> "Le conteneur MSKU1234567 a généré 30 000 KES lors du dédouanement mais a perdu 25 000 KES lors du transport, ne laissant qu'une contribution nette de 5 000 KES."

Cette perspective change les décisions.

Plutôt que de construire un autre remplacement d'ERP, ce classeur produit un cadre de raisonnement :

**Suivez le conteneur. Consolidez l'économie. Révélez les exceptions assez tôt pour agir.**

---

## Problèmes logistiques courants résolus

| Problème | Sans cet outil | Avec cet outil |
|---|---|---|
| Douane et transport opèrent séparément | Les départements rapportent indépendamment | Une vue de profit au niveau du conteneur |
| Les conteneurs libérés restent inactifs | Les retards d'expédition restent cachés | Les exceptions "libéré-mais-non-expédié" apparaissent immédiatement |
| La rentabilité de la flotte est floue | Les coûts des véhicules se confondent | La contribution du véhicule devient mesurable |
| La rentabilité du client est déformée | Les classements de revenus ignorent les coûts d'exécution | Les classements des clients reflètent le profit réel |
| Les expéditions déficitaires passent inaperçues | Les problèmes émergent lors des revues de fin de mois | Les pertes déclenchent des alertes opérationnelles |
| La qualité des données se dégrade | Différentes conventions de nommage apparaissent | La validation contrôlée impose la cohérence |

---

## À qui cela s'adresse

Cet outil est conçu pour :

- Les agences de dédouanement exploitant leurs propres flottes de transport.
- Les transitaires gérant l'exécution de bout en bout des conteneurs.
- Les petites et moyennes entreprises logistiques ayant besoin de visibilité opérationnelle sans la complexité d'un ERP.
- Les propriétaires et responsables d'exploitation qui réconcilient actuellement les informations manuellement.

Ce n'est **pas** conçu pour les implémentations ERP multinationales nécessitant des flux de travail d'approvisionnement, des modules comptables et des intégrations d'entreprise.

Aucune expertise en tableur n'est nécessaire. Ouvrez la version navigateur et commencez à suivre immédiatement, ou utilisez le classeur Excel hors ligne.

---

## À propos

Je construis des trackers légers et des outils d'aide à la décision pour des situations avec trop de pièces mobiles à garder en tête.

La question centrale est toujours la même :

> Quelles informations doivent exister en un seul endroit pour prendre la prochaine décision avec confiance ?

Ce tableau de bord de contrôle logistique est un exemple de cette approche : transformer des enregistrements opérationnels épars en systèmes de raisonnement réutilisables plutôt que de créer une autre plateforme à maintenir.

---

## Détails techniques

<details>
<summary>Pour les réviseurs techniques, les praticiens d'Excel et les collaborateurs</summary>

---

### Architecture du classeur

| Couche | Feuille | Rôle |
|---|---|---|
| Sortie décisionnelle | 00_Dashboard | Reporting KPI et alertes pour le DG |
| Données de référence | 01_Master_Data | Clients, véhicules, chauffeurs, dictionnaires de statut |
| Entrée opérationnelle | 02_Clearing_Agency | Flux douanier et enregistrement financier |
| Entrée opérationnelle | 03_Fleet_Operations | Expédition et exécution du transport |
| Moteur de calcul | 04_Consolidation_Engine | Consolidation au niveau du conteneur |
| Gouvernance | 05_User_Guide | Normes et conseils de maintenance |

#### Flux de données

```text
Master Data
     ↓
Clearing Agency ──┐
                  │
Fleet Operations ├──→ Consolidation Engine
                  │
                  ↓
             Dashboard
```

#### Logique de clé primaire

```text
Container Number

Clearing Agency:
Primary Key (PK)

Fleet Operations:
Foreign Key (FK)

Consolidation:
Aggregation Dimension
```

---

### Trois pièges qui piègent même les opérateurs logistiques expérimentés

#### Piège 1 : profit de département ≠ profit d'expédition

Une décision a été prise.

> "L'activité de dédouanement est rentable."

Le défaut passé inaperçu :

Les coûts de transport ont été exclus.

| Vue erronée | Vue correcte |
|---|---|
| Profit douanier uniquement | Profit du conteneur de bout en bout |
| Reporting départemental | Économie de l'expédition |
| Fausse confiance | Contribution exacte |

Résultat corrigé :

La direction intervient sur des expéditions déficitaires spécifiques plutôt que de blâmer des départements entiers.

<details>
<summary>Formules</summary>

```excel
Clearance Profit
= Agency Revenue - Agency Cost

Fleet Profit
= Freight Revenue - Fuel Cost - Trip Expense

Total Profit
= Clearance Profit + Fleet Profit
```

</details>

---

#### Piège 2 : libéré ne signifie pas livré

Une décision a été prise.

> "Les opérations se déroulent normalement."

Le défaut passé inaperçu :

Les conteneurs libérés sont restés non expédiés.

| Vue erronée | Vue correcte |
|---|---|
| Libéré par la douane | Achevé opérationnellement |
| Statut supposé | Statut vérifié |
| Retard caché | Retard escaladé |

Résultat corrigé :

Les responsables se concentrent immédiatement sur les goulots d'étranglement de l'expédition.

<details>
<summary>Formules</summary>

```excel
=IF(
 Clearance<>"Released",
 "Clearing",
 IF(Delivery="未派车","Awaiting Dispatch",Delivery)
)
```

</details>

---

#### Piège 3 : les clients à haut chiffre d'affaires peuvent détruire la marge

Une décision a été prise.

> "Les plus grands clients méritent la priorité."

Le défaut passé inaperçu :

Les classements de revenus ignoraient les coûts d'exécution.

| Vue erronée | Vue correcte |
|---|---|
| Classement de revenus | Classement de profit |
| Focus sur le volume | Focus sur la contribution |
| Effort mal alloué | Optimisation des ressources |

Résultat corrigé :

L'attention commerciale se déplace vers les relations rentables.

<details>
<summary>Formules</summary>

```excel
=QUERY(
 Consolidation!A:H,
 "SELECT B,SUM(H)
 GROUP BY B
 ORDER BY SUM(H) DESC"
)
```

</details>

---

### Scénario d'exemple

Un conteneur arrive à Mombasa.

#### Entrées

```text
Container:
MSKU1234567

Agency Revenue:
KES 120,000

Agency Cost:
KES 90,000

Freight Revenue:
KES 60,000

Fuel:
KES 20,000

Trip Expenses:
KES 5,000
```

#### Calculs intermédiaires

```text
Clearance Profit
= 120,000 − 90,000
= KES 30,000

Fleet Profit
= 60,000 − 20,000 − 5,000
= KES 35,000

Total Profit
= 30,000 + 35,000
= KES 65,000
```

#### Interprétation

L'expédition a généré des profits sains sur les deux entités.

Si les frais de transport avaient atteint 55 000 KES au lieu de cela, la même expédition n'aurait contribué que 15 000 KES au total.

#### Recommandation

Surveillez en continu la rentabilité des conteneurs plutôt que de vous fier aux résumés de fin de mois.

#### Implication décisionnelle

L'efficacité de l'expédition influence directement la rentabilité commerciale.

---

### Référence des formules

<details>
<summary>Moteur de consolidation</summary>

```excel
Unique Containers
=UNIQUE(Clearing!A2:A)

Client Lookup
=XLOOKUP(...)

Fleet Profit
=SUMIFS(...)
 -SUMIFS(...)
 -SUMIFS(...)
```

</details>

<details>
<summary>KPI du tableau de bord</summary>

```excel
Total Profit
=SUM(H:H)

Average Profit
=AVERAGE(H:H)

Clearance Total
=SUM(F:F)

Fleet Total
=SUM(G:G)
```

</details>

<details>
<summary>Logique de statut</summary>

```excel
Overall Status
=IF(...)
```

</details>

---

### Règles de validation

| Champ | Règle | Comportement en cas d'erreur |
|---|---|---|
| Numéro de conteneur | 4 lettres + 7 chiffres | Rejeter l'entrée invalide |
| Client | Doit exister dans la liste de référence | Empêcher la soumission |
| Plaque du véhicule | Doit exister dans la liste de référence | Rejeter les valeurs personnalisées |
| Chauffeur | Doit exister dans la liste de référence | Rejeter les valeurs personnalisées |
| Statut KRA | Liste contrôlée | Restreindre la saisie |
| Statut KEBS | Liste contrôlée | Restreindre la saisie |
| Statut de dédouanement | Liste contrôlée | Restreindre la saisie |
| Statut de livraison | Liste contrôlée | Restreindre la saisie |
| Colonnes de formules | Plages protégées | Lecture seule |
| Tableau de bord | Feuille entière protégée | Lecture seule |

</details>

---

## Autres outils de cette série

- Financial Dual-Track Budget Control Dashboard — planification de trésorerie personnelle et professionnelle.
- Lawn Care Operations Console — coordination des équipes de terrain et rentabilité des services.
- CRM Decision Support Trackers — gestion client opérationnelle sans complexité ERP.

Profil GitHub : *Ajoutez le lien du profil ici*

---

## Licence

Ce projet est sous licence **Apache License 2.0**.

Vous pouvez utiliser, modifier et distribuer cette œuvre conformément aux termes de la Apache License 2.0.
