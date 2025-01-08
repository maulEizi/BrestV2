const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bannir un utilisateur du serveur.')
    .addUserOption(option =>
      option.setName('user')
        .setDescription("L'utilisateur à bannir")
        .setRequired(true)),

  async execute(interaction) {
    // Récupérer l'utilisateur à bannir
    const user = interaction.options.getUser('user');
    
    if (!user) {
      return interaction.reply({ content: 'Utilisateur introuvable', ephemeral: true });
    }

    // Vérification si l'utilisateur à bannir est un bot
    if (user.bot) {
      return interaction.reply({ content: "Tu ne peux pas bannir un bot.", ephemeral: true });
    }

    // Vérification des permissions de l'utilisateur qui exécute la commande
    if (!interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
      return interaction.reply({ content: 'Vous n\'avez pas la permission de bannir des membres.', ephemeral: true });
    }

    // Vérification des permissions du bot
    if (!interaction.guild.me.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
      return interaction.reply({ content: 'Je n\'ai pas la permission de bannir des membres.', ephemeral: true });
    }

    // Vérification de la hiérarchie des rôles (le bot ne peut pas bannir un utilisateur plus haut que lui)
    const member = await interaction.guild.members.fetch(user.id);
    if (member && member.roles.highest.position >= interaction.guild.members.me.roles.highest.position) {
      return interaction.reply({ content: "Je ne peux pas bannir cet utilisateur car il a un rôle plus élevé que moi.", ephemeral: true });
    }

    try {
      // Bannir l'utilisateur
      await interaction.guild.members.ban(user);
      await interaction.reply({ content: `${user.tag} a été banni avec succès !`, ephemeral: true });
    } catch (error) {
      console.error('Erreur lors du bannissement:', error);
      await interaction.reply({ content: 'Une erreur est survenue lors du bannissement.', ephemeral: true });
    }
  },
};
