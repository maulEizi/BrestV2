const { Client, GatewayIntentBits, Collection } = require('discord.js');

// Définir un port fictif pour éviter l'erreur de Render
process.env.PORT = process.env.PORT || 8080;  // Utilisation d'un port fictif (8080) si aucune variable PORT n'est définie

// Création du client Discord
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

// Initialiser la collection de commandes
client.commands = new Collection();

// Exemple de commande : ping
client.commands.set('ping', {
  execute: async (interaction) => {
    await interaction.reply('Pong!');
  },
});

// Quand le bot est prêt
client.once('ready', () => {
  console.log('Bot est prêt et connecté!');
});

// Gérer les interactions
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

// Connexion du bot avec le token Discord depuis les variables d'environnement
client.login(process.env.DISCORD_TOKEN);
