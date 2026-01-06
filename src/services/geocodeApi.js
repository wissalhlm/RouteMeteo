// src/services/geocodeApi.js
export const getCoordinates = async (city) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`,
      {
        headers: { 'User-Agent': 'MeteoTrajetApp/1.0' }
      }
    );
    const data = await response.json();
    if (data && data.length > 0) {
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
        name: data[0].display_name.split(',')[0],
      };
    }
    return null;
  } catch (error) {
    console.error("Erreur de géocodage :", error);
    return null;
  }
};

export const getPlaceName = async (lat, lon) => {
  try {
    // Zoom 12 permet de mieux détecter les communes et villages aux alentours
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=12`,
      {
        headers: { 'User-Agent': 'MeteoTrajetApp/1.0' }
      }
    );
    const data = await response.json();
    if (data && data.address) {
      const a = data.address;
      // On cherche le nom le plus précis possible
      return a.city || a.town || a.village || a.hamlet || a.municipality || a.county || "Lieu-dit";
    }
    return "Point sur le trajet";
  } catch (error) {
    return "Étape";
  }
};