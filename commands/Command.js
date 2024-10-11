export default class Command {
    command;

    async execute(interaction) {
        throw 'No action specified.';
    }

    isRequestedByOwner(interaction) {
        return interaction.user.id === process.env.OWNER_DISCORD_USER_ID;
    }
}