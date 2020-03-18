
# Shooter Game 👾

**Le test en ligne c'est par [ici](https://camilleabella.github.io/TypedShooterGame/) !**<br>
Les specs c'est en dessous.

## Bonus list

`LEVEL` : Nombre d'obtention du bonus dans une partie.

| Implemented | Name | Description | Type |
|:---:|---|---|:---:|
| ✅ | Heal | soigne completement le joueur | consomable |
| ✅ | Star Balls | le joueur tire de tous les cotés pendant `15 secondes` | consomable |
| ✅ | Deadly Wave | tue tous les ennemis dans un rayon de `1000` pixels | consomable |
| ✅ | Piercing Shots | les tirs traversent `LEVEL` ennemis | passif |
| ✅ | Automatic Fire Guidance | les tirs suivent la cible la plus proche si elle est plus proche que `LEVEL * 100` pixels | passif |
| ✅ | Shield | les ennemis ayant `LEVEL` points de vie meurent avant de toucher le joueur les ennemis en ayant plus infligent leurs dégats et baissent le niveau du *shield* | passif |
| ✅ | Damage Up | les tirs infligent `LEVEL * 50%` degats en plus | passif |
| ✅ | Shots Size Up | les tirs sont `LEVEL * 25%` plus volumineux | passif |
| ✅ | Fire Rate Up | la cadence de tir est `LEVEL` fois plus rapide | passif |
| ✅ | Range Up | le joueur peut tirer `LEVEL * 50%` plus loin | passif |
| ✅ | Dead Chain | en mourant, les ennemis infligent `enemy.baseLife / 2` dégâts à une distance de `LEVEL * 100` autour d'eux | passif |

## Enemy list

| Implemented | Name | Description | Pattern |
| :---: | --- | --- | --- |
| ✅ | Shield Piercer | ignore le `shield` du joueur | suit le joueur, vitesse `4` |
| ✅ | Blob | absorbe les ennemis qu'il touche | suit le joueur lentement |
| ❌ | Rocket | immortel, pensez juste à l'esquiver | place précisément une cible sur le joueur au bout de 2 secondes, s'arrète. au bout de 2.5 secondes, s'active et meure |
| ✅ | Circular Saw | immortel, pensez juste à l'esquiver | ne bouge jamais, peut avoir différentes tailles |
| ❌ | Bound | transcende la 2D, gare à son apparition | suit le joueur lentement fait des bonds tres rapides sur la carte en passant des foit en dessous, des fois par dessus |
| ✅ | Tesla | crée des arcs électriques entre lui et ses congénères les plus proches | suit le joueur lentement |
| ❌ | Slug | laisse une courte trainée derrière lui qui inflige des DPS a qui la touche | suit le joueur lentement |
