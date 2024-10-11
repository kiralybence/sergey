import FetchedWord from './FetchedWord.js';

export default class Imitator {
    /**
     * @param {string} author_id
     * @param {number|null} days Limit messages to past X days
     */
    constructor(author_id, days = null) {
        this.maxWords = 100; // hardcoded for now
        this.author_id = author_id;
        this.days = days;
        this.selectedWord = null;
        this.starterWordOffset = 0;
        this.fakeText = [];
    }

    /**
     * Generate a fake text to imitate a certain person.
     *
     * @return {Promise<string>}
     */
    async imitate() {
        this.selectedWord = await this.getNextStarterWord();

        while (!this.maxWordsReached() && !this.isDepleted()) {
            this.fakeText.push(this.selectedWord.word);
            this.selectedWord = await this.getNextWord();
        }

        return this.getFormattedFakeText();
    }

    /**
     * Check if the fake text has reached the specified maximum length.
     *
     * @return {boolean}
     */
    maxWordsReached() {
        return this.fakeText.length >= this.maxWords;
    }

    /**
     * Check if there are no more words left to use.
     *
     * @return {boolean}
     */
    isDepleted() {
        return !this.selectedWord || this.selectedWord.isEmpty();
    }

    /**
     * Return the next word to use (from any queues or sources).
     *
     * @return {Promise<FetchedWord>}
     */
    async getNextWord() {
        return await this.getNextFollowingWord() ?? await this.getNextStarterWord();
    }

    /**
     * Return the next started word.
     * This should only be used if getNextFollowingWord() cannot be used.
     *
     * @return {Promise<FetchedWord|null>}
     */
    async getNextStarterWord() {
        let starterWord = null;

        do {
            starterWord = await FetchedWord.getStarterWord(this.author_id, this.starterWordOffset++, this.days);
        } while (starterWord !== null && !starterWord.canBeUsedToImitate());

        return starterWord;
    }

    /**
     * Return the word that most often follows the current word.
     * This is a wrapper around FetchedWord.getNextFollowingWord(), because we also have to calculate the offset.
     *
     * @return {Promise<FetchedWord|null>}
     */
    async getNextFollowingWord() {
        let followingWord = null;
        let iterations = 0; // We must keep track of iterations, because if a word was found, but it doesn't meet the criteria, then it shouldn't be picked again.

        do {
            // Subtracting 1 from the offset, because this is being called right after inserting the current word,
            // so there is no way the next top word has been used before.
            let timesUsed = this.getTimesUsedInFakeText(this.selectedWord.word);
            let offset = (timesUsed > 0 ? timesUsed - 1 : timesUsed) + iterations++;

            followingWord = await this.selectedWord.getNextFollowingWord(offset, this.days);
        } while (followingWord !== null && !followingWord.canBeUsedToImitate());

        return followingWord;
    }

    /**
     * We keep track of how many times we've already used a certain word,
     * so the next time we'll pick a different one to avoid infinitely repeating patterns.
     *
     * @param {string} string
     * @return {number}
     */
    getTimesUsedInFakeText(string) {
        return this.fakeText.filter(word => word === string).length;
    }

    /**
     * Prepare the fake text as a string.
     *
     * @return {string}
     */
    getFormattedFakeText() {
        return this.fakeText.join(' ').substring(0, 1900); // so we don't reach Discord's character limit
    }
}