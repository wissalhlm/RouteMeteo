// src/screens/HomeScreen.js
import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getCoordinates, getPlaceName } from '../services/geocodeApi';
import { assemblerToutLeTrajet } from '../services/trajetService';

export default function HomeScreen({ navigation }) {
  const [cityStart, setCityStart] = useState('');
  const [cityEnd, setCityEnd] = useState('');
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!cityStart || !cityEnd) {
      Alert.alert("Erreur", "Veuillez remplir les deux villes.");
      return;
    }
    setLoading(true);
    try {
      const start = await getCoordinates(cityStart);
      const end = await getCoordinates(cityEnd);
      
      if (start && end) {
        // Calcul des 3 étapes avec de vrais noms de villes
        const steps = [];
        for (let i = 1; i <= 3; i++) {
          const fraction = i / 4;
          const lat = start.latitude + (end.latitude - start.latitude) * fraction;
          const lon = start.longitude + (end.longitude - start.longitude) * fraction;
          const cityName = await getPlaceName(lat, lon);
          steps.push({ lat, lon, name: cityName });
        }

        const trajetFinal = assemblerToutLeTrajet(start, end, steps);
        navigation.navigate('RouteWeather', { 
          routePoints: trajetFinal, 
          departureName: start.name,
          destinationName: end.name,
          departureDate: date.toISOString()
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nouveau Trajet</Text>
      
      <TextInput 
        placeholder="Ville de départ" 
        value={cityStart} 
        onChangeText={setCityStart} 
        style={styles.input} 
      />
      
      <TextInput 
        placeholder="Ville d'arrivée" 
        value={cityEnd} 
        onChangeText={setCityEnd} 
        style={styles.input} 
      />

      <TouchableOpacity style={styles.datePicker} onPress={() => setShowPicker(true)}>
        <Text style={styles.dateText}>📅 {date.toLocaleString('fr-FR')}</Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={date}
          mode="datetime"
          onChange={(e, d) => { setShowPicker(false); if(d) setDate(d); }}
        />
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#2ecc71" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleSearch}>
          <Text style={styles.buttonText}>CALCULER LE TRAJET</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 30, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 30, textAlign: 'center', color: '#333' },
  input: { borderBottomWidth: 1, borderBottomColor: '#ddd', marginBottom: 25, padding: 10, fontSize: 16 },
  datePicker: { padding: 15, backgroundColor: '#f9f9f9', borderRadius: 8, marginBottom: 30, alignItems: 'center' },
  dateText: { fontSize: 16, color: '#555' },
  button: { backgroundColor: '#2ecc71', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});