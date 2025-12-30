// Nouveau fichier pour forcer la mise à jour du cache
export const calculateRoutePoints = (depart, arrivee, nombreEtapes = 3) => {
  const points = [];
  if (!depart || !arrivee) return points;

  for (let i = 1; i <= nombreEtapes; i++) {
    const fraction = i / (nombreEtapes + 1);
    const lat = depart.latitude + (arrivee.latitude - depart.latitude) * fraction;
    const lon = depart.longitude + (arrivee.longitude - depart.longitude) * fraction;
    points.push({ 
      latitude: lat, 
      longitude: lon, 
      name: "Étape " + i 
    });
  }
  return points;
};

export const combineAllPoints = (objDepart, objArrivee, tableauEtapes) => {
  console.log("=== APPEL VIA ROUTE-MANAGER.JS ===");
  const finalResult = [];
  
  // 1. Ajout du départ
  if (objDepart && objDepart.latitude) {
    finalResult.push({ ...objDepart, type: 'Départ' });
  }

  // 2. Ajout des étapes (Vérification stricte)
  if (Array.isArray(tableauEtapes)) {
    console.log("Étapes détectées :", tableauEtapes.length);
    for (let i = 0; i < tableauEtapes.length; i++) {
      finalResult.push({ ...tableauEtapes[i], type: 'Étape' });
    }
  } else {
    console.error("ERREUR : Le troisième argument n'est pas un tableau !");
  }

  // 3. Ajout de l'arrivée
  if (objArrivee && objArrivee.latitude) {
    finalResult.push({ ...objArrivee, type: 'Arrivée' });
  }

  console.log("TOTAL POINTS GÉNÉRÉS :", finalResult.length);
  return finalResult;
};