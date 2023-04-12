const fs = require('fs');

/**
 * Counts the students in a CSV data file.
 * @param {String} dataPath The path to the CSV data file.
 */
const countStudents = (dataPath) => new Promise((resolve, reject) => {
  fs.readFile(dataPath, 'utf-8', (err, data) => {
    if (err) {
      reject(new Error('Cannot load the database'));
    }
    if (data) {
      const entries = data
        .toString('utf-8')
        .trim()
        .split('\n');
      const groups = {};
      const dbFields = entries[0].split(',');
      const studentPropNames = dbFields
        .slice(0, dbFields.length - 1);

      for (const line of entries.slice(1)) {
        const entity = line.split(',');
        const studentPropValues = entity
          .slice(0, entity.length - 1);
        const field = entity[entity.length - 1];
        if (!Object.keys(groups).includes(field)) {
          groups[field] = [];
        }
        const entities = studentPropNames
          .map((propName, idx) => [propName, studentPropValues[idx]]);
        groups[field].push(Object.fromEntries(entities));
      }

      const totalEntities = Object
        .values(groups)
        .reduce((pre, cur) => (pre || []).length + cur.length);
      console.log(`Number of students: ${totalEntities}`);
      for (const [field, group] of Object.entries(groups)) {
        const entityName = group.map((student) => student.firstname).join(', ');
        console.log(`Number of students in ${field}: ${group.length}. List: ${entityName}`);
      }
      resolve(true);
    }
  });
});

module.exports = countStudents;
