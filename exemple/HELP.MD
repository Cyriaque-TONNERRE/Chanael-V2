# Guide pour dev ce bot
Les 2 site les plus importants :
- [Guide discord JS](https://discordjs.guide/)
- [Wiki discord JS](https://discord.js.org/#/docs/discord.js/main/general/welcome)

____

## Avant tout :
Intaller les dépendances :
- Executer la commande ci dessous à l'intérieur du dossier du bot
 ```bash
 npm i 
 ```
Si ça marche pas, il faut installer node js :
- https://nodejs.org/en/download/ puis réexécuter la commande ci dessus

## Tout les fonctions de ce bot sont divisé dans des fichiers differents

- **Dossier commands :** Où les slashs commands sont enregistré (eg : `/ping`)
- **Dossier events :** Où les events discord sont récuperé (eg : `guildMemberAdd`)
- **Dossier fonctions :** Où sont stocké les fonctions (eg : `verificationpermission`)
- **Dossier exemple :** Où sont donné les exemples pour build ce bot (eg : `ce fichier`)

## Pour démarrer le bot :
- Executer la commande ci dessous à l'intérieur du dossier du bot
 ```bash
 node index.js
 ```
- Si une commande à été modifié, il faut avant exécuter la commande ci dessous
```bash
node deploy-commands.js
```