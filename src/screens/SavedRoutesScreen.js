import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  Alert, 
  TouchableOpacity,
  Animated,
  RefreshControl
} from 'react-native';
import { useState, useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { getRoutes, deleteRoute } from '../services/storage';
import { Ionicons } from '@expo/vector-icons';

export default function SavedRoutesScreen() {
  const [routes, setRoutes] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Animation d'entrée simple
  useFocusEffect(
    useCallback(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
      loadRoutes();
      return () => {
        fadeAnim.setValue(0);
      };
    }, [])
  );

  const loadRoutes = async () => {
    const data = await getRoutes();
    setRoutes(data);
    return data;
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRoutes();
    setRefreshing(false);
  };

  const confirmDelete = (id) => {
    Alert.alert(
      'Confirmer la suppression',
      'Voulez-vous vraiment supprimer ce trajet ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', style: 'destructive', onPress: () => handleDelete(id) },
      ]
    );
  };

  const handleDelete = async (id) => {
    await deleteRoute(id);
    loadRoutes();
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <Text style={styles.title}>🚗 Trajets enregistrés</Text>
        <Text style={styles.subtitle}>
          {routes.length} trajet{routes.length > 1 ? 's' : ''}
        </Text>
      </View>

      <FlatList
        data={routes}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#4A90E2']}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="car-outline" size={60} color="#aaa" />
            <Text style={styles.emptyText}>Aucun trajet enregistré</Text>
            <Text style={styles.emptySubtext}>
              Vos trajets apparaîtront ici
            </Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <View style={[
            styles.card,
            index % 2 === 0 ? styles.cardEven : styles.cardOdd
          ]}>
            <View style={styles.cardHeader}>
              <View style={styles.routeIcon}>
                <Ionicons name="navigate" size={24} color="#4A90E2" />
              </View>
              <View style={styles.routeInfo}>
                <Text style={styles.departure}>
                  <Ionicons name="location-outline" size={14} /> {item.depart}
                </Text>
                <View style={styles.line}>
                  <View style={styles.dots}>
                    <View style={styles.dot} />
                    <View style={styles.dot} />
                    <View style={styles.dot} />
                  </View>
                </View>
                <Text style={styles.arrival}>
                  <Ionicons name="flag-outline" size={14} /> {item.arrivee}
                </Text>
              </View>
            </View>

            <View style={styles.cardFooter}>
              <Text style={styles.date}>
                <Ionicons name="calendar-outline" size={14} /> {item.date}
              </Text>
              
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => confirmDelete(item.id)}
              >
                <Ionicons name="trash-outline" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
    padding: 15,
  },
  header: {
    marginBottom: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 15,
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  cardEven: {
    borderLeftWidth: 4,
    borderLeftColor: '#4A90E2',
  },
  cardOdd: {
    borderLeftWidth: 4,
    borderLeftColor: '#6BC950',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  routeIcon: {
    marginRight: 15,
  },
  routeInfo: {
    flex: 1,
  },
  departure: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  arrival: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 5,
  },
  line: {
    height: 20,
    justifyContent: 'center',
    marginLeft: 5,
  },
  dots: {
    flexDirection: 'column',
    height: 20,
    justifyContent: 'space-between',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#aaa',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF6B6B',
  },
  separator: {
    height: 10,
  },
});