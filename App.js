import AppNavigator from './src/navigation/AppNavigator';
import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { getCoordinates } from './src/services/geocodeApi';
import { calculateIntermediatePoints, prepareWeatherPoints } from './src/services/routeUtils';

export default function App() {
  useEffect(() => {
    async function runTest() {
      console.log("=== Test géocodage ===");
      try {
        const depart = await getCoordinates("Casablanca");
        const arrivee = await getCoordinates("Rabat");
        console.log('Départ:', depart);
        console.log('Arrivée:', arrivee);

        console.log("=== Points intermédiaires ===");
        const etapes = calculateIntermediatePoints(depart, arrivee, 4);
        console.log(etapes);

        console.log("=== Préparation météo ===");
        const pointsMeteo = prepareWeatherPoints(depart, arrivee, etapes);
        console.log(pointsMeteo);
      } catch (error) {
        console.error(error);
      }
    }

    runTest();
  }, []);

  return <AppNavigator />;
}
