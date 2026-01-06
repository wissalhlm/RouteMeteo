// src/services/trajetService.js
export const assemblerToutLeTrajet = (startPoint, endPoint, steps) => {
  const result = [];

  // Départ
  result.push({ 
    lat: startPoint.latitude, 
    lon: startPoint.longitude, 
    name: startPoint.name, 
    type: 'Départ' 
  });

  // Étapes (on utilise le nom "name" passé par l'étape)
  if (Array.isArray(steps)) {
    steps.forEach((step, index) => {
      result.push({ 
        lat: step.lat, 
        lon: step.lon, 
        name: step.name || `Étape ${index + 1}`, 
        type: 'Étape' 
      });
    });
  }

  // Arrivée
  result.push({ 
    lat: endPoint.latitude, 
    lon: endPoint.longitude, 
    name: endPoint.name, 
    type: 'Arrivée' 
  });

  return result;
};