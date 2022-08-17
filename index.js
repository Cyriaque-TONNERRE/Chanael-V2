const fs = require('node:fs');
const path = require('node:path');
const { QuickDB } = require("quick.db");
const { Client, GatewayIntentBits, Collection} = require('discord.js');
const { token } = require('./config.json');
const {register_user} = require('./fonctions/register_user.js');

const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildBans, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.MessageContent]});

//----------------Partie-Base-de-données-----------//

const db = new QuickDB();

const user_db = db.table("user");

//----------------Partie-Commandes----------------//
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection
    // With the key as the command name and the value as the exported module
    client.commands.set(command.data.name, command);
}

client.on('interactionCreate',  async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (!await user_db.has(interaction.member.id)) {    
        register_user(interaction.member.id).then(() => {
            const command = client.commands.get(interaction.commandName);

            if (!command) return;

            try {
                console.log(`${interaction.member.displayName} a utilisé la commande ${interaction.commandName}`);
                command.execute(interaction);
            } catch (error) {
                console.error(error);
                interaction.reply({
                    content: 'Il y a eu une erreur durant l\'exécution de la commande !',
                    ephemeral: true
                });
            }
        })
    } else {
        const command = client.commands.get(interaction.commandName);

        if (!command) return;

        try {
            console.log(`${interaction.member.displayName} a utilisé la commande ${interaction.commandName}`);
            command.execute(interaction);
        } catch (error) {
            console.error(error);
            interaction.reply({content: 'Il y a eu une erreur durant l\'exécution de la commande !', ephemeral: true});
        }
    }

});

//----------------Partie-Evenement----------------//

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

//----------------Partie-Cron-----------------//

const cronPath = path.join(__dirname, 'cron');
const cronFiles = fs.readdirSync(cronPath).filter(file => file.endsWith('.js'));

for (const file of cronFiles) {
    const filePath = path.join(cronPath, file);
    const cron = require(filePath);
    cron.execute(client);
}

//----------------Partie-Ratio----------------//

client.login(token);
