class Ghost {

    constructor(name, index) {
        this.name = name
        this.index = index
    }

    init() {
        squares[this.index].classList.add(this.name)
    }

    tick() {

    }

    die() {

    }

    checkForPacman() {

    }
}