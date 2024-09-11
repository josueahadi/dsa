import * as fs from "fs";
import * as path from "path";

class UniqueInt {
  private seenNumbers: boolean[] = new Array(2047).fill(false); // Boolean array to track integers in the range [-1023, 1023]

  // Main function to process input and output files
  // Main function to process input and output files
  processFile(inputFilePath: string, outputFilePath: string): void {
    try {
      const inputData = fs.readFileSync(inputFilePath, "utf-8");
      const lines = inputData.split("\n");
      const uniqueIntegers: number[] = [];

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
      if (error instanceof Error) {
        console.error(`Error processing file: ${error.message}`);
      } else {
        console.error(`Unknown error occurred: ${error}`);
      }
    }
  }

  // Function to read and validate each line
  readNextItemFromFile(line: string): number | null {
    const trimmedLine = line.trim();

    // Skip empty lines and lines with multiple numbers or non-integer characters
    if (
      trimmedLine === "" ||
      /\s+/.test(trimmedLine) ||
      isNaN(Number(trimmedLine))
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
  private sort(arr: number[]): void {
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
  private writeOutputFile(
    outputFilePath: string,
    uniqueIntegers: number[]
  ): void {
    const outputData = uniqueIntegers.join("\n");
    fs.writeFileSync(outputFilePath, outputData, "utf-8");
    console.log(`Results written to ${outputFilePath}`);
  }

  // Function to process all files in the input directory
  processAllFiles(inputDir: string, outputDir: string): void {
    const files = fs.readdirSync(inputDir);

    files.forEach((file) => {
      const inputFilePath = path.join(inputDir, file);
      const outputFilePath = path.join(outputDir, `${file}_results.txt`);
      console.log(`Processing file: ${file}`);

      // Reset seenNumbers array for each file
      this.seenNumbers.fill(false);

      this.processFile(inputFilePath, outputFilePath);
    });
  }
}

// Input directory and output directory paths
const uniqueInt = new UniqueInt();
const inputDir = "/dsa/sample_inputs";
const outputDir = "/dsa/sample_outputs";
uniqueInt.processAllFiles(inputDir, outputDir);
