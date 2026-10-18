# Collecte 2026-10-18_v4.9.5.7_echo-partie-15

Ariane 4.9.5.7 (test 7), **Écho de la partie 15**, 18 octobre 2026, depuis 18 h 35 (session en cours à 18 h 57) : **567 visites** à la dernière sauvegarde. Départ : 9 729 validés, 0 invalide, total 9 729. Pas de cut mémorisé d'Ariane : **pas de lot Orbite** sur cette partie. Mic dit que ces Échos sont ceux de l'opérateur débutant.

**Ce qui manque** : l'**export final** de fin de séance (sans « auto » dans le nom) n'a pas été envoyé ; le dernier fichier est la sauvegarde automatique de 18 h 57 (3 volumes, segments 35 et 36). Le volume 2 sur 2 de la sauvegarde de 16 h 54 UTC n'a pas été envoyé non plus (sans effet : les sauvegardes sont cumulatives, la suivante le contient). Les visites faites après 18 h 57 ne sont pas archivées.

Les notes de Mic sur la partie 15 (PN, ADV avec marges, aiguilles) sont dans la collection `2026-10-18_v4.9.5.7_echo-partie-14` (`notes-de-mic-parties-14-15-16.txt`).

Exports envoyés par Mic et archivés le 19/10/2026 (heures de Paris), **tels qu'envoyés** (zips d'origine, préfixe de téléversement retiré du nom). Leurs empreintes sont dans `SHA256SUMS`. Vérifié avant dépôt : aucun courriel, aucune adresse web, aucun identifiant de projet ESV, aucun champ de nom d'opérateur dans les zips (analyse de tout le contenu, y compris les JSON) ; seulement des champs génériques.

## Contenu

| Dossier | Fichiers | Taille |
|---|---|---|
| `echo p15 18h35` | 21 zips : sauvegardes automatiques de 16 h 37 à 16 h 57 UTC (segments 1 à 36, dernières en 2 et 3 volumes) | 205 Mo |

Les sauvegardes sont cumulatives ; recoller avec `node tools/merge-segments.cjs`.
