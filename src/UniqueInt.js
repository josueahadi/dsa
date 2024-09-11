const fs = require("fs");

class UniqueInt {
  constructor() {
    this.seenNumbers = new Array(2047).fill(false); // Boolean array to track integers in the range [-1023, 1023]
  }

  // Main function to process input and output files
  processFile(inputFilePath, outputFilePath) {
    try {
      const inputData = fs.readFileSync(inputFilePath, "utf-8");
      const lines = inputData.split("\n"); // String array
      const uniqueIntegers = [];

      lines.forEach((line) => {
        const parsedNumber = this.readNextItemFromFile(line);
        if (parsedNumber !== null) {
          const index = parsedNumber + 1023; // Shift range [-1023, 1023] to [0, 2046]
          if (!this.seenNumbers[index]) {
            this.seenNumbers[index] = true;
            uniqueIntegers.push(parsedNumber);
          }
        }
      });

      this.sort(uniqueIntegers); // Sort the unique integers
      this.writeOutputFile(outputFilePath, uniqueIntegers);
    } catch (error) {
      console.error(`Error processing file: ${error.message}`);
    }
  }

  // Function to read and validate each line
  readNextItemFromFile(line) {
    const trimmedLine = line.trim();

    // Skip empty lines and lines with multiple numbers or non-integer characters
    if (
      trimmedLine === "" ||
      /\s+/.test(trimmedLine) || // Multiple numbers
      isNaN(Number(trimmedLine)) // Non-integer
    ) {
      return null;
    }

    const parsedNumber = parseInt(trimmedLine, 10);

    // Check for valid integer range [-1023, 1023]
    if (parsedNumber >= -1023 && parsedNumber <= 1023) {
      return parsedNumber;
    }

    return null;
  }

  // Manual sorting implementation (Bubble Sort)
  sort(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          const temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
        }
      }
    }
  }

  // Function to write the unique sorted integers to the output file
  writeOutputFile(outputFilePath, uniqueIntegers) {
    const outputData = uniqueIntegers.join("\n");
    fs.writeFileSync(outputFilePath, outputData, "utf-8");
    console.log(`Results written to ${outputFilePath}`);
  }

  // Function to process multiple files
  processFiles(inputFolderPath, outputFolderPath) {
    const files = fs.readdirSync(inputFolderPath); // Array of filenames
    files.forEach((file) => {
      const inputFilePath = `${inputFolderPath}/${file}`;
      const outputFilePath = `${outputFolderPath}/${file}_results.txt`;
      this.processFile(inputFilePath, outputFilePath);
    });
  }
}

// Input and output folder paths
const uniqueInt = new UniqueInt();
uniqueInt.processFiles("./dsa/sample_inputs", "./dsa/sample_outputs");
