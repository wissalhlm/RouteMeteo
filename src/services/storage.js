// import AsyncStorage from '@react-native-async-storage/async-storage';

// const STORAGE_KEY = 'SAVED_ROUTES';

// // Récupérer tous les trajets
// export const getRoutes = async () => {
//   const data = await AsyncStorage.getItem(STORAGE_KEY);
//   return data ? JSON.parse(data) : [];
// };

// // Sauvegarder un nouveau trajet
// export const saveRoute = async (route) => {
//   const routes = await getRoutes();
//   routes.push(route);
//   await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(routes));
// };

// // Supprimer un trajet
// export const deleteRoute = async (id) => {
//   const routes = await getRoutes();
//   const updatedRoutes = routes.filter(r => r.id !== id);
//   await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRoutes));
// };
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'SAVED_ROUTES';

export const getRoutes = async () => {
  const data = await AsyncStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveRoute = async (route) => {
  const routes = await getRoutes();
  routes.push(route);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(routes));
};

export const deleteRoute = async (id) => {
  const routes = await getRoutes();
  const updatedRoutes = routes.filter(r => r.id !== id);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRoutes));
};