const prompt = require('prompt-sync')({sigint: true});
const term = require( 'terminal-kit' ).terminal;

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

let booleanField = [];
let visited = [];
let correctPath = [];
let startRow = 0;
let endRow = 0;
let startColumn = 0;
let endColumn = 0;

class Field {
    
    constructor(field) {
        this.field = field;
    }

    print() {
        let myField = "";
        for (let i = 0; i < this.field.length; i++) {
            for (let j = 0; j < this.field[0].length; j++) {
                myField += this.field[i][j];
            }
            myField += "\n"; 
        }

        return myField;
    }

    static generateField(height, width) {
        let myField = [];
        let fieldArea = height * width;
        let holePercentage = 1 / 4;
        let numOfHoles = Math.floor(fieldArea * holePercentage)

        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                if (!myField[i]) {
                    myField[i] = [];
                }

                if (!myField[i][j]) {
                    myField[i][j] = fieldCharacter;
                }
            }
        }

        myField[0][0] = pathCharacter;

        let hatColumn = 0;
        let hatRow = 0; 

        while (hatColumn === 0 && hatRow === 0) {
            hatRow = Math.floor(Math.random() * height);
            hatColumn = Math.floor(Math.random() * width);
        }

        endColumn = hatColumn;
        endRow = hatRow; 
        
        myField[hatRow][hatColumn] = hat;

        for (let i = 0; i < numOfHoles; i++) {
            let holeColumn = 0;
            let holeRow = 0;

            while ((holeColumn === 0 && holeRow === 0) || myField[holeRow][holeColumn] === hat) {
                holeColumn = Math.floor(Math.random() * width);
                holeRow = Math.floor(Math.random() * height);
            }

            myField[holeRow][holeColumn] = hole;
        }

        return myField;
    }
}

const checkMove = (field, row, column) => {
    try {
        let target = field[row][column];
        if (typeof target === 'undefined') {
            throw Error();
        }

        if (field[row][column] === hat) {
            field[row][column] = pathCharacter;
            term.green("Congratulations, you won!");
            return true;
        }

        else if (field[row][column] === hole) {
            term.red("Oh no! You fell into the hole!");
            return true;
        }

        else {
            field[row][column] = pathCharacter;
            return false;
        }
    } catch (e) {
        term.red("Out of bounds!\n");
    }
}

const solver = (currRow, currColumn) => {

    if (currColumn === endColumn && currRow == endRow) {
        return true;
    }
    
    if (visited[currRow][currColumn] || booleanField[currRow][currColumn])
        return false;

    visited[currRow][currColumn] = true;

    if (currRow != 0) {
        if (solver(currRow - 1, currColumn)) {
            correctPath[currRow][currColumn] = true;
            return true;
        }
    }

    if (currRow != visited.length - 1) {
        if (solver(currRow + 1, currColumn)) {
            correctPath[currRow][currColumn] = true;
            return true;
        }
    }

    if (currColumn != 0) {
        if (solver(currRow, currColumn - 1)) {
            correctPath[currRow][currColumn] = true;
            return true;
        }
    }

    if (currColumn != visited[0].length - 1) {
        if (solver(currRow, currColumn + 1)) {
            correctPath[currRow][currColumn] = true;
            return true;
        }
    }

    return false;
}

const validateField = field => {
    for (let i = 0; i < field.length; i++) {
        for (let j = 0; j < field[0].length; j++) {
            if (!visited[i]) {
                visited[i] = [];
                booleanField[i] = [];
            }

            if (!visited[i][j]) {
                visited[i][j] = false;
                if (field[i][j] === hole) 
                    booleanField[i][j] = true;
                else
                    booleanField[i][j] = false;
            }
        }
    }

    correctPath = [...visited];
    return solver(startRow, startColumn);
}

const move = (field, dir, currIndex) => {
    let checked = false;
    let row = currIndex[0];
    let column = currIndex[1];

    try {
        switch (dir.toLowerCase()) {
            case "l":
                checked = checkMove(field, row, column - 1);
                if (field[row][column - 1])
                    currIndex[1] = column - 1;
                return checked;
            case "r":
                checked = checkMove(field, row, column + 1);
                if (field[row][column + 1])
                    currIndex[1] = column + 1;
                return checked;
            case "u":
                checked = checkMove(field, row - 1, column);
                if (field[row - 1][column])
                    currIndex[0] = row - 1;
                return checked;
            case "d":
                checked =  checkMove(field, row + 1, column);
                if (field[row + 1][column]) 
                    currIndex[0] = row + 1;
                return checked;
            default:
                throw Error();
        }
    } catch(e) {
        term.red("Invalid direction!\n");
    }
}

const main = () => {
    let myField;
    let valid = false;
    let numOfRows;
    let numOfColumns

    do {
        term.cyan("Determine dimensions\n");
        console.log();
        numOfRows = prompt("Number of rows: ");
        numOfColumns = prompt("Number of columns: ");

        if ((numOfRows < 2 && numOfColumns < 2) || numOfRows < 2 || numOfColumns < 2)
            term.red("\nDimensions too small, please try again\n");

        else if ((numOfRows > 50 && numOfColumns > 50) || numOfRows > 50 || numOfColumns > 50)
            term.red("\nDimensions too large, please try again\n");

        else
            valid = true;

    } while (!valid);

    do {
        myField = new Field(Field.generateField(numOfRows,numOfColumns));
    } while (!validateField(myField.field));

    let quit = false;
    let currIndex = [0,0];

    console.log(myField.print());
    while (!quit) {
        let movement = prompt("Which way? ");
        quit = move(myField.field, movement, currIndex);
        if (!quit)
            console.log(myField.print());
    }
}

main();