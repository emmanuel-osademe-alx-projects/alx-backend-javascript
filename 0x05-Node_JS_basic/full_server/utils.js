import fs from 'fs';

/**
 * Reads the data of students in a CSV data file.
 * @param {String} filePath The path to the CSV data file.
 * @returns {Promise<{
 *   String: {firstname: String, lastname: String, age: number}[]
 * }>}
 */
const readDatabase = (filePath) => new Promise((resolve, reject) => {
  if (!filePath) {
    reject(new Error('Cannot load the database'));
  }

  if (filePath) {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(new Error('Cannot load the database'));
      }
      if (data) {
        const fileLines = data
          .toString('utf-8')
          .trim()
          .split('\n');
        const groups = {};
        const dbFN = fileLines[0].split(',');
        const sNames = dbFN
          .slice(0, dbFN.length - 1);

        fileLines.slice(1).map((line) => {
          const records = line.split(',');
          const studentPropValues = records
            .slice(0, records.length - 1);
          const field = records[records.length - 1];
          if (!Object.keys(groups).includes(field)) {
            groups[field] = [];
          }
          const studentEntries = sNames
            .map((propName, idx) => [propName, studentPropValues[idx]]);
          groups[field].push(Object.fromEntries(studentEntries));

          return true;
        });

        resolve(groups);
      }
    });
  }
});

export default readDatabase;
// module.exports = readDatabase;
