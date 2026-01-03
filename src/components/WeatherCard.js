/**
 * Composant WeatherStepCard
 * Membre 3 - Affichage d'une étape météo du trajet
 */

import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { getWeatherIconUrl } from '../services/weatherApi';

/**
 * Carte météo pour une étape du trajet
 * @param {Object} props
 * @param {string} props.stepName - Nom de l'étape (ex: "Départ", "25% du trajet")
 * @param {string} props.cityName - Nom de la ville
 * @param {Object} props.weather - Données météo
 * @param {Date} props.estimatedTime - Heure estimée d'arrivée
 * @param {boolean} props.isFirst - Si c'est la première étape
 * @param {boolean} props.isLast - Si c'est la dernière étape
 */
const WeatherStepCard = ({ 
  stepName, 
  cityName, 
  weather, 
  estimatedTime, 
  isFirst = false, 
  isLast = false 
}) => {
  // Formater l'heure
  const formatTime = (date) => {
    if (!date) return '';
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Formater la date
  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short' 
    });
  };

  // Gestion des erreurs
  if (!weather) {
    return (
      <View style={[styles.card, styles.errorCard]}>
        <View style={styles.header}>
          <Text style={styles.stepName}>{stepName}</Text>
          <Text style={styles.cityName}>{cityName}</Text>
        </View>
        <View style={styles.errorContent}>
          <Text style={styles.errorText}>⚠️ Météo indisponible</Text>
          <Text style={styles.errorSubtext}>Impossible de récupérer les données</Text>
        </View>
      </View>
    );
  }

  // Style conditionnel pour départ/arrivée
  const cardStyle = isFirst 
    ? [styles.card, styles.firstCard] 
    : isLast 
    ? [styles.card, styles.lastCard] 
    : styles.card;

  return (
    <View style={cardStyle}>
      {/* En-tête avec le nom de l'étape */}
      <View style={styles.header}>
        <View style={styles.stepInfo}>
          <Text style={styles.stepName}>
            {isFirst ? '🚗 ' : isLast ? '🏁 ' : '📍 '}
            {stepName}
          </Text>
          <Text style={styles.cityName}>{cityName}</Text>
        </View>
        <View style={styles.timeInfo}>
          <Text style={styles.time}>{formatTime(estimatedTime)}</Text>
          <Text style={styles.date}>{formatDate(estimatedTime)}</Text>
        </View>
      </View>

      {/* Contenu météo principal */}
      <View style={styles.weatherContent}>
        {/* Icône météo */}
        <View style={styles.iconContainer}>
          <Image 
            source={{ uri: getWeatherIconUrl(weather.icon) }}
            style={styles.weatherIcon}
            resizeMode="contain"
          />
        </View>

        {/* Température principale */}
        <View style={styles.tempContainer}>
          <Text style={styles.temperature}>{weather.temperature}°</Text>
          <Text style={styles.description}>
            {weather.description.charAt(0).toUpperCase() + weather.description.slice(1)}
          </Text>
        </View>

        {/* Détails supplémentaires */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>🌡️</Text>
            <Text style={styles.detailLabel}>Ressenti</Text>
            <Text style={styles.detailValue}>{weather.feelsLike}°</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>💨</Text>
            <Text style={styles.detailLabel}>Vent</Text>
            <Text style={styles.detailValue}>{weather.windSpeed} km/h</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>💧</Text>
            <Text style={styles.detailLabel}>Humidité</Text>
            <Text style={styles.detailValue}>{weather.humidity}%</Text>
          </View>
        </View>
      </View>

      {/* Indicateur de connexion entre les étapes */}
      {!isLast && <View style={styles.connector} />}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  firstCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  lastCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  errorCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  stepInfo: {
    flex: 1,
  },
  stepName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  cityName: {
    fontSize: 14,
    color: '#666',
  },
  timeInfo: {
    alignItems: 'flex-end',
  },
  time: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  date: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  weatherContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  iconContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weatherIcon: {
    width: 70,
    height: 70,
  },
  tempContainer: {
    flex: 1,
    paddingHorizontal: 12,
  },
  temperature: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  detailsContainer: {
    justifyContent: 'space-around',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  detailIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  detailLabel: {
    fontSize: 12,
    color: '#999',
    flex: 1,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  connector: {
    position: 'absolute',
    bottom: -16,
    left: '50%',
    marginLeft: -1,
    width: 2,
    height: 16,
    backgroundColor: '#E0E0E0',
  },
  errorContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF9800',
    fontWeight: '600',
    marginBottom: 4,
  },
  errorSubtext: {
    fontSize: 12,
    color: '#999',
  },
});

export default WeatherStepCard;
