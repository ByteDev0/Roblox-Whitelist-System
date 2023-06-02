const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')

const User = require('../../../models/User')

const randomString = require('../../../utilities/randomString')
const Server = require('../../../models/Server')

let success = 0
let failed  = 0

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mass-whitelist')
        .setDescription('Whitelists all the users that have the specified role.')
        .addRoleOption(option => option.setName('role').setDescription('The role to whitelist everyone that has it').setRequired(true)),
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

        const members_with_role = interaction.guild.members.cache.filter(m => m.roles.cache.find(r => r.id === interaction.options.getRole('role').id))
        const member_ids = members_with_role.map(member => member.id)

        for (const id of member_ids) {
            const result = await User.findOne({ discord_id: id })
            if (!result) {
                await User.create({
                    discord_id: id,
                    key: randomString(42 + Math.floor(Math.random() * 3)),
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
                success++;
            } else {
                if (!result.whitelisted) {
                    success++;
                    await result.updateOne({ whitelisted: true, key: randomString(42 + Math.floor(Math.random() * 3)) })
                } else {
                    failed++;
                }
            }
        }

        await interaction.reply({
            embeds: [new MessageEmbed()
                .setColor(0x2F3136)
                .setTitle(' ')
                .setDescription(success == 0 && `❎ There were no users to whitelist.` || `✅ Successfully whitelisted ${success} user(s), however ${failed} were already whitelisted.` )
                .setTimestamp()
                .setFooter({ text: ' ' })]
        })
    }
}