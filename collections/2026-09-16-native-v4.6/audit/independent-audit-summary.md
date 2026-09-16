# Audit indépendant — collecte Natif V4.6 du 2026-09-16

Cette synthèse consigne les constats d'audit indépendants communiqués après lecture de l'archive brute gelée.

Archive vérifiée : `banane-native-v4.6-2026-09-16.7z`

- taille : 34 509 008 octets
- SHA-256 : `32e48aa79de988ab8bb6efc65d7038d4e27535e2a5f2486768438616f518bfc0`
- Banane : 4.6.0
- mode : `native-passive-observation`

## Inventaire structurel

- 18 JSON
- 3 sessions `FINISHED`
- chaque session : 5 `auto-seg` + 1 segment de clôture
- 679 visites
- 611 cuts distincts
- `commandSentByBanane = 0`
- `serverConfirmed = false` sur 679/679 visites

Sessions observées :

| Session | Part | Visites | Cuts | Fenêtre |
|---|---:|---:|---:|---|
| `f938b9f8-…debe05` | 8 U50 | 176 | 137 | 8576–9821 |
| `92dbb85e-…cdf766` | 1 U50 | 232 | 225 | 3–1291 |
| `06c77393-…b60c7f` | 1 U50 | 271 | 249 | 1856–3190 |

Les deux dernières sessions partagent la même page/part mais portent sur des plages de cuts disjointes.

## Continuité et segmentation

- `visitIndex` dense sans trou dans les trois sessions.
- Chaîne compacte cohérente entre segments.
- Les cas `allPresent=false` correspondent à des tranches parallèles partitionnant exactement le reliquat ; ils ne constituent pas une perte d'identifiants.
- Aucun overlap snapshot inter-segment signalé.
- Références compactes `__ref` résolues.
- Aucune visite canonique sans `(part, cut)`.

Conclusion structurelle : ingestion, segments, continuité et contrôle de doublons validés.

## Couverture et étages de qualification

Les compteurs suivants ne doivent pas être fusionnés car ils appartiennent à des étages différents :

- 1 454 snapshots rail dans l'union auto-seg : 1 026 `qualified-candidate`, 428 `insufficient` ;
- `closure.usablePairs` : 37 + 26 + 13 = **76** ;
- `quality.snapshotsQualified` session : 50 / 55 / 63.

Le champ `associationStatus` snapshot est `same-target-and-rail-pose` sur les snapshots recensés, tandis que la closure peut porter `capture-used-a-different-rail-pose-than-initial-state`. Ces labels décrivent des étages distincts.

## Associations humaines

- 525 `candidate-observed`
- 519 associations fiables au sens observationnel selon le critère : `candidate-observed` ∧ identité concordante ∧ initial observé ∧ navigation ∧ intention `VALIDATE` ∧ absence de multi-intent ∧ non revue
- 19 `timing-uncertain`
- 4 multi-intent : part/cut signalés 8/9648, 1/261, 1/2342, 1/2371
- `reviewed=true` : 0

Ces associations restent observationnelles. Aucune n'est promue automatiquement en oracle ou en vérité d'entraînement.

## Cas remarquables rapportés

- séries de grands déplacements initial → humain, notamment autour de 9658–9665 et 722–729 ;
- extrêmes rapportés : cut 9665, cut 326, cut 3019 ;
- 24 snapshots `insufficient` avec `pointsInEngineUsefulRoi <= 25` ;
- l'exemple visuel de décorrélation « nuage bleu » reste non adressable faute d'identifiant de cut dans le registre.

## Statut restant ouvert

- qualification humaine détaillée : non terminée ;
- replay des candidats moteur : non exécuté ;
- éligibilité entraînement : false ;
- aucune règle automatique de décorrélation n'est dérivée de l'exemple visuel ;
- unités de scène uniquement, jamais mm sans calibration physique indépendante.

Les artefacts détaillés produits dans le workspace Grok (`native-v4.6-2026-09-16-audit.md`, `inventory.json`, `remarkable.json`) ne sont pas recopiés ici tant que leurs fichiers exacts n'ont pas été transmis au registre. Cette synthèse n'en prétend pas reproduire le contenu intégral.
