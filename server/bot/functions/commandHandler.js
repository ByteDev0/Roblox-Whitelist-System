const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const fs = require('fs')

const client_id = ''
const guild_id = ''

module.exports = (client) => {
    client.handleCommands = async (commandFolder, path) => {
        client.commandArray = []
        for (folder of commandFolder) {
            const commandFiles = fs.readdirSync(`${path}/${folder}`).filter(file => file.endsWith('.js'))
            for (const file of commandFiles) {
                const command = require(`../commands/${folder}/${file}`)

                client.commands.set(command.data.name, command)
                client.commandArray.push(command.data.toJSON())
            }
        }

        const rest = new REST({
            version: '9'
        }).setToken('')

        try {
            console.log("Command Handler --> Started refreshing application (/) commands.")

            await rest.put(
                Routes.applicationGuildCommands(client_id, guild_id), {
                    body: client.commandArray
                }
            )

            console.log("Command Handler --> Successfully reloaded application (/) commands.")
        } catch(e) {
            console.error("Command Handler --> " + e)
        }
    }
}