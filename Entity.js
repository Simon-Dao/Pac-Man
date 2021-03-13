class Entity {
    constructor(index) {
        this.index = index
        this.spawnIndex = index
        this.direction = 'up'
        this.hitbox = new Hitbox()
    }
}