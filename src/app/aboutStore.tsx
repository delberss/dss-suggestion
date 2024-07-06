import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView, BackHandler, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconMaterial from 'react-native-vector-icons/MaterialIcons';

import ImageViewing from 'react-native-image-viewing';
import { useLocalSearchParams } from 'expo-router';
import * as Clipboard from 'expo-clipboard';


interface StoreImage {
    id: number;
    path: any;
}

interface Store {
    id: number;
    imagem: any;
    name: string;
    endereco: string;
    telefone: string;
    avaliacaoGoogle: string;
    avaliacaoIfood: string;
    instagram: string; // Add this line to include Instagram URL
    images: StoreImage[];
}

export default function AboutStore() {
    const [highlightedImageIndex, setHighlightedImageIndex] = useState<number | null>(null);
    const [showAllImages, setShowAllImages] = useState<boolean>(false);

    const copyToClipboard = async (text: string) => {
        await Clipboard.setStringAsync(text);
    };


    const { store } = useLocalSearchParams();
    const storeObject: Store | null = store && typeof store === 'string' ? JSON.parse(store) : null;

    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            () => {
                if (highlightedImageIndex !== null) {
                    setHighlightedImageIndex(null);
                    return true;
                }
                return false;
            }
        );

        return () => backHandler.remove();
    }, [highlightedImageIndex]);


    if (!storeObject) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Dados da loja não disponíveis.</Text>
            </View>
        );
    }

    const renderedImages = showAllImages ? storeObject.images : storeObject.images.slice(0, 4);

    const renderedItems = (
        <View style={styles.storeContainer} key={storeObject.id}>
            <Image source={storeObject.imagem} style={styles.image} />
            <Text style={styles.storeName}>{storeObject.name}</Text>
            <View style={styles.infoRow}>
                <Text style={styles.storeInfos}>{storeObject.endereco}</Text>
                <TouchableOpacity onPress={() => copyToClipboard(storeObject.endereco)}>
                    <IconMaterial name="content-copy" size={24} color="#666" />
                </TouchableOpacity>
            </View>
            <View style={styles.infoRow}>
                {storeObject.telefone ? (
                    <>
                        <Text style={styles.storeInfos}>{storeObject.telefone}</Text>
                        <TouchableOpacity onPress={() => copyToClipboard(storeObject.telefone)}>
                            <IconMaterial name="content-copy" size={24} color="#666" />
                        </TouchableOpacity>
                    </>
                ) : (
                    <Text style={styles.storeInfos}>Telefone não disponível</Text>
                )}
            </View>

            {/* <Text style={styles.storeRatingsIfood}>Avaliação Ifood: {storeObject.avaliacaoIfood}</Text> */}
            <Text style={styles.storeRatingsGoogle}>Avaliação Google: {storeObject.avaliacaoGoogle}</Text>

            {storeObject.instagram && (
                <TouchableOpacity style={styles.instagramContainer} onPress={() => Linking.openURL(storeObject.instagram)}>
                    <Icon name="instagram" size={42} color="#C13584" style={styles.instagramText} />
                </TouchableOpacity>
            )}


            <View style={styles.storeImages}>
                <Text style={styles.textStoreImages}>Imagens da loja</Text>
                <View style={styles.imageContainer}>
                    {renderedImages.map((img: StoreImage, index: number) => (
                        <TouchableOpacity key={img.id} onPress={() => setHighlightedImageIndex(index)}>
                            <Image source={img.path} style={styles.images} />
                        </TouchableOpacity>
                    ))}
                </View>
                {!showAllImages && (
                    <TouchableOpacity onPress={() => setShowAllImages(true)}>
                        <Text style={styles.showAllImagesButton}>Ver Todas</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.storeContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.grid}>
                    {renderedItems}
                </View>
            </ScrollView>

            {highlightedImageIndex !== null && (
                <ImageViewing
                    images={storeObject.images.map(image => image.path)}
                    imageIndex={highlightedImageIndex}
                    visible={highlightedImageIndex !== null}
                    onRequestClose={() => setHighlightedImageIndex(null)}
                    
                />
            )}

        </View>
    );
}

const styles = StyleSheet.create({
    storeContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 10,
        paddingTop: 10,
        paddingBottom: 10,
    },
    imageContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginVertical: 10,
        justifyContent: 'center',
    },
    title: {
        alignSelf: 'center',
        padding: 5,
        fontSize: 19.2,
        marginTop: 0,
        marginBottom: 10,
        textAlign: 'center',
        textTransform: 'capitalize',
    },
    grid: {
        marginTop: 10,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    storeImages: {
        alignItems: 'center',
    },
    rank: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ADD8E6',
        borderRadius: 50,
        marginRight: 50,
    },
    rankText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    storeName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 10,
        textTransform: 'uppercase',
        textAlign: 'center',
    },
    storeInfos: {
        padding: 4,
        fontSize: 16,
        color: '#666',
        marginRight: 5,
        textAlign: 'center',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    storeRatingsGoogle: {
        fontSize: 16,
        color: '#008080',
        marginTop: 5,
        textAlign: 'center',
    },
    storeRatingsIfood: {
        fontSize: 16,
        color: '#ff4500',
        marginTop: 5,
        textAlign: 'center',
    },
    textStoreImages: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#444',
        marginTop: 15,
    },
    image: {
        width: 150,
        height: 150,
        borderRadius: 10,
        margin: 0,
    },
    images: {
        width: 150,
        height: 150,
        margin: 0,
        padding: 0,
        borderWidth: 5,
        borderColor: 'white',
    },
    showAllImagesButton: {
        fontSize: 16,
        marginTop: 10,
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#008081',
    },
    gridItemText: {
        marginTop: 5,
        textAlign: 'center',
    },
    errorText: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
    instagramContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    instagramText: {
        margin: 10,
    },
});
