process.stdout.write('Welcome to Holberton School, what is your name?\n');

process.stdin.on('readable', () => {
  const ch = process.stdin.read();

  if (ch) {
    process.stdout.write(`Your name is: ${ch}`);
  }
});

process.stdin.on('end', () => {
  process.stdout.write('This important software is now closing\n');
});
