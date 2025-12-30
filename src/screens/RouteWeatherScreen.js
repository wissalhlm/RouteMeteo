import React, { useState, useEffect } from 'react';
import { getTemperatureByCoords } from '../services/weatherService';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveRoute } from '../services/storage';

export default function RouteWeatherScreen({ route, navigation }) {
  const { routeData } = route.params || { routeData: [] };
  const [unit, setUnit] = useState('°C');
  const [temperatures, setTemperatures] = useState([]);

  useEffect(() => {
    const loadUnit = async () => {
      const u = await AsyncStorage.getItem('unit');
      setUnit(u === 'F' ? '°F' : '°C');
    };
    loadUnit();
  }, []);

  const [filteredRouteData, setFilteredRouteData] = useState([]);
  const [filteredTemps, setFilteredTemps] = useState([]);

  useEffect(() => {
    async function fetchTemps() {
      if (!routeData || routeData.length === 0) return;
      const filteredPoints = [];
      const filteredTempsLocal = [];
      for (let i = 0; i < routeData.length; i++) {
        const p = routeData[i];
        if (p.latitude && p.longitude) {
          const temp = await getTemperatureByCoords(p.latitude, p.longitude, unit === '°F' ? 'imperial' : 'metric');
          if (temp !== null) {
            filteredPoints.push(p);
            filteredTempsLocal.push(temp);
          }
        }
      }
      setFilteredRouteData(filteredPoints);
      setFilteredTemps(filteredTempsLocal);
    }
    fetchTemps();
  }, [routeData, unit]);

  const handleSave = async () => {
    if (routeData.length === 0) return;
    await saveRoute({
      id: Date.now().toString(),
      depart: routeData[0].name,
      arrivee: routeData[routeData.length - 1].name,
      date: new Date().toLocaleDateString(),
    });
    Alert.alert("Su    git pull origin main --allow-unrelated-histories    git pull origin main --allow-unrelated-historiesccès", "Trajet enregistré !");
    navigation.navigate('Trajets');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {routeData.length > 0 && <Text>{routeData[0].name} ➜ {routeData[routeData.length-1].name}</Text>}
        <Button title="Sauvegarder" onPress={handleSave} color="#2ecc71" />
      </View>
      <MapView style={styles.map} initialRegion={{
        latitude: routeData.length > 0 ? routeData[0].latitude : 33.57,
        longitude: routeData.length > 0 ? routeData[0].longitude : -7.58,
        latitudeDelta: 1.5, longitudeDelta: 1.5,
      }}>
        {filteredRouteData.map((p, i) => (
          <Marker
            key={i}
            coordinate={{ latitude: p.latitude, longitude: p.longitude }}
            title={p.name + (filteredTemps[i] !== undefined && filteredTemps[i] !== null ? ` (${filteredTemps[i]}${unit})` : '')}
            pinColor={
              i === 0 ? 'red' :
              i === filteredRouteData.length - 1 ? 'green' :
              'blue'
            }
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 15, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  map: { flex: 1 }
});