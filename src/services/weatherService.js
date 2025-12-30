// Service météo pour récupérer la température à partir des coordonnées
const API_KEY = '3e3e881e0fca96cdc3c4b4d7f2d5866e'; // Peut être remplacé par @env si besoin

export async function getTemperatureByCoords(lat, lon, unit = 'metric') {
	try {
		const response = await fetch(
			`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${API_KEY}`
		);
		if (!response.ok) {
			// Si la réponse n'est pas ok (404, 400, etc.), on considère que c'est l'océan ou une zone non couverte
			return null;
		}
		const data = await response.json();
		if (data && data.main && typeof data.main.temp === 'number') {
			return data.main.temp;
		}
		return null;
	} catch (error) {
		console.error('Erreur météo:', error);
		return null;
	}
}
