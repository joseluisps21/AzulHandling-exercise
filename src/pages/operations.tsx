import React, { useState, useEffect } from 'react';
import '../static/operations.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import CustomAlert from '../components/customAlert';
import FlightsAPI from '../api/flightsAPI';


const formatUnixTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}`;
};

const FlashingCell: React.FC<{ value: any }> = ({ value, }) => {
    const [previousValue, setPreviousValue] = useState<any | null>(null);

    useEffect(() => {
        if (previousValue !== null && previousValue !== value) {
            const cellElement = document.getElementById(`cell-${value}`);
            if (cellElement) {
                cellElement.style.backgroundColor = 'yellow';
                setTimeout(() => {
                    cellElement.style.backgroundColor = 'white';
                }, 5000);
            }
        }

        setPreviousValue(value);
    }, [value, previousValue,]);

    let displayValue;

    if (value === null) {
        displayValue = 'Not Available';
    } else {
        displayValue = value;
    }

    return <span id={`cell-${value}`}>{displayValue}</span>;
};

const Operations: React.FC = () => {
    const [searchDate, setSearchDate] = useState<string>('');
    const [searchText, setSearchText] = useState<string>('');
    const { apiData, fetchData, showErrorAlert } = FlightsAPI({ searchDate, searchText });

    useEffect(() => {
        const intervalId = window.setInterval(() => {
            fetchData();
        }, 30000);

        return () => clearInterval(intervalId);
    }, [fetchData]);

    const handleSearch = async () => {
        try {
            await fetchData();
            console.log('fetchData', fetchData);
        } catch (error) {
            console.error('Error fetching data in handleSearch:', error);
        }
    };

    return (
        <div className="operations-container">

            <div className="header-section">
                <div className="left-subsection">
                    <label htmlFor="dateSelector"></label>
                    <input
                        type="date"
                        id="dateSelector"
                        value={searchDate}
                        onChange={(e) => setSearchDate(e.target.value)}
                    />
                    <label htmlFor="searchInput">
                        <FontAwesomeIcon icon={faSearch} />
                    </label>
                    <input
                        type="text"
                        id="searchInput"
                        placeholder="Arrival Airport"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </div>
                <div className="center-subsection">
                    <button className='search-button' onClick={handleSearch}>Buscar</button>
                </div>


                <div className="right-subsection">
                    <h1>Operations</h1>
                </div>
            </div>
            <div className="table-section">
                <table>
                    <thead>
                        <tr>
                            <th>Aircraft ID</th>
                            <th>First Seen</th>
                            <th>Departure Airport</th>
                            <th>Last Seen</th>
                            <th>Arrival Airport</th>
                            <th>Callsign</th>
                            <th>Departure Horiz. Distance</th>
                            <th>Departure Vert. Distance</th>
                            <th>Arrival Horiz. Distance</th>
                            <th>Arrival Vert. Distance</th>
                            <th>Departure Airport Candidates Count</th>
                            <th>Arrival Airport Candidates Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        {apiData?.map((data, index) => (
                            <tr key={index}>
                                <td><FlashingCell value={data.icao24} /></td>
                                <td><FlashingCell value={formatUnixTimestamp(data.firstSeen)} /></td>
                                <td><FlashingCell value={data.estDepartureAirport} /></td>
                                <td><FlashingCell value={formatUnixTimestamp(data.lastSeen)} /></td>
                                <td><FlashingCell value={data.estArrivalAirport} /></td>
                                <td><FlashingCell value={data.callsign} /></td>
                                <td><FlashingCell value={data.estDepartureAirportHorizDistance} /></td>
                                <td><FlashingCell value={data.estDepartureAirportVertDistance} /></td>
                                <td><FlashingCell value={data.estArrivalAirportHorizDistance} /></td>
                                <td><FlashingCell value={data.estArrivalAirportVertDistance} /></td>
                                <td><FlashingCell value={data.departureAirportCandidatesCount} /></td>
                                <td><FlashingCell value={data.arrivalAirportCandidatesCount} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {showErrorAlert && (
                <CustomAlert
                    message="Hubo un error al obtener los datos. Por favor, inténtelo de nuevo más tarde."

                />
            )}
        </div>
    );
};

export default Operations;

