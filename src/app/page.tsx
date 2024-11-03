// pages/index.tsx
'use client'
import { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';

type Intento = {
  intento: string;
  picas: number;
  fijas: number;
};

export default function PicasYFijas() {
  const [clave, setClave] = useState<string>('');
  const [intento, setIntento] = useState<string>('');
  const [intentos, setIntentos] = useState<Intento[]>([]);
  const [mensaje, setMensaje] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const maxIntentos = 12;

  useEffect(() => {
    setClave(generarNumeroClave());
  }, []);

  const generarNumeroClave = (): string => {
    let numeros: string[] = [];
    while (numeros.length < 4) {
      const digito = Math.floor(Math.random() * 10).toString();
      if (!numeros.includes(digito)) numeros.push(digito);
    }
    return numeros.join('');
  };

  const manejarIntento = () => {
    if (intento.length !== 4 || isNaN(Number(intento))) {
      setMensaje('Por favor ingresa un número de cuatro cifras.');
      return;
    }

    const { picas, fijas } = calcularPicasYFijas(intento);
    const nuevoIntento: Intento = { intento, picas, fijas };
    setIntentos([...intentos, nuevoIntento]);

    if (fijas === 4) {
      setMensaje(mensajeFinal(intentos.length + 1));
      setOpen(true);
    } else if (intentos.length + 1 >= maxIntentos) {
      setMensaje('Mal, este juego no es para ti');
    } else {
      setMensaje(`Intento ${intentos.length + 1}: ${picas} picas, ${fijas} fijas.`);
    }

    setIntento('');
  };

  const calcularPicasYFijas = (intento: string): { picas: number; fijas: number } => {
    let picas = 0;
    let fijas = 0;
    for (let i = 0; i < 4; i++) {
      if (intento[i] === clave[i]) {
        fijas++;
      } else if (clave.includes(intento[i])) {
        picas++;
      }
    }
    return { picas, fijas };
  };

  const mensajeFinal = (intentos: number): string => {
    if (intentos <= 2) return 'Excelente, eres un maestro estas fuera del alcance de los demás';
    if (intentos <= 4) return 'Muy bueno, puedes ser un gran competidor';
    if (intentos <= 8) return 'Bien, estas progresando debes buscar tus límites';
    if (intentos <= 10) return 'Regular, Aún es largo el camino por recorrer';
    return 'Mal, este juego no es para ti';
  };

  const resetGame = () => {
    setClave(generarNumeroClave());
    setIntento('');
    setIntentos([]);
    setMensaje('');
    setOpen(false);
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
        <h1 className="text-3xl font-bold mb-6 text-blue-600">Juego de Picas y Fijas</h1>
        <p className="mb-4 text-gray-700">Intenta adivinar el número clave de cuatro cifras.</p>
        
        <div className="flex flex-col items-center space-y-4">
          <input
            type="text"
            value={intento}
            onChange={(e) => setIntento(e.target.value)}
            placeholder="Ingresa tu intento"
            maxLength={4}
            className="border border-gray-300 rounded-md p-2 text-center text-lg focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={manejarIntento}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
          >
            Intentar
          </button>
          <button
            onClick={resetGame}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none"
          >
            Reiniciar
          </button>
        </div>

        <p className="mt-4 text-lg text-gray-800 font-medium">{mensaje}</p>

        <h2 className="mt-8 text-2xl font-semibold text-gray-700">Historial de Intentos</h2>
        <ul className="mt-4 space-y-2">
          {intentos.map((item, index) => (
            <li key={index} className="bg-white shadow rounded-md p-4 w-72 mx-auto text-center">
              <span className="font-bold">Intento {index + 1}:</span> {item.intento} - 
              <span className="text-blue-600 font-semibold"> {item.picas} picas</span>, 
              <span className="text-green-600 font-semibold"> {item.fijas} fijas</span>
            </li>
          ))}
        </ul>
      </div>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-white p-6 rounded-md shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">¡Felicidades!</h1>
        <p className="text-lg">{mensaje}</p>
        <button
          onClick={() => {setOpen(false);resetGame()}}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
        >
          Cerrar y reiniciar
        </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
