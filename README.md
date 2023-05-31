## How to use 

Cet algorythme prend en valeur d'entrée un objet comme décrit ci-dessous qui contient la liste des toutes les parties de joueurs (les joueurs n'apartenant pas à une partie sont indiqué dans l'objet comme appartenant à une partie qui ne contient qu'eux). 
L'algorithme trie les parties par niveau, puis les réparties entre les équipes, en divisant parfois les parties si cela est nécessaire.
Une fois cela fait, il retourne un objet et/ou l'exporte sous la forme d'un json.

L'algorithme privilégie toujours le fait d'avoir un nombre égal de joueurs entre chaque équipe, et le weight de chaque équipe ne sera jamais uniforme.

On peut passer ses données dans l'algo via la méthode `dispatch`

#### Paramètres de configuration

`teamCount` : <\int> Nombre d'équipes désiré (attention, le programme se comporte mal avec des nombres trop grand d'équipe, privilégiez un nombre d'équipe inferieur à 20% des joueurs -> j'espère fix ça plus tard).
`exportResult` : <\bool> True si on veut que le json soit exporté à l'endroit indiqué.
`exportPath` : <\string> Chemin où sera généré le json contenant les équipes.
`priviledgeEquity` : <\bool> Si true, privilégie une répartition des build weight plus équitable. Si false, privilégie la sauvegarde des party pour éviter leur séparation.

#### Input data structure

```json
[
    { // party
        "members" : [ // Array<Object> représente la liste des joueurs appartenant à la party
            {
                "name" : "Pseudo Minecraft", // <string> Pseudo IG du joueur (surtout pour la lisibilité)
                "uuid" : "lorem ipsum", // <string> id unique du compte minecraft
                "discord" : "id", // <string> id du compte discord
                "build_weight" : 1 // <int> niveau de build du joueur (int min value le plus faible, int max value le plus fort)
            },
        ]
    }
    //, ...
]
```

#### Output data structure

```json
[
    {
        "id": 0, // <int> ID unique de l'équipe
        "playerCount": 10, // <int> nombre de joueur dans l'équipe (valeur qui sert principalement à debug l'algo)
        "weight": 60, // <int> total des "buildweight" des joueurs de l'équipe
        "players": [
            {
                "name" : "Pseudo Minecraft", // <string> Pseudo IG du joueur (surtout pour la lisibilité)
                "uuid" : "lorem ipsum", // <string> id unique du compte minecraft
                "discord" : "id", // <string> id du compte discord
                "build_weight" : 1 // <int> niveau de build du joueur (int min value le plus faible, int max value le plus fort)
            },
            //, ...
        ]
    },
    //, ...
]
```