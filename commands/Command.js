export default class Command {
    command;

    async execute(interaction) {
        throw new Error('No action specified.');
    }

    isRequestedByOwner(interaction) {
        return interaction.user.id === process.env.OWNER_DISCORD_USER_ID;
    }
}