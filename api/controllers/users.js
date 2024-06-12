const fs = require('fs');
const path = require('path');

// Helper function to read JSON file
const readJSONFile = (filename) => {
  const filePath = path.join(__dirname, '../../', filename);
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
};

// Helper function to write JSON file
const writeJSONFile = (filename, data) => {
  const filePath = path.join(__dirname, '../../', filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Get all Docentes
exports.getAllDocentes = (req, res, next) => {
  try {
    const docentes = readJSONFile('users.json').docentes;
    res.json(docentes);
  } catch (err) {
    next(err);
  }
};

// Create a new Docente
exports.createDocente = (req, res, next) => {
  try {
    const docentes = readJSONFile('users.json').docentes;
    const newDocente = req.body;
    docentes.push(newDocente);
    writeJSONFile('users.json', { docentes });
    res.status(201).json(newDocente);
  } catch (err) {
    next(err);
  }
};

// Get Docente by ID (username)
exports.getDocenteById = (req, res, next) => {
  try {
    const docentes = readJSONFile('users.json').docentes;
    const docente = docentes.find((docente) => docente.username === req.params.id);
    if (!docente) return res.status(404).json({ message: "Docente not found" });
    res.json(docente);
  } catch (err) {
    next(err);
  }
};

// Update Docente by ID (username)
exports.updateDocente = (req, res, next) => {
  try {
    let docentes = readJSONFile('users.json').docentes;
    const index = docentes.findIndex((docente) => docente.username === req.params.id);
    if (index === -1) return res.status(404).json({ message: "Docente not found" });
    
    docentes[index] = { ...docentes[index], ...req.body };
    writeJSONFile('users.json', { docentes });
    res.json(docentes[index]);
  } catch (err) {
    next(err);
  }
};

// Delete Docente by ID (username)
exports.deleteDocente = (req, res, next) => {
  try {
    let docentes = readJSONFile('users.json').docentes;
    const index = docentes.findIndex((docente) => docente.username === req.params.id);
    if (index === -1) return res.status(404).json({ message: "Docente not found" });

    docentes.splice(index, 1);
    writeJSONFile('users.json', { docentes });
    res.json({ message: "Docente deleted" });
  } catch (err) {
    next(err);
  }
};
