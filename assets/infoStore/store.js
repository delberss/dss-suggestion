import capitalize from '../../src/functions/capitalize';

import { beloHorizonteData } from '../cities/belohorizonte';
import { saoPauloData } from '../cities/saoPaulo';
import { rioDeJaneiroData } from '../cities/rioDeJaneiro';


const cityData = {
    'Belo Horizonte': beloHorizonteData,
    'São Paulo': saoPauloData,
    'Rio de Janeiro': rioDeJaneiroData,
};

const getItemsByPlace = (city, place) => {
    const cityInfo = cityData[city];
    const placeInfo = cityInfo[place];

    return placeInfo || [];
}


export default getItemsByPlace;