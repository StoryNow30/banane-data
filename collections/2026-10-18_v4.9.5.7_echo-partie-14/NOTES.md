# Collecte 2026-10-18_v4.9.5.7_echo-partie-14

Ariane 4.9.5.7 (test 7), **Écho de la partie 14**, 18 octobre 2026, de 18 h 27 à 18 h 32 : **114 visites** en 5 min 21 s. Départ : 9 887 validés, 0 invalide, total 9 887. L'instantané de la liste d'ESV (9 887 lignes) dit « aucun cut mémorisé d'Ariane pour cette partie » : **pas de lot Orbite** sur cette partie. Mic dit que ces Échos sont ceux de l'opérateur débutant.

Note de Mic : « 14 : que des PN que j'ai corrigés ». Les notes de Mic sur les parties 14, 15 et 16 sont dans `notes-de-mic-parties-14-15-16.txt` (voir ci-dessous).

Les notes de Mic sont dans `notes-de-mic-parties-14-15-16.txt` : texte tel qu'envoyé, **sauf sa première ligne** (identifiant du projet ESV, remplacé par « identifiant du projet ESV retiré » ; il ne doit figurer dans aucun dépôt).
L'identifiant de projet ESV de ces notes n'est pas celui des notes des parties 10 et 11 : les parties 14 à 16 viennent donc d'un autre projet ESV que les parties 10 et 11 (le projet reste à nommer par Mic). Le fichier donne aussi l'avis de Mic : ne pas compter les SKIP dans les calculs pour l'instant ; **un cut corrigé = un cut appris et entraîné par GCV2** ; un compteur des nouveaux cuts appris depuis le début de la 5.0, avec une file entre « en apprentissage » et « appris », tenu à jour entre chaque séance ; les cuts visités et non modifiés en 0,6 s peuvent aussi être appris ; on ne s'arrêtera pas à 1 000 ou 1 500 cuts appris, il en faudra bien plus.

Exports envoyés par Mic et archivés le 19/10/2026 (heures de Paris), **tels qu'envoyés** (zips d'origine, préfixe de téléversement retiré du nom). Leurs empreintes sont dans `SHA256SUMS`. Vérifié avant dépôt : aucun courriel, aucune adresse web, aucun identifiant de projet ESV, aucun champ de nom d'opérateur dans les zips (analyse de tout le contenu, y compris les JSON) ; seulement des champs génériques.

## Contenu

| Dossier | Fichiers | Taille |
|---|---|---|
| `echo p14 18h27` | 4 zips : 2 sauvegardes automatiques (16 h 28 et 16 h 31 UTC) et 2 exports finals (16 h 32 et 16 h 34 UTC ; le second réexporte la même session) | 26 Mo |

Les segments sont cumulatifs ; recoller avec `node tools/merge-segments.cjs`.
