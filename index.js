const fs = require('fs');
const readline = require('readline');

//  decode a number from a given base
function decodeValue(base, value) {
    return parseInt(value, base);  
}

//  calculate the constant term using Lagrange interpolation
function lagrangeInterpolation(points) {
    let constantTerm = 0.0;
    const k = points.length;

    for (let i = 0; i < k; i++) {
        const xi = points[i][0];
        const yi = points[i][1];

    
        let term = yi;

        for (let j = 0; j < k; j++) {
            if (i !== j) {
                const xj = points[j][0];
                term *= (0 - xj) / (xi - xj);  
            }
        }

        constantTerm += term;
    }

    return constantTerm;
}


// read and parse the input JSON from a file
function parseAndReadTestCaseFromFile(filePath) {
    try {
        
        const jsonInput = fs.readFileSync(filePath, 'utf8');
        const inputData = JSON.parse(jsonInput);
        const keys = inputData.keys;

        const n = keys.n;
        const k = keys.k;

        console.log(`Number of points provided: ${n}`);
        console.log(`Minimum number of points required (k): ${k}`);

        // Collect the points (x, y)
        const points = [];

        
        Object.keys(inputData).forEach(key => {
            if (key !== 'keys') {
                const x = parseInt(key);  
                const point = inputData[key];
                const base = parseInt(point.base);  
                const encodedY = point.value;  
                const y = decodeValue(base, encodedY); 

                // Add the point (x, y) to the points array
                points.push([x, y]);

                console.log(`Point (x, y): (${x}, ${y})`);
            }
        });

        // Ensure we have enough points to solve the polynomial
        if (points.length < k) {
            throw new Error("Not enough points to solve the polynomial");
        }

        // Calculating the constant term (secret) using Lagrange interpolation
        return lagrangeInterpolation(points.slice(0, k));  // Use the first k points
    } catch (error) {
        throw new Error(`Invalid JSON or processing error: ${error.message}`);
    }
}


// function to process multiple JSON files
function processMultipleFiles(filePaths) {
  filePaths.forEach(filePath => {
      try {
          const secret = parseAndReadTestCaseFromFile(filePath);
          console.log(`The secret (constant term) from ${filePath} is:`, secret);
          console.log('----------------------------');
      } catch (error) {
          console.error("Error:", error.message);
      }
  });
}

//  list of file paths to process
const filePaths = ['input1.json', 'input2.json'];  // Add as many files as needed


processMultipleFiles(filePaths);
