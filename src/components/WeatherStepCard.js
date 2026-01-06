// src/components/WeatherStepCard.js
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const WeatherStepCard = ({ stepName, cityName, weather, type, unitSymbol }) => {
  const iconUrl = weather ? `https://openweathermap.org/img/wn/${weather.icon}@2x.png` : null;
  
  const getStepColor = () => {
    if (type === 'Départ') return '#27ae60'; // Vert
    if (type === 'Arrivée') return '#e74c3c'; // Rouge
    return '#3498db'; // Bleu
  };

  const stepColor = getStepColor();

  return (
    <View style={[styles.card, { borderLeftColor: stepColor, borderLeftWidth: 4 }]}>
      <View style={styles.info}>
        <Text style={[styles.step, { color: stepColor }]}>{stepName}</Text>
        <Text style={styles.city}>{cityName}</Text>
        {weather && <Text style={styles.desc}>{weather.description}</Text>}
      </View>
      {weather && (
        <View style={styles.weatherInfo}>
          {iconUrl && <Image source={{ uri: iconUrl }} style={styles.icon} />}
          {/* Affiche la température suivie du symbole dynamique (°C ou °F) */}
          <Text style={styles.temp}>{weather.temperature}{unitSymbol}</Text> 
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', flexDirection: 'row', padding: 15, marginHorizontal: 15, marginTop: 10, borderRadius: 8, elevation: 2, alignItems: 'center', justifyContent: 'space-between' },
  step: { fontWeight: 'bold', marginBottom: 2, fontSize: 12, textTransform: 'uppercase' },
  city: { fontSize: 16, fontWeight: 'bold', color: '#2c3e50' },
  desc: { color: '#7f8c8d', fontSize: 12, textTransform: 'capitalize' },
  weatherInfo: { alignItems: 'center' },
  icon: { width: 45, height: 45 },
  temp: { fontSize: 18, fontWeight: 'bold', color: '#333' }
});

export default WeatherStepCard;