const Command = require('./Command');
const Discord = require('discord.js');
const axios = require('axios');
const Formatter = require('../classes/Formatter');
const Utils = require('../classes/Utils');

module.exports = class RedditCommand extends Command {
    command = new Discord.SlashCommandBuilder()
        .setName('reddit')
        .setDescription('Show a random top post from a Reddit subreddit.')
        .addStringOption(option => 
            option
                .setName('subreddit')
                .setDescription('The subreddit you want to get an image from (without r/).')
                .setRequired(true)
        );

    async execute(interaction) {
        await interaction.deferReply();

        let subreddit = interaction.options.getString('subreddit');

        axios.get(`https://www.reddit.com/r/${subreddit}/top.json?t=all`, {
            params: {
                limit: 100,
            },
        }).then(resp => {
            const allowedTypes = ['jpg', 'png', 'webp', 'gif'];

            let posts = resp.data.data.children.filter(post => {
                // Filter posts that contain media of allowed types
                return allowedTypes.some(type => post.data.url.endsWith(`.${type}`));
            });

            if (posts.length === 0) {
                interaction.editReply(`No posts found in r/${subreddit}.`);
                return;
            }

            let randomPost = Utils.randArr(posts);
            let fileName = Formatter.getFileNameFromUrl(randomPost.data.url);

            if (randomPost.data.over_18) {
                fileName = `SPOILER_${fileName}`;
            }

            interaction.editReply({ files: [new Discord.AttachmentBuilder(randomPost.data.url, fileName)] });
        }).catch(err => {
            switch (err.response.status) {
                case 403:
                    interaction.editReply('The command was used too often and Reddit detected it as spam. Please wait for a bit and try again.');
                    return;

                case 404:
                    interaction.editReply(`r/${subreddit} doesn't exist.`);
                    return;
            }

            throw err;
        });
    }
};