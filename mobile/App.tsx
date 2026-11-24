import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HomeScreen } from './src/screens/HomeScreen';
import { SearchScreen } from './src/screens/SearchScreen';

// Deux écrans seulement : on change d'écran avec un simple état,
// pas besoin d'une librairie de navigation pour l'instant.
type Screen = { name: 'home' } | { name: 'search'; query: string };

export default function App() {
  const [screen, setScreen] = useState<Screen>({ name: 'home' });

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      {screen.name === 'home' ? (
        <HomeScreen onSearch={(query) => setScreen({ name: 'search', query })} />
      ) : (
        <SearchScreen initialQuery={screen.query} onBack={() => setScreen({ name: 'home' })} />
      )}
    </SafeAreaProvider>
  );
}
