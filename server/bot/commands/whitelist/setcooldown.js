const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')

const User = require('../../../models/User')

const randomString = require('../../../utilities/randomString')
const Server = require('../../../models/Server')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setcooldown')
        .setDescription('Changes the amount of days you need to wait to reset your HWID.')
        .addNumberOption(option => option.setName('days').setDescription('The amount of days').setRequired(true)),
    async execute(interaction) {
        let server_find = await Server.find()
        let guild_constants = server_find[0]

        if (!interaction.member.roles.cache.find(r => r.id === guild_constants.manager_role)) {
            return interaction.reply({ embeds: [new MessageEmbed()
                .setColor(0x2F3136)
                .setTitle(' ')
                .setDescription(':x: You do not have permission to use this command!')
                .setTimestamp()
                .setFooter({ text: ' ' })], ephemeral: true })
        }

        await Server.updateOne({ cooldown_amount: interaction.options.getNumber('days') })

        await interaction.reply({
            embeds: [new MessageEmbed()
                .setColor(0x2F3136)
                .setTitle(' ')
                .setDescription(`✅ Successfully changed HWID reset cooldown!`)
                .setTimestamp()
                .setFooter({ text: ' ' })]
        })
    }
}