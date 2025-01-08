const { Client, GatewayIntentBits, Collection } = require('discord.js');
const http = require('http'); // Importer le module HTTP pour faire un serveur fictif

// Définir un port fictif pour Render
process.env.PORT = process.env.PORT || 8080;  // Utilisation d'un port fictif (8080)

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

// Créer un serveur HTTP fictif pour écouter sur un port (utile pour Render)
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bot Discord en ligne');
}).listen(process.env.PORT, () => {
  console.log(`Serveur fictif en écoute sur le port ${process.env.PORT}`);
});
