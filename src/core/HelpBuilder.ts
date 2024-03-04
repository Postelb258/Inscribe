type HelpMessageList = string[]

export type CommandHelp = {
    commandName: string
    commandHelp: string
    commandArgs?: string
}

export class HelpBuilder {
    helpMessageList: HelpMessageList = [
        'The list of available commands:\n\n',
        `/help - displays the available commands\n`
    ]

    addHelpMessage(commandHelp: CommandHelp): HelpBuilder {
        this.helpMessageList.push(
            `/${commandHelp.commandName} ${commandHelp.commandArgs ?? ''} - ${
                commandHelp.commandHelp
            }`
        )

        return this
    }

    constructHelp(): string {
        return this.helpMessageList.join('\n')
    }
}
