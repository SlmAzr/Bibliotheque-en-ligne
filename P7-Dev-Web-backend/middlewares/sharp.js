const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Configuration des paramètres de compression
const QUALITY_RATIO = 50;
const maxWidth = 750;
const maxHeight = 900;

async function sharpMiddleware(req, res, next) {
  if (!req.file || !req.file.filename) {
    next();
    return;
  }
  const file = req.file;
  let { filename } = file;

  // Renomme le fichier en ajoutant "-sharp.webp" à la fin du nom de fichier
  const lastDotIndex = filename.lastIndexOf('.');
  filename = filename.slice(0, lastDotIndex) + '-sharp.webp';

  try {
    // Utilise Sharp pour redimensionner l'image, la convertir en WebP et la sauvegarder
    await sharp(file.path)
      .resize(maxWidth, maxHeight, { fit: 'cover' })
      .webp({ quality: QUALITY_RATIO })
      .toFile(path.resolve(file.destination, filename));
    req.file.filename = filename;
    next();
  } catch (error) {
    // Gère les erreurs potentielles lors de la compression
    printError(error); // Assurez-vous d'avoir la fonction printError définie
  } finally {
    try {
      // Supprime le fichier d'origine téléchargé, quelle que soit l'issue de la compression
      fs.unlinkSync(file.path);
    } catch (error) {
      // Gère les erreurs potentielles lors de la suppression du fichier
      printError(error); // Assurez-vous d'avoir la fonction printError définie
    }
  }
}

module.exports = { sharpMiddleware };
