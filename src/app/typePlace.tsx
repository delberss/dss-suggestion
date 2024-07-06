import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, router, useNavigation } from 'expo-router';
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importando o AsyncStorage

import getItemsByPlace from '../../assets/infoStore/store';

const { width } = Dimensions.get('window'); // Obtendo a largura da tela

interface Store {
  id: number;
  name: string;
  image: any;
  imagem: any;
  endereco: string;
  telefone: string;
  avaliacaoGoogle: string;
  avaliacaoIfood: string;
  instagram: string;
  images: { id: number; path: any }[];
}

export default function TypePlace() {
  const { place, city } = useLocalSearchParams();
  const [stores, setStores] = useState<Store[]>([]);
  const [favorites, setFavorites] = useState<{ id: number}[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      title: place,
    });

    const loadFavorites = async () => {
      try {
        const savedFavorites = await AsyncStorage.getItem(`favorites${place}${city}`);
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites));
        }
      } catch (error) {
        console.error('Failed to load favorites:', error);
      }
    };

    loadFavorites();
  }, [navigation, place]);

  const saveFavorites = async (favorites: { id: number;}[]) => {
    try {
      await AsyncStorage.setItem(`favorites${place}${city}`, JSON.stringify(favorites));
    } catch (error) {
      console.error('Failed to save favorites:', error);
    }
  };

  // const resetFavorites = async () => {
  //   try {
  //     await AsyncStorage.removeItem('favorites');
  //     setFavorites([]);
  //   } catch (error) {
  //     console.error('Failed to reset favorites:', error);
  //   }
  // };

  const handlePress = (store: any) => {
    router.push({ pathname: "/aboutStore", params: { store: JSON.stringify(store) } });
  };

  const handleFavoritePress = (storeId: number) => {
    setFavorites((prevFavorites) => {
      const isFavorite = prevFavorites.some(favorite => favorite.id === storeId);
      const updatedFavorites = isFavorite
        ? prevFavorites.filter(favorite => !(favorite.id === storeId))
        : [...prevFavorites, { id: storeId}]; // Armazena também a categoria
      saveFavorites(updatedFavorites);
      return updatedFavorites;
    });
  };
  

  useEffect(() => {
    const items = getItemsByPlace(city, place);
    setStores(items as Store[]);
  }, [place, city]);

  const favoriteStores = stores
  .filter(store => favorites.some(favorite => favorite.id === store.id))
  .map((store, index) => (
    <TouchableOpacity key={store.id} style={styles.gridItem} onPress={() => handlePress(store)}>
      <View style={styles.rank}>
        <View>
          <Text style={styles.rankText}>{index + 1}</Text>
        </View>
        <View style={styles.imagemAndText}>
          <Image source={store.imagem} style={styles.image} />
          <Text style={styles.rankTextName}>{store.name}</Text>
        </View>
        <TouchableOpacity onPress={() => handleFavoritePress(store.id)}>
          <Icon
            name='star'
            size={42}
            color="#FFD700"
            style={styles.favoriteIcon}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  ));




  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <Text style={styles.title}>{city}</Text>
        {/* <TouchableOpacity onPress={resetFavorites}>
          <Text>Resetar Favoritos</Text>
        </TouchableOpacity> */}

        {favorites.length > 0 && (
          <TouchableOpacity onPress={() => setShowFavorites(!showFavorites)} style={styles.favoritesToggle}>
            <Text style={styles.favoritesTitle}>Favoritos</Text>
            <Icon
              name={showFavorites ? 'chevron-up' : 'chevron-down'}
              size={30}
              color="#FFD700"
            />
          </TouchableOpacity>
        )}
        {showFavorites && (
          <View style={styles.favoritesContainer}>
            <View style={styles.grid}>
              {favoriteStores}
            </View>
          </View>
        )}
        <Text style={styles.sectionTitle}>Lojas</Text>
        <View style={styles.grid}>
          {stores.map((store, index) => (
            <TouchableOpacity key={store.id} style={styles.gridItem} onPress={() => handlePress(store)}>
              <View style={styles.rank}>
                <View>
                  <Text style={styles.rankText}>{index + 1}</Text>
                </View>
                <View style={styles.imagemAndText}>
                  <Image source={store.imagem} style={styles.image} />
                  <Text style={styles.rankTextName}>{store.name}</Text>
                </View>
                <TouchableOpacity onPress={() => handleFavoritePress(store.id)}>
                  <Icon
                    name={favorites.some(favorite => favorite.id === store.id) ? 'star' : 'star-o'}
                    size={42}
                    color="#FFD700"
                    style={styles.favoriteIcon}
                  />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  scrollContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  favoritesContainer: {
    marginTop: 10,
    width: '100%',
  },
  title: {
    alignSelf: 'center',
    padding: 5,
    fontSize: 19.2,
    textAlign: 'center',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    color: '#ADD8E6',
    textShadowColor: '#000',
    textShadowOffset: { width: 0.5, height: 1 },
    textShadowRadius: 5,
  },
  favoritesTitle: {
    padding: 5,
    fontSize: 19.2,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    color: '#FFD700',
    textShadowColor: '#000',
    textShadowOffset: { width: 0.5, height: 1 },
    textShadowRadius: 5,
  },
  favoritesToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    alignSelf: 'center',
    padding: 5,
    fontSize: 19.2,
    marginBottom: 10,
    textAlign: 'center',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    color: '#ADD8E6',
    textShadowColor: '#000',
    textShadowOffset: { width: 0.5, height: 1 },
    textShadowRadius: 5,
  },
  grid: {
    marginTop: 10,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridItem: {
    width: width * 0.8,
    marginVertical: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  rank: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  rankText: {
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: '#ADD8E6',
    width: 30,
    height: 30,
    borderRadius: 15,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  rankTextName: {
    textAlign: 'center',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    marginTop: 8,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  favoriteIcon: {
    marginLeft: 10,
  },
  gridItemText: {
    textAlign: 'center',
  },
  imagemAndText: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '60%',
    marginRight: 10,
  },
});
