// src/services/routeUtils.js

export const calculateIntermediatePoints = (start, end, numPoints = 3) => {
  const points = [];
  if (!start || !end) return points;

  for (let i = 1; i <= numPoints; i++) {
    const fraction = i / (numPoints + 1);
    const lat = start.latitude + (end.latitude - start.latitude) * fraction;
    const lon = start.longitude + (end.longitude - start.longitude) * fraction;
    points.push({ 
      latitude: lat, 
      longitude: lon, 
      name: "Étape " + i 
    });
  }
  return points;
};

export const prepareWeatherPoints = (start, end, steps) => {
  console.log("=== PRÉPARATION DU TRAJET ===");
  const finalArray = [];
  
  // 1. Ajout du départ
  if (start && start.latitude) {
    finalArray.push({ ...start, type: 'Départ' });
  }

  // 2. Ajout des étapes (on vérifie que c'est bien un tableau)
  if (Array.isArray(steps)) {
    console.log("Nombre d'étapes reçues :", steps.length);
    for (let i = 0; i < steps.length; i++) {
      finalArray.push({ ...steps[i], type: 'Étape' });
    }
  } else {
    console.log("ERREUR : 'steps' n'est pas un tableau");
  }

  // 3. Ajout de l'arrivée
  if (end && end.latitude) {
    finalArray.push({ ...end, type: 'Arrivée' });
  }

  console.log("Résultat final (nb points) :", finalArray.length);
  return finalArray;
};