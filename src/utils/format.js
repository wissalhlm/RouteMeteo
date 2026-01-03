/**
 * Utilitaires de formatage
 * PARTAGÉ - Utilisé par tous les membres
 * 
 * Responsabilités :
 * - Formater les températures
 * - Formater les dates et heures
 * - Formater les distances
 */

/**
 * Formate une température
 * @param {number} temp - Température
 * @param {string} unit - 'metric' ou 'imperial'
 * @returns {string}
 */
export const formatTemperature = (temp, unit = 'metric') => {
  const symbol = unit === 'metric' ? '°C' : '°F';
  return `${Math.round(temp)}${symbol}`;
};

/**
 * Formate une date
 * @param {Date} date
 * @returns {string}
 */
export const formatDate = (date) => {
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

/**
 * Formate une heure
 * @param {Date} date
 * @returns {string}
 */
export const formatTime = (date) => {
  return date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Formate une date et heure
 * @param {Date} date
 * @returns {string}
 */
export const formatDateTime = (date) => {
  return `${formatDate(date)} à ${formatTime(date)}`;
};

/**
 * Formate une distance
 * @param {number} distance - Distance en km
 * @returns {string}
 */
export const formatDistance = (distance) => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)} m`;
  }
  return `${distance.toFixed(1)} km`;
};

/**
 * Formate la vitesse du vent
 * @param {number} speed - Vitesse en km/h
 * @returns {string}
 */
export const formatWindSpeed = (speed) => {
  return `${Math.round(speed)} km/h`;
};

/**
 * Formate l'humidité
 * @param {number} humidity - Humidité en %
 * @returns {string}
 */
export const formatHumidity = (humidity) => {
  return `${humidity}%`;
};
