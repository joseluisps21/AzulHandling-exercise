import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="App">
            <header className="App-header">
                <p>
                    ¡Consulta información acerca de vuelos en tiempo real!
                </p>
                <img src="plane.png" className="App-logo" alt="logo" />

                <Link to="/operations" className="App-button">Acceder</Link>
            </header>
        </div>
    );
};

export default LandingPage;