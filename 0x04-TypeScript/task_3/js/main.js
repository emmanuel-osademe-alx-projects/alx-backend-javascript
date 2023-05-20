'use strict';
/// <reference path="crud.d.ts"/>
exports.__esModule = true;
const CRUD = require('./crud');
const row = {
  firstName: 'Guillaume',
  lastName: 'Salva'
};
const newRowID = CRUD.insertRow(row);
const updatedRow = {
  firstName: 'Guillaume',
  lastName: 'Salva',
  age: 23
};
CRUD.updateRow(newRowID, updatedRow);
CRUD.deleteRow(newRowID);
