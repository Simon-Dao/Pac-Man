//todo make pacman stop turning black when turning
//todo implement a more object oriented design to your code
//todo add sound to the game
//todo make the ghosts have their own personalities
//todo get a better system for ghosts to detect collisions with pacman

document.addEventListener('DOMContentLoaded', ()=> {
    const grid = document.querySelector('.grid')
    const scoreDisplay = document.querySelector('#score-text')
    const eventDisplay = document.querySelector('#event-text')
    const livesDisplay = document.querySelector('#lives-text')
    const width = 28
    const squares = []
    //should be 200
    const timePerTick = 200
    let powerTime = 0
    let RUNNING = true
    let totalDots = countPacDots()
    let opposites = new Map()
    getOppositeDirectionMap()

    const pinkGhost = new Ghost('pink-ghost',322)
    //const redGhost = new Ghost('red-ghost',350)
    //const blueGhost = new Ghost('blue-ghost',377)
    //const orangeGhost = new Ghost('orange-ghost',378)
    const pac = new Pacman(490)

    let ghosts = [pinkGhost]//, redGhost, blueGhost, orangeGhost]

    createBoard()
    loadEntities()
    //GAME LOOP    
    setInterval(tick, timePerTick)

    document.addEventListener('keyup', updatePacmanDirection) 

    function createBoard() {
        for(var i=0; i<layout.length; i++) {
            const square = document.createElement('div')
            grid.appendChild(square)
            squares.push(square) 
    
            //add layout to the board
            switch(layout[i]) {
                case 0:
                    squares[i].classList.add('pac-dot')
                    break
                case 1:
                    squares[i].classList.add('wall')
                    break
                case 3:
                    squares[i].classList.add('power-pellet')
                    break
                case 4:
                    squares[i].classList.add('empty')
                    break
            }
        }
    }

    function loadEntities() {
        squares[pac.index].classList.add('pac-man')
        ghosts.forEach(
            (ghost) => {
                squares[ghost.index].classList.add(ghost.name)
            }
        )
    }

    function tick() {
        if(!RUNNING) return
        movePacman()
        ///*
        ghosts.forEach(
            (ghost) => {
                updateGhosts(ghost)
            }
        )
        //*/
        pacDotEaten()
        powerPelletEaten()
    }

    function countPacDots() {
        let count = 0

        layout.forEach(element => {
            if(element === 0)count++
        })
        return count
    }

    function updatePacmanDirection(event) {
        if(!RUNNING) return
        squares[pac.index].classList.remove('pac-man')
        resetAnimation()
        switch(event.keyCode) {
            //left arrow key
            case 37:
                pac.direction = 'left'
                break
            //up arrow
            case 38:
                pac.direction = 'up'
                break
            //right arrow
            case 39:
                pac.direction = 'right'
                break
            //down arrow
            case 40:
                pac.direction = 'down'
                break
        }
    }
    
    function getOppositeDirectionMap() {
        opposites.set('left','right')
        opposites.set('right','left')
        opposites.set('up','down')
        opposites.set('down','up')
    }

    function movePacman() {
        squares[pac.index].classList.remove('pac-man')

        switch(pac.direction) {
            case 'left':
                if(pac.index % width !== 0 && 
                   !squares[pac.index-1].classList.contains('wall')) {
                    pac.index-=1
                }
                break
            case 'up':
                if(pac.index - width >= 0 && 
                    !squares[pac.index-width].classList.contains('wall')) 
                    pac.index-=width
                break
            case 'right':
                if(pac.index % width < width - 1 && 
                    !squares[pac.index+1].classList.contains('wall')) 
                    pac.index+=1
                break
            case 'down':
                if(pac.index + width < width * width && 
                    !squares[pac.index+width].classList.contains('wall')) 
                    pac.index+=width
                break
        }
        if(pac.index === 391) pac.index = 364
        else if(pac.index === 364) pac.index = 391

        animatePacman()
        squares[pac.index].classList.add('pac-man')
        pacDotEaten()
        checkForGameOver()
    }

    function updateGhosts(ghost) {
        squares[ghost.index].classList.remove(ghost.name)
        squares[ghost.index].classList.remove('powered')
        
        switch(ghost.direction) {
            case 'left':
                if(ghost.index % width !== 0 && 
                   !squares[ghost.index-1].classList.contains('wall')) 
                   ghost.index-=1
                else 
                    ghost.direction = randomDirection(ghost,ghost.direction) 
                break
            case 'up':
                if(ghost.index -  width >= 0 && 
                    !squares[ghost.index-width].classList.contains('wall')) 
                    ghost.index-=width
                else 
                    ghost.direction = randomDirection(ghost,ghost.direction) 
                break
            case 'right':
                if(ghost.index % width < width - 1 && 
                    !squares[ghost.index+1].classList.contains('wall')) 
                    ghost.index+=1
                else 
                    ghost.direction = randomDirection(ghost,ghost.direction) 
                break
            case 'down':
                if(ghost.index + width < width * width && 
                    !squares[ghost.index+width].classList.contains('wall')) 
                    ghost.index+=width
                else 
                    ghost.direction = randomDirection(ghost,ghost.direction) 
                break
        }
        if(atJunction(ghost)) ghost.direction = randomDirection(ghost,ghost.direction)
        if(ghost.index === 391) ghost.index = 364
        else if(ghost.index === 364) ghost.index = 391
        squares[ghost.index].classList.add(ghost.name)
        checkForPac(ghost)
        animateGhost(ghost)
        checkGhostEaten(ghost)
    }

    function checkForPac(ghost) {
        if(ghost.hitbox.isCollided(pac.hitbox) && powerTime == 0 && !ghost.powered) {
            pac.lives--
            resetGame()
        } 
    }

    function resetGame() {
        ghosts.forEach((ghost) => {
            squares[ghost.index].className = 'empty'
            ghost.index = ghost.spawnIndex
        })
        layout = original
        pac.index = 490
    }

    function checkGhostEaten(ghost) {
        if(powerTime > 0 && pac.hitbox.isCollided(ghost.hitbox) && ghost.powered) {
            squares[ghost.index].className = 'empty'
            ghost.index = ghost.spawnIndex
            ghost.powered = false
        }
    }

    function atJunction(ghost) {
        let count = 0
        //check left
        if(!squares[ghost.index-1].classList.contains('wall')) count++
        //check right
        if(!squares[ghost.index+1].classList.contains('wall')) count++
        //check up
        if(!squares[ghost.index-width].classList.contains('wall')) count++
        //check down
        if(!squares[ghost.index+width].classList.contains('wall')) count++

        return count >= 3
    }

    function randomDirection() {
        let directions = ['up','down','left','right']

        let randomIndex = Math.floor(Math.random() * Math.floor(directions.length));
        return directions[randomIndex]
    }

    function randomDirection(ghost,oldDirection) {
        oldDirection = opposites.get(oldDirection)
        let directions = getAvailableDirections(ghost)
        let randomIndex = Math.floor(Math.random() * Math.floor(directions.length));
        let newDirection = directions[randomIndex]
        let x = 0;
        while(newDirection === oldDirection && x < 4) {
            x++
            randomIndex = Math.floor(Math.random() * Math.floor(directions.length));
            newDirection = directions[randomIndex]
        }
        return newDirection
    }

    function getAvailableDirections(ghost) {
        let availableDirections = []
        //check left
        if(!squares[ghost.index-1].classList.contains('wall')) 
        availableDirections.push('left')
        //check right
        if(!squares[ghost.index+1].classList.contains('wall')) 
        availableDirections.push('right')
        //check up
        if(!squares[ghost.index-width].classList.contains('wall')) 
        availableDirections.push('up')
        //check down
        if(!squares[ghost.index+width].classList.contains('wall')) 
        availableDirections.push('down')

        return availableDirections  
    }

    function animatePacman() {
        let current = squares[pac.index]
        let pos = 0

        var x = 0;
        var intervalID = setInterval(function () {
            switch(pac.direction) {
                case 'right':
                    if(!squares[pac.index+1].classList.contains('wall')) {
                        pos+= 5
                        pac.hitbox.x += .25
                    }
                    current.style.right = -pos + 'px'
                    break
                case 'left':
                    if(!squares[pac.index-1].classList.contains('wall')) {
                        pos+= 5
                        pac.hitbox.x -= .25
                    }
                    current.style.right = pos + 'px'
                   break
                case 'up':
                    if(!squares[pac.index-width].classList.contains('wall')) {
                        pos+= 5
                        pac.hitbox.y -= .25
                    }
                    current.style.top = -pos + 'px'
                    break
                case 'down':
                    if(!squares[pac.index+width].classList.contains('wall')) {
                        pos+= 5
                        pac.hitbox.y += .25
                    }
                    current.style.top = pos + 'px'
                    break
            }

            if (++x === 4) {
                window.clearInterval(intervalID);
            }
        }, timePerTick/4);
        resetAnimation()
    }

    function animateGhost(ghost) {
        let current = squares[ghost.index]
        let pos = 0
        var x = 0;
        var intervalID = setInterval(function () {
            switch(ghost.direction) {
                case 'right':
                    if(!squares[ghost.index+1].classList.contains('wall'))
                    pos+= 5
                    current.style.right = -pos + 'px'
                    break
                case 'left':
                    if(!squares[ghost.index-1].classList.contains('wall'))
                    pos+= 5
                    current.style.right = pos + 'px'
                   break
                case 'up':
                    if(!squares[ghost.index-width].classList.contains('wall'))
                    pos+= 5
                    current.style.top = -pos + 'px'
                    break
                case 'down':
                    if(!squares[ghost.index+width].classList.contains('wall'))
                    pos+= 5
                    current.style.top = pos + 'px'
                    break
            }
            if (++x === 4) {
                window.clearInterval(intervalID);
            }
        }, timePerTick/4);

        current.style.right = '0px'
        current.style.top = '0px'
    }

    function resetAnimation() {
        let current = squares[pac.index]

        current.style.right = '0px'
        current.style.top = '0px'
        pac.hitbox.x = Math.floor(pac.hitbox.x)
        pac.hitbox.y = Math.floor(pac.hitbox.y)
    }

    function pacDotEaten() {
    
        let current = squares[pac.index]
        
        if(checkSquaresFor('pac-dot')) {
            totalDots--
        }

        setScoreBoard()
    }
    
    function powerPelletEaten() {
        if(checkSquaresFor('power-pellet')) {
            powerTime += 50
        }
        powerTime = powerTime > 0 ? powerTime-1 : 0 
        if(powerTime > 0) { 
            ghosts.forEach(
                (ghost) => {
                    squares[ghost.index].classList.remove(ghost.name)
                    squares[ghost.index].classList.add('.powered')
                    ghost.powered = true
                }
            )
        } else { 
            ghosts.forEach(
                (ghost) => {
                    squares[ghost.index].classList.add(ghost.name)
                    squares[ghost.index].classList.remove('.powered')
                    ghost.powered = true
                }
            )
        }
    }

    function checkSquaresFor(className) {
        let current = squares[pac.index]
        let containsName = false
        if(current.classList.contains(className)) {
            current.classList.remove(className)
            current.classList.add('empty')
            containsName = true
        }

        return containsName;
    }

    function setScoreBoard() {
        scoreDisplay.innerHTML = totalDots+''
        livesDisplay.innerHTML = ''+pac.lives
    }

    function checkForGameOver() {
        
        /*
        if(totalDots == 0) {
            RUNNING = false
            eventDisplay.innerHTML = 'PACMAN WINS!'
        }

        if(pacLives == 0) {
            RUNNING = false
            eventDisplay.innerHTML = 'GHOSTS WIN!'
        }
        */
    }
})