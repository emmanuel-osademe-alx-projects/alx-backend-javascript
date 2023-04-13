const express = require('express');
const fs = require('fs');

const app = express();
const port = 1245;
const DB_FILE = process.argv.length > 2 ? process.argv[2] : '';

/**
 * Counts the students in a CSV data file.
 * @param {String} dbPath The path to the CSV data file.
 */
const countStudents = (dbPath) => new Promise((resolve, reject) => {
  if (!dbPath) {
    reject(new Error('Cannot load the database'));
  }
  if (dbPath) {
    fs.readFile(dbPath, (err, data) => {
      if (err) {
        reject(new Error('Cannot load the database'));
      }
      if (data) {
        const rParts = [];
        const fileLines = data.toString('utf-8').trim().split('\n');
        const studentGroups = {};
        const dbFieldNames = fileLines[0].split(',');
        const studentPropNames = dbFieldNames.slice(
          0,
          dbFieldNames.length - 1
        );

        for (const line of fileLines.slice(1)) {
          const dbRecord = line.split(',');
          const studentPropValues = dbRecord.slice(
            0,
            dbRecord.length - 1
          );
          const field = dbRecord[dbRecord.length - 1];
          if (!Object.keys(studentGroups).includes(field)) {
            studentGroups[field] = [];
          }
          const studentEntries = studentPropNames.map((propName, idx) => [
            propName,
            studentPropValues[idx]
          ]);
          studentGroups[field].push(Object.fromEntries(studentEntries));
        }

        const totalStudents = Object.values(studentGroups).reduce(
          (pre, cur) => (pre || []).length + cur.length
        );
        rParts.push(`Number of students: ${totalStudents}`);
        for (const [field, group] of Object.entries(studentGroups)) {
          rParts.push([
            `Number of students in ${field}: ${group.length}.`,
            'List:',
            group.map((student) => student.firstname).join(', ')
          ].join(' '));
        }
        resolve(rParts.join('\n'));
      }
    });
  }
});

app.get('/', (_, res) => {
  res.send('Hello Holberton School!');
});

app.get('/students', (_, res) => {
  const resParts = ['This is the list of our students'];

  countStudents(DB_FILE)
    .then((report) => {
      resParts.push(report);
      const resText = resParts.join('\n');
      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Content-Length', resText.length);
      res.statusCode = 200;
      res.write(Buffer.from(resText));
    })
    .catch((err) => {
      resParts.push(err instanceof Error ? err.message : err.toString());
      const resText = resParts.join('\n');
      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Content-Length', resText.length);
      res.statusCode = 200;
      res.write(Buffer.from(resText));
    });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

module.exports = app;
