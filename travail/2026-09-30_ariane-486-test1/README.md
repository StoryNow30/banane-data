# Ariane 4.8.6 test 1 — KI-069 (30/09/2026)

`ariane-4.8.6-test.1.zip`, SHA-256 dans `ariane-4.8.6-test.1.zip.sha256`
(`09b4c239…c33a`, 1 143 936 octets). Construit par `git archive c81e958` + `tools/package.py`, depuis la
branche `claude/banane-486-ki069` du dépôt `banane` ; deux constructions identiques. Manifeste `4.8.6.1`,
nom « Ariane 4.8.6 TEST ». Version de test : ni merge dans `main`, ni étiquette, ni publication.

**Ce que ça change** (D-065, KI-069) : sur le **dernier cut certain** d'une partie (N = M−1, M lu dans le
compteur « N on M treated » du cut lui-même), Orbite valide par **Ctrl+Entrée** (sans passer au cut suivant)
au lieu du bouton « valider et suivant », et n'envoie aucun « suivant » après un différé. Preuve de la
validation : identité inchangée et compteur passé de N à N+1. Ctrl+Entrée sans effet : le lot s'arrête, la pose
reste non validée, aucun repli automatique. Tous les autres cas sont ceux de la 4.8.5. Le moteur de
décision (`src/lot-decision.js`, `src/engine.js`, `src/gauge.js`) est identique à la 4.8.5.

**Une seule question de terrain** : Ctrl+Entrée valide-t-il le dernier cut d'une partie sans changer de
partie ? Fiche : `consignes/installation-4.8.6-test1.md` (dépôt `banane`, branche `claude/banane-486-ki069`).

**Note d'empreinte** : la session de développement a annoncé une autre empreinte (`a96dca61…`) pour un zip qui
n'a pas été déposé. Le paquet ci-dessus est reconstruit depuis le commit exact, donc reproductible par
quiconque ; c'est celui à installer.
