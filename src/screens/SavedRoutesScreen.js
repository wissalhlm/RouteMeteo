import { View, Text, FlatList, Button } from 'react-native';
import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { getRoutes, deleteRoute } from '../services/storage';

export default function SavedRoutesScreen() {
  const [routes, setRoutes] = useState([]);

  const loadRoutes = async () => {
    const data = await getRoutes();
    setRoutes(data);
  };

  useFocusEffect(
    useCallback(() => {
      loadRoutes();
    }, [])
  );

  const handleDelete = async (id) => {
    await deleteRoute(id);
    loadRoutes();
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Trajets enregistrés</Text>
      <FlatList
        data={routes}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text>Aucun trajet enregistré</Text>}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 10 }}>
            <Text>{item.depart} ➜ {item.arrivee}</Text>
            <Text>Date : {item.date}</Text>
            <Button title="Supprimer" onPress={() => handleDelete(item.id)} />
          </View>
        )}
      />
    </View>
  );
}