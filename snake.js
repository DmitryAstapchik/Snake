class Cell {
    constructor(line, column) {
        this.line = line;
        this.column = column;
    }
}

class Snake {
    constructor(length = 5, fieldSize = 10) {
        this.length = length;
        this.direction = 'right';
        this.fieldSize = fieldSize;
        this.cells = [];
        for (var i = 0; i < length; i++) {
            this.cells.push(new Cell(0, - (i + 1)));
        }
        this.foodEaten = 0;

        document.body.onkeydown = function (e) {
            switch (e.keyCode) {
                case 37:
                    if (this.direction === 'right') {
                        break;
                    }
                    this.direction = 'left';
                    break;
                case 38:
                    if (this.direction === 'down') {
                        break;
                    }
                    this.direction = 'up';
                    break;
                case 39:
                    if (this.direction === 'left') {
                        break;
                    }
                    this.direction = 'right';
                    break;
                case 40:
                    if (this.direction === 'up') {
                        break;
                    }
                    this.direction = 'down';
                    break;
            }
        }.bind(this);
    }

    moveHead() {
        var newHeadCell;
        switch (this.direction) {
            case 'right':
                newHeadCell = document.getElementsByClassName(this.cells[0].line + '_' + (this.cells[0].column + 1 >= this.fieldSize ? 0 : this.cells[0].column + 1))[0];
                this.cells.unshift(new Cell(this.cells[0].line, this.cells[0].column + 1 >= this.fieldSize ? 0 : this.cells[0].column + 1));
                break;
            case 'left':
                newHeadCell = document.getElementsByClassName(this.cells[0].line + '_' + (this.cells[0].column - 1 < 0 ? this.fieldSize - 1 : this.cells[0].column - 1))[0];
                this.cells.unshift(new Cell(this.cells[0].line, this.cells[0].column - 1 < 0 ? this.fieldSize - 1 : this.cells[0].column - 1));
                break;
            case 'up':
                newHeadCell = document.getElementsByClassName((this.cells[0].line - 1 < 0 ? this.fieldSize - 1 : this.cells[0].line - 1) + '_' + this.cells[0].column)[0];
                this.cells.unshift(new Cell(this.cells[0].line - 1 < 0 ? this.fieldSize - 1 : this.cells[0].line - 1, this.cells[0].column));
                break;
            case 'down':
                newHeadCell = document.getElementsByClassName((this.cells[0].line + 1 >= this.fieldSize ? 0 : this.cells[0].line + 1) + '_' + this.cells[0].column)[0];
                this.cells.unshift(new Cell(this.cells[0].line + 1 >= this.fieldSize ? 0 : this.cells[0].line + 1, this.cells[0].column));
                break;
        }
        newHeadCell.classList.add('snake', 'head');
        let oldHeadCell = document.getElementsByClassName(this.cells[1].line + '_' + this.cells[1].column)[0];
        if (oldHeadCell) oldHeadCell.classList.remove('head');
    }

    moveTail() {
        let tailCell = document.getElementsByClassName(snake.cells[snake.cells.length - 1].line + '_' + snake.cells[snake.cells.length - 1].column)[0];
        if (tailCell) tailCell.classList.remove('snake');
        snake.cells.pop();
    }

    eatFood() {
        document.getElementsByClassName('food')[0].classList.remove('food');
        this.foodEaten++;
        document.getElementsByTagName('h1')[0].innerHTML = 'Score:' + snake.foodEaten;
    }

    get isCrossed() {
        for (var i = 0; i < this.cells.length; i++) {
            for (var j = i; j < this.cells.length; j++) {
                if (i !== j && this.cells[i].line === this.cells[j].line && this.cells[i].column === this.cells[j].column) {
                    return true;
                }
            }
        }
        return false;
    }
}

class Food {
    constructor(fieldSize, snakeCoordinates) {
        this.fieldSize = fieldSize;
        this.snakeCoordinates = snakeCoordinates;
    }

    appear() {
        do {
            var ok = true;
            this.line = Math.round(Math.random() * 10 % (this.fieldSize - 1));
            this.column = Math.round(Math.random() * 10 % (this.fieldSize - 1));
            for (var i = 0; i < this.snakeCoordinates.length; i++) {
                if (this.snakeCoordinates[i].line === this.line && this.snakeCoordinates[i].column === this.column) {
                    ok = false;
                }
            }
        } while (!ok);
        let cell = document.getElementsByClassName(this.line + '_' + this.column)[0];
        cell.classList.add('food');
    }
}

class GameField {
    constructor(size, cellSize) {
        this.size = size;
        this.cellSize = cellSize;
    }

    render() {
        let field = document.createElement('div');
        field.className = 'field';
        document.body.appendChild(field);

        for (var i = 0; i < this.size; i++) {
            let line = document.createElement('div');
            line.className = 'line';
            field.appendChild(line);

            for (var j = 0; j < this.size; j++) {
                let cell = document.createElement('div');
                cell.className = i + '_' + j;
                cell.style.width = this.cellSize + 'px';
                cell.style.height = this.cellSize + 'px';
                cell.style.margin = Math.round(this.cellSize / 20) + 'px';
                cell.style.borderWidth = cell.style.margin;
                cell.style.borderRadius = Math.round(this.cellSize / 5) + 'px';
                line.appendChild(cell);
            }
        }
        field.style.width = this.size * (this.cellSize + Math.round(this.cellSize / 20) * 4) + 'px';
        field.style.height = field.style.width;
    }

    gameOver() {
        document.getElementsByClassName('game-over')[1].innerHTML = 'Your score: ' + snake.foodEaten;
        Array.from(document.getElementsByClassName('game-over')).forEach(e => e.style.display = 'block');
    }
}

const gameField = new GameField(10, 30);
gameField.render();
const snake = new Snake(5, gameField.size);
let food = new Food(gameField.size, snake.cells);
food.appear();
let timer = setInterval(function () {
    snake.moveHead();
    if (snake.isCrossed) {
        gameField.gameOver();
        clearInterval(timer);
    }
    else if (snake.cells[0].line === food.line && snake.cells[0].column === food.column) {
        snake.eatFood();
        food = new Food(gameField.size, snake.cells);
        food.appear();
    }
    else {
        snake.moveTail();
    }
}, 400);


