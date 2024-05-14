import { Link } from 'expo-router';
import { StyleSheet, View, Text, Button } from 'react-native';


export default function App() {

  return (
    <View style={styles.container}>
      <Text>Página Home</Text>
      <Link href={"/typePlace"}>Ir para TypePlace</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
});