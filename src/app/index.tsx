import React, { useState } from 'react';
import { Link } from 'expo-router';
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';

import cities from '../../assets/cities/index';
import categorias from '../../assets/categorias/index';

interface Categoria {
  name: string;
  image: any;
}

export default function App() {
  const [selectedCity, setSelectedCity] = useState<string>('São Paulo');

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
  };

  

  const renderGridItem = (categoria: Categoria) => (
    <Link href={{ pathname: "/typePlace", params: { place: categoria.name, city: selectedCity } }} asChild>
      <TouchableOpacity style={styles.gridItem}>
        <Image source={categoria.image} style={styles.image} />
        <Text style={styles.gridItemText}>{categoria.name}</Text>
      </TouchableOpacity>
    </Link>
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Veja os melhores lugares para comer e/ou beber na cidade</Text>

        <View style={styles.cityOptions}>
          {cities.map((city) => (
            <TouchableOpacity
              key={city}
              style={[styles.cityOption, selectedCity === city && styles.selectedCityOption]}
              onPress={() => handleCitySelect(city)}
            >
              <Text style={[styles.cityOptionText, selectedCity === city && styles.selectedCityOptionText]}>
                {city}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.grid}>
          {categorias.map((categoria, index) => (
            <React.Fragment key={index}>
              {renderGridItem(categoria)}
            </React.Fragment>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  title: {
    alignSelf: 'center',
    padding: 10,
    fontSize: 19.2,
    margin: 10,
    textAlign: 'center',
  },
  cityOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  cityOption: {
    padding: 10,
    margin: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  selectedCityOption: {
    backgroundColor: 'blue',
  },
  cityOptionText: {
    color: '#000',
  },
  selectedCityOptionText: {
    color: '#fff',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  gridItem: {
    width: '45%',
    margin: '2.5%',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 100,
    borderRadius: 10,
  },
  gridItemText: {
    marginTop: 5,
    textAlign: 'center',
  },
});
