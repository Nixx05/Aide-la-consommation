// Point d'entrée de l'application.
// Il y a deux pages : l'accueil et la recherche. On garde en mémoire celle qui est affichée.

import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HomeScreen } from './src/screens/HomeScreen';
import { SearchScreen } from './src/screens/SearchScreen';

export default function App() {
  const [page, setPage] = useState<'home' | 'search'>('home');
  const [firstSearch, setFirstSearch] = useState('');

  // Appelée depuis l'accueil : on passe à la page de recherche
  function goToSearch(text: string) {
    setFirstSearch(text);
    setPage('search');
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      {page === 'home' ? (
        <HomeScreen goToSearch={goToSearch} />
      ) : (
        <SearchScreen firstSearch={firstSearch} goHome={() => setPage('home')} />
      )}
    </SafeAreaProvider>
  );
}
