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
}