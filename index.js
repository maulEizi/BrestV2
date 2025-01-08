const { Client, GatewayIntentBits, Collection } = require('discord.js');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Définir un port fictif pour Render
process.env.PORT = process.env.PORT || 8080;

// Créer le client Discord
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

// Initialiser la collection de commandes
client.commands = new Collection();

// Charger toutes les commandes depuis le dossier 'commands'
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  client.commands.set(command.data.name, command);
}

// Quand le bot est prêt, enregistrer les commandes Slash auprès de Discord
client.once('ready', async () => {
  console.log('Bot est prêt et connecté!');

  // ID du serveur (ou guild) où enregistrer les commandes
  const guildId = 'TON_ID_DE_SERVEUR'; // Remplace par l'ID de ton serveur
  const guild = await client.guilds.fetch(guildId);

  // Enregistrer toutes les commandes slash
  await guild.commands.set(client.commands.map(command => command.data));
  console.log('Commandes Slash enregistrées sur le serveur.');

  // Optionnel : pour enregistrer les commandes globales (mais cela peut prendre plus de temps)
  // await client.application.commands.set(client.commands.map(command => command.data));
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
