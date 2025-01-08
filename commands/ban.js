module.exports = {
  data: {
    name: 'ban',
    description: 'Bannir un utilisateur du serveur.',
    options: [
      {
        name: 'user',
        type: 'USER',
        description: 'L\'utilisateur à bannir',
        required: true,
      },
    ],
  },
  execute: async (interaction) => {
    const user = interaction.options.getUser('user');
    if (!user) {
      return interaction.reply({ content: 'Veuillez mentionner un utilisateur à bannir.', ephemeral: true });
    }

    // Vérification des permissions de l'utilisateur
    if (!interaction.member.permissions.has('BAN_MEMBERS')) {
      return interaction.reply({ content: 'Vous n\'avez pas la permission de bannir des membres.', ephemeral: true });
    }

    // Vérification des permissions du bot
    if (!interaction.guild.me.permissions.has('BAN_MEMBERS')) {
      return interaction.reply({ content: 'Je n\'ai pas la permission de bannir des membres.', ephemeral: true });
    }

    try {
      // Bannir l'utilisateur
      await interaction.guild.members.ban(user);
      await interaction.reply({ content: `${user.tag} a été banni avec succès !`, ephemeral: true });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Une erreur est survenue lors du bannissement de l\'utilisateur.', ephemeral: true });
    }
  },
};
