const { Client, GatewayIntentBits, Collection } = require('discord.js');
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

// Initialiser la collection de commandes
client.commands = new Collection();

// Exemple de commande, à ajouter dans ton code
client.commands.set('ping', {
  execute: async (interaction) => {
    await interaction.reply('Pong!');
  },
});

client.once('ready', () => {
  console.log('Bot est prêt et connecté!');
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'Il y a eu une erreur en exécutant cette commande !', ephemeral: true });
  }
});

// Connecte le bot avec le token
client.login(process.env.DISCORD_TOKEN);
