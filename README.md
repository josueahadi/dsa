# UniqueInt - Data Structures & Algorithms

## Overview

This project processes a list of integers from a file and generates a result file containing unique integers sorted in increasing order. The solution was implemented in TypeScript without using standard libraries for sorting or list operations.

## Directory Structure

- `/dsa/src`: Contains the source code `UniqueInt.ts`.
- `/dsa/sample_inputs/`: Contains sample input files.
- `/dsa/sample_results/`: Contains output result files.

## How to Run the Code

1. Navigate to the `dsa/src/` directory.
2. Run the following command to execute the TypeScript file:

   ```bash
   npx ts-node UniqueInt.ts
   ```

3. Ensure the input files are in the `sample_inputs` directory and named correctly.
4. The output will be written in the `sample_results` directory.

## Prerequisites

- Install `ts-node` and `typescript` globally:

  ```bash
  npm install -g ts-node typescript
  ```

## Additional Notes

- The input files should contain one integer per line, with valid integers in the range [-1023, 1023].
- Lines with non-integer values, multiple integers, or empty lines will be skipped.
- The result file will contain unique integers sorted in ascending order.
