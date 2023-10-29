const readLineModule = require("readline-sync");

function startProgram() {
    console.log("Start");

    let words = [];
    let numbers = [];

    let userInput = readLineModule.question("Enter something: ");

    // Split the input into words and numbers
    let substrings = userInput.split(' ');

    substrings.forEach(substring => {
        //Convert the substring to a number
        let number = parseInt(substring);
        if (!isNaN(number)) {
            // If number
            numbers.push(number);
        } else {
            // If words 
            words.push(substring);
        }
    });

    console.log("1. Sort words alphabetically");
    console.log("2. Show numbers from lesser to greater");
    console.log("3. Show numbers from bigger to smaller");
    console.log("4. Display words in ascending order by number of letters in the word");
    console.log("5. Show only unique words");
    console.log("6. Display only unique values from the set of words and numbers entered by the user");

    let userMode = readLineModule.question("Enter mode: ");

    if (userMode === "1") {
        let sortedArray = words.sort();
        console.log("Sorted Words Alphabetically:", sortedArray);
    } else if (userMode === "2") {
        let sortedArray = numbers.sort((a, b) => a - b);
        console.log("Sorted Numbers from Lesser to Greater:", sortedArray);
    } else if (userMode === "3") {
        let sortedArray = numbers.sort((a, b) => b - a);
        console.log("Sorted Numbers from Bigger to Smaller:", sortedArray);
    } else if (userMode === "4") {
        let sortedArray = words.sort((a, b) => a.length - b.length);
        console.log("Words Sorted by Length:", sortedArray);
    } else if (userMode === "5") {
        let uniqueWords = words.filter((word, index) => words.indexOf(word) === index);
        console.log("Unique Words:", uniqueWords);
    } else if (userMode === "6") {
        let uniqueValuesSet = new Set(substrings);
        let uniqueValuesArray = Array.from(uniqueValuesSet);
        console.log('Unique Values:', uniqueValuesArray);
    } else if (userMode.toLowerCase() !== "exit") {
        console.log("Invalid mode. Please try again.");
    }
    
    startProgram(); // Restart the program

}

// Start the program 
startProgram();
