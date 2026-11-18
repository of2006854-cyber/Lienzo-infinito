// Copia el icono de la app (logo del Lienzo) a la carpeta android.
// Se ejecuta solo con "npm run preparar" o "npm run actualizar".
const fs = require('fs');
const path = require('path');
const origen = path.join(__dirname, '..', 'resources', 'res');
const destino = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'res');
if (!fs.existsSync(path.join(__dirname, '..', 'android'))) {
  console.log('Aún no existe la carpeta "android". Ejecuta primero: npm run preparar');
  process.exit(0);
}
fs.cpSync(origen, destino, { recursive: true, force: true });
console.log('Icono de la app aplicado.');
