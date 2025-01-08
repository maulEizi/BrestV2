const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Utilisation de la variable d'environnement pour récupérer le token
const token = process.env.DISCORD_TOKEN;

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

// Charger toutes les commandes
client.commands = new Map();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  client.commands.set(command.data.name, command);
}

// Quand le bot est prêt
client.once('ready', () => {
  console.log('Bot est prêt et connecté!');
});

// Enregistrer les commandes auprès de Discord
client.on('ready', async () => {
  const commands = client.application.commands;

  // Crée toutes les commandes en une fois
  await commands.set(client.commands.map(cmd => cmd.data.toJSON()));
});

// Gestion des interactions
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    return interaction.reply('Commande non trouvée.');
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply('Il y a eu une erreur lors de l\'exécution de cette commande.');
  }
});

// Connexion du bot avec le token de la variable d'environnement
client.login(token);
