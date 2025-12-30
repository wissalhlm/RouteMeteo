import { View, Text, Switch, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export default function ProfileScreen() {
  const [isCelsius, setIsCelsius] = useState(true);

  useEffect(() => {
    const loadUnit = async () => {
      try {
        const storedUnit = await AsyncStorage.getItem('unit');
        if (storedUnit !== null) {
          setIsCelsius(storedUnit === 'C');
        }
      } catch (e) {
        console.error("Erreur chargement unité:", e);
      }
    };
    loadUnit();
  }, []);

  const toggleUnit = async () => {
    const newValue = !isCelsius;
    setIsCelsius(newValue);
    await AsyncStorage.setItem('unit', newValue ? 'C' : 'F');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Paramètres de l'application</Text>
      <View style={styles.row}>
        <Text style={styles.label}>
          Unité : {isCelsius ? 'Celsius (°C)' : 'Fahrenheit (°F)'}
        </Text>
        <Switch value={isCelsius === true} onValueChange={toggleUnit} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: 16 }
});