// Service de géocodage utilisant l'API gratuite Nominatim
export const getCoordinates = async (city) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`
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
    throw error;
  }
};