import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import RouteWeatherScreen from '../screens/RouteWeatherScreen';
import SavedRoutesScreen from '../screens/SavedRoutesScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Calculer un Trajet' }} />
      <Stack.Screen name="RouteWeather" component={RouteWeatherScreen} options={{ title: 'Météo du Parcours' }} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: true }}> 
        <Tab.Screen
          name="Accueil"
          component={HomeStack}
          options={{
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons
                name={focused ? 'home' : 'home-outline'}
                size={size}
                color={color}
              />
            ),
          }}
        />
       <Tab.Screen
          name="Trajets"
          component={SavedRoutesScreen}
          options={{
            title: 'Mes Trajets',
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons
                name={focused ? 'map' : 'map-outline'}
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Profil"
          component={ProfileScreen}
          options={{
            title: 'Paramètres',
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons
                name={focused ? 'settings' : 'settings-outline'}
                size={size}
                color={color}
              />
            ),
          }}
        />      
      </Tab.Navigator>
    </NavigationContainer>
  );
}