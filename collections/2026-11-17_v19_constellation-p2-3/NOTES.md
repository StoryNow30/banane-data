# Vision 19 (build 2b07cb1), 17/11 : Constellation arrêtée en partie 3 sur une correction de la relecture interrompue (cut 2475)

Lot : 2 volumes (journal au volume 2), export du 17/11 14:56 Paris. Parties 2 et 3.

## Mesuré (ÉTABLI)
- Relecture de la partie 3 (mode corriger) : 94 sur 467 relus, 12 corrigés, arrêtée au cut 2475 : Maj+Espace envoyé à 13:52:30.031 UTC, ESV dit le cut « valid » (`railPairUpdated`, +87 ms, comme pour les corrections réussies), mais aucune écriture de validation vue en 6 s. Pour les corrections réussies juste avant (2268, 2269, 2270 ; 6172, 6176, 6177), l'écriture `ExtractionStatus: valid` est vue 530 à 662 ms après Maj+Espace.
- Après 13:52:30.118 UTC, la page n'a plus rien relayé (ni écriture, ni événement, ni nuage) jusqu'à 13:55:28 (relevé du sélecteur de parties, empreinte de contrat : page de nouveau prête). Cause non établie.
- Deux avis « ESV n'a plus le même contrat » (13:48:33 et 13:55:28 UTC) : empreinte d'une page sans boutons de cut ni rails (entre deux parties) comparée à la vraie, à l'aller puis au retour. Faux avis, corrigé en Vision 19.1.
- L'écran d'arrêt de la Constellation n'offrait pas « J'ai contrôlé le cut 2475 » demandé par l'avis : corrigé en Vision 19.1.
