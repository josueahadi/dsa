# IP Request Analyzer

A high-performance Node.js tool for analyzing IP address request patterns in server logs. This tool efficiently processes log files to identify the top N IP addresses making the most requests, with special handling for equally important IPs.

## 🚀 Features

- Stream-based log file processing for minimal memory footprint
- Efficient handling of large datasets (millions of lines)
- Custom sorting for equally important IP addresses
- Support for various input file sizes and formats
- Detailed error handling and reporting
- Async/await pattern for better performance
- Memory-efficient implementation using MinPriorityQueue

## 📋 Prerequisites

- Node.js (v12.0.0 or higher)
- npm (v6.0.0 or higher)

## 🔧 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/ip-request-analyzer.git

# Navigate to the project directory
cd ip-request-analyzer

# Install dependencies
npm install
```

## 📖 Usage

### Basic Usage

```javascript
const { getTopNIPAddresses } = require('./ip-request-analyzer');

async function main() {
  try {
    await getTopNIPAddresses(
      'input.log',  // Input log file path
      3,            // Number of top IP addresses to find
      'output.txt'  // Output file path
    );
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
```

### Input File Format

The input log file should follow this format:
```
IP_ADDRESS, REQUEST_COUNT
```

Example:
```
192.168.1.1, 50
10.0.0.1, 30
192.168.1.2, 20
```

### Output Format

The output file will contain the top N IP addresses in the following format:
```
IMPORTANCE, IP_ADDRESS, TOTAL_REQUEST_COUNT
```

Example:
```
1, 192.168.1.1, 50
2, 10.0.0.1, 30
3, 192.168.1.2, 20
```

## 🔍 Algorithm Details

The program uses a two-pass algorithm for optimal performance:

1. First Pass:
   - Streams through the log file line by line
   - Maintains a HashMap of IP addresses and their request counts
   - Handles duplicate IP addresses by aggregating counts

2. Second Pass:
   - Uses a MinPriorityQueue to maintain top N IP addresses
   - Ensures O(n log k) complexity where k is the number of top IPs requested
   - Handles equally important IPs by sorting them lexicographically

## ⚡ Performance

- Memory Usage: O(k) where k is the number of unique IP addresses
- Time Complexity: O(n log k) where n is the number of log entries
- Suitable for processing log files with millions of entries
- Stream-based processing ensures constant memory usage regardless of file size

## 🔰 Examples

### Example 1: Basic Usage
```javascript
await getTopNIPAddresses('sample_01_easy.log', 3, 'output.txt');
```

### Example 2: With Error Handling
```javascript
try {
  await getTopNIPAddresses('sample_02_medium.log', 5, 'top5.txt');
} catch (error) {
  console.error('Failed to process log file:', error.message);
}
```

## 📝 Notes on Equal Importance

When multiple IP addresses have the same request count:
- They are considered equally important
- They are sorted in ascending order of IP address
- They receive the same importance ranking
- Subsequent IPs are ranked accordingly

Example:
```
1, 192.168.10.3, 7
1, 192.168.10.5, 7
1, 192.168.20.1, 7
4, 192.168.10.2, 5
```

## 🛠️ Development

### Running Tests
```bash
npm test
```

### Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request