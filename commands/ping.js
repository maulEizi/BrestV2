const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bannir un membre du serveur')
    .addUserOption(option => option.setName('user').setDescription('Membre à bannir').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Raison du bannissement').setRequired(false)),
  
  async execute(interaction) {
    const member = interaction.options.getMember('user');
    const reason = interaction.options.getString('reason') || 'Aucune raison spécifiée';

    if (!interaction.member.permissions.has('BAN_MEMBERS')) {
      return interaction.reply('Tu n\'as pas la permission de bannir des membres.');
    }

    if (!member.bannable) {
      return interaction.reply('Je ne peux pas bannir ce membre.');
    }

    await member.ban({ reason: reason });
    return interaction.reply(`${member.user.tag} a été banni pour : ${reason}`);
  }
};
