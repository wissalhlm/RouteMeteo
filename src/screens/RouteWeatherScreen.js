// src/screens/RouteWeatherScreen.js
import React, { useState, useEffect } from 'react';
import { View, ScrollView, ActivityIndicator, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import MapView, { Marker, Polyline } from 'react-native-maps';
import WeatherStepCard from '../components/WeatherStepCard';
import { getWeatherForRoute } from '../services/weatherService';
import { saveRoute } from '../services/storage';
import { Ionicons } from '@expo/vector-icons'; // Ajout de l'import

const RouteWeatherScreen = ({ route }) => {
  const [loading, setLoading] = useState(true);
  const [weatherData, setWeatherData] = useState([]);
  const [unitSymbol, setUnitSymbol] = useState('°C'); // État pour l'affichage du symbole
  const { routePoints = [], departureName, destinationName, departureDate } = route.params || {};

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. Récupérer l'unité choisie dans les paramètres (C ou F)
        const storedUnit = await AsyncStorage.getItem('unit');
        const isFahrenheit = storedUnit === 'F';
        
        // Déterminer l'unité pour l'API et le symbole pour l'affichage
        const apiUnit = isFahrenheit ? 'imperial' : 'metric';
        setUnitSymbol(isFahrenheit ? '°F' : '°C');

        const pointsForWeather = routePoints.map(p => ({ 
          lat: parseFloat(p.latitude || p.lat), 
          lon: parseFloat(p.longitude || p.lon), 
          name: p.name 
        }));

        // 2. Passer l'unité (metric/imperial) à l'API météo
        const results = await getWeatherForRoute(pointsForWeather, new Date(departureDate), apiUnit);
        setWeatherData(results);
      } catch (err) {
        console.error("Erreur lors du chargement des données :", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [routePoints, departureDate]);

  const handleSave = async () => {
    try {
      const newRoute = {
        id: Date.now().toString(),
        depart: departureName,
        arrivee: destinationName,
        date: new Date(departureDate).toLocaleDateString('fr-FR'),
      };
      await saveRoute(newRoute);
      Alert.alert("Succès", "Trajet enregistré dans vos favoris !");
    } catch (e) {
      Alert.alert("Erreur", "Impossible d'enregistrer le trajet.");
    }
  };

  if (loading) return <ActivityIndicator size="large" style={styles.center} color="#2ecc71" />;

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: routePoints[0]?.lat || routePoints[0]?.latitude || 33.57,
          longitude: routePoints[0]?.lon || routePoints[0]?.longitude || -7.58,
          latitudeDelta: 2,
          longitudeDelta: 2,
        }}
      >
        {routePoints.map((p, i) => (
          <Marker 
            key={i} 
            coordinate={{ latitude: p.lat || p.latitude, longitude: p.lon || p.longitude }} 
            title={p.name} 
            pinColor={p.type === 'Départ' ? 'green' : p.type === 'Arrivée' ? 'red' : 'blue'} 
          />
        ))}
        <Polyline 
          coordinates={routePoints.map(p => ({ latitude: p.lat || p.latitude, longitude: p.lon || p.longitude }))} 
          strokeWidth={3} 
          strokeColor="#3498db" 
        />
      </MapView>
      
      <ScrollView style={styles.list}>
        <View style={styles.header}>
          <View style={styles.routeInfo}>
            <Text style={styles.title}>{departureName} ➜ {destinationName}</Text>
            <Text style={styles.routeDate}>
              <Ionicons name="calendar-outline" size={14} /> {formatDate(departureDate)}
            </Text>
          </View>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Ionicons name="bookmark-outline" size={20} color="#fff" />
            <Text style={styles.saveBtnText}>Enregistrer</Text>
          </TouchableOpacity>
        </View>

        {weatherData.map((step, index) => (
          <WeatherStepCard
            key={index}
            stepName={step.type}
            cityName={step.name}
            weather={step.weather}
            type={step.type}
            unitSymbol={unitSymbol} // Transmission du symbole au composant enfant
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center' },
  map: { height: '35%' },
  list: { flex: 1 },
  header: { 
    padding: 15, 
    backgroundColor: '#fff', 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    borderBottomWidth: 1, 
    borderBottomColor: '#eee' 
  },
  routeInfo: {
    flex: 1,
  },
  title: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#333', 
    marginBottom: 4 
  },
  routeDate: {
    fontSize: 14,
    color: '#666',
    flexDirection: 'row',
    alignItems: 'center',
  },
  saveBtn: { 
    backgroundColor: '#3498db', 
    paddingHorizontal: 12,
    paddingVertical: 8, 
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  saveBtnText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 12,
    marginLeft: 6,
  },
});

export default RouteWeatherScreen;