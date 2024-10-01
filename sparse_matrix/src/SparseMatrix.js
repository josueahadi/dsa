const fs = require('fs'); // This function call imports the fs module, which provides an API for interacting with the file system (readinf from and writing to files, creating directories, etc)


class SparseMatrix {
    constructor(filePath = null, numRows = null, numCols = null) {
        if (filePath) {
            this.loadMatrixFromFile(filePath);
        } else {
            this.numRows = numRows;
            this.numCols = numCols;
            this.matrix = {}; // Stire nonzero values as {(row, col): value}
        }
    }

    // Load a sparse matrix from a file
    loadMatrixFromFile(filePath) {
        /**
         * Reads the content of the file at the given file path, splits it into lines,
         * and filters out any empty lines or lines that contain only whitespace.
         *
         * @param {string} filePath - The path to the file to be read.
         * @returns {string[]} An array of non-empty lines from the file.
         */
        const data = fs.readFileSync(filePath, 'utf8').split('\n').filter(line => line.trim());
        /**
         * Initialize the number of rows and columns from the first two elements of the data array.
         * The data array is expected to have the format where the first element is "rows=<number>"
         * and the second element is "cols=<number>". The values are extracted, trimmed, and parsed as integers.
         */
        this.numRows = parseInt(data[0].split('=')[1].trim());
        this.numCols = parseInt(data[1].split('=')[1].trim());
        this.matrix = {}; // Initialize an empty object to represent the sparse matrix.

        for (let i = 2; i < data.length; i++) {
            // Trim any leading or trailing whitespace from the current line.
            const line = data[i].trim();
            /**
             * Parse the line to extract the row, column, and value of the matrix entry.
             * The parseLine method is assumed to return an object with 'row', 'col', and 'value' properties.
             */
            const parsed = this.parseLine(line);
            this.setElement(parsed.row, parsed.col, parsed.value);
        }
    }

    // Parse each line in the format (row, col, value)
    parseLine(line) {
        const regex = /^\((\d+),\s*(\d+),\s*(-?\d+)\)$/;
        const match = line.match(regex);

        if (!match) {
            throw new Error('Input file has wrong format');
        }

        return {
            row: parseInt(match[1]),
            col: parseInt(match[2]),
            value: parseInt(match[3])
        };
    }

    // Get the value at a specific (row, col)
    getElement(row, col) {
        return this.matrix[`${row},${col}`] || 0;
    }

    // Set the value at a specific (row, col)
    setElement(row, col, value) {
        if (value !== 0) {
            this.matrix[`${row},${col}`] = value;
        } else {
            delete this.matrix[`${row},${col}`];
        }
    }

    // Add two sparse matrices
    add(other) {
        if (this.numRows !== other.numRows || this.numCols !== other.numCols) {
            throw new Error("Matrices must have the same dimensions for addition");
        }

        const result = new SparseMatrix(null, this.numRows, this.numCols);

        // Add non-zero elements from both matrices
        for (const key in this.matrix) {
            const [row, col] = key.split(',').map(Number);
            result.setElement(row, col, this.getElement(row, col) + other.getElement(row, col));
        }

        for (const key in other.matrix) {
            const [row, col] = key.split(',').map(Number);
            if (!result.matrix[`${row},${col}`]) {
                result.setElement(row, col, other.getElement(row, col));
            }
        }

        return result;
    }

    // Subtract another sparse matrix
    subtract(other) {
        if (this.numRows !== other.numRows || this.numCols !== other.numCols) {
            throw new Error("Matrices must have the same dimensions for subtraction");
        }

        const result = new SparseMatrix(null, this.numRows, this.numCols);

        for (const key in this.matrix) {
            const [row, col] = key.split(',').map(Number);
            result.setElement(row, col, this.getElement(row, col) - other.getElement(row, col));
        }

        for (const key in other.matrix) {
            const [row, col] = key.split(',').map(Number);
            if (!result.matrix[`${row},${col}`]) {
                result.setElement(row, col, -other.getElement(row, col));
            }
        }

        return result;
    }

    // Multiply two sparse matrices
    multiply(other) {
        if (this.numCols !== other.numRows) {
            throw new Error("Number of columns in first matrix must equal number of rows in second matrix");
        }

        const result = new SparseMatrix(null, this.numRows, other.numCols);

        for (const [key, value] of Object.entries(this.matrix)) {
            const [row, col] = key.split(',').map(Number);
            for (let i = 0; i < other.numCols; i++) {
                const product = value * other.getElement(col, i);
                if (product !== 0) {
                    result.setElement(row, i, result.getElement(row, i) + product);
                }
            }
        }

        return result;
    }

    // Output matrix for debugging (in sparse format)
    printMatrix() {
        console.log(`Rows: ${this.numRows}, Cols: ${this.numCols}`);
        for (const [key, value] of Object.entries(this.matrix)) {
            console.log(`(${key}): ${value}`);
        }
    }

}

 
// Main function to handle user input and call matrix operations
 const main = () => {
    const file1 = '../sample_inputs/matrixfile1.txt';
    const file2 = '../sample_inputs/easy_sample_01_3.txt';
    const operation = process.argv[2]; // Pass 'add', 'subtract', or 'multiply' via command line

    const matrix1 = new SparseMatrix(file1);
    const matrix2 = new SparseMatrix(file2);    

    let result;

    if (operation === 'add') {
        result = matrix1.add(matrix2);
    } else if (operation === 'subtract') {
        result = matrix1.subtract(matrix2);
    } else if (operation === 'multiply') {
        result = matrix1.multiply(matrix2);
    } else {
        throw new Error('Invalid operation. Please use "add", "subtract", or "multiply"');
        return
    }

    result.printMatrix();
};

main();