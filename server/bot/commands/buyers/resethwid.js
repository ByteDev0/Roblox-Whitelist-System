const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const User = require('../../../models/User')
const Server = require('../../../models/Server')

function msTo(ms, unit) {
    const units = {days: 24*60*60*1000, hours: 60*60*1000, minutes: 60*1000};
    return Math.floor(ms / units[unit]);
}

module.exports = {
    data: new SlashCommandBuilder().setName('resethwid').setDescription('Resets your HWID back to an empty value.'),
    async execute(interaction) {
        let guild_constants = (await Server.find())[0]
        const current_time = new Date().getTime()
        const cooldown_time = current_time + guild_constants.cooldown_amount * 24*60*60*1000;
        
        let user = await User.findOneAndUpdate(
            { discord_id: interaction.member.id },
            { $setOnInsert: { discord_id: interaction.user.id, hwid: '', key: "NO_KEY", whitelisted: false, lastHWIDReset: 0, beforeReset: 0 } },
            { new: true, upsert: true }
        )

        if (!user.whitelisted) {
            return interaction.reply({ 
                embeds: [new MessageEmbed().setColor(0x2F3136).setDescription(':x: You do not have permission to use this command!')], 
                ephemeral: true 
            })
        }

        if (user.lastHWIDReset > current_time) {
            return interaction.reply({ embeds: [new MessageEmbed()
                .setColor(0x2F3136)
                .setDescription(`:x: You are on cooldown! Please wait ${msTo(user.lastHWIDReset - user.beforeReset, 'days')} day(s), ${msTo(user.lastHWIDReset - user.beforeReset, 'hours')} hour(s), ${msTo(user.lastHWIDReset - user.beforeReset, 'minutes')} minute(s) to be able to reset your HWID again.`)
            ]})
        }

        await User.updateOne({ discord_id: interaction.member.id }, { lastHWIDReset: cooldown_time, beforeReset: current_time, hwid: '' })

        await interaction.reply({ embeds: [new MessageEmbed()
            .setColor(0x2F3136)
            .setDescription(`✅ Successfully reset your HWID. You will be able to reset your HWID again in ${msTo(cooldown_time - current_time, 'days')} day(s), ${msTo(cooldown_time - current_time, 'hours')} hour(s), ${msTo(cooldown_time - current_time, 'minutes')} minute(s).`)
        ]})
    }
}
