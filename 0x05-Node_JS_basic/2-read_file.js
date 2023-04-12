const fs = require('fs');

/**
 * Counts the students in a CSV data file.
 * @param {String} dbPath The path to the CSV data file.
 */
const countStudents = (dbPath) => {
  if (!fs.existsSync(dbPath)) {
    throw new Error('Cannot load the database');
  }
  if (!fs.statSync(dbPath).isFile()) {
    throw new Error('Cannot load the database');
  }
  const entries = fs
    .readFileSync(dbPath, 'utf-8')
    .toString('utf-8')
    .trim()
    .split('\n');
  const groups = {};
  const dbFields = entries[0].split(',');
  const studentPropNames = dbFields.slice(0, dbFields.length - 1);

  for (const line of entries.slice(1)) {
    const studentRecord = line.split(',');
    const studentPropValues = studentRecord.slice(0, studentRecord.length - 1);
    const field = studentRecord[studentRecord.length - 1];
    if (!Object.keys(groups).includes(field)) {
      groups[field] = [];
    }
    const studentEntries = studentPropNames
      .map((propName, idx) => [propName, studentPropValues[idx]]);
    groups[field].push(Object.fromEntries(studentEntries));
  }

  const totalStudents = Object
    .values(groups)
    .reduce((pre, cur) => (pre || []).length + cur.length);
  console.log(`Number of students: ${totalStudents}`);
  for (const [field, group] of Object.entries(groups)) {
    const studentNames = group.map((student) => student.firstname).join(', ');
    console.log(`Number of students in ${field}: ${group.length}. List: ${studentNames}`);
  }
};

module.exports = countStudents;
