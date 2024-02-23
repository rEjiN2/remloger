const fs = require('fs');
const path = require('path');

// Function to remove console.log statements from a string
function removeConsoleLogs(content) {
    // Use a regular expression to remove all console.log occurrences
    return content.replace(/console\.log\(.*?\);?/g, '');
}

// Function to list all files inside a folder
function listFilesInFolder(folderPath) {
    fs.readdir(folderPath, (err, items) => {
        if (err) {
            console.error('Error reading folder:', err);
            return;
        }
        items.forEach(item => {
            const itemPath = path.join(folderPath, item);
            fs.stat(itemPath, (err, stats) => {
                if (err) {
                    console.error('Error getting file stats:', err);
                    return;
                }
                if (stats.isFile()) {
                    if (item !== 'package.json' ) {
                        fs.readFile(itemPath, 'utf8', (err, data) => {
                            if (err) {
                                console.error('Error reading file:', err);
                                return;
                            }
                            if (data.includes('console.log')) {
                                const modifiedContent = removeConsoleLogs(data);
                                fs.writeFile(itemPath, modifiedContent, 'utf8', (err) => {
                                    if (err) {
                                        console.error('Error writing file:', err);
                                        return;
                                    }
                                    console.log(`console.log statements removed successfully from ${itemPath}`);
                                });
                            }
                        });
                    }
                } else if (stats.isDirectory()) {
                    // Recursively list files in subdirectories
                    listFilesInFolder(itemPath);
                }
            });
        });
    });
}

// List all files in the folder
listFilesInFolder(__dirname); 

module.exports = listFilesInFolder