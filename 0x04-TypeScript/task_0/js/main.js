const studentOne = {
  firstName: 'Syd',
  lastName: 'Barrett',
  age: 60,
  location: 'Cambridge'
};
const studentTwo = {
  firstName: 'Will',
  lastName: 'Oldham',
  age: 51,
  location: 'Louisville'
};
const studentsList = [studentOne, studentTwo];
const table = document.createElement('table');
document.body.appendChild(table);
const head = table.createTHead();
const row = head.insertRow();
const th1 = row.insertCell(0);
const th2 = row.insertCell(1);
th1.innerHTML = ('<b>First Name</b>');
th2.innerHTML = ('<b>Location</b>');
const body = table.createTBody();
studentsList.map(function (student) {
  const newRow = body.insertRow();
  const firstNameRow = newRow.insertCell();
  const locationRow = newRow.insertCell();
  firstNameRow.innerHTML = student.firstName;
  locationRow.innerHTML = student.location;
});
