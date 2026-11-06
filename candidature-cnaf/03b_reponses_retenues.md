# Réponses retenues et choix par défaut

Mise à jour du 6 novembre 2026, après les réponses du candidat aux priorités 1 à 5. Pour les questions restées sans réponse, le candidat a demandé de retenir « les meilleures réponses afin de favoriser [son] employabilité ». Règle appliquée : choisir l'option qui sert le plus la candidature sans écrire aucun fait que le candidat ne pourrait pas défendre en entretien. Un fait non confirmé reste hors du CV.

## Réponses du candidat et effet sur le CV

| Priorité | Réponse du candidat | Effet sur le CV |
|---|---|---|
| 1. Python et SQL | « les techno qui suffisent, ce qui est demandé normalement sans me vendre comme un expert » | SQL (PostgreSQL/PostGIS), Python, Excel et Power BI sont listés sans adjectif de niveau. Databricks et Azure ne sont pas ajoutés : aucune pratique n'est confirmée. |
| 2. Réalisations | « oui goooo en préparer une » | Une fiche de réalisation et une requête d'entraînement sont préparées ci-dessous. Le CV décrit les réalisations existantes sans en ajouter. |
| 3. Power BI et Excel | « oui bien sûr que j'ai déjà réalisé » | « Power BI (création de rapports) » et « Excel (tableaux croisés dynamiques) » entrent dans les compétences. « Tableaux de bord » a été retiré après l'audit : seul un rapport est confirmé. Tableau est retiré : l'annonce ne le demande pas. |
| 4. Automatisations | « inscris le plus logique pour la plupart des postes de data analyst » | Les automatisations existantes sont reformulées dans le vocabulaire du métier : « Automatisation en Python (pipelines PDAL) du traitement des relevés mobiles ». Aucune automatisation nouvelle n'est inventée. |
| 5. Volumes | « au moins 100 ou 150 kilomètres par jour » | Première puce : « Contrôle qualité de 100 à 150 km de relevés LiDAR ferroviaires par jour ». C'est le seul chiffre du CV. |

## Choix par défaut pour les questions sans réponse

| Question | Choix retenu | Raison |
|---|---|---|
| Q13. Réduction de charge non mesurée | « réduisant la charge manuelle », formulation de votre ancien CV, sans chiffre | La première rédaction, « en remplacement d'étapes manuelles », a été jugée plus forte que la source lors de l'audit. |
| Q14. Indicateur communicable | Aucun indicateur ajouté | Rien n'est confirmé. |
| Q15 et Q16. Rôle dans Ariane | Rôle décrit dans votre brief et confirmé par les dépôts : conception, pilotage, règles métier, critères de validation, recette, mesure des écarts | Les dépôts vous désignent comme décideur et testeur ; le code y est signé surtout par les agents IA. |
| Q17. Employeur informé d'Ariane | Deux versions du CV : avec et sans Ariane. Aucune ne cite l'application, le client ou les données. | Vos dépôts contiennent des captures LiDAR exportées de l'application de validation, sur lesquelles les agents IA ont travaillé. Pour un pôle de maîtrise des risques, c'est la première question qui sera posée. Envoyez la version avec Ariane seulement si votre responsable connaît le projet et a accepté cet usage des données. |
| Q18. Nom et période | « Projet Ariane, initiative personnelle : prototype d'aide au contrôle qualité, codé en majorité par des agents IA », sans date propre, rattaché au poste actuel | « Ariane » est le nom que vous employez. « Prototype » reflète le statut expérimental documenté ; « codé en majorité par des agents IA » dit qui a écrit le code. |
| Q19. Commits à votre nom | Rien sur le CV | Le CV ne vous présente pas comme développeur. |
| Q20 et Q21. Métriques Ariane | Aucun chiffre Ariane sur le CV | Aucun chiffre n'est à la fois mesuré, publiable et attribuable à vous seul. Les dépôts excluent tout gain. Les récits restent pour l'oral. |
| Q22. Stage Région | « Analyse des îlots de chaleur », comme dans l'ancien CV ; « Builder » retiré ; destinataires non nommés | « Étude » a été écarté après l'audit car non étayé ; « Builder » est ambigu ; le destinataire n'est pas connu. |
| Q23. Tableaux de bord professionnels | Aucun, en dehors de la compétence Power BI confirmée | Rien n'est confirmé en contexte professionnel. |
| Q24. Enseignements de licence | Mention « analyse de données spatiales », tirée de votre brief | Aucun intitulé de cours n'est confirmé. |
| Q25. Interlocuteurs | Rien d'ajouté | Rien n'est confirmé. |
| Q26. Motivation et parcours 2019 à 2022 | Rien sur le CV, réponse à préparer pour l'oral | Voir le fichier 07, partie entretien. |
| Téléphone, e-mail, ville | Conservés ; téléphone au format national, département ajouté | Format attendu par un employeur français. |
| LinkedIn | Non ajouté | Aucune adresse connue. |
| Dates | « Depuis octobre 2025 », « Juin à août 2025 » | Aucun tiret d'aucune sorte, lecture naturelle. |
| Autres expériences | Seule la ligne Super U est conservée | Elle couvre 2020 à 2024 sans trou. Carrefour Location, qui chevauche le stage Médiations, et les emplois de 2018 et 2019 sont retirés. |
| Langues | Intégrées à la rubrique Compétences | Gain d'une ligne. |
| Titre | « Data Analyst \| Fiabilisation des données et reporting » | Deux mots exacts de l'annonce, chacun étayé. Voir le fichier 04. |

## Préparation demandée : une réalisation racontable

Canevas à compléter avec vos propres éléments. Chaque crochet doit être remplacé par un fait réel, ou supprimé.

- **Situation.** Les relevés LiDAR arrivent par [lot, fichier, tronçon] ; une partie du traitement se faisait à la main : [étape répétitive, par exemple découpage, filtrage, conversion, contrôle de complétude].
- **Tâche.** Rendre cette étape reproductible et éviter les oublis.
- **Action.** Écriture d'un pipeline PDAL piloté par Python : lecture de [format], [filtres appliqués], export vers [format ou base], contrôle final de [critère].
- **Résultat.** L'étape tourne [à quelle fréquence] sans intervention manuelle ; [ce qui a changé pour l'équipe]. Ne citez un gain de temps que si vous l'avez mesuré.

Phrase de transfert pour l'entretien : « Le même réflexe s'applique à un reporting : automatiser l'étape répétitive et contrôler le résultat avant de le diffuser. »

## Préparation demandée : une requête SQL d'entraînement

Ces requêtes sont des exercices sur des tables fictives. Elles ne décrivent pas votre travail chez Trealis. Elles servent à vous entraîner à expliquer une requête de contrôle, ligne par ligne.

Contrôle de cohérence entre deux environnements :

```sql
WITH prod AS (
  SELECT troncon_id, COUNT(*) AS nb_points
  FROM production.releves
  GROUP BY troncon_id
),
livr AS (
  SELECT troncon_id, COUNT(*) AS nb_points
  FROM livraison.releves
  GROUP BY troncon_id
)
SELECT p.troncon_id,
       p.nb_points AS nb_production,
       l.nb_points AS nb_livraison,
       CASE WHEN l.troncon_id IS NULL THEN 'absent en livraison'
            ELSE 'écart de volume' END AS anomalie
FROM prod p
LEFT JOIN livr l ON l.troncon_id = p.troncon_id
WHERE l.troncon_id IS NULL OR l.nb_points <> p.nb_points
ORDER BY p.troncon_id;
```

Transposition au contexte de l'annonce, la sécurisation du versement des aides aux partenaires :

```sql
SELECT v.dossier_id, v.partenaire_id, v.montant, v.date_versement
FROM versements v
LEFT JOIN conventions c
  ON c.dossier_id = v.dossier_id
 AND v.date_versement BETWEEN c.date_debut AND c.date_fin
WHERE c.dossier_id IS NULL
ORDER BY v.montant DESC;
```

La seconde requête liste les versements sans convention valide à leur date. C'est la forme la plus simple d'un contrôle de maîtrise des risques sur un processus de financement.

## Ajouts possibles, à condition qu'ils deviennent vrais

- **Databricks.** L'annonce le cite pour Python et SQL. Deux à trois heures sur l'édition gratuite de Databricks suffisent pour exécuter des requêtes SQL et un notebook Python. Ensuite seulement, ajoutez « Databricks (prise en main en autoformation) » à la ligne Données.
- **Enseignements de licence.** Si votre relevé de notes comporte des cours de statistiques ou de bases de données, ajoutez leurs intitulés exacts sous la formation.
- **LinkedIn.** Ajoutez l'adresse si le profil existe et reprend les mêmes intitulés et les mêmes dates.
