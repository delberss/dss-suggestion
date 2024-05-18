import { Image } from 'react-native';
import hamburguer from '../images/foods/hamburguer.jpg';
import japonesa from '../images/foods/japonesa.jpg';
import pizza from '../images/foods/pizza.jpg';
import salgado from '../images/foods/salgado.jpg';
import vegetariano from '../images/foods/vegetariano.jpg';
import bebida from '../images/foods/bebida.jpg';
import cafe from '../images/foods/cafe.jpg';
import sorvete from '../images/foods/sorvete.jpg';





interface Categoria {
  name: string;
  image: any;
}

const categorias: Categoria[] = [
  { name: 'Hamburguer', image: hamburguer },
  { name: 'Pizza', image: pizza },
  { name: 'Japonesa', image: japonesa },
  { name: 'Bebida', image: bebida },
  { name: 'Vegetariano', image: vegetariano },
  { name: 'Salgado', image: salgado },
];

export default categorias;
