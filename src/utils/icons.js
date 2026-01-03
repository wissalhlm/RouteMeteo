/**
 * Utilitaires pour les icônes météo
 * PARTAGÉ - Utilisé par tous les membres
 * 
 * Responsabilités :
 * - Mapper les codes météo aux emojis
 * - Fournir les couleurs selon la météo
 */

/**
 * Convertit un code météo OpenWeatherMap en emoji
 * @param {string} iconCode - Code de l'icône (ex: '01d', '10n')
 * @returns {string} Emoji correspondant
 */
export const getWeatherEmoji = (iconCode) => {
  const code = iconCode?.substring(0, 2);
  
  const emojiMap = {
    '01': '☀️',  // Clear sky
    '02': '⛅',  // Few clouds
    '03': '☁️',  // Scattered clouds
    '04': '☁️',  // Broken clouds
    '09': '🌧️',  // Shower rain
    '10': '🌦️',  // Rain
    '11': '⛈️',  // Thunderstorm
    '13': '❄️',  // Snow
    '50': '🌫️',  // Mist
  };
  
  return emojiMap[code] || '🌤️';
};

/**
 * Obtient une couleur selon la température
 * @param {number} temp - Température en °C
 * @returns {string} Code couleur
 */
export const getTemperatureColor = (temp) => {
  if (temp < 0) return '#1565C0';   // Bleu foncé
  if (temp < 10) return '#42A5F5';  // Bleu
  if (temp < 20) return '#66BB6A';  // Vert
  if (temp < 30) return '#FFA726';  // Orange
  return '#EF5350';                 // Rouge
};

/**
 * Obtient une couleur de fond selon la météo
 * @param {string} iconCode - Code de l'icône
 * @returns {string} Code couleur
 */
export const getWeatherBackgroundColor = (iconCode) => {
  const code = iconCode?.substring(0, 2);
  
  const colorMap = {
    '01': '#FFE082',  // Jaune clair
    '02': '#B3E5FC',  // Bleu clair
    '03': '#CFD8DC',  // Gris clair
    '04': '#B0BEC5',  // Gris
    '09': '#90CAF9',  // Bleu pluie
    '10': '#81D4FA',  // Bleu pluie clair
    '11': '#616161',  // Gris foncé
    '13': '#E1F5FE',  // Bleu très clair
    '50': '#ECEFF1',  // Gris très clair
  };
  
  return colorMap[code] || '#E3F2FD';
};

/**
 * Obtient l'icône pour le vent selon la vitesse
 * @param {number} speed - Vitesse du vent en km/h
 * @returns {string} Emoji
 */
export const getWindIcon = (speed) => {
  if (speed < 10) return '🍃';
  if (speed < 30) return '💨';
  return '🌪️';
};

/**
 * Obtient l'icône pour l'humidité
 * @returns {string} Emoji
 */
export const getHumidityIcon = () => '💧';

/**
 * Obtient l'icône pour la pression
 * @returns {string} Emoji
 */
export const getPressureIcon = () => '🌡️';
