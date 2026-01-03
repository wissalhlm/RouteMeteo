/**
 * Écran RouteWeatherScreen
 * Membre 3 - Affichage de la météo sur le trajet
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import WeatherStepCard from '../components/WeatherStepCard';
import { getWeatherForRoute } from '../services/weatherApi';

/**
 * Écran principal pour afficher la météo du trajet
 * @param {Object} route - Paramètres de navigation
 * @param {Object} navigation - Navigation
 */
const RouteWeatherScreen = ({ route, navigation }) => {
  // État local
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [weatherData, setWeatherData] = useState([]);
  const [error, setError] = useState(null);

  // Récupération des paramètres de la route
  // Ces données seront fournies par le Membre 2 (points intermédiaires)
  const {
    routePoints = [],      // [{lat, lon, name}]
    departureDate = new Date(),
    departureName = 'Départ',
    destinationName = 'Arrivée',
    units = 'metric',
  } = route.params || {};

  /**
   * Charger la météo pour tous les points
   */
  const loadWeatherData = async () => {
    try {
      setError(null);

      // Vérifier qu'on a bien des points
      if (!routePoints || routePoints.length === 0) {
        throw new Error('Aucun point de trajet fourni');
      }

      // Appeler l'API météo pour tous les points
      const weatherResults = await getWeatherForRoute(
        routePoints,
        departureDate,
        units
      );

      // Ajouter les noms des étapes
      const formattedData = weatherResults.map((point, index) => {
        let stepName;
        
        if (index === 0) {
          stepName = 'Départ';
        } else if (index === weatherResults.length - 1) {
          stepName = 'Arrivée';
        } else {
          const percentage = Math.round((index / (weatherResults.length - 1)) * 100);
          stepName = `${percentage}% du trajet`;
        }

        return {
          ...point,
          stepName,
          cityName: point.name || `Point ${index + 1}`,
        };
      });

      setWeatherData(formattedData);
    } catch (err) {
      console.error('Erreur lors du chargement de la météo:', err);
      setError(err.message || 'Une erreur est survenue');
      
      // Afficher une alerte à l'utilisateur
      Alert.alert(
        'Erreur',
        'Impossible de charger la météo. Vérifiez votre connexion internet et votre clé API.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /**
   * Rafraîchir les données
   */
  const onRefresh = () => {
    setRefreshing(true);
    loadWeatherData();
  };

  /**
   * Chargement initial
   */
  useEffect(() => {
    loadWeatherData();
  }, []);

  /**
   * Affichage pendant le chargement
   */
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Chargement de la météo...</Text>
        <Text style={styles.loadingSubtext}>Récupération des données pour {routePoints.length} points</Text>
      </View>
    );
  }

  /**
   * Affichage en cas d'erreur
   */
  if (error && weatherData.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorTitle}>Erreur</Text>
        <Text style={styles.errorMessage}>{error}</Text>
        <Text style={styles.errorHint}>
          Vérifiez que vous avez bien configuré votre clé API OpenWeatherMap
        </Text>
      </View>
    );
  }

  /**
   * Affichage principal
   */
  return (
    <View style={styles.container}>
      {/* En-tête avec résumé du trajet */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Météo du trajet</Text>
        <Text style={styles.headerSubtitle}>
          {departureName} → {destinationName}
        </Text>
        <Text style={styles.headerDate}>
          Départ : {departureDate.toLocaleDateString('fr-FR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>

      {/* Liste des étapes météo */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2196F3']}
          />
        }
      >
        {weatherData.map((step, index) => (
          <WeatherStepCard
            key={`step-${index}`}
            stepName={step.stepName}
            cityName={step.cityName}
            weather={step.weather}
            estimatedTime={step.estimatedTime}
            isFirst={index === 0}
            isLast={index === weatherData.length - 1}
          />
        ))}

        {/* Message de fin */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            ✅ {weatherData.length} étapes analysées
          </Text>
          <Text style={styles.footerHint}>
            Tirez vers le bas pour actualiser
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  loadingSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#999',
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  errorHint: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#2196F3',
    fontWeight: '600',
    marginBottom: 8,
  },
  headerDate: {
    fontSize: 14,
    color: '#666',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 16,
  },
  footer: {
    alignItems: 'center',
    padding: 24,
    marginTop: 8,
  },
  footerText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
    marginBottom: 8,
  },
  footerHint: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
});

export default RouteWeatherScreen;
