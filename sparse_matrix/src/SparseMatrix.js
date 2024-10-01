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
}