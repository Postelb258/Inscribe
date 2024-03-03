export class HelpBuilder {
    private INTRO: string = 'List of the available commands:\n\n';
    private helpList: string[] = [];

    addHelp(helpString: string): HelpBuilder {
        this.helpList.push(helpString);
        return this;
    }

    get help(): string {
        return this.INTRO + this.helpList.join('\n');
    }
}
