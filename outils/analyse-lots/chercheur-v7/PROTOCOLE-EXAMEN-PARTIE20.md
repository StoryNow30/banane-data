# CH-012 : protocole d'examen sur la partie 20 (proposition, à valider par l'intégrateur avant ouverture)

Écrit le 29/10/2026, **avant** toute ouverture. Rien n'est extrait des archives de la partie 20.

## Pourquoi la partie 20
Examen indépendant : autre partie, jamais vue au réglage (aucune ligne du manifeste, donc réservée), jamais utilisée pour régler. Réserve à écrire : CH-015 a publié des comptes agrégés de cette partie (172 jugés, 21 mauvaise voie, 18,9 % de différés) ; aucun n'a servi à fixer quoi que ce soit ici, et la v7 de CH-012 n'a aucun paramètre appris. Collectes : `collections/2026-10-28_v4.9.5.23_partie-20-lot` (20 volumes) et `collections/2026-10-29_v4.9.5.23_echo-partie-20` (Écho, 15 envois), branche `claude/execute-prompt-00-18ra5a`.

## Ce qui est mesuré (une seule ouverture, résultats rapportés tels quels)
1. **Porte de fidélité** : rejeu `base` filtré comme à la partie 17 ; si moins de 95 % des poses sont à 0,8 mm de la pose du journal, la simulation n'est pas rapportée.
2. **v6 contre l'opérateur** : part des poses du lot sous 3 mm et sous 5 mm (pire rail, 3D) parmi les jugés, avec Wilson et bootstrap par blocs de 20 cuts. Séparés : « corrigé » et « contrôlé, bon » (visite sans action, référence = la pose elle-même).
3. **Clic arrondi, simulé hors ligne** (`simulation-arrondi.cjs`, déjà éprouvé sur le réglage) : pose simulée J′ = pose du journal décalée d'un pixel là où la fraction perdue dépasse un demi-pixel ; écart simulé à l'opérateur. Parts sous 3 et 5 mm, **différence appariée** avec la v6 sur les mêmes rails (bootstrap par blocs), nombre de rails qui franchissent chaque seuil dans un sens et dans l'autre. Seuls les rails déplacés par l'opérateur ont une référence utilisable.
4. **H0, H1, oracle** par `gcv2-jeu` filtré (mêmes lignes que le réglage de la partie 17), avec `--juger-partie-reservee` (jugement sans réglage).
5. **Avec et sans les cuts à plus de 100 mm** (mode de défaut « voie décalée », 21 cuts d'après CH-015) : tous les chiffres sont donnés deux fois.

## Critère écrit avant (pas de gain exigé)
L'hypothèse 1 est tenue pour **non régressive** si, sur les rails appariés, la différence de part sous 3 mm et sous 5 mm (arrondi moins v6) a une borne basse de bootstrap supérieure ou égale à −3 points. Gain attendu : de l'ordre de la suppression d'un biais de 0,25 mm par axe, soit quelques points à 3 mm. Un gain n'est annoncé que si la borne basse est positive. Écart minimal détectable à 172 jugés : environ 11 points (deux proportions autour de 80 %) ; un gain de 5 points ne sera donc pas démontrable.

## Ce qui ne prouvera rien
- La simulation n'est pas le clic réel : la phase de la grille est déduite de la fraction perdue (fidélité), les axes de la vue sont pris pour les axes latéral et vertical du profil (le dévers les tourne de quelques degrés).
- Les jugés sont les cuts que l'opérateur a regardés (sélection) ; un opérateur, une séance, une partie.
- Les cuts « contrôlé, bon » ne se simulent pas ; la mesure sur les rails déplacés ne dit rien des rails laissés intacts.
- Un examen « sans régression » n'établit pas un gain, et n'établit rien sous 3 mm au-delà de l'effectif.

## Procédure
Scripts commités avec leur SHA-256 avant lancement ; brut du rejeu et du jeu supprimé par le script ; comptes lus / écrits archivés ; label de projet de la partie 20 à donner par l'intégrateur (le manifeste porte une entrée pour la partie 17 seulement) ; ouverture unique, sur ton accord.
