
// Importe le JS global de FlyonUI (remplace le chemin selon ton package)
import "flyonui/flyonui";

// Si FlyonUI expose une méthode d'init via une variable globale
// tu peux l'encapsuler ici :
export function initFlyonUI() {
  if (typeof window !== 'undefined' && (window as any).FlyonUI?.init) {
    (window as any).FlyonUI.init()
    console.log('[flyonui] Initialisé.')
  } else {
    console.warn('[flyonui] Pas de méthode init trouvée.')
  }
}