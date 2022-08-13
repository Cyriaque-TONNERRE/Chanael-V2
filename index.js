const fs = require('node:fs');
const path = require('node:path');
const maths = require('mathjs');
const cron = require('node-cron');
const { QuickDB } = require("quick.db");
const { Client, GatewayIntentBits, Collection} = require('discord.js');
const { token } = require('./config.json');
const {register_user} = require('./fonctions/register_user.js');

const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildBans, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.MessageContent]});

//----------------Partie-Base-de-données-----------//

const db = new QuickDB();

const user_db = db.table("user");
const onerole_db = db.table("onerole");

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

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (!await user_db.has(interaction.member.id)){
        register_user(interaction.member.id);
    }

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Il y a eu une erreur durant l\'exécution de la commande !', ephemeral: true });
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
cron.schedule('0 8 * * *', async () => {
    await bday_db.all().then(list => {
        forEach(list, (elem) => {
            if (elem.value.jour === new Date().getDate() && elem.value.mois === new Date().getMonth() + 1) {
                const bdaygif = ["https://media3.giphy.com/media/SwIMZUJE3ZPpHAfTC4/giphy.gif", "https://tenor.com/Y8iY.gif", "https://tenor.com/bBJpT.gif", "https://tenor.com/bRZjc.gif", "https://tenor.com/bNoxv.gif", "https://tenor.com/bdecb.gif", "https://i.pinimg.com/originals/11/68/82/116882088dc7f44d5cc3d3377f963c70.gif", "https://thumbs.gfycat.com/RepentantUnpleasantFantail-size_restricted.gif", "https://imgur.com/34YQYmg", "https://media.giphy.com/media/oXpZ1sLkbCZ9jFhBMx/giphy.gif", "https://hurfat.com/wp-content/uploads/2021/07/Happy-Birthday...-22.gif", "https://i.pinimg.com/originals/28/35/2f/28352f4f85ebb3ff4019c0b4a2dd0092.gif", "https://cdn.discordapp.com/attachments/987748619010576424/996437041199992985/b5ae8413d8b1167720f3804fb58faaf8.gif", "https://cdn.discordapp.com/attachments/987748619010576424/996437061819170966/giphy.gif", "https://cdn.discordapp.com/attachments/987748619010576424/996437151367565392/Gvb.gif", "https://cdn.discordapp.com/attachments/987748619010576424/1000099809346211890/Untitled111.gif"];
                const member = bot.guilds.cache.get(config.GUILD_ID).members.cache.get(elem.id);
                if (member) {
                    const embed_bday = new MessageEmbed()
                        .setColor('#cc532e')
                        .setTitle('Joyeux Anniversaire ! 🎉')
                        .setDescription(`Aujourd'hui c'est l'anniversaire de <@${member.user.id}> ! 🎈 🎂 🎊\n`)
                        .setThumbnail(bdaygif[randomInt(0, 16)])
                        .setFooter({
                            text: 'Pensez à lui faire sa fête bande de BG',
                            iconURL: `https://twemoji.maxcdn.com/v/latest/72x72/1f61c.png`
                        })
                    bot.guilds.cache.get(config.GUILD_ID).channels.fetch(config.ANNIVERSAIRE_CHANNEL).then(channel => {
                        channel.send({embeds: [embed_bday]});
                    });
                }
            }
        });
    });
}, {
    scheduled: true,
    timezone: "Europe/Paris"
});

//----------------Partie-Ratio----------------//

client.login(token);
