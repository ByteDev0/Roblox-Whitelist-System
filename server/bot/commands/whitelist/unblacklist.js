const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')

const User = require('../../../models/User')

const randomString = require('../../../utilities/randomString')
const Server = require('../../../models/Server')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unblacklist')
        .setDescription(`Allows the user to run the script in the future again.`)
        .addUserOption(option => option.setName('user').setDescription('The user to unblacklist').setRequired(true)),
    async execute(interaction) {
        let user_to_whitelist = await User.findOne({ discord_id: interaction.options.getUser('user').id })
        let server_find = await Server.find()
        let guild_constants = server_find[0]

        if (!user_to_whitelist) {
            if (interaction.user.id != interaction.options.getUser('user').id) {
                await User.create({
                    discord_id: interaction.options.getUser('user').id,
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
    
                user_to_whitelist = await User.findOne({ discord_id: interaction.options.getUser('user').id })
            }
        }

        if (!interaction.member.roles.cache.find(r => r.id === guild_constants.manager_role)) {
            return interaction.reply({ embeds: [new MessageEmbed()
                .setColor(0x2F3136)
                .setTitle(' ')
                .setDescription(':x: You do not have permission to use this command!')
                .setTimestamp()
                .setFooter({ text: ' ' })], ephemeral: true })
        }

        if (!user_to_whitelist.blacklisted) {
            return interaction.reply({ embeds: [new MessageEmbed()
                .setColor(0x2F3136)
                .setTitle(' ')
                .setDescription(':x: This user is not blacklisted!')
                .setTimestamp()
                .setFooter({ text: ' ' })], ephemeral: true })
        }

        await user_to_whitelist.updateOne({ whitelisted: false, blacklisted: false })

        await interaction.options.getUser('user').send({
                embeds: [new MessageEmbed()
                    .setColor(0x2F3136)
                    .setTitle(' ')
                    .setDescription(`✅ You have been unblacklisted by **${interaction.user}**!`)
                    .setTimestamp()
                    .setFooter({ text: ' ' })]
            })

        await interaction.reply({
            embeds: [new MessageEmbed()
                .setColor(0x2F3136)
                .setTitle(' ')
                .setDescription(`✅ Successfully unblacklisted **${interaction.options.getUser('user')}**!`)
                .setTimestamp()
                .setFooter({ text: ' ' })]
        })
    }
}