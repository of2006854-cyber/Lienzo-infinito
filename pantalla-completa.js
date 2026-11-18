// Pone la app Android en PANTALLA COMPLETA (oculta barra de estado y de navegación).
// Se ejecuta solo con "npm run preparar" o "npm run actualizar".
const fs = require('fs');
const path = require('path');

function buscar(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { const r = buscar(p); if (r) return r; }
    else if (e.name === 'MainActivity.java') return p;
  }
  return null;
}

const raiz = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'java');
if (!fs.existsSync(raiz)) {
  console.log('Aún no existe la carpeta "android". Ejecuta primero: npm run preparar');
  process.exit(0);
}
const archivo = buscar(raiz);
if (!archivo) { console.log('No se encontró MainActivity.java'); process.exit(0); }

const viejo = fs.readFileSync(archivo, 'utf8');
const m = viejo.match(/^\s*package\s+([\w.]+)\s*;/m);
const pkg = m ? m[1] : 'com.lienzo.infinito';

const codigo = `package ${pkg};

import android.os.Build;
import android.os.Bundle;
import android.view.WindowManager;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (Build.VERSION.SDK_INT >= 28) {
            WindowManager.LayoutParams lp = getWindow().getAttributes();
            lp.layoutInDisplayCutoutMode = WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES;
            getWindow().setAttributes(lp);
        }
        ocultarBarras();
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) ocultarBarras();
    }

    private void ocultarBarras() {
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
        WindowInsetsControllerCompat c = WindowCompat.getInsetsController(getWindow(), getWindow().getDecorView());
        c.setSystemBarsBehavior(WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
        c.hide(WindowInsetsCompat.Type.systemBars());
    }
}
`;
if (viejo !== codigo) {
  fs.writeFileSync(archivo, codigo);
  console.log('Pantalla completa aplicada en: ' + archivo);
} else {
  console.log('Pantalla completa ya estaba aplicada.');
}
