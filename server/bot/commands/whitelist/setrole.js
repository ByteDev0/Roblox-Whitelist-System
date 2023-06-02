const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const Server = require('../../../models/Server')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setrole')
        .setDescription('Sets the buyer role to a specified role')
        .addRoleOption(option => option.setName('role').setDescription('The buyer role').setRequired(true)),
    async execute(interaction) {
        let server_find = await Server.find()
        let guild_constants = server_find[0]

        if (!interaction.member.roles.cache.find(r => r.id === guild_constants.manager_role)) {
            const fEmbed = new MessageEmbed()
                .setColor(0x2F3136)
                .setTitle(' ')
                .setDescription(':x: You do not have permission to use this command!')
                .setTimestamp()
                .setFooter({ text: ' ' })
            return interaction.reply({ embeds: [fEmbed], ephemeral: true })
        }

        await Server.updateOne({ buyer_role: interaction.options.getRole('role').id })

        await interaction.reply({
            embeds: [new MessageEmbed()
                .setColor(0x2F3136)
                .setTitle(' ')
                .setDescription(`✅ Successfully set buyer role to ${interaction.options.getRole('role')}!`)
                .setTimestamp()
                .setFooter({ text: ' ' })]
        })
    }
}