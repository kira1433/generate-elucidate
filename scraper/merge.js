const fs = require('fs');

// Function to merge and deduplicate JSON arrays
function mergeJSONArrays(jsonArrayFiles) {
    const mergedArray = [];

    // Read and parse JSON files
    jsonArrayFiles.forEach((filePath) => {
        const content = fs.readFileSync(filePath, 'utf8');
        const array = JSON.parse(content);
        mergedArray.push(...array);
    });

    let i = 1
    for(item of mergedArray){
        item["number"] = i++
    }

    // Remove duplicates using Set
    const deduplicatedSet = new Set(mergedArray);

    // Convert Set back to an array
    const deduplicatedArray = [...deduplicatedSet];

    // Optionally, sort the array if needed
    deduplicatedArray.sort();

    return deduplicatedArray;
}

// List of JSON files containing arrays
const jsonArrayFiles = ['0-35.json', '36-40.json', '41-47.json', '48-59.json', 'missed.json', 'missed2.json'];

// Merge and deduplicate the arrays
const mergedArray = mergeJSONArrays(jsonArrayFiles);

// Convert the final array to JSON format
const finalJSON = JSON.stringify(mergedArray, null, 2);

// Save the merged JSON to a file
fs.writeFileSync('merged.json', finalJSON, 'utf8');
