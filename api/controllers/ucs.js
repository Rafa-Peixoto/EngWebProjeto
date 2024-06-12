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

// Get all UCs
exports.getAllUCs = (req, res, next) => {
  try {
    const ucs = readJSONFile('ucs.json');
    res.json(ucs);
  } catch (err) {
    next(err);
  }
};

// Create a new UC
exports.createUC = (req, res, next) => {
  try {
    const ucs = readJSONFile('ucs.json');
    const newUC = req.body;
    ucs.push(newUC);
    writeJSONFile('ucs.json', ucs);
    res.status(201).json(newUC);
  } catch (err) {
    next(err);
  }
};

// Get UC by ID (sigla)
exports.getUCById = (req, res, next) => {
  try {
    const ucs = readJSONFile('ucs.json');
    const uc = ucs.find((uc) => uc.sigla === req.params.id);
    if (!uc) return res.status(404).json({ message: "UC not found" });
    res.json(uc);
  } catch (err) {
    next(err);
  }
};

// Update UC by ID (sigla)
exports.updateUC = (req, res, next) => {
  try {
    let ucs = readJSONFile('ucs.json');
    const index = ucs.findIndex((uc) => uc.sigla === req.params.id);
    if (index === -1) return res.status(404).json({ message: "UC not found" });
    
    ucs[index] = { ...ucs[index], ...req.body };
    writeJSONFile('ucs.json', ucs);
    res.json(ucs[index]);
  } catch (err) {
    next(err);
  }
};

// Delete UC by ID (sigla)
exports.deleteUC = (req, res, next) => {
  try {
    let ucs = readJSONFile('ucs.json');
    const index = ucs.findIndex((uc) => uc.sigla === req.params.id);
    if (index === -1) return res.status(404).json({ message: "UC not found" });

    ucs.splice(index, 1);
    writeJSONFile('ucs.json', ucs);
    res.json({ message: "UC deleted" });
  } catch (err) {
    next(err);
  }
};
