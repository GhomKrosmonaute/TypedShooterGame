# Shooter Game 👾

**Le test en ligne c'est par [ici](https://camilleabella.github.io/TypedShooterGame/) !**<br>
Les specs c'est en dessous.

## Bonus list

- `LEVEL` : Nombre d'obtention du bonus dans une partie.
- `VIEWPORT` : Zone de ~1000 pixels autour du joueur.

| Implemented | Name                    | Description                                                             |          Type          |
| :---------: | ----------------------- | ----------------------------------------------------------------------- | :--------------------: |
|     ✅      | Heal                    | soigne completement le joueur                                           |       consomable       |
|     ✅      | Star Balls              | le joueur tire de tous les cotés                                        | consomable, temporaire |
|     ✅      | Dead Chain              | en mourant, les ennemis infligent des dommages aux ennemis autour d'eux |         passif         |
|     ✅      | Explosive Shots         | vos tirs explosent lorsqu'ils s'arrêtent                                |         passif         |
|     ✅      | Deadly Wave             | tue tous les ennemis dans le `VIEWPORT`                                 |       consomable       |
|     ✅      | Piercing Shots          | les tirs traversent `LEVEL` ennemis                                     |         passif         |
|     ✅      | Automatic Fire Guidance | les tirs suivent les cibles proches d'eux                               |         passif         |
|     ✅      | Shield                  | protection rudimentaire contre les petits dommages                      |         passif         |
|     ✅      | Damage Up               | les tirs infligent plus de dommages                                     |         passif         |
|     ✅      | Shots Size Up           | les tirs sont plus gros                                                 |         passif         |
|     ✅      | Shots Speed Up          | les tirs sont plus rapides                                              |         passif         |
|     ✅      | Fire Rate Up            | la cadence de tir est plus rapide                                       |         passif         |
|     ✅      | Rotation Speed Up       | la rotation est plus rapide                                             |         passif         |
|     ✅      | Range Up                | les tirs vont plus loin                                                 |         passif         |
|     ✅      | Speed Up                | le joueur se déplace plus vite                                          |         passif         |

## Enemy list

| Implemented | Name           | Description                           |
| :---------: | -------------- | ------------------------------------- |
|     ✅      | Shield Piercer | ignore le `Shield` du joueur          |
|     ✅      | Blob           | absorbe les ennemis qu'il touche      |
|     ✅      | Rocket         | une cible suit le joueur puis explose |
|     ✅      | Circular Saw   | tue tout ce qui le touche             |
|     ✅      | Pulsar         | repousse tout avec des ondes          |
|     ✅      | Freezer        | gèle les ennemis et le joueur         |
|     ❌      | Bound          | peut faire des bonds et des plongées  |
|     ✅      | Tesla          | crée des arcs électriques             |
|     ❌      | Slug           | crée une trainée de poison            |
