require('dotenv').config()

const fs = require('fs')

// Register functions globally
fs.readdirSync(__dirname + '/../functions').forEach(fn => require('../functions/' + fn)())

queryPromise('SET NAMES utf8mb4')

queryPromise('DROP TABLE IF EXISTS words')

queryPromise(`
    CREATE TABLE words (
        id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
        word VARCHAR(255) NOT NULL COLLATE 'utf8mb4_unicode_ci',
        prev_id BIGINT(20) UNSIGNED NULL DEFAULT NULL,
        author_id VARCHAR(255) NOT NULL COLLATE 'utf8mb4_unicode_ci',
        channel_id VARCHAR(255) NOT NULL COLLATE 'utf8mb4_unicode_ci',
        created_at TIMESTAMP NULL DEFAULT NULL,
        PRIMARY KEY (id),
        INDEX FK_words_words (prev_id),
        INDEX author_id (author_id),
        INDEX channel_id (channel_id),
        INDEX word (word),
        CONSTRAINT FK_words_words FOREIGN KEY (prev_id) REFERENCES sergey.words (id) ON UPDATE SET NULL ON DELETE SET NULL
    )
    COLLATE='utf8mb4_unicode_ci'
    ENGINE=InnoDB
;`)

queryPromise('DROP TABLE IF EXISTS auto_reactions')

queryPromise(`
    CREATE TABLE auto_reactions (
        id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
        keyword VARCHAR(255) NOT NULL COLLATE 'utf8mb4_unicode_ci',
        emote VARCHAR(255) NOT NULL COLLATE 'utf8mb4_unicode_ci',
        PRIMARY KEY (id)
    )
    COLLATE='utf8mb4_unicode_ci'
    ENGINE=InnoDB
;`)

queryPromise('DROP TABLE IF EXISTS x_words')

queryPromise(`
    CREATE TABLE x_words (
        id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
        word VARCHAR(255) NOT NULL COLLATE 'utf8mb4_unicode_ci',
        PRIMARY KEY (id),
        UNIQUE INDEX word (word)
    )
    COLLATE='utf8mb4_unicode_ci'
    ENGINE=InnoDB
;`)

console.log('Successfully migrated database.');
process.exit();