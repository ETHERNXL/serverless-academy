const fs = require('fs');

const rawData = fs.readFileSync('data.json');
const originalData = JSON.parse(rawData);

const transformedData = {};

// Extract user ID, user name, start date, and end date from each vacation object
originalData.forEach(vacation => {
  const userId = vacation.user._id;
  const userName = vacation.user.name;
  const { startDate, endDate } = vacation;

  // Check if transformedData already has an entry for the current user
  if (!transformedData[userId]) {
    // If not, create a new entry with userId, userName, and an empty vacations array
    transformedData[userId] = {
      userId: userId,
      userName: userName,
      vacations: []
    };
  }

// Push the current vacation's start and end dates into 
// the vacations array of the corresponding user
  transformedData[userId].vacations.push({
    startDate: startDate,
    endDate: endDate
  });
});

const resultArray = Object.values(transformedData);

fs.writeFileSync('dataSorted.json', JSON.stringify(resultArray, null, 2));

console.log('dataSorted.json file created successfully.');
