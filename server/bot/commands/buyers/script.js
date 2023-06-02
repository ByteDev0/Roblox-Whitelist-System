const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const User = require('../../../models/User')

const fs = require('fs')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('script')
        .setDescription('Sends the script with your script key in DMs.'),
    async execute(interaction) {
        let user = await User.findOne({ discord_id: interaction.member.id })

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

        const buffer = fs.readFileSync(`./assets/loader.lua`)
        const loader = buffer.toString();

        await interaction.member.send({
            embeds: [new MessageEmbed()
                .setColor(0x2F3136)
                .setTitle(' ')
                .addFields(
                    { name: 'Click to reveal:', value: `||\`\`\`lua\ngetgenv().script_key = "${user.key}";\n\n${loader}\n\nloadstring(game:HttpGet("http://api. s.space/v1/api/script"))();\n\`\`\`||` }
                )
                .setTimestamp()
                .setFooter({ text: ' ' })]
        })

        await interaction.reply({
            embeds: [new MessageEmbed()
                .setColor(0x2F3136)
                .setTitle(' ')
                .setDescription('✅ Successfully sent you the script in DMs!')
                .setTimestamp()
                .setFooter({ text: ' ' })]
        })
    }
}