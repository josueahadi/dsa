const fs = require("fs"); // import the fs (filesystem) module, which provides functions that allow you to read, write, and manipulate files and directories
const path = require("path"); //  import the path module -- it helps you manipulate file paths in a cross-platform way (Join paths using path.join, resolve absolute paths using path.resolve, extract file extensions or directory names)

class UniqueInt {
  constructor() {
    // Create the output directory if it doesn't exist
    const outputDir = path.resolve(__dirname, "../sample_results");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
  }

  // Main function to process input and output files
  processFile(inputFilePath, outputFilePath) {
    try {
      // Reset seenNumbers for each file
      this.seenNumbers = new Array(2047).fill(false);

      const inputData = fs.readFileSync(inputFilePath, "utf-8");
      const lines = inputData.split("\n");
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
    // Trim whitespace from the beginning and end of the line
    const trimmedLine = line.trim();

    // Skip empty lines
    if (trimmedLine === "") {
      return null;
    }

    // Check if the line contains exactly one integer
    const match = trimmedLine.match(/^\s*(-?\d+)\s*$/);
    if (!match) {
      return null; // Line doesn't contain exactly one integer
    }

    const parsedNumber = parseInt(match[1], 10);

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
    const files = fs.readdirSync(inputFolderPath);
    files.forEach((file) => {
      const inputFilePath = path.join(inputFolderPath, file);
      const outputFilePath = path.join(outputFolderPath, file);
      this.processFile(inputFilePath, outputFilePath);
    });
  }
}

// Input and output folder paths
const uniqueInt = new UniqueInt();
uniqueInt.processFiles(
  path.join(__dirname, "../sample_inputs"),
  path.join(__dirname, "../sample_results")
);
