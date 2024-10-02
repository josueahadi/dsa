const fs = require('fs');
const path = require('path');
const readline = require('readline');

class CoreFunctions {
    static removeLeadingWhitespace(text) {
        let index = 0;
        while (text[index] === ' ' || text[index] === '\t') {
            index += 1;
        }
        return text.slice(index);
    }

    static removeTrailingWhitespace(text) {
        let index = 1;
        while (index <= text.length && (text[text.length - index] === ' ' || text[text.length - index] === '\n' || text[text.length - index] === '\t')) {
            index += 1;
        }
        return text.slice(0, text.length + 1 - index);
    }

    static removeWhitespace(text) {
        return this.removeTrailingWhitespace(this.removeLeadingWhitespace(text));
    }

    static convertToInteger(text) {
        let result = 0;
        for (let char of text) {
            if (char === ' ') return false;
            if (char === '#') continue;
            if (char === '.') throw new Error("Input file has an invalid format");
            if (char < '0' || char > '9') return false;
            result = result * 10 + (char.charCodeAt(0) - '0'.charCodeAt(0));
        }
        if (text[0] === '#') result *= -1;
        return result;
    }
}

class SparseMatrix {
    constructor(rows, cols) {
        if (rows <= 0 || cols <= 0) {
            throw new Error("Invalid matrix dimensions");
        }
        this.rows = rows;
        this.cols = cols;
        this.data = {}; // Dictionary to store non-zero elements in format {"row,col": value}
    }

    insertValue(row, col, value) {
        if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
            throw new Error(`Invalid matrix position: (${row}, ${col}). Matrix dimensions are ${this.rows}x${this.cols}.`);
        }
        if (value !== 0) {
            this.data[`${row},${col}`] = value; // Store value at the key "row,col"
        } else {
            delete this.data[`${row},${col}`]; // Remove entry if the value is 0
        }
    }

    getValue(row, col) {
        return this.data[`${row},${col}`] || 0; // Return value or 0 if not found
    }

    addMatrices(other) {
        if (this.rows !== other.rows || this.cols !== other.cols) {
            throw new Error("Matrix dimensions do not match");
        }

        const result = new SparseMatrix(this.rows, this.cols);

        for (const key in this.data) {
            const [row, col] = key.split(',').map(Number);
            result.insertValue(row, col, this.getValue(row, col) + other.getValue(row, col));
        }

        for (const key in other.data) {
            if (!this.data[key]) {
                const [row, col] = key.split(',').map(Number);
                result.insertValue(row, col, other.getValue(row, col));
            }
        }

        return result;
    }

    subtractMatrices(other) {
        if (this.rows !== other.rows || this.cols !== other.cols) {
            throw new Error("Matrix dimensions do not match");
        }

        const result = new SparseMatrix(this.rows, this.cols);

        for (const key in this.data) {
            const [row, col] = key.split(',').map(Number);
            result.insertValue(row, col, this.getValue(row, col) - other.getValue(row, col));
        }

        for (const key in other.data) {
            if (!this.data[key]) {
                const [row, col] = key.split(',').map(Number);
                result.insertValue(row, col, -other.getValue(row, col));
            }
        }

        return result;
    }

    multiplyMatrices(other) {
        if (this.cols !== other.rows) {
            throw new Error("Invalid matrix dimensions for multiplication");
        }

        const result = new SparseMatrix(this.rows, other.cols);

        for (const key in this.data) {
            const [row, col] = key.split(',').map(Number);
            for (let k = 0; k < other.cols; k++) {
                const product = this.getValue(row, col) * other.getValue(col, k);
                if (product !== 0) {
                    const newValue = result.getValue(row, k) + product;
                    result.insertValue(row, k, newValue);
                }
            }
        }

        return result;
    }

    printMatrix() {
        console.log(`Dimension: ${this.rows} x ${this.cols}`);
        console.log("Sparse Matrix: Row Column Value");
        for (const key in this.data) {
            const [row, col] = key.split(',').map(Number);
            console.log(row, col, this.data[key]);
        }
    }
}

function extractParts(text) {
    const output = [];
    if (text[0] === '(') {
        let part = '';
        for (let i = 1; i < text.length; i++) {
            const char = text[i];
            if (char !== ' ' && char !== ',' && char !== ')') {
                part += char;
            } else if (char === ',' || char === ')') {
                output.push(part);
                part = '';
            }
        }
    }
    return output;
}

function splitString(text, split) {
    const parts = text.split(split);
    return parts.length === 2 ? parts : null;
}

function processInputFile(inputPath) {
    const lines = fs.readFileSync(inputPath, 'utf8').split('\n');
    let rows, cols;

    lines.forEach(line => {
        const cleanedLine = CoreFunctions.removeWhitespace(line);
        if (cleanedLine.startsWith('rows')) {
            const parts = splitString(cleanedLine, '=');
            rows = CoreFunctions.convertToInteger(parts[1]);
            if (rows <= 0) {
                throw new Error("Invalid rows value");
            }
        } else if (cleanedLine.startsWith('cols')) {
            const parts = splitString(cleanedLine, '=');
            cols = CoreFunctions.convertToInteger(parts[1]);
            if (cols <= 0) {
                throw new Error("Invalid cols value");
            }
        }
    });

    if (rows === undefined || cols === undefined) {
        throw new Error("Input file does not specify rows and columns correctly.");
    }

    //console.log(`Matrix Dimensions: Rows = ${rows}, Cols = ${cols}`); // Debugging line

    const matrix = new SparseMatrix(rows, cols);
    
    lines.forEach((line, lineIndex) => {
        const cleanedLine = CoreFunctions.removeWhitespace(line);
        if (cleanedLine.startsWith('(')) {
            const parts = extractParts(cleanedLine).map(part => CoreFunctions.convertToInteger(part));
            const [row, col, value] = parts;

            try {
                // Attempt to insert the value into the matrix
                matrix.insertValue(row, col, value);
            } catch (error) {
                console.warn(`Warning on line ${lineIndex + 1}: ${error.message} Skipping this entry.`);
            }
        }
    });

    return matrix;
}

function outputResults(outputPath, matrix) {
    const directory = path.dirname(outputPath); // Extract the directory path

    // Check if the directory exists
    if (!fs.existsSync(directory)) {
        // If it doesn't exist, create the directory
        fs.mkdirSync(directory, { recursive: true });
        console.log(`Directory "${directory}" did not exist, so it was created.`);
    }

    // Create the output string for the matrix
    let output = `rows=${matrix.rows}\ncols=${matrix.cols}\n`;
    for (const key in matrix.data) {
        const [row, col] = key.split(',').map(Number);
        output += `(${row}, ${col}, ${matrix.getValue(row, col)})\n`;
    }

    // Write the matrix result to the output file
    fs.writeFileSync(outputPath, output);
    console.log(`Results saved to ${outputPath}`);
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

function listFiles(directory) {
    return fs.readdirSync(directory).filter(file => file.endsWith('.txt'));
}

async function main() {
    console.log("\n.................... Sparse Matrix Operations ................\n");

    const inputDir = await question("Enter the path of the directory containing matrix files: ");
    const files = listFiles(inputDir);

    if (files.length === 0) {
        console.log("No matrix files found in the specified directory.");
        rl.close();
        return;
    }

    console.log("\nAvailable matrix files:");
    files.forEach((file, index) => {
        console.log(`${index + 1}: ${file}`);
    });

    const firstFileIndex = await question("\nSelect the first file (enter the number): ");
    const secondFileIndex = await question("Select the second file (enter the number): ");

    const matrix1 = processInputFile(path.join(inputDir, files[firstFileIndex - 1]));
    const matrix2 = processInputFile(path.join(inputDir, files[secondFileIndex - 1]));

    console.log("Choose an operation:\n");
    console.log("1. Add Matrices");
    console.log("2. Subtract Matrices");
    console.log("3. Multiply Matrices\n");

    const choice = await question("Enter your choice: ");
    const outputFile = await question("Enter the output file path: ");

    let result;
    try {
        if (choice === '1') {
            result = matrix1.addMatrices(matrix2);
        } else if (choice === '2') {
            result = matrix1.subtractMatrices(matrix2);
        } else if (choice === '3') {
            result = matrix1.multiplyMatrices(matrix2);
        } else {
            console.log("Invalid choice. Exiting.");
            rl.close();
            return;
        }

        outputResults(outputFile, result);
        console.log(`Results saved to ${outputFile}`);
    } catch (error) {
        console.error("Error:", error.message);
    }

    rl.close();
}

main();
