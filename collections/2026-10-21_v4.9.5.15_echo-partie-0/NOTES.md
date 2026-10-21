# Collecte 2026-10-21_v4.9.5.15_echo-partie-0

Ariane 4.9.5.15 (test 15), **Écho de la partie 0 du troisième projet** (confirmé par Mic le 20/10), 21 octobre 2026, après le lot Orbite du 20/10 (`2026-10-20_v4.9.5.15_partie-0`). Selon Mic, ces deux envois contiennent presque toutes les corrections du dernier lot de la partie 0. C'est le premier Écho de cette partie, fait sur les cuts restés rouges : il en a corrigé d'abord les différés.

Session Écho du 21/10/2026, de 8 h 26 min 43 s à 8 h 33 min 17 s (heure de Paris), **41 visites**, une seule partie (0). Deux envois, qui se recouvrent (le second, final, contient toute la session) :

| Envoi | Heure (Paris) | Contenu |
|---|---|---|
| vidage automatique en cours de séance | 8 h 31 min 06 s | 30 visites, session encore en cours |
| export final « Terminer et télécharger » | 8 h 33 min 18 s | 41 visites |

Chaque zip contient la liste d'ESV relue (instantané du 21/10/2026 à 8 h 26 min 44 s, 9 400 lignes, aucun cut mémorisé d'Ariane pour cette partie à ce moment), un fichier Écho (segment 1) et `CONTENU.txt`.

Départs de la partie 0 vus par l'export (heures de Paris) :

| Heure | Validés | Invalides | Total |
|---|---|---|---|
| 20/10/2026 19 h 07 min 38 s | 9 064 | 336 | 9 400 |
| 21/10/2026 8 h 24 min 42 s | 9 372 | 28 | 9 400 |

Le second départ suit le lot et sa relecture : il reste 28 cuts invalides, ce qui correspond aux 28 différés du lot (308 posés sur 336).

Export envoyé et archivé le 21/10/2026, **tel qu'envoyé** : les deux zips d'origine, préfixe de téléversement retiré du nom. Contrôles :

- SHA-256 recalculés après copie et comparés aux originaux téléversés : identiques (2 sur 2). Empreintes dans `echo 08h33/SHA256SUMS`.
- CRC des 2 zips : valides.
- Contrôle d'identité sur tout le contenu : **0 courriel, 0 adresse web, 0 code de projet ESV, 0 nom d'opérateur**. Les identifiants internes de cuts et de captures sont présents, comme dans les collectes précédentes.

**Consigne de Mic : une fois la test 16 livrée, mettre ces cuts en apprentissage (très important).** Rien n'est analysé ni jugé ici ; l'apprentissage et le jugement suivent la livraison de la test 16. Les nuages du lot sont dans `2026-10-20_v4.9.5.15_partie-0` (le premier Écho n'en contient pas : il est en mode allégé). Mic prévoit encore un second Écho sur toute la partie.

## Contenu

| Dossier | Fichiers | Taille |
|---|---|---|
| `echo 08h33` | 2 zips (`ariane-echo-partie0-2026-10-21T06-31-06-auto.zip`, `ariane-echo-partie0-2026-10-21T06-33-18.zip`), `SHA256SUMS` | 10,2 Mo (10 695 428 octets) |

## Suite (21/10/2026)

Mis en apprentissage le 21/10 (décision D-224), après examen à réglages figés. Chiffres de l'examen (v4 → v5, vérité d'Écho = validations seules, liste d'ESV du lot) : cuts laissés sans pose 18 → 15 ; poses jugées 20 → 22 ; à 10 mm ou moins 6 → 14 ; à plus de 50 mm 6 → 4 ; 0 vert de la chaîne changé. Sans la liste : 30 → 26 cuts sans pose, 3 poses à plus de 50 mm. Détail : `fiches/APPRENTISSAGE_3_0.md` du dépôt de code (branche `claude/50-apprentissage-3-0`).
