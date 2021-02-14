document.addEventListener('DOMContentLoaded', ()=> {
    const grid = document.querySelector('.grid')
    const scoreDisplay = document.querySelector('#score-text')
    const eventDisplay = document.querySelector('#event-text')
    const width = 28
    const squares = []
    const timePerTick = 200 
    let direction = 'up'
    let RUNNING = true
    let totalDots = countPacDots()
    let powerTime = 0

    createBoard()
    //GAME LOOP    
    setInterval(tick, timePerTick)

    let pacmanCurrentIndex = 490

    squares[pacmanCurrentIndex].classList.add('pac-man')

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
                case 2:
                    squares[i].classList.add('ghost-lair')
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
    
    function tick() {
        if(!RUNNING) return
        movePacman()
        pacDotEaten()
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
        squares[pacmanCurrentIndex].classList.remove('pac-man')
        resetAnimation()
        switch(event.keyCode) {
            //left arrow key
            case 37:
                direction = 'left'
                break
            //up arrow
            case 38:
                direction = 'up'
                break
            //right arrow
            case 39:
                direction = 'right'
                break
            //down arrow
            case 40:
                direction = 'down'
                break
        }
    }
    
    function movePacman() {
        squares[pacmanCurrentIndex].classList.remove('pac-man')
        squares[pacmanCurrentIndex].classList.remove('powered')
        
        switch(direction) {
            case 'left':
                if(pacmanCurrentIndex % width !== 0 && 
                   !squares[pacmanCurrentIndex-1].classList.contains('wall')) 
                   pacmanCurrentIndex-=1
                break
            case 'up':
                if(pacmanCurrentIndex -  width >= 0 && 
                    !squares[pacmanCurrentIndex-width].classList.contains('wall')) 
                    pacmanCurrentIndex-=width
                break
            case 'right':
                if(pacmanCurrentIndex % width < width - 1 && 
                    !squares[pacmanCurrentIndex+1].classList.contains('wall')) 
                    pacmanCurrentIndex+=1
                break
            case 'down':
                if(pacmanCurrentIndex + width < width * width && 
                    !squares[pacmanCurrentIndex+width].classList.contains('wall')) 
                    pacmanCurrentIndex+=width
                break
        }
        animate()
        resetAnimation()
        squares[pacmanCurrentIndex].classList.add('pac-man')
        pacDotEaten()
        powerPelletEaten()
        checkForGameOver()
    }

    function animate() {
        let current = squares[pacmanCurrentIndex]
        let pos = 0
    
        var x = 0;
        var intervalID = setInterval(function () {
            switch(direction) {
                case 'right':
                    if(!squares[pacmanCurrentIndex+1].classList.contains('wall'))
                    pos+= 5
                    current.style.right = -pos + 'px'
                    break
                case 'left':
                    if(!squares[pacmanCurrentIndex-1].classList.contains('wall'))
                    pos+= 5
                    current.style.right = pos + 'px'
                   break
                case 'up':
                    if(!squares[pacmanCurrentIndex-width].classList.contains('wall'))
                    pos+= 5
                    current.style.top = -pos + 'px'
                    break
                case 'down':
                    if(!squares[pacmanCurrentIndex+width].classList.contains('wall'))
                    pos+= 5
                    current.style.top = pos + 'px'
                    break
            }
            if (++x === 4) {
                window.clearInterval(intervalID);
            }
        }, timePerTick/4);
    }

    function resetAnimation() {
        let current = squares[pacmanCurrentIndex]

        current.style.right = '0px'
        current.style.top = '0px'
    }

    function pacDotEaten() {
    
        let current = squares[pacmanCurrentIndex]
        
        if(checkSquaresFor('pac-dot')) {
            totalDots--
        }

        setScoreBoard()
    }
    
    function powerPelletEaten() {
        if(checkSquaresFor('power-pellet'))
            powerTime += 50

        powerTime = powerTime > 0 ? powerTime-1 : 0 
        if(powerTime > 0) 
            squares[pacmanCurrentIndex].classList.add('powered')
        else 
            squares[pacmanCurrentIndex].classList.remove('powered')
    }

    function checkSquaresFor(className) {
        let current = squares[pacmanCurrentIndex]
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
    }

    function checkForGameOver() {
        if(totalDots == 0) {
            RUNNING = false
            eventDisplay.innerHTML = 'PACMAN WINS!'
        }
    }
})


