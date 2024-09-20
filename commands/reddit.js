const Command = require('./Command');
const Discord = require('discord.js');
const axios = require('axios');
const Formatter = require('../classes/Formatter');
const Utils = require('../classes/Utils');

module.exports = class RedditCommand extends Command {
    constructor() {
        super({
            name: 'reddit',
            description: 'Grab a random top post from a Reddit subreddit.',
            paramsRequired: 1,
            example: '!reddit <subreddit>',
        });
    }

    async run(msg) {
        axios.get(`https://www.reddit.com/r/${this.getParamArray(msg)[0]}/top.json?t=all`, {
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
                msg.reply('Nincs érvényes top poszt.');
                return;
            }

            let randomPost = Utils.randArr(posts);
            let fileName = Formatter.getFileNameFromUrl(randomPost.data.url);

            if (randomPost.data.over_18) {
                fileName = `SPOILER_${fileName}`;
            }

            msg.reply({ files: [new Discord.AttachmentBuilder(randomPost.data.url, fileName)] });
        }).catch(err => {
            switch (err.response.status) {
                case 403:
                    msg.reply('Letiltott a reddit, mert túl sokat használtuk a commandot. Várj egy kicsit.');
                    return;

                case 404:
                    msg.reply('Nincs ilyen subreddit.');
                    return;
            }

            throw err;
        });
    }
};