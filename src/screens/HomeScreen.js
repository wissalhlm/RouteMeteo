// src/screens/HomeScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { getCoordinates } from '../services/geocodeApi';
// ON IMPORTE LE NOUVEAU SERVICE ICI
import { calculerPoints, assemblerTrajetFinal } from '../services/trajetFix';

export default function HomeScreen({ navigation }) {
  const [cityStart, setCityStart] = useState('');
  const [cityEnd, setCityEnd] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!cityStart || !cityEnd) {
      Alert.alert("Champs vides", "Saisissez deux villes.");
      return;
    }
    setLoading(true);
    try {
      const start = await getCoordinates(cityStart);
      const end = await getCoordinates(cityEnd);

      if (start && end) {
        // 1. On calcule 3 étapes
        const steps = calculerPoints(start, end);
        
        // 2. Assemblage avec les 3 ARGUMENTS : start, end, ET steps
        // C'est l'ordre CRUCIAL pour éviter l'erreur "n'est pas un tableau"
        const trajetFinal = assemblerTrajetFinal(start, end, steps);

        // 3. Navigation vers l'écran météo
        navigation.navigate('RouteWeather', { routeData: trajetFinal });
      } else {
        Alert.alert("Erreur", "Ville introuvable.");
      }
    } catch (e) {
      console.error(e);
      Alert.alert("Erreur", "Problème lors du calcul.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Ville de départ" value={cityStart} onChangeText={setCityStart} style={styles.input} />
      <TextInput placeholder="Ville d'arrivée" value={cityEnd} onChangeText={setCityEnd} style={styles.input} />
      {loading ? <ActivityIndicator size="large" color="#3498db" /> : 
      <Button title="Calculer le trajet" onPress={handleSearch} color="#3498db" />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  input: { borderBottomWidth: 1, marginBottom: 20, padding: 10 }
});