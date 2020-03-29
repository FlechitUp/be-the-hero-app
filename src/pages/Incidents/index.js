import React, { useState, useEffect } from 'react';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { View, Image, Text, TouchableOpacity } from 'react-native'; 

import api from '../../services/api';

import logoImg from '../../assets/logo.png';

import styles from './styles';
import { FlatList } from 'react-native-gesture-handler';

export default function Incidents() {
    const [incidents, setIncidents] = useState([]);
    const [total, setTotal] = useState(0); /* Vai iniciar com o valor 0*/
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const navigation = useNavigation();

    function navigateToDetail(incident) {
        navigation.navigate('Detail', { incident });
    }

    async function loadIncidents() {
        if(loading) {
            return;
        }

        if (total > 0 && incidents.length == total) {  /* ===*/
            return;
        }
        setLoading(true);

        const response = await api.get('incidents', {
            params: { page }
        });
        /* Outra opcao para a linha de acima
        const response = await api.get(`incidents?page=${page}`);           
        */
        
        setIncidents([...incidents, ...response.data]); /* ...incidents  e um vetor com todos seus valores */
        setTotal(response.headers['x-total-count']);
        setPage(page + 1 );
        setLoading(false);
    }

    useEffect(()=>{
        loadIncidents();
    },[])

    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={logoImg} />
                <Text style={styles.headerText} >
                    Total de casos <Text style={styles.headerTextBold}>{total}</Text> casos.
                </Text>
            </View>

            <Text style={styles.title} >Bem-vindo!</Text>
            <Text style={styles.description} >Escoha um dos casos</Text>

            <FlatList 
                data={incidents} /*  Para fazer scroll */ 
                style={styles.incidentList}
                keyExtractor={incident => String(incident.id)}
                //showsVerticalScrollIndicator={false}   
                onEndReached={loadIncidents} /*Funcao lancada automaticamente quando o user chega ao fim da lista */
                onEndReachedThreshold={0.2} //Quanto porcento da lista o user precisa estar para carregar novos items
                renderItem={({ item : incident  }) => (
                    <View style={styles.incident} >
                        <Text style={styles.incidentProperty}>Ong: </Text>
                        <Text style={styles.incidentValue}>{incident.name}</Text>

                        <Text style={styles.incidentProperty}>Caso: </Text>
                        <Text style={styles.incidentValue}>{incident.title}</Text>

                        <Text style={styles.incidentProperty}>Valor: </Text>
                        <Text style={styles.incidentValue}>
                            {incident.value}
                        </Text>

                        <TouchableOpacity
                            style={styles.detailsButton}
                            onPress={() => navigateToDetail(incident)}
                        >
                            <Text style={styles.detailButtonText}>Ver mais detalhes</Text>
                            <Feather name="arrow-right" size={16} color="#e02041" />
                        </TouchableOpacity>
                    </View>
                )}
            />
           
        </View>
    );
}