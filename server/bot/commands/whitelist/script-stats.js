const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const Server = require('../../../models/Server')
const User = require('../../../models/User')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('script-stats')
        .setDescription('Displays the scripts stats'),
    async execute(interaction) {
        const whitelisted_users = await User.countDocuments({ whitelisted: true })

        await interaction.reply({ embeds: [new MessageEmbed()
            .setColor(0x2F3136)
            .setTitle(' ')
            .setDescription(` 's statistics`)
            .addFields(
                { name: "Whitelisted users", value: whitelisted_users.toString(), inline: true }
            )
            .setTimestamp()
            .setFooter({ text: ' ' })] 
        })
    }
}