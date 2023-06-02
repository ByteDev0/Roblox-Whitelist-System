const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const Server = require('../../../models/Server')

const fs = require('fs')
const request = require('request')
function download(url) {
    request.get(url)
        .pipe(fs.createWriteStream(`./assets/loader.lua`))
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setscript')
        .setDescription('Changes the loader for when an user runs the /script command.')
        .addAttachmentOption(option => option.setName('script_file').setDescription('The file of the script').setRequired(true)),
    async execute(interaction) {
        let server_find = await Server.find()
        let guild_constants = server_find[0]

        console.log(interaction.options.getAttachment('script_file').url)
        console.log(interaction.options.getAttachment('script_file').name)

        if (!interaction.member.roles.cache.find(r => r.id === guild_constants.manager_role)) {
            return interaction.reply({ embeds: [new MessageEmbed()
                .setColor(0x2F3136)
                .setTitle(' ')
                .setDescription(':x: You do not have permission to use this command!')
                .setTimestamp()
                .setFooter({ text: ' ' })], ephemeral: true })
        }

        fs.unlink(`./assets/loader.lua`, function(err) {
            if (err) return console.error('Set Script --> '+ err)
            download(interaction.options.getAttachment('script_file').url)
        })
        const buffer = fs.readFileSync(`./assets/loader.lua`)
        const main_script = buffer.toString();

        await interaction.reply({ embeds: [new MessageEmbed()
            .setColor(0x2F3136)
            .setTitle(' ')
            .setDescription('✅ Successfully changed the script loader!')
            .addFields(
                { name: "Click to reveal:", value: `||\`\`\`lua\n${main_script}\`\`\`||` }
            )
            .setTimestamp()
            .setFooter({ text: ' ' })], ephemeral: true })
    }
}