/**
 * Service pour récupérer les données météo via OpenWeatherMap API
 * Membre 3 - Intégration API OpenWeatherMap
 */

// Clé API OpenWeatherMap (à remplacer par votre propre clé)
const API_KEY = '9a54707fead2e50a7e10b7c7f7ec2e85';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

/**
 * Récupère la météo actuelle pour des coordonnées GPS
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {string} units - Unités (metric pour °C, imperial pour °F)
 * @returns {Promise<Object>} - Données météo
 */
export const getCurrentWeather = async (lat, lon, units = 'metric') => {
  try {
    const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=${units}&lang=fr&appid=${API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return {
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed),
      pressure: data.main.pressure,
      visibility: data.visibility,
    };
  } catch (error) {
    console.error('Erreur lors de la récupération de la météo actuelle:', error);
    throw new Error('Impossible de récupérer la météo. Vérifiez votre connexion internet.');
  }
};

/**
 * Récupère les prévisions météo (5 jours) pour des coordonnées GPS
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {string} units - Unités (metric pour °C, imperial pour °F)
 * @returns {Promise<Array>} - Liste des prévisions
 */
export const getForecastWeather = async (lat, lon, units = 'metric') => {
  try {
    const url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=${units}&lang=fr&appid=${API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Retourne une liste formatée des prévisions
    return data.list.map(item => ({
      dateTime: item.dt,
      dateTimeText: item.dt_txt,
      temperature: Math.round(item.main.temp),
      feelsLike: Math.round(item.main.feels_like),
      description: item.weather[0].description,
      icon: item.weather[0].icon,
      humidity: item.main.humidity,
      windSpeed: Math.round(item.wind.speed),
      pressure: item.main.pressure,
      clouds: item.clouds.all,
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des prévisions météo:', error);
    throw new Error('Impossible de récupérer les prévisions météo.');
  }
};

/**
 * Récupère la météo pour un point spécifique à une date/heure donnée
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {Date} targetDate - Date ciblée
 * @param {string} units - Unités (metric pour °C, imperial pour °F)
 * @returns {Promise<Object>} - Données météo pour cette date
 */
export const getWeatherForDateTime = async (lat, lon, targetDate, units = 'metric') => {
  try {
    const now = new Date();
    const hoursDiff = (targetDate - now) / (1000 * 60 * 60);
    
    // Si c'est dans moins de 5 jours, utiliser l'API forecast
    if (hoursDiff <= 120 && hoursDiff >= 0) {
      const forecasts = await getForecastWeather(lat, lon, units);
      
      // Trouver la prévision la plus proche de la date ciblée
      const targetTimestamp = Math.floor(targetDate.getTime() / 1000);
      
      let closestForecast = forecasts[0];
      let minDiff = Math.abs(forecasts[0].dateTime - targetTimestamp);
      
      forecasts.forEach(forecast => {
        const diff = Math.abs(forecast.dateTime - targetTimestamp);
        if (diff < minDiff) {
          minDiff = diff;
          closestForecast = forecast;
        }
      });
      
      return closestForecast;
    } else {
      // Pour l'instant ou au-delà de 5 jours, utiliser la météo actuelle
      return await getCurrentWeather(lat, lon, units);
    }
  } catch (error) {
    console.error('Erreur lors de la récupération de la météo pour la date:', error);
    throw error;
  }
};

/**
 * Récupère la météo pour plusieurs points du trajet
 * @param {Array} points - Liste des points [{lat, lon, name}]
 * @param {Date} departureDate - Date de départ
 * @param {string} units - Unités
 * @returns {Promise<Array>} - Données météo pour chaque point
 */
export const getWeatherForRoute = async (points, departureDate, units = 'metric') => {
  try {
    // Calculer l'heure d'arrivée estimée pour chaque point
    // Durée moyenne entre chaque point (exemple: 1h)
    const hoursPerSegment = 1;
    
    const weatherPromises = points.map(async (point, index) => {
      // Calculer l'heure d'arrivée à ce point
      const pointDate = new Date(departureDate);
      pointDate.setHours(pointDate.getHours() + (index * hoursPerSegment));
      
      try {
        const weather = await getWeatherForDateTime(point.lat, point.lon, pointDate, units);
        
        return {
          ...point,
          weather,
          estimatedTime: pointDate,
          success: true,
        };
      } catch (error) {
        console.error(`Erreur pour le point ${point.name}:`, error);
        return {
          ...point,
          weather: null,
          estimatedTime: pointDate,
          success: false,
          error: error.message,
        };
      }
    });
    
    const results = await Promise.all(weatherPromises);
    return results;
  } catch (error) {
    console.error('Erreur lors de la récupération de la météo du trajet:', error);
    throw new Error('Impossible de récupérer la météo pour le trajet.');
  }
};

/**
 * Obtenir l'URL de l'icône météo
 * @param {string} iconCode - Code icône (ex: '01d')
 * @returns {string} - URL complète de l'icône
 */
export const getWeatherIconUrl = (iconCode) => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

/**
 * Valider la clé API
 * @returns {Promise<boolean>} - True si la clé est valide
 */
export const validateApiKey = async () => {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?lat=33.5731&lon=-7.5898&appid=${API_KEY}`
    );
    return response.ok;
  } catch (error) {
    return false;
  }
};
