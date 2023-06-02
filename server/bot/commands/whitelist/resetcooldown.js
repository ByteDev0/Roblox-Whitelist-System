const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')

const User = require('../../../models/User')

const randomString = require('../../../utilities/randomString')
const Server = require('../../../models/Server')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resetcooldown')
        .setDescription(`Resets someone's HWID reset cooldown.`)
        .addUserOption(option => option.setName('user').setDescription('User to reset cooldown').setRequired(true)),
    async execute(interaction) {
        let user_to_reset = await User.findOne({ discord_id: interaction.options.getUser('user').id })
        let server_find = await Server.find()
        let guild_constants = server_find[0]

        if (!user_to_reset) {
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
    
                user_to_reset = await User.findOne({ discord_id: interaction.options.getUser('user').id })
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

        const current_time = new Date().getTime()

        if (current_time > user_to_reset.lastHWIDReset) {
            return interaction.reply({ embeds: [new MessageEmbed()
                .setColor(0x2F3136)
                .setTitle(' ')
                .setDescription(`:x: This user's HWID reset ability is not on cooldown.`)
                .setTimestamp()
                .setFooter({ text: ' ' })] })
        }

        await user_to_reset.updateOne({ lastHWIDReset: 0, beforeReset: 0 })

        await interaction.options.getUser('user').send({
                embeds: [new MessageEmbed()
                    .setColor(0x2F3136)
                    .setTitle(' ')
                    .setDescription(`✅ Your HWID reset cooldown has been reset by ${interaction.member}!`)
                    .setTimestamp()
                    .setFooter({ text: ' ' })]
            })

        await interaction.reply({
            embeds: [new MessageEmbed()
                .setColor(0x2F3136)
                .setTitle(' ')
                .setDescription(`✅ Successfully reset the cooldown of **${interaction.options.getUser('user')}**!`)
                .setTimestamp()
                .setFooter({ text: ' ' })]
        })
    }
}