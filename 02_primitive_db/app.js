import inquirer from 'inquirer';
import fs from 'fs';

function startProgram() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'name',
                message: 'What is your name? (Press ENTER to find user in the DB)'
            }
        ])
        .then((nameAnswer) => {
            const name = nameAnswer.name.trim(); // Trim whitespace 

            if (name) {
                // Ask questions if name is provided
                inquirer
                    .prompt([
                        {
                            type: 'list',
                            name: 'gender',
                            message: 'Please select your gender:',
                            choices: ['Male', 'Female']
                        },
                        {
                            type: 'input',
                            name: 'age',
                            message: 'How old are you?'
                        }
                    ])
                    .then((answers) => {
                        const user = {
                            name: name,
                            gender: answers.gender,
                            age: answers.age
                        };

                        // Read the existing data from the file
                        let existingData = [];
                        try {
                            existingData = JSON.parse(fs.readFileSync('db.txt'));
                        } catch (error) {
                        }

                        // Add the new user to the existing data
                        existingData.push(user);

                        // Write the updated data back to the file
                        fs.writeFile('db.txt', JSON.stringify(existingData, null, 2), (err) => {
                            if (err) {
                                console.error('Error writing to db.txt:', err);
                            } else {
                                console.log('User data has been saved to db.txt.');
                            }

                            // Automatically start adding a new user
                            startProgram();
                        });
                    });
            } else {
                // If name is empty, ask if the user wants to find a user or exit
                inquirer
                    .prompt([
                        {
                            type: 'confirm',
                            name: 'findUser',
                            message: 'Do you want to find a user in the database?',
                            default: true
                        }
                    ])
                    .then((findUserAnswer) => {
                        if (findUserAnswer.findUser) {
                            // Search user in the database
                            findUser();
                        } else {
                            // Exit
                            console.log('Exit');
                        }
                    });
            }
        })
        .catch((error) => {
            console.error('Something went wrong:', error);
        });
}

function findUser() {
    console.log('Searching for user...');
    inquirer
    .prompt([
        {
            type: 'input',
            name: 'searchName',
            message: 'Enter the name of the user you want to find:'
        }
    ])
    .then((searchAnswer) => {
        const searchName = searchAnswer.searchName.trim();

        try {
            const data = JSON.parse(fs.readFileSync('db.txt'));

            // Search for the user 
            const foundUser = data.find(user => user.name.toLowerCase() === searchName.toLowerCase());

            if (foundUser) {
                console.log('User found:');
                console.log(foundUser);
            } else {
                console.log('User not found.');
            }
        } catch (error) {
            console.error('Error reading db.txt:', error);
        }

        // Automatically start adding a new user
        startProgram();
    })
    .catch((error) => {
        console.error('Something went wrong:', error);
        startProgram();
    });
}

// Start
startProgram();
