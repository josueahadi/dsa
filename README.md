# UniqueInt - Data Structures & Algorithms

## Overview

This project processes a list of integers from input files and generates result files containing unique integers sorted in ascending order. The solution is implemented in JavaScript without using standard libraries for sorting or list operations.

## Directory Structure

- `/dsa/src`: Contains the source code `UniqueInt.ts`.
- `/dsa/inputs/`: Contains input files.
- `/dsa/results/`: Contains output result files.

## How to Run the Code

1. Navigate to the `dsa/src/` directory.
2. Run the following command to execute the TypeScript file:

   ```bash
   node UniqueInt.js
   ```

3. Ensure the input files are in the `inputs` directory and named correctly.
4. The output will be written in the `results` directory.

## Prerequisites

Node.js installed on your system.

## Input File Format

The program handles various input formats:

- One integer per line, with valid integers in the range [-1023, 1023].
- Integers can have whitespace before or after them.
- Empty lines or lines with only whitespace are skipped.
- Lines with multiple integers are skipped.
- Lines with non-integer input (including alphabets, punctuation marks, non-numeric values, floating point numbers) are skipped.
