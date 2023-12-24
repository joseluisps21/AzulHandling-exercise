import React, { useEffect, useState } from 'react';
import '../static/customAlert.css';

interface CustomAlertProps {
  message: string;
  onClose?: () => void;
}

const CustomAlert: React.FC<CustomAlertProps> = ({ message, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();

    //Cada 10 segundos mostramos el mensaje de alerta como recordatorio hasta que vuelvan a mostrarse los datos correctamente.
    setTimeout(() => {
      setIsVisible(true);
    }, 10000);
  };

  return (
    <div className={`custom-alert ${isVisible ? 'visible' : ''}`}>
      <p>{message}</p>
      <button className="custom-button" onClick={handleClose}>
        OK
      </button>
    </div>
  );
};

export default CustomAlert;


