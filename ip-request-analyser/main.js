const fs = require('fs');
const readline = require('readline');
const { MinPriorityQueue } = require('@datastructures-js/priority-queue');

/**
 * Parse log file and get top n IP addresses by request count.
 * @param {string} inputFile - Path to the input log file.
 * @param {number} n - Number of top IP addresses to return.
 * @param {string} outputFile - Path to the output file.
 * @returns {Promise<void>}
 * @throws {Error} If file operations fail or input is invalid
 */
async function getTopNIPAddresses(inputFile, n, outputFile) {
  // Input validation
  if (!Number.isInteger(n) || n <= 0) {
    throw new Error('n must be a positive integer');
  }

  const ipCounts = new Map();

  try {
    // Read and process each line in the input file
    const fileStream = fs.createReadStream(inputFile);
    const rl = readline.createInterface({ input: fileStream });

    fileStream.on('error', (error) => {
      throw new Error(`Error reading file: ${error.message}`);
    });

    for await (const line of rl) {
      if (!line.trim()) continue;

      const [ip, countStr] = line.split(',').map(s => s.trim());
      const count = parseInt(countStr, 10);

      if (!ip || isNaN(count)) {
        console.warn(`Skipping invalid line: ${line}`);
        continue;
      }

      // Update the request count for each IP in the hash map
      ipCounts.set(ip, (ipCounts.get(ip) || 0) + count);
    }

    // Define a min-heap with custom comparator to keep top 'n' IPs
    const heap = new MinPriorityQueue({
      priority: ([, count]) => count,
      compare: (a, b) => {
        // If counts are equal, compare IPs lexicographically
        if (a.priority === b.priority) {
          return b.element[0].localeCompare(a.element[0]);
        }
        return a.priority - b.priority;
      }
    });

    // Process IP counts
    for (const [ip, count] of ipCounts.entries()) {
      if (heap.size() < n) {
        heap.enqueue([ip, count]);
      } else if (count > heap.front().element[1]) {
        heap.dequeue();
        heap.enqueue([ip, count]);
      }
    }

    // Extract and sort results
    const topNIPs = [];
    while (!heap.isEmpty()) {
      topNIPs.push(heap.dequeue().element);
    }

    // Sort by count (descending) and IP (ascending)
    topNIPs.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));

    // Format output
    const outputData = topNIPs
      .map((entry, index) => `${index + 1}, ${entry[0]}, ${entry[1]}`)
      .join('\n');

    // Write results
    await fs.promises.writeFile(outputFile, outputData);
    console.log(`Top ${n} IP addresses saved to ${outputFile}`);

  } catch (error) {
    throw new Error(`Failed to process IP addresses: ${error.message}`);
  }
}

// Export the function
module.exports = { getTopNIPAddresses };

// Example usage with error handling:

async function main() {
  try {
    await getTopNIPAddresses('sample_01_easy.log', 3, 'sample_01_easy_result_n3.txt');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
