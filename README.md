
# Shooter Game 👾

Le test en ligne c'est par [ici](./dist/index.html) !<br>
Les specs c'est en dessous.

## Bonus list

`LEVEL` : Nombre d'obtention du bonus dans une partie.

| Name | Description | Type |
|:---:|---|:---:|
| Heal | soigne completement le joueur | consomable |
| Star | le joueur tire de tous les cotés pendant `15 secondes` | consomable |
| Carnage | tue tous les ennemis dans un rayon de `1000` pixels | consomable |
| Drill | les tirs traversent `LEVEL` ennemis | passif |
| Falcon | les tirs suivent la cible la plus proche si elle est plus proche que `LEVEL * 100` pixels | passif |
| Shield | les ennemis ayant `LEVEL` points de vie meurent avant de toucher le joueur | passif |
| Shotgun | les tirs infligent `LEVEL * 25%` degats en plus | passif |
| Bazooka | les tirs sont `LEVEL * 25%` plus volumineux | passif |
| Minigun | la cadence de tir est `LEVEL` fois plus rapide | passif |
| Sniper | le joueur peut tirer `LEVEL * 25%` plus loin | passif |
| Deadchain | en mourant, les ennemis infligent `LEVEL` dégats autour d'eux | passif |
| Ping | apres avoir touché un ennemi, un tir rebondi sur `LEVEL` ennemis proches | passif |

## Enemy list

| Name | Description | Pattern |
| :---: | :---: | --- |
| Aya | ignore le `shield` du joueur | suit le joueur rapidement |
| Blob | absorbe les ennemis qu'il touche | suit le joueur lentement |
| Rocket | immortel, pensez juste a l'esquiver | place précisément une cible sur le joueur<br>au bout de 2 secondes, s'arrète.<br>au bout de 2.5 secondes, s'active et meure |
| Bound | transcende la 2D, gare à son apparition | suit le joueur lentement<br>fait des bonds tres rapides sur la carte en passant des foit<br>en dessous, des fois par dessus |
| Tesla | crée des arcs électriques entre lui et ses congénères les plus proches | suit le joueur lentement |
| Slug | laisse une courte trainée derrière lui qui inflige des DPS a qui la touche | suit le joueur lentement |
