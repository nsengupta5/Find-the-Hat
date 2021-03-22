const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

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

        let hatXIndex = 0;
        let hatYIndex = 0; 

        while (hatXIndex === 0 && hatYIndex === 0) {
            hatYIndex = Math.floor(Math.random() * height);
            hatXIndex = Math.floor(Math.random() * width);
        }
    
        myField[hatYIndex][hatXIndex] = hat;

        let i = 0;
        while (i < numOfHoles) {
            let xCoord = 0;
            let yCoord = 0;

            while ((xCoord === 0 && yCoord === 0) || myField[yCoord][xCoord] === hat) {
                xCoord = Math.floor(Math.random() * width);
                yCoord = Math.floor(Math.random() * height);
            }

            myField[yCoord][xCoord] = hole;
            i++;
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
            console.log("Congratulations, you won!");
            return true;
        }

        else if (field[row][column] === hole) {
            console.log("Oh no! You fell into the hole!");
            return true;
        }

        else {
            field[row][column] = pathCharacter;
            return false;
        }
    } catch (e) {
        console.log("Out of bounds!\n");
    }
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
        console.log("Invalid direction!\n");
    }
}

const main = () => {
    const myField = new Field(Field.generateField(10,10));
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