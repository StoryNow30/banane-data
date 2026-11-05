# Questions de clarification au candidat : candidature CNAF NVHADD130588

Objet : obtenir, avant le 12/11/2026 (« Date limite de candidature 12/11/2026 »), les faits qui conditionnent la réécriture du CV. Chaque question indique pourquoi la réponse change le CV et donne un aide-mémoire concret pour retrouver des exemples. Les chiffres et documents cités comme « à confirmer ou infirmer » viennent des dépôts /home/user/banane et /home/user/banane-data ; ils ne seront repris sur le CV qu'après confirmation, sous forme générique, sans identifiant client. Les apostrophes typographiques du CV sont rendues par l'apostrophe droite dans les citations. Les questions dont la réponse figure déjà clairement dans le CV ont été exclues (employeurs, dates, intitulés, outils cités). Il est possible de répondre en vrac ; un format est suggéré en fin de document.

Ordre d'urgence si le temps manque : priorités 1, 2, 3 et 7 d'abord ; une version du CV sans le projet Ariane et sans chiffre sera préparée en parallèle pour être envoyable même sans réponse.

## Priorité 1 : niveau réel en Python et en SQL

L'annonce exige « Une très bonne maitrise de Python et/ou SQL sous Databricks ». Le « et/ou » rend un seul langage suffisant ; il faut donc savoir lequel mettre en avant et à quel niveau. Le CV ne dit que « requêtage SQL/PostGIS » et « pipelines PDAL/Python », sans niveau ni exemple. Le brief interdit de supposer la maîtrise.

Q1. En SQL, sans documentation, que savez-vous écrire aujourd'hui : sélections et filtres, jointures sur plusieurs tables, GROUP BY avec HAVING, sous-requêtes ou CTE (WITH), fonctions de fenêtre (ROW_NUMBER, LAG), création de tables, de vues ou d'index, fonctions spatiales PostGIS (ST_Intersects, ST_Within, ST_Buffer) ? À quelle fréquence écrivez-vous des requêtes chez Trealis ?
Pourquoi : décide si « SQL » peut passer en tête des compétences et si la puce « Structuration et interrogation de bases de données spatiales (PostgreSQL/PostGIS) » peut préciser la nature des requêtes. « Structuration » implique d'avoir créé des tables ou des vues ; si vous n'avez qu'interrogé l'existant, le mot sera remplacé.
Aide-mémoire : historique de requêtes de pgAdmin, DBeaver ou du gestionnaire de bases de QGIS ; fichiers .sql sur le poste ; la dernière requête écrite, compter les tables jointes.

Q2. Écrivez de mémoire, approximativement, la requête SQL la plus complexe que vous ayez produite au travail et dites à quoi elle servait (quel écart, quelle incohérence, quel doublon elle détectait ; entre quels environnements).
Pourquoi : transforme « fiabiliser les flux entre environnements de traitement » (déclaré) en un cas racontable en entretien et permet d'écrire « requêtes SQL de contrôle de cohérence » si c'est exact.
Aide-mémoire : un cas précis où une requête a révélé des fichiers manquants, des géométries invalides ou des doublons, et ce qui a été décidé ensuite.

Q3. En Python, quelles bibliothèques utilisez-vous réellement (pandas, numpy, laspy, pdal, geopandas, matplotlib, autres) ? Savez-vous sans aide lire un CSV, filtrer, regrouper, fusionner deux tables et exporter avec pandas ? Vos « pipelines PDAL/Python » sont-ils des fichiers de configuration JSON lancés en ligne de commande, des scripts paramétrés, ou des programmes structurés en fonctions ou modules ? Combien de scripts avez-vous écrits seul du début à la fin ?
Pourquoi : « Python » peut recouvrir très peu de code écrit ; la place de Python dans les compétences et la formulation de la puce « Développement de pipelines PDAL/Python » en dépendent. Dans les dépôts du projet, les scripts Python (tools/package.py, tools/build-windows.py, tools/plot-part7.py, tools/check-originals.py dans /home/user/banane ; tools/materialize_release_dataset.py et tools/reconstruct_materialized_json.py dans /home/user/banane-data) sont soit attribués à l'agent IA dans git, soit committés par vous sans preuve d'écriture manuelle : ils ne prouvent rien sur votre Python.
Aide-mémoire : dossiers de scripts du poste, historique VS Code ou Jupyter, sortie de pip list ; distinguer les scripts écrits à la main, adaptés d'un exemple, générés par un agent et relus.

Q4. Avez-vous déjà ouvert Databricks, Spark SQL ou un service Azure, même en autoformation (notebook, édition communautaire, cours) ? Si oui, quand, combien de temps, et pourriez-vous en parler cinq minutes en entretien ?
Pourquoi : « Databricks » et « Azure » sont absents du CV ; ils n'y entreront que si une pratique réelle existe (« Databricks (notions, autoformation) »). Sinon la lettre évoquera l'adaptation depuis PostgreSQL, sans superlatif.
Aide-mémoire : compte Databricks Community ou Microsoft Learn, favoris, relevé de formation.

## Priorité 2 : réalisations personnelles avec ces outils

Q5. Décrivez un pipeline PDAL/Python de bout en bout : fichiers en entrée (format, taille), étapes ou filtres, sortie, fréquence d'exécution, qui le lance aujourd'hui, et quelle étape manuelle il remplace. Quelle part est du Python que vous avez tapé vous-même ?
Pourquoi : la puce « réduisant la charge de traitement manuel » est un résultat déclaré sans mesure ; un pipeline nommé avec entrée, sortie et utilisateur la rend défendable, et un ordre de grandeur honnête (temps avant et après, par fichier ou par semaine) peut remplacer l'adjectif. Sans mesure, la puce sera reformulée en fait (« en remplacement d'étapes manuelles »).
Aide-mémoire : fichiers pipeline .json, scripts .bat ou .sh de lancement, journaux d'exécution, dates du premier et du dernier lancement, tickets ou messages échangés lors de la mise en place.

Q6. Donnez deux autres réalisations concrètes faites avec Python ou SQL (chez Trealis ou en stage) : étape du traitement, données en entrée et en sortie, qui a utilisé le résultat, comment vous avez vérifié qu'il était juste.
Pourquoi : les puces décrivent des activités ; une réalisation nommée par outil permet d'écrire des puces vérifiables et fournit la matière du test technique.
Aide-mémoire : livraisons client récentes, scripts de conversion ou de contrôle, tables PostGIS créées, rapports produits pour un chef de projet, travaux de licence en Python.

## Priorité 3 : expérience réelle de Power BI et d'Excel

Q7. Power BI : avez-vous construit au moins un rapport complet (connexion à une source, modèle, au moins une mesure DAX, visuels, publication ou partage) ? Dans quel cadre (cours, stage, personnel) ? Pouvez-vous le montrer ? Même question pour Tableau. Si la réponse est non pour l'un ou l'autre, acceptez-vous de retirer Tableau et de qualifier Power BI « notions » ?
Pourquoi : l'annonce met Power BI dans son titre « Data Analyst Décisionnel (PowerBI/Azure) » et en « Atout supplémentaire : Connaissance de PowerBI » ; le CV liste « Power BI · Tableau · StoryMaps » sans aucune réalisation. Un manager technique demandera à voir ; une mention non tenue coûte plus qu'une absence.
Aide-mémoire : fichiers .pbix ou .twb sur le disque ou OneDrive, compte Power BI Service, Tableau Public, TD de licence sur la visualisation.

Q8. Excel : utilisez-vous les tableaux croisés dynamiques, RECHERCHEV ou RECHERCHEX, Power Query, les formules conditionnelles ? Quel classeur de suivi ou de contrôle avez-vous construit, pour qui, à quelle fréquence est-il utilisé ? Pourquoi Excel n'est-il pas sur le CV ?
Pourquoi : Excel est absent du CV et absent de l'annonce ; le brief le cite parmi les compétences à vérifier. Il n'entrera que si une pratique réelle existe ; il ne sera pas ajouté pour « coller » à une attente imaginée.
Aide-mémoire : fichiers de suivi de production, planning de livraison, contrôles de conformité, tableaux de stage (indices par commune, comptages d'annotations).

## Priorité 4 : automatisations et traitements effectivement réalisés

Q9. En dehors des pipelines PDAL, quelles automatisations ou contrôles systématiques avez-vous mis en place chez Trealis : scripts de vérification de conformité des livrables, contrôles de complétude ou de doublons, exports automatisés, règles de validation appliquées en masse ? Qui les utilise et sont-ils toujours en service ?
Pourquoi : l'annonce demande de « renforcer l'efficience et simplifier les outils » et de « proposer des outils destinés à en améliorer l'efficience » ; le CV n'affiche qu'une automatisation.
Aide-mémoire : dossiers de scripts et de modèles, planificateur de tâches, demandes de collègues du type « tu peux faire tourner ton script », procédures internes rédigées ou modifiées.

Q10. Sur le dépôt de données du projet Ariane (/home/user/banane-data, 21 commits sur 22 à votre nom), le workflow de matérialisation des archives de Release (.github/workflows/materialize-native-v46.yml : vérification des SHA-256 avant extraction, rejet des fichiers de plus de 8 MiB) et les deux scripts Python associés (tools/materialize_release_dataset.py, tools/reconstruct_materialized_json.py) : les avez-vous écrits, adaptés ou fait générer, et pouvez-vous les expliquer ? Les automatisations du dépôt de code (workflow CI GitHub Actions, outil de parité sur 239 rails) sont traitées en Q19.
Pourquoi : ces fichiers portent votre signature ; vous devez pouvoir les assumer en entretien, mais le CV ne doit pas vous présenter comme développeur. Aucun commit, trailer ou mention ne dit dans ce dépôt si le code a été tapé par vous ou produit par un agent.
Aide-mémoire : relire ces fichiers, rejouer mentalement comment chaque commit a été produit (tapé, adapté, généré puis relu).

## Priorité 5 : volumes de données traités

Q11. Chez Trealis, quels volumes pouvez-vous défendre et votre employeur accepterait-il de les voir cités : nombre de fichiers LAS/LAZ ou de kilomètres de voie contrôlés par semaine, taille typique d'un nuage ou d'une livraison (Go ou nombre de fichiers), nombre de cas d'échec diagnostiqués par jour ou par lot, nombre de livrables validés depuis octobre 2025, nombre de tables ou de lignes dans la base PostGIS ? Le périmètre « sur l'ensemble du réseau ferré national » est-il celui du marché ou le vôtre ?
Pourquoi : la seule quantification du CV est « sur l'ensemble du réseau ferré national » ; « donnée massive » et « à grande échelle » sont déclarés sans mesure. Un ordre de grandeur honnête rend le contrôle qualité tangible. Attention : les volumes des dépôts Ariane (110 corrections, 91 corrections le 21/09, 101 cuts de la part 6, 679 visites, 22 sessions le 15/09) sont des sessions d'expérimentation du prototype, pas des volumes de production ; ils ne serviront pas à chiffrer la puce de contrôle qualité.
Aide-mémoire : tableaux de suivi de production, planning de lots, taille d'un fichier LAZ moyen, nombre de fichiers par relevé, compteurs de l'outil de validation.

Q12. En stage : combien d'objets annotés sous Label Studio, quelle taille de corpus constitué (Médiations) ; combien d'images, de communes ou d'indicateurs traités et quelle emprise cartographiée (Région) ?
Pourquoi : les puces de stage peuvent porter au moins une taille de corpus ou une emprise, seule quantification possible de ces expériences.
Aide-mémoire : exports Label Studio, rapport de stage et soutenance, liens ArcGIS Online des applications.

## Priorité 6 : résultats quantifiables et vérifiables

Q13. Si la réduction de charge décrite en Q5 (« réduisant la charge de traitement manuel ») n'est pas mesurée, acceptez-vous une reformulation sans quantification (« en remplacement d'étapes manuelles ») ?
Pourquoi : complément de Q5, qui porte l'étape remplacée et l'ordre de grandeur. Une tournure d'impact non mesurable sera attaquée en entretien ; le brief impose « tout doit être vérifiable ». Les dépôts Ariane ne documentent aucune réduction de charge et ne concernent pas PDAL : la formulation ne sera pas transférée au projet.
Aide-mémoire : réponse à Q5 ; à défaut de mesure, accord de principe sur la reformulation.

Q14. Existe-t-il un indicateur suivi par votre équipe ou votre client auquel vous avez contribué et qui soit communicable : taux de retours ou de non-conformités signalés sur vos livrables, délais de validation tenus, nombre de cas d'échec résolus par rapport à ceux remontés, nombre de reprises avant et après une amélioration de procédure ? Qui pourrait le confirmer et sur quelle période ?
Pourquoi : un pôle « Maîtrise des activités et des risques » lit un CV en cherchant des indicateurs de qualité ; le CV n'en contient aucun ; un résultat réel, même modeste, distingue le dossier à condition d'être autorisé.
Aide-mémoire : comptes rendus de livraison ou de recette, mails de retour client, points hebdomadaires ; demander au responsable d'équipe ce qui est partageable.

## Priorité 7 : rôle précis dans Ariane

Q15. Confirmez-vous être la personne désignée « Mic » dans la documentation des dépôts (51 mentions) ? Les documents vous attribuent : la règle « Ne modifie pas verify.cjs ni ses empreintes simplement pour obtenir un résultat vert » et les « Autres règles posées par Mic, toujours en vigueur » (pas de fuite de la correction humaine dans les entrées, pas de réglage sur le jeu réservé, pas de SKIP automatique, unités jamais appelées millimètres sans calibration, distinction fait observé / calcul reproduit / interprétation / hypothèse) ; les décisions d'orientation (« Mic décide des développements », gel puis dégel du moteur, retrait du mode « Mes corrections ») ; la recette en conditions réelles (capture d'écran V4.4.2, « journal réel fourni par Mic ») ; la relecture critique (« Réserve de Mic, juste », « Aggravé, relevé par Mic ») ; la détection visuelle d'un défaut (« trouvé par Mic, à l'œil ») ; un désaccord argumenté sur le verrouillage 4.5.7. Est-ce exact, et qu'y ajouteriez-vous ou retireriez-vous ?
Pourquoi : tout le sous-bloc Ariane repose sur cette attribution ; si « Mic » n'est pas vous, le rôle de décideur s'effondre. Sources : /home/user/banane/PASSATION_BANANE.md (sections 1 et 7), AUDIT_PILOTE.md (défauts 1, 2, 4, 7, 9), TEST_REPORT.md, DECISIONS.md (D-010).
Aide-mémoire : relire ces passages et noter, pour chacun, « exact », « à nuancer » ou « faux ».

Q16. Racontez sans vos documents trois décisions prises seul, un désaccord avec l'agent IA et un défaut détecté que les outils ne contrôlaient pas. Puis répondez en une phrase à « qui a écrit le code ? ».
Pourquoi : c'est ce que vous devrez incarner en entretien ; le CV dira « conception, spécification, pilotage et validation d'un prototype réalisé avec des agents de développement assistés par IA », jamais « développement ». Les commits de /home/user/banane : 21 à votre nom (+2 135 lignes, 18 au 21 septembre 2026) contre 14 signés « Claude » (+156 470 lignes) et 1 « Codex » ; dans /home/user/banane-data : 21 commits sur 22 à votre nom, le benchmark étant « createdBy: Grok independent benchmark preparation » et « verifiedBy: Astra ».
Aide-mémoire : gel et dégel du moteur (CHANGELOG 4.6.0 « Le gel est levé pour eux seuls, sur décision explicite »), retrait du mode de collecte guidée (4.5.4), désaccord (PASSATION section 7 « Il a raison sur deux points »), écartement de voie « vérifié nulle part » (AUDIT_PILOTE défaut 7), régression d'usage rapportée (D-010).

Q17. Votre employeur sait-il que ce projet existe ? Autorise-t-il la mention publique d'un prototype greffé sur l'application de validation du client, qui observe et pilote cet outil par clics simulés en s'appuyant sur des symboles internes non documentés, et dont les données LiDAR client sont exclues du dépôt « sur consigne » ? Le projet a-t-il été demandé, toléré ou mené en autonomie ? Qui l'a vu ? Avez-vous relu votre contrat ou la charte informatique sur les outils internes et les données client ?
Pourquoi : sans accord, le projet reste hors CV et sert uniquement d'exemple d'entretien ; avec accord, il entre en deux puces sous l'expérience Trealis. Le mot « interne » ne sera écrit que si l'employeur reconnaît le projet. Le README de banane-data exige « Ne déposer ici que des données dont le stockage sur un service cloud externe privé est autorisé », mais l'autorisation elle-même n'est documentée nulle part.
Aide-mémoire : contrat de travail, charte informatique, échanges avec le responsable d'équipe au sujet de l'extension.

Q18. Quel nom souhaitez-vous employer sur le CV : « Ariane » (brief), « Banane » (manifeste « Banane V4.5 TEST », tous les documents, tous les exports), ou aucun nom avec une description fonctionnelle (« prototype d'assistance au contrôle qualité ») ? Le mot « prototype » vous convient-il (le brief dit « extension » et « projet » ; les dépôts disent « développement expérimental, non qualifié pour la production ») ? Quelle période afficher : les en-têtes de documents commencent au 9 septembre 2026, les commits vont du 15 au 22 septembre, les versions V2 à V2.4.2 ne sont pas datées, aucune activité du 22 septembre au 5 novembre ; CHANGELOG.md documente une version 4.7 et l'analyse d'un lot du 21 septembre (commit signé Claude : « docs+tools: analyser le lot terrain du 21 septembre et afficher la politique effective ») ; les branches distantes ne portent que des noms de chantier (claude/banane-terra-delta-qa, infra/materialized-native-v46-v1), aucun n'évoque le 21 septembre ni la 4.7.
Pourquoi : « Ariane » n'existe dans aucun fichier vérifiable ; « Banane » prête à sourire ; un nom non expliqué en entretien est un risque. La période affichée doit être justifiable (« 2026 » par défaut).
Aide-mémoire : premières versions V2 utilisées (date approximative), dernier usage réel de l'extension.

Q19. Dans les 21 commits à votre nom (intégration « shadow » du candidat géométrique GCV1, CI, parité sur 239 rails, correction de la machine à états « fix: accept ESV next non-validated transitions », exports de diagnostic), qu'avez-vous écrit, qu'avez-vous fait générer, que pouvez-vous expliquer ? Les messages sont en anglais au format conventional commits, sans corps ; votre adresse de commit est leitesmichael@gmail.com alors que le CV indique amorimleitesmichael@gmail.com.
Pourquoi : le CV ne vous présentera pas comme développeur, mais vous devez assumer ce qui porte votre signature ; l'écart d'adresse interdit tout lien vers les dépôts tant que l'identité n'est pas harmonisée (aucun lien ne sera donné de toute façon : les dépôts contiennent l'URL de l'application cliente).
Aide-mémoire : git log de /home/user/banane du 18 au 21 septembre, fichiers src/gcv1-shadow.js, src/gcv1-export.js, tests/gcv1-shadow.test.cjs.

## Priorité 8 : métriques Ariane communicables

Q20. Parmi les faits suivants, lesquels acceptez-vous de voir sur le CV (sous forme générique, sans identifiant), lesquels réservez-vous à l'entretien, lesquels refusez-vous : (a) corpus de référence de 110 corrections humaines (/home/user/banane/OFFLINE_EVALUATION.md, audit/ingestion-certificate-v4.3.0.json ; les numéros de parts du corpus figurent dans BRAIN_V1.md et PASSATION_BANANE.md section 5 : ne citer aucun numéro de part ni de cut) : les avez-vous toutes produites vous-même ? (b) 679 visites et 611 cuts distincts en trois sessions d'observation dans l'outil métier le 16 septembre (/home/user/banane-data/collections/2026-09-16-native-v4.6/audit/independent-audit-summary.md) : « terrain » y désigne des sessions dans l'application, pas une enquête de terrain ; (c) 22 sessions d'observation le 15 septembre (CHANGELOG_V45R.md 4.5.4 : « 22 sessions réelles du 15/09 (11 en 4.5.2, 11 en 4.5.3) ») et 37 cycles de pilote (AUDIT_PILOTE.md : « 37 cycles mesurés, du démarrage d'un cut à sa validation », « parts 6 et 31 ») ; (d) 21 numéros de version distincts relevés dans les en-têtes des deux changelogs (3.0.0 à 4.7, la 4.7 comptant pour un alors qu'elle porte sept entrées distinctes ; plusieurs versions reprises dans les deux fichiers ; les deux en-têtes « V4.5 lot 1 » et les versions V2 non datées non comptés) : décompte des auditeurs, non chiffre du dépôt (CHANGELOG.md, CHANGELOG_V45R.md) ; (e) journal de 27 décisions (DECISIONS.md D-001 à D-027) et registre de 34 problèmes connus (KNOWN_ISSUES.md KI-001 à KI-034) ; (f) suite de 540 tests automatisés, 538 réussis, 2 ignorés (audit/verification.json), écrits majoritairement par les agents IA ; (g) registre de données avec empreintes SHA-256, manifests et statuts de qualification (banane-data/README.md, sept principes introduits par un commit à votre nom).
Pourquoi : ce sont les seuls chiffres jugés « publiables » ou « douteux mais défendables » ; par défaut, le CV n'en portera aucun, et jamais (f) en première personne : les signatures git attribuent la majorité des fichiers de tests aux agents IA ; audit/verification.json ne fait que compter 540 tests, 538 réussis, 2 ignorés. Le principe (g) est publiable sans chiffre.
Aide-mémoire : rouvrir chacun des fichiers cités, vérifier qu'aucun chiffre retenu ne révèle un numéro de part, de cut, un seuil métier ou un identifiant de session.

Q21. Confirmez-vous qu'aucun gain de temps, de productivité, de précision ou de taux d'erreur n'a été mesuré sur Ariane et qu'aucun ne sera inscrit ? Les sources disent « Je n'annonce aucun chiffre de gain : il se mesure sur ESV réel, pas sur le banc » (AUDIT_PILOTE.md), « Aucune amélioration de précision n'est revendiquée » (RESULTATS.md ; variante dans DECISIONS.md : « Aucune amélioration de précision n'est annoncée sans essai ESV 4.4.1 et comparaison sur les mêmes cuts ») et interdisent les millimètres sans calibration. Êtes-vous à l'aise pour raconter en entretien, sans chiffres client, que le prototype a produit des erreurs en conditions réelles (12 lots sur 12 arrêtés le 15 septembre, 10 paires hors contrat appliquées puis validées le 21 septembre avant l'existence du garde, sélection à confiance nulle sur un cut le 15 septembre) et comment elles ont été détectées et corrigées ? Pouvez-vous raconter l'épisode de l'indicateur qui affichait « jusqu'à 53 % d'échec » alors qu'il recouvrait des refus légitimes et aucune panne réelle, et celui du corpus d'ajustement biaisé (gestes 4,5 fois plus grands à la médiane que le travail réel ; PASSATION_BANANE.md : « Les gestes du corpus d'ajustement sont 4,5 fois plus grands à la médiane ») ?
Pourquoi : le brief demandait d'explorer temps de traitement, gains, taux d'erreur ; les sources les excluent. Il faut un accord explicite sur ce qui ne sera pas écrit. La boucle détection / correctif / test et la rigueur sur la définition d'un indicateur constituent des arguments solides pour un pôle de maîtrise des risques, à l'oral uniquement.
Aide-mémoire : CHANGELOG_V45R.md (4.5.3, 4.5.4), PASSATION_BANANE.md (sections 3, 8 et 11 « Erreurs commises pendant ce chantier »), CHANGELOG.md (4.6.0, 4.7) ; préparer une version orale sans numéro de version, sans nom de fichier, sans valeur en millimètres.

## Priorité 9 : projets de reporting ou d'analyse décisionnelle, enseignements, contexte

Q22. Au Conseil Régional (2024) : à qui s'adressaient les applications « ArcGIS StoryMaps, Builder » (élus, services, public) ? « Builder » désigne-t-il Experience Builder, Web AppBuilder ou Dashboards ? Contenaient-elles des indicateurs chiffrés, des filtres, des graphiques, des cartes à seuils ? Qui a défini les seuils des indices NDVI/NDWI et comment ont-ils été validés ? Le travail a-t-il donné lieu à une étude ou un rapport remis à la Région ?
Pourquoi : seule restitution du CV ; l'annonce demande « Collecter, mettre en forme et restituer » et « maitrise d'ouvrage de tableaux de bord d'aide au pilotage ». Le destinataire, le mot « étude » et un éventuel « tableau de bord » ne seront écrits que sur vos réponses.
Aide-mémoire : liens ArcGIS Online, captures du rapport de stage, échanges avec le tuteur sur les seuils.

Q23. Avez-vous déjà construit un tableau de bord, un reporting récurrent, un indicateur suivi dans le temps ou une note de synthèse pour un responsable, où que ce soit (Trealis : suivi de production, indicateurs de qualité ; laboratoire ; licence ; emplois étudiants) ? Pour qui, à quelle fréquence, avec quel outil, avec quelle définition des indicateurs (dénominateur, source, fréquence) ?
Pourquoi : « tableaux de bord », « indicateurs », « reporting » (hors intitulé de rubrique), « synthèse » sont absents du CV et ne peuvent y entrer que sur des faits. Une note ou un suivi réel chez l'employeur serait une preuve plus simple à défendre qu'Ariane.
Aide-mémoire : documents de suivi produits pour l'équipe, comptes rendus, classeurs partagés.

Q24. Quels enseignements de la licence pouvez-vous nommer avec leur intitulé exact (statistiques descriptives, analyse spatiale, bases de données, programmation, échantillonnage) ? Avez-vous rédigé un mémoire ou une étude quantitative ? Quel mois de 2025 la licence a-t-elle été validée ?
Pourquoi : « statistiques » et « études » sont absents du CV alors que le poste s'intitule « chargé (e) d'études et de statistiques » ; une ligne d'enseignements sous le diplôme n'est possible que sur des intitulés réels (aucune liste ne sera pré-rédigée pour vous).
Aide-mémoire : relevé de notes, intitulés d'UE, rapport de stage, mémoire.

Q25. Avec qui travaillez-vous réellement chez Trealis : taille de l'équipe, interlocuteurs côté client (SNCF Réseau), équipe algorithme, chefs de projet, autres opérateurs ? Avez-vous des échanges directs avec le client sur les livrables ? Au Conseil Régional, avec quels services ?
Pourquoi : l'annonce insiste sur « Travailler en transversal », « De bonnes qualités d'écoute et de compréhension des besoins des Caf », « le goût du travail en équipe » ; le CV ne nomme aucun interlocuteur hormis « client ». Une mention factuelle (« en interface avec le client et l'équipe algorithme ») n'entrera que si elle est vraie.
Aide-mémoire : organigramme, destinataires habituels de vos mails de livraison.

Q26. Avez-vous un lien quelconque avec le secteur social, associatif, les Caf ou la protection sociale (bénévolat, emploi étudiant, entourage, allocataire) qui serait honnête à mentionner ? Pourquoi quitter, après treize mois, un poste de spécialiste 3D pour un poste d'études et de statistiques dans la protection sociale ? Que s'est-il passé entre le stage en architecture (fin 2019) et l'entrée en licence (2022) ?
Pourquoi : l'écart avec « la branche Famille », « les Caf » et « le SID » est total et ne se comble pas sur le CV ; la motivation du changement et le parcours 2019-2022 seront demandés en entretien et doivent être préparés, même si rien n'est ajouté au CV.
Aide-mémoire : lecture de la COG 2023-2027, documents publics de la Cnaf sur les aides aux partenaires, le contrôle sur place, le sigle « AFC ».

## Points à confirmer sur l'état civil et la forme

- Téléphone « +33 6 46 16 14 95 » et adresse « amorimleitesmichael@gmail.com » : à conserver tels quels ? L'adresse des commits (leitesmichael@gmail.com) ne sera jamais exposée.
- Ville « Ozoir-la-Ferrière, France » : garder la ville (le poste est à Paris, « accessible via le RER B, métro ligne 4 et 6 ») ou écrire « Île-de France » ?
- LinkedIn : existe-t-il un profil, est-il cohérent avec le CV (intitulé « Spécialiste en traitement de données 3D », dates), faut-il l'ajouter ? Aucun lien GitHub ne sera ajouté.
- Nom public du projet : « Ariane », « Banane » ou aucun (voir Q18).
- Mobilité Paris : trajet quotidien accepté ; « Quelques déplacements sont à prévoir au sein du réseau des Caf » : disponibilité pour des déplacements en région, permis B si pertinent (à ne mentionner sur le CV que si c'est un atout réel pour ces déplacements).
- Télétravail : « jusqu'à 3 jours par semaine » dans le texte, « TELECOMMUTE » dans les données structurées ; préférence à connaître pour l'entretien, rien sur le CV.
- Intitulé du poste actuel : « Spécialiste en traitement de données 3D » est-il l'intitulé contractuel exact ? Il sera conservé tel quel.
- Employeur : relation exacte entre « Trealis » et « Eurailscout France » (groupe, ancien nom, filiale), pour écrire la ligne sans parenthèse si possible. Autorisation de citer « SNCF Réseau » comme client sur un CV public (déjà présent sur le CV actuel).
- Chevauchement « Laboratoire Médiations ... JUIN – AOÛT 2025 » et « Carrefour Location ... JUILLET – SEPT. 2025 » : temps partiel, soirs, week-ends ? Garder Carrefour Location en une ligne ou le supprimer ?
- Rubrique « AUTRES EXPÉRIENCES » : accord pour la réduire à une ligne de synthèse (Super U conservé ; AJP 2018, manutention 2019 et stage d'architecture 2019 retirés) ?
- Langues « Français (natif) · Portugais (natif) · Anglais (courant) » : accord pour les placer sur la ligne de contact ?
- Règle typographique : votre interdiction des tirets cadratins couvre-t-elle aussi les demi-cadratins « – » des plages de dates (« OCT. 2025 – AUJOURD'HUI ») ? Sinon ils seront conservés ou remplacés par « à ».
- Titre : accord sur la proposition par défaut « Data Analyst | Contrôle qualité et fiabilisation des données », avec variante « Data Analyst | Fiabilisation des données et reporting » si Q7 et Q22 confirment une restitution réelle ?

## Format de réponse suggéré

Répondez en vrac, dans l'ordre qui vous convient, en commençant par Q1 à Q4, Q5, Q7 et Q15 à Q18. Pour chaque question : le numéro, puis une réponse courte ; pour les faits (requêtes, scripts, fichiers, chiffres), une ligne par exemple avec « où le retrouver » et « qui peut le confirmer ». Pour les chiffres : écrire « mesuré » ou « estimé », et « publiable », « entretien seulement » ou « confidentiel ». Pour les attributions Ariane (Q15) : « exact », « à nuancer » ou « faux » devant chaque élément. Si une réponse est « je ne sais pas » ou « je préfère ne pas l'écrire », le dire : le CV sera construit sans cet élément. Un message vocal transcrit ou une liste de notes brutes conviennent ; la mise en forme n'a aucune importance à ce stade.
