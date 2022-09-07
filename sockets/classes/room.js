class Room {
    constructor(name, scores, owner, timer) {
        this.name = name;
        this.scores = scores;
        this.owner = owner;
        this.timer = timer;
        this.textMessages = [];
    }
}

module.exports = Room