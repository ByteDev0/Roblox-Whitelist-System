const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName)

        if (!command) return;

        try {
            await command.execute(interaction)
        } catch(e) {
            console.error('Interaction Create --> ' + e)
            await interaction.reply({
                embeds: [new MessageEmbed()
                    .setColor(0x2F3136)
                    .setTitle(' ')
                    .setDescription(`:x: An unexpected error occured while executing this command!`)
                    .setTimestamp()
                    .setFooter({ text: ' ' })],
                ephemeral: true
            })
        }
    }
}