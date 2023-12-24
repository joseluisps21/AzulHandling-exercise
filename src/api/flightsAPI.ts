import { useState, useEffect } from 'react';
import axios from 'axios';

export interface FlightData {
    icao24: string;
    firstSeen: number;
    estDepartureAirport: string;
    lastSeen: number;
    estArrivalAirport: string;
    callsign: string;
    estDepartureAirportHorizDistance: number;
    estDepartureAirportVertDistance: number;
    estArrivalAirportHorizDistance: number;
    estArrivalAirportVertDistance: number;
    departureAirportCandidatesCount: number;
    arrivalAirportCandidatesCount: number;
}

interface FlightsAPIProps {
    searchDate?: string;
    searchText?: string;
}

const FlightsAPI = ({ searchDate, searchText }: FlightsAPIProps): { apiData: FlightData[]; fetchData: () => Promise<void>; showErrorAlert: boolean } => {
    const [apiData, setApiData] = useState<FlightData[]>([]);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const currentTimeInSeconds = Math.floor(Date.now() / 1000);

    //Al estar utilizando una API gratuita y solo disponer de acceso a datos historicos, simulo el comportamiento de refresco actual consultando los datos de hace dos años
    //justo antes de la fecha actual, obtenida con Date.now()

    const twoYearsAgo = currentTimeInSeconds - 2 * 365 * 24 * 60 * 60; // Hace 2 años
    const twoYearsAgoPlusOneHour = twoYearsAgo + 3600; // Hace 2 años y 1 hora

    const fetchData = async () => {
        try {
            const response = await axios.get(
                'https://opensky-network.org/api/flights/arrival',
                {
                    params: {
                        //Por defecto escogemos los datos del aeropuerto de Frankfurt
                        airport: searchText || 'EDDF',

                        begin: searchDate ? Math.floor(new Date(searchDate).getTime() / 1000) + 43200 : twoYearsAgo,
                        end: searchDate ? Math.floor(new Date(searchDate).getTime() / 1000) + 3600 + 43200 : twoYearsAgoPlusOneHour,
                    },
                }
            );

            setApiData(response.data);
            setShowErrorAlert(false);
        } catch (error) {
            console.error('Error fetching flight data:', error);
            setShowErrorAlert(true);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return { apiData, fetchData, showErrorAlert };
};

export default FlightsAPI;



