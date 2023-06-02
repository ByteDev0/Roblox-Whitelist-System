const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const Server = require('../../../models/Server')

const User = require('../../../models/User')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setmanager')
        .setDescription('Sets the manager role to a specified role')
        .addRoleOption(option => option.setName('role').setDescription('The manager role').setRequired(true)),
    async execute(interaction) {
        let user = await User.findOne({ discord_id: interaction.member.id })
        let server_find = await Server.find()
        let guild_constants = server_find[0]
        
        if (!user) {
            await User.create({
                discord_id: interaction.user.id,
                key: "NO_KEY",
                hwid: "NO_HWID",
                timezone: "NO_TIMEZONE",
                blacklisted: false,
                blacklistedFor: 0,
                violations: 0,
                whitelisted: false,
                whitelistAccess: false,
                lastHWIDReset: 0,
                beforeReset: 0
            })

            user = await User.findOne({ discord_id: interaction.user.id })
        }

        if (user.whitelistAccess == false) {
            const fEmbed = new MessageEmbed()
                .setColor(0x2F3136)
                .setTitle(' ')
                .setDescription(':x: You do not have permission to use this command!')
                .setTimestamp()
                .setFooter({ text: ' ' })
            return interaction.reply({ embeds: [fEmbed], ephemeral: true })
        }

        await Server.updateOne({ manager_role: interaction.options.getRole('role').id })

        await interaction.reply({
            embeds: [new MessageEmbed()
                .setColor(0x2F3136)
                .setTitle(' ')
                .setDescription(`✅ Successfully set manager role to ${interaction.options.getRole('role')}!`)
                .setTimestamp()
                .setFooter({ text: ' ' })]
        })
    }
}