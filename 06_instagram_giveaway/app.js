const fs = require('fs');
const readline = require('readline');

//COunt unique username across all of the 20 files
function uniqueValues(filePaths) {
    return new Promise((resolve, reject) => {
        const uniqueUsernames = new Set();

        function processFile(filename) {
            const fileStream = fs.createReadStream(filename);
            const rl = readline.createInterface({
                input: fileStream,
                output: process.stdout,
                terminal: false
            });

            rl.on('line', (line) => {
                //look for usernames with structure "word-word" that include all leter from a to z
                const usernameRegex = /\b([a-z]+-[a-z]+)\b/g;
                let match;
                while ((match = usernameRegex.exec(line)) !== null) {
                    uniqueUsernames.add(match[1]);
                }
            });

            rl.on('close', () => {
                if (fileQueue.length > 0) {
                    processFile(fileQueue.shift());
                } else {
                    console.log('Number of unique usernames:', uniqueUsernames.size);
                    resolve(uniqueUsernames);
                }
            });
        }

        const fileQueue = [...filePaths];
        if (fileQueue.length > 0) {
            processFile(fileQueue.shift());
        } else {
            console.log('No files to process for unique usernames.');
            resolve(uniqueUsernames);
        }
    });
}

//COunt unique username that occur in all 20 of the files 
function existInAllFiles(filePaths, uniqueUsernames) {
    return new Promise((resolve, reject) => {
        const usernameSets = [];

        function processFile(filename) {
            const usernameSet = new Set();
            const fileStream = fs.createReadStream(filename);
            const rl = readline.createInterface({
                input: fileStream,
                output: process.stdout,
                terminal: false
            });

            rl.on('line', (line) => {
                //look for usernames with structure "word-word" that include all leter from a to z
                const usernameRegex = /\b([a-z]+-[a-z]+)\b/g;
                let match;
                while ((match = usernameRegex.exec(line)) !== null) {
                    usernameSet.add(match[1]);
                }
            });

            rl.on('close', () => {
                usernameSets.push(usernameSet);
                if (fileQueue.length > 0) {
                    processFile(fileQueue.shift());
                } else {
                    const commonUsernames = intersectSets(usernameSets);
                    console.log('Number of usernames present in every file:', commonUsernames.size);
                    resolve(commonUsernames);
                }
            });
        }

        const fileQueue = [...filePaths];
        if (fileQueue.length > 0) {
            processFile(fileQueue.shift());
        } else {
            console.log('No files to process for common usernames.');
            resolve([]);
        }
    });
}

//COunt unique username that occur in at least 10 of the files 
function existInAtleastTen(filePaths, uniqueUsernames) {
    return new Promise((resolve, reject) => {
        const usernameCountMap = new Map();

        function processFile(filename) {
            const usernameSet = new Set();
            const fileStream = fs.createReadStream(filename);
            const rl = readline.createInterface({
                input: fileStream,
                output: process.stdout,
                terminal: false
            });

            rl.on('line', (line) => {
                //look for usernames with structure "word-word" that include all leter from a to z
                const usernameRegex = /\b([a-z]+-[a-z]+)\b/g;
                let match;
                while ((match = usernameRegex.exec(line)) !== null) {
                    usernameSet.add(match[1]);
                }
            });

            rl.on('close', () => {
                for (const username of usernameSet) {
                    if (usernameCountMap.has(username)) {
                        usernameCountMap.set(username, usernameCountMap.get(username) + 1);
                    } else {
                        usernameCountMap.set(username, 1);
                    }
                }

                if (fileQueue.length > 0) {
                    processFile(fileQueue.shift());
                } else {
                    let count = 0;
                    for (const [username, fileCount] of usernameCountMap.entries()) {
                        if (fileCount >= 10) {
                            count++;
                        }
                    }
                    console.log('Number of unique usernames present in at least 10 files:', count);
                    resolve(count);
                }
            });
        }

        const fileQueue = [...filePaths];
        if (fileQueue.length > 0) {
            processFile(fileQueue.shift());
        } else {
            console.log('No files to process for unique usernames present in at least 10 files.');
            resolve(0);
        }
    });
}

function intersectSets(sets) {
    const intersection = new Set([...sets[0]]);
    for (let i = 1; i < sets.length; i++) {
        for (const item of intersection) {
            if (!sets[i].has(item)) {
                intersection.delete(item);
            }
        }
    }
    return intersection;
}

// List of file names to process
const filePaths = ['out0.txt', 'out1.txt', 'out2.txt', 'out3.txt', 'out4.txt', 'out5.txt', 'out6.txt', 'out7.txt', 'out8.txt', 'out9.txt', 'out10.txt', 'out11.txt', 'out12.txt', 'out13.txt', 'out14.txt', 'out15.txt', 'out16.txt', 'out17.txt', 'out18.txt', 'out19.txt']; // Array of file names

// Start counting time
const startTime = Date.now();

// Call all functions using async/await and promises
async function processFiles() {
    try {
        const uniqueUsernames = await uniqueValues(filePaths);
        const commonUsernames = await existInAllFiles(filePaths, uniqueUsernames);
        const count = await existInAtleastTen(filePaths, uniqueUsernames);
        
        // Calculate and print elapsed time
        const elapsedTime = Date.now() - startTime;
        console.log('Elapsed time:', elapsedTime, 'milliseconds');
    } catch (error) {
        console.error('Error:', error);
    }
}

processFiles();