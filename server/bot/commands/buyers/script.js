const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const User = require('../../../models/User')
const fs = require('fs')

module.exports = {
    data: new SlashCommandBuilder().setName('script').setDescription('Sends the script with your script key in DMs.'),
    async execute(interaction) {
        let user = await User.findOneAndUpdate({ discord_id: interaction.member.id }, 
                                               { $setOnInsert: { discord_id: interaction.user.id, key: "NO_KEY", hwid: "NO_HWID", whitelisted: false }}, 
                                               { new: true, upsert: true })

        if (!user.whitelisted) {
            return interaction.reply({ embeds: [new MessageEmbed().setColor(0x2F3136).setDescription(':x: You do not have permission to use this command!')], ephemeral: true })
        }

        await interaction.member.send({
            embeds: [new MessageEmbed()
                .setColor(0x2F3136)
                .addField('Click to reveal:', `||\`\`\`lua\ngetgenv().script_key = "${user.key}";\n\n${fs.readFileSync('./assets/loader.lua')}\n\nloadstring(game:HttpGet("http://api. s.space/v1/api/script"))();\n\`\`\`||`)]
        })

        await interaction.reply({
            embeds: [new MessageEmbed().setColor(0x2F3136).setDescription('✅ Successfully sent you the script in DMs!')]
        })
    }
}

