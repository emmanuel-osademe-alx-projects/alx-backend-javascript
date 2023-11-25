const http = require('http');
const fs = require('fs');

const PORT = 1245;
const HOST = 'localhost';
const SERVER = http.createServer();
const DB_FILE = process.argv.length > 2 ? process.argv[2] : '';

/**
 * Counts the number of students in a CSV data file.
 * @param {String} filePath The path to the CSV data file.
 */
const countStudents = (filePath) => new Promise((resolve, reject) => {
  if (!filePath) {
    reject(new Error('Cannot load the database'));
  }

  if (filePath) {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(new Error('Cannot load the database'));
      }
      if (data) {
        const reports = [];
        const fl = data.toString('utf-8').trim().split('\n');
        const groups = {};
        const dbfn = fl[0].split(',');
        const sNames = dbfn.slice(0, dbfn.length - 1);

        for (const line of fl.slice(1)) {
          const record = line.split(',');
          const studentPropValues = record.slice(0, record.length - 1);
          const field = record[record.length - 1];
          if (!Object.keys(groups).includes(field)) {
            groups[field] = [];
          }
          const entries = sNames.map((propName, idx) => [
            propName,
            studentPropValues[idx],
          ]);
          groups[field].push(Object.fromEntries(entries));
        }

        const total = Object.values(groups).reduce(
          (pre, cur) => (pre || []).length + cur.length,
        );
        reports.push(`Number of students: ${total}`);
        for (const [field, group] of Object.entries(groups)) {
          reports.push(
            [
              `Number of students in ${field}: ${group.length}.`,
              'List:',
              group.map((student) => student.firstname).join(', '),
            ].join(' '),
          );
        }
        resolve(reports.join('\n'));
      }
    });
  }
});

const ROUTES = [
  {
    route: '/',
    handler(_, res) {
      const responseText = 'Hello Holberton School!';

      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Content-Length', responseText.length);
      res.statusCode = 200;
      res.write(Buffer.from(responseText));
    },
  },
  {
    route: '/students',
    handler(_, res) {
      const responseParts = ['This is the list of our students'];

      countStudents(DB_FILE)
        .then((report) => {
          responseParts.push(report);
          const responseText = responseParts.join('\n');
          res.setHeader('Content-Type', 'text/plain');
          res.setHeader('Content-Length', responseText.length);
          res.statusCode = 200;
          res.write(Buffer.from(responseText));
        })
        .catch((err) => {
          responseParts.push(
            err instanceof Error ? err.message : err.toString(),
          );
          const responseText = responseParts.join('\n');
          res.setHeader('Content-Type', 'text/plain');
          res.setHeader('Content-Length', responseText.length);
          res.statusCode = 200;
          res.write(Buffer.from(responseText));
        });
    },
  },
];

SERVER.on('request', (req, res) => {
  ROUTES.map((route) => (route.route === req.url ? route.handler(req, res) : null));
});

SERVER.listen(PORT, HOST, () => {
  process.stdout.write(`Server listening at -> http://${HOST}:${PORT}\n`);
});

module.exports = SERVER;
