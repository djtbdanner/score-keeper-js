class Room {
    constructor(name, scores, owner) {
        this.name = name
        this.scores = scores;
        this.owner = owner
        this.textMessages = [];
    }
}

module.exports = Room