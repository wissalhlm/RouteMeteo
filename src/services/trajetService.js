// src/services/trajetService.js

export const calculerLesEtapes = (depart, arrivee) => {
  const points = [];
  if (!depart || !arrivee) return points;

  // On en génère 3 (pour être sûr de voir le changement par rapport aux 4 actuels)
  for (let i = 1; i <= 3; i++) {
    const fraction = i / (3 + 1);
    const lat = depart.latitude + (arrivee.latitude - depart.latitude) * fraction;
    const lon = depart.longitude + (arrivee.longitude - depart.longitude) * fraction;
    points.push({ latitude: lat, longitude: lon, name: "Etape " + i });
  }
  return points;
};

export const assemblerToutLeTrajet = (p1, p2, listeEtapes) => {
  console.log("=== APPEL NOUVEAU SERVICE TRAJET ===");
  const resultat = [];

  // 1. Départ
  resultat.push({ ...p1, type: 'Départ' });

  // 2. Étapes (Vérification)
  if (Array.isArray(listeEtapes) && listeEtapes.length > 0) {
    console.log("Etapes bien reçues ! Nombre :", listeEtapes.length);
    for (let i = 0; i < listeEtapes.length; i++) {
      resultat.push({ ...listeEtapes[i], type: 'Étape' });
    }
  } else {
    console.error("ERREUR : Les étapes sont manquantes ou mal passées");
  }

  // 3. Arrivée
  resultat.push({ ...p2, type: 'Arrivée' });

  console.log("Total points créés :", resultat.length);
  return resultat;
};