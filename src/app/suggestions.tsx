import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import categorias from '../../assets/categorias/index';
import * as MailComposer from 'expo-mail-composer';

interface State {
  id: number;
  nome: string;
}
''
interface City {
  nome: string;
}

export default function Suggestions() {
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedStateId, setSelectedStateId] = useState<number | ''>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [suggestion, setSuggestion] = useState<string>('');
  const [citySearch, setCitySearch] = useState<string>('');

  useEffect(() => {
    // Fetch the states
    fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then((response) => response.json())
      .then((data: State[]) => {
        // Ordenar os estados alfabeticamente
        const sortedStates = data.map((state) => ({
          id: state.id,
          nome: state.nome,
        })).sort((a, b) => a.nome.localeCompare(b.nome)); // Ordenar por nome
        
        setStates(sortedStates);
      })
      .catch((error) => console.error('Error fetching states:', error));
  }, []);
  
  useEffect(() => {
    if (selectedStateId) {
      // Fetch the cities for the selected state
      fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedStateId}/municipios`)
        .then((response) => response.json())
        .then((data: City[]) => setCities(data))
        .catch((error) => console.error('Error fetching cities:', error));
    }
  }, [selectedStateId]);

  const filteredCities = cities.filter(city =>
    city.nome.toLowerCase().includes(citySearch.toLowerCase())
  );

  const handleSendSuggestion = () => {
    if (!selectedCity || !selectedCategory || !suggestion) {
      Alert.alert('Erro', 'Por favor, selecione um estado, uma cidade, uma categoria e escreva uma sugestão.');
      return;
    }

    const email = 'dssappsoficial@gmail.com';
    const selectedStateName = states.find((state) => state.id === selectedStateId)?.nome || '';
    const subject = `Sugestão de ${selectedCity} - Categoria: ${selectedCategory}`;
    const body = `Estado: ${selectedStateName}\nCidade: ${selectedCity}\nCategoria: ${selectedCategory}\nSugestão: ${suggestion}`;

    MailComposer.composeAsync({
      recipients: [email],
      subject: subject,
      body: body,
    }).then(result => {
      if (result.status === 'sent') {
        Alert.alert('Sucesso', 'Sugestão enviada com sucesso!');
        setSelectedStateId('');
        setSelectedCity('');
        setSelectedCategory('');
        setSuggestion('');
      }
    }).catch(error => {
      Alert.alert('Erro', 'Houve um erro ao enviar sua sugestão.');
      console.error('Error sending email:', error);
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Envie sua sugestão</Text>

        <Picker
          selectedValue={selectedStateId}
          onValueChange={(itemValue) => setSelectedStateId(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Selecione um estado" value="" />
          {states.map((state, index) => (
            <Picker.Item key={index} label={state.nome} value={state.id} />
          ))}
        </Picker>

        <Picker
          selectedValue={selectedCity}
          onValueChange={(itemValue) => setSelectedCity(itemValue)}
          style={styles.picker}
          enabled={selectedStateId !== ''}
        >
          <Picker.Item label="Selecione uma cidade" value="" />
          {filteredCities.map((city, index) => (
            <Picker.Item key={index} label={city.nome} value={city.nome} />
          ))}
        </Picker>

        <Picker
          selectedValue={selectedCategory}
          onValueChange={(itemValue) => setSelectedCategory(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Selecione uma categoria" value="" />
          {categorias.map((categoria, index) => (
            <Picker.Item key={index} label={categoria.name} value={categoria.name} />
          ))}
        </Picker>

        <TextInput
          style={styles.textInput}
          placeholder="Escreva sua sugestão aqui"
          value={suggestion}
          onChangeText={setSuggestion}
          multiline
        />

        <TouchableOpacity style={styles.button} onPress={handleSendSuggestion}>
          <Text style={styles.buttonText}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    scrollViewContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 20,
    },
    container: {
        flex: 1,
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    picker: {
        height: 50,
        width: '100%',
        marginBottom: 20,
    },
    textInput: {
        height: 100,
        width: '100%',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
        textAlignVertical: 'top',
    },
    button: {
        width: '100%',
        padding: 15,
        backgroundColor: '#007BFF',
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
