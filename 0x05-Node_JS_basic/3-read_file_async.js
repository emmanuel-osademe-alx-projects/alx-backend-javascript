const fs = require('fs');

/**
 * Counts the number of students in a CSV data file.
 * @param {String} filePath The path to the CSV data file.
 */
const countStudents = (filePath) => new Promise((resolve, reject) => {
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      reject(new Error('Cannot load the database'));
    }
    if (data) {
      const fl = data
        .toString('utf-8')
        .trim()
        .split('\n');
      const groups = {};
      const dbFN = fl[0].split(',');
      const sNames = dbFN
        .slice(0, dbFN.length - 1);

      for (const line of fl.slice(1)) {
        const studentRecord = line.split(',');
        const studentPropValues = studentRecord
          .slice(0, studentRecord.length - 1);
        const field = studentRecord[studentRecord.length - 1];
        if (!Object.keys(groups).includes(field)) {
          groups[field] = [];
        }
        const sEntries = sNames
          .map((propName, idx) => [propName, studentPropValues[idx]]);
        groups[field].push(Object.fromEntries(sEntries));
      }

      const total = Object
        .values(groups)
        .reduce((pre, cur) => (pre || []).length + cur.length);
      console.log(`Number of students: ${total}`);
      for (const [field, group] of Object.entries(groups)) {
        const studentNames = group.map((student) => student.firstname).join(', ');
        console.log(`Number of students in ${field}: ${group.length}. List: ${studentNames}`);
      }
      resolve(true);
    }
  });
});

module.exports = countStudents;
