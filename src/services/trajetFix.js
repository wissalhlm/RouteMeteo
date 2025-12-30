// src/services/trajetFix.js

// Cette fonction génère exactement 3 points pour vérifier le changement
export const calculerPoints = (depart, arrivee) => {
  const points = [];
  if (!depart || !arrivee) return points;

  for (let i = 1; i <= 3; i++) {
    const fraction = i / (3 + 1);
    const lat = depart.latitude + (arrivee.latitude - depart.latitude) * fraction;
    const lon = depart.longitude + (arrivee.longitude - depart.longitude) * fraction;
    points.push({ 
      latitude: lat, 
      longitude: lon, 
      name: "Etape " + i 
    });
  }
  return points;
};

// Cette fonction assemble les 3 arguments : depart, arrivee, et le tableau etapes
export const assemblerTrajetFinal = (objDepart, objArrivee, tableauEtapes) => {
  console.log("=== APPEL NOUVEAU SERVICE TRAJET FIX ===");
  const resultat = [];

  // 1. Ajout du Départ
  if (objDepart) {
    resultat.push({ ...objDepart, type: 'Départ' });
  }

  // 2. Ajout des Étapes (on vérifie que c'est bien le tableau en 3ème position)
  if (Array.isArray(tableauEtapes)) {
    console.log("Étapes reçues avec succès :", tableauEtapes.length);
    for (let i = 0; i < tableauEtapes.length; i++) {
      resultat.push({ ...tableauEtapes[i], type: 'Étape' });
    }
  } else {
    console.error("ERREUR : Le paramètre 'tableauEtapes' n'est pas un tableau !");
  }

  // 3. Ajout de l'Arrivée
  if (objArrivee) {
    resultat.push({ ...objArrivee, type: 'Arrivée' });
  }

  console.log("NOMBRE TOTAL DE POINTS :", resultat.length);
  return resultat;
};