# Sparse Matrix Operations 

## Overview 
This project implements efficient sparse matrix operations in JavaScript. It provides a memory-efficient solution for handling large sparse matrices, using a dictionary-based storage method. The implementation includes operations such as `addition`, `subtraction`, and `multiplication` of sparse matrices. 
<br><br>
A sparse matrix is a matrix in which most of the elements are zero, and this project leverages efficient storage and processing techniques to handle such matrices.

## Folder Structure

```bash
sparse_matrix/
├── sample_inputs/      # Directory containing sample input files
├── SparseMatrix.js     # Main JavaScript file with matrix processing code
```

## Features

- Memory-efficient sparse matrix representation
- Matrix operations: addition, subtraction, multiplication
- File I/O for reading matrix data and writing results
- Command-line interface for easy interaction
- Robust error handling and input validation

## Requirements
- Node.js (version 12.0 or higher recommended)

## Installation
1. Clone this repository:
    ```bash
    git clone https://github.com/josueahadi/dsa
    cd sparse_matrix
    ```
2. Install any required dependencies (if applicable). In this case, ensure you have Node.js installed to run the program.

## Usage
### 1. Prepare Input Files: 
The matrix input files should be located in the `sample_inputs/` directory. Each file must specify the matrix dimensions (`rows` and `cols`) and matrix entries in the following format:
    ```bash
    rows=3
    cols=3
    (0, 0, 5)
    (1, 2, 3)
    ```
    - `rows` and `cols` specify the dimensions of the matrix.
    - Each matrix entry is represented as `(row, col, value)`.

### 2. Run the Program:

    ```bash
    node SparseMatrix.js
    ```
### 3. Follow the Interactive Prompts:
- Enter the path to the directory containing matrix files (e.g., `sample_inputs/`).
- Choose two matrix files to process by selecting their numbers from the list.
- Choose the operation you wish to perform (addition, subtraction, or multiplication).
- Provide the output file path to save the results (e.g., `output/results.txt`).
### 4. Output Format
The output file will contain the result matrix in the same format as the input files, with matrix dimensions followed by non-zero entries.

## Example
### Input Files:
matrix1.txt:
```bash
rows=3
cols=3
(0, 0, 1)
(1, 1, 2)
(2, 2, 3)
```
matrix2.txt:
```bash
rows=3
cols=3
(0, 0, 4)
(1, 1, 5)
(2, 2, 6)
```
### Running the Program:
```bash
node SparseMatrix.js
```
- Select `matrix1.txt` and `matrix2.txt`.
- Choose the `Add Matrices` option.
- Enter the output file path (e.g., `output/result.txt`).
### Output (result.txt):
```bash
rows=3
cols=3
(0, 0, 5)
(1, 1, 7)
(2, 2, 9)
```
## Notes
- Ensure that matrix dimensions in the input files are correct, as mismatched dimensions can lead to errors during operations.
- The program provides detailed warnings in case of invalid input formats or matrix entries.

## License
This project is licensed under the MIT License.