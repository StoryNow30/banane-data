# Lot arrêté au cut 115 de la partie 0 (4.9.5.33), 02/11/2026 (heures UTC du journal ; Paris = UTC + 1)

Mesuré (ÉTABLI, journal) :
- 07:54:00 la Constellation démarre (une partie), lot sur la partie 0 ; 11 cuts posés et validés (105 à 114 après un premier clic hors vue sur le cut 1).
- Cut 115 : déplacement de vue automatique avant la pose (« amenerDansLaVue », glisser 1 027 ms, remise de vue « faite » en 333 ms), puis la pose (« apply ») fait un second glisser de 1 015 ms à 07:55:13 ; l'application dure 36 s (trois relances de 12 s de la sélection du rail droit) et se termine par l'erreur « Vue ESV non recentrée sur le rail right. » ; la remise de vue après la pose est « inconnu ».
- Conséquence : `batch-error`, le lot s'arrête (file : « ecriture-incertaine »), l'écriture du cut 115 est incertaine (clôturée par l'opérateur à 07:56:16 : `uncertain-result-closed`, capture abandonnée). Les démarrages suivants de la file sont refusés (`lot-non-demarre`).
- Premier cut du lot où le déplacement de vue (D-268, allumé en test 25, clic droit) agit en conditions réelles dans un lot.
