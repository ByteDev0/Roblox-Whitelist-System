const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const User = require('../../../models/User')

const Server = require('../../../models/Server')

function daysToMs(days) {
    return ((24 * 60 * 60) * parseInt(days)) * 1000
}

function msToTime(ms, current) {
    return (parseInt(ms) + parseInt(current))
}

function msToDays(ms) {
    return Math.floor(parseInt(ms) / (1000 * 60 * 60 * 24))
}

function msToHours(ms) {
    return Math.floor((parseInt(ms) / (1000 * 60 * 60)) % 60)
}

function msToMinutes(ms) {
    return Math.floor(parseInt(ms) / (1000 * 60) % 60)
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resethwid')
        .setDescription('Resets your HWID back to an empty value.'),
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

        if (user.whitelisted == false) {
            const fEmbed = new MessageEmbed()
                .setColor(0x2F3136)
                .setTitle(' ')
                .setDescription(':x: You do not have permission to use this command!')
                .setTimestamp()
                .setFooter({ text: ' ' })
            return interaction.reply({ embeds: [fEmbed], ephemeral: true })
        }
        
        const current_time = new Date().getTime()
        const is_on_cooldown = user.lastHWIDReset > current_time

        if (is_on_cooldown) {
            return interaction.reply({ embeds: [new MessageEmbed()
                .setColor(0x2F3136)
                .setTitle(' ')
                .setDescription(`:x: You are on cooldown! Please wait \`\`${msToDays(user.lastHWIDReset - user.beforeReset)}\`\` day(s), \`\`${msToHours(user.lastHWIDReset - user.beforeReset)}\`\` hour(s), \`\`${msToMinutes(user.lastHWIDReset - user.beforeReset)}\`\` minute(s) to be able to reset your HWID again.`)
                .setTimestamp()
                .setFooter({ text: ' ' })] })
        }

        const cooldown_time = msToTime(daysToMs(guild_constants.cooldown_amount), current_time)
        await user.updateOne({ lastHWIDReset: cooldown_time, beforeReset: current_time, hwid: '' })

        await interaction.reply({ embeds: [new MessageEmbed()
            .setColor(0x2F3136)
            .setTitle(' ')
            .setDescription(`✅ Successfully reset your HWID. You will be able to reset your HWID again in \`\`${msToDays(cooldown_time - current_time)}\`\` day(s), \`\`${msToHours(cooldown_time - current_time)}\`\` hour(s), \`\`${msToMinutes(cooldown_time - current_time)}\`\` minute(s).`)
            .setTimestamp()
            .setFooter({ text: ' ' })] })
    }
}