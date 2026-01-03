
import React from 'react';
import RouteWeatherScreen from './RouteWeatherScreen';

/**
 * Données de test pour Casablanca → Tanger (Maroc)
 */
const testRouteMaroc = {
  params: {
    routePoints: [
      { lat: 33.5731, lon: -7.5898, name: "Casablanca" },
      { lat: 34.0209, lon: -6.8416, name: "Rabat" },
      { lat: 34.2610, lon: -6.5802, name: "Kénitra" },
      { lat: 35.7595, lon: -5.8337, name: "Tanger" },
    ],
    departureDate: new Date(),
    departureName: "Casablanca",
    destinationName: "Tanger",
    units: "metric",
  }
};

/**
 * Données de test pour Paris → Lyon (France)
 */
const testRouteFrance = {
  params: {
    routePoints: [
      { lat: 48.8566, lon: 2.3522, name: "Paris" },
      { lat: 47.9022, lon: 1.9094, name: "Orléans" },
      { lat: 46.5802, lon: 0.3404, name: "Châtellerault" },
      { lat: 45.7640, lon: 4.8357, name: "Lyon" },
    ],
    departureDate: new Date(),
    departureName: "Paris",
    destinationName: "Lyon",
    units: "metric",
  }
};

/**
 * Test avec 5 points (maximum recommandé)
 */
const testRoute5Points = {
  params: {
    routePoints: [
      { lat: 33.5731, lon: -7.5898, name: "Casablanca" },
      { lat: 33.9716, lon: -6.8498, name: "Point 1 (25%)" },
      { lat: 34.3701, lon: -6.3707, name: "Point 2 (50%)" },
      { lat: 34.7687, lon: -5.8917, name: "Point 3 (75%)" },
      { lat: 35.7595, lon: -5.8337, name: "Tanger" },
    ],
    departureDate: new Date(),
    departureName: "Casablanca",
    destinationName: "Tanger",
    units: "metric",
  }
};

/**
 * Test avec date future (dans 2 jours)
 */
const futureDate = new Date();
futureDate.setDate(futureDate.getDate() + 2);
futureDate.setHours(14, 30, 0, 0);

const testRouteFuture = {
  params: {
    routePoints: [
      { lat: 33.5731, lon: -7.5898, name: "Casablanca" },
      { lat: 34.0209, lon: -6.8416, name: "Rabat" },
      { lat: 35.7595, lon: -5.8337, name: "Tanger" },
    ],
    departureDate: futureDate,
    departureName: "Casablanca",
    destinationName: "Tanger",
    units: "metric",
  }
};

/**
 * Test avec unités impériales (°F)
 */
const testRouteImperial = {
  params: {
    routePoints: [
      { lat: 40.7128, lon: -74.0060, name: "New York" },
      { lat: 39.9526, lon: -75.1652, name: "Philadelphia" },
      { lat: 38.9072, lon: -77.0369, name: "Washington DC" },
    ],
    departureDate: new Date(),
    departureName: "New York",
    destinationName: "Washington DC",
    units: "imperial", // Fahrenheit
  }
};

/**
 * Composant de test par défaut
 * Changez la variable 'testData' pour tester différents scénarios
 */
export default function RouteWeatherTest() {
  // 👇 Choisissez quel test utiliser
  const testData = testRouteMaroc; 
  
  // Autres options disponibles :
  // const testData = testRouteFrance;
  // const testData = testRoute5Points;
  // const testData = testRouteFuture;
  // const testData = testRouteImperial;

  return <RouteWeatherScreen route={testData} />;
}

/**
 * INSTRUCTIONS D'UTILISATION :
 * 
 * 1. Configurez votre clé API dans weatherApi.js
 * 2. Dans App.js, importez ce fichier :
 *    import RouteWeatherTest from './src/screens/RouteWeatherTest';
 * 
 * 3. Utilisez-le comme écran :
 *    <Stack.Screen name="Test" component={RouteWeatherTest} />
 * 
 * 4. Ou testez directement en modifiant initialRouteName :
 *    <Stack.Navigator initialRouteName="Test">
 */

// Export des données de test pour utilisation externe
export {
  testRouteMaroc,
  testRouteFrance,
  testRoute5Points,
  testRouteFuture,
  testRouteImperial,
};
