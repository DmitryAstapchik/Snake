class Cell {
    constructor(line, column) {
        this.line = line;
        this.column = column;
    }
}

class Snake {
    constructor(fieldSize, length = 5) {
        this.length = length;
        this.direction = 'right';
        this.fieldSize = fieldSize;
        this.cells = [];
        for (var i = 0; i < length; i++) {
            this.cells.push(new Cell(0, - (i + 1)));
        }
        this.eatenFoodCount = 0;

        document.body.onkeydown = function (e) {
            switch (e.keyCode) {
                case 37:
                    if (this.direction !== 'right') {
                        this.direction = 'left';
                    }
                    break;
                case 38:
                    if (this.direction !== 'down') {
                        this.direction = 'up';
                    }
                    break;
                case 39:
                    if (this.direction !== 'left') {
                        this.direction = 'right';
                    }
                    break;
                case 40:
                    if (this.direction !== 'up') {
                        this.direction = 'down';
                    }
                    break;
            }
        }.bind(this);
    }

    moveHead() {
        var newHeadCell, newCell;
        switch (this.direction) {
            case 'right':
                newCell = new Cell(this.cells[0].line, this.cells[0].column + 1 >= this.fieldSize ? 0 : this.cells[0].column + 1);
                this.cells.unshift(newCell);
                newHeadCell = document.getElementsByClassName(newCell.line + '_' + newCell.column)[0];
                break;
            case 'left':
                newCell = new Cell(this.cells[0].line, this.cells[0].column - 1 < 0 ? this.fieldSize - 1 : this.cells[0].column - 1);
                this.cells.unshift(newCell);
                newHeadCell = document.getElementsByClassName(newCell.line + '_' + newCell.column)[0];
                break;
            case 'up':
                newCell = new Cell(this.cells[0].line - 1 < 0 ? this.fieldSize - 1 : this.cells[0].line - 1, this.cells[0].column);
                this.cells.unshift(newCell);
                newHeadCell = document.getElementsByClassName(newCell.line + '_' + newCell.column)[0];
                break;
            case 'down':
                newCell = new Cell(this.cells[0].line + 1 >= this.fieldSize ? 0 : this.cells[0].line + 1, this.cells[0].column);
                this.cells.unshift(newCell);
                newHeadCell = document.getElementsByClassName(newCell.line + '_' + newCell.column)[0];
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
        this.eatenFoodCount++;
        document.getElementsByTagName('h1')[0].innerHTML = 'Score:' + snake.eatenFoodCount;
    }

    get isLooped() {
        for (var i = 1; i < this.cells.length; i++) {
            if (this.cells[0].line === this.cells[i].line && this.cells[0].column === this.cells[i].column) {
                return true;
            }
        }
        return false;
    }
}

class Food {
    constructor(fieldSize, snakeCells) {
        this.fieldSize = fieldSize;
        this.snakeCells = snakeCells;
    }

    appear() {
        do {
            var ok = true;
            this.line = Math.round(Math.random() * 10 % (this.fieldSize - 1));
            this.column = Math.round(Math.random() * 10 % (this.fieldSize - 1));
            for (var i = 0; i < this.snakeCells.length; i++) {
                if (this.snakeCells[i].line === this.line && this.snakeCells[i].column === this.column) {
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
        document.getElementsByClassName('game-over')[1].innerHTML = 'Your score: ' + snake.eatenFoodCount;
        Array.from(document.getElementsByClassName('game-over')).forEach(e => e.style.display = 'block');
    }
}

const gameField = new GameField(10, 30);
gameField.render();
const snake = new Snake(gameField.size);
let food = new Food(gameField.size, snake.cells);
food.appear();
let timer = setInterval(function () {
    snake.moveHead();
    if (snake.isLooped) {
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


