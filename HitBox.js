class Hitbox {
    constructor(index) { 
        this.x = this.getX(index)
        this.y = this.getY(index)
        this.step = 0
    }

    getX() {
        return this.index * 28 
    }

    getY() {
        return this.index - this.getX() / 28
    }

    update() {

    }

    isCollided(other) {
        if(other.getX() >= this.getX() && this.getX() <= other.getX()) {
            if(other.getY() >= this.getY() && this.getY() <= other.getY()) {
                console.log('collision')
                return true
            }
        }
        return false
    }
}