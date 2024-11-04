"use client";
import { useState } from "react";
import Modal from "@mui/material/Modal";
import Link from "next/link"; 

// Definición del tamaño del laberinto
const LABERINTO_SIZE = 5;
type Posicion = { x: number; y: number };

export default function EscapandoDelLaberinto() {
  const [posicionJugador, setPosicionJugador] = useState<Posicion>({
    x: 0,
    y: 0,
  });
  const [posicionSalida, setPosicionSalida] = useState<Posicion>(() =>
    generarPosicionAleatoria()
  );
  const [intentos, setIntentos] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);
  const [mensaje, setMensaje] = useState<string>(
    "Encuentra la salida antes de 8 movimientos."
  );

  // Genera una posición aleatoria para la salida
  function generarPosicionAleatoria(): Posicion {
    return {
      x: Math.floor(Math.random() * LABERINTO_SIZE),
      y: Math.floor(Math.random() * LABERINTO_SIZE),
    };
  }

  // Calcula si el movimiento acerca o aleja al jugador de la salida
  function evaluarMovimiento(nuevaPosicion: Posicion): string {
    const distanciaAnterior = distancia(posicionJugador, posicionSalida);
    const nuevaDistancia = distancia(nuevaPosicion, posicionSalida);
    return nuevaDistancia < distanciaAnterior ? "Más cerca" : "Más lejos";
  }

  // Calcula la distancia de Manhattan entre dos posiciones
  function distancia(pos1: Posicion, pos2: Posicion): number {
    return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
  }

  // Maneja el movimiento en la dirección seleccionada
  function mover(direccion: string) {
    if (intentos >= 8) {
      setMensaje("Has alcanzado el límite de movimientos. Estás atrapado.");
      return;
    }

    const nuevaPosicion = { ...posicionJugador };
    switch (direccion) {
      case "arriba":
        if (nuevaPosicion.y > 0) nuevaPosicion.y--;
        break;
      case "abajo":
        if (nuevaPosicion.y < LABERINTO_SIZE - 1) nuevaPosicion.y++;
        break;
      case "izquierda":
        if (nuevaPosicion.x > 0) nuevaPosicion.x--;
        break;
      case "derecha":
        if (nuevaPosicion.x < LABERINTO_SIZE - 1) nuevaPosicion.x++;
        break;
      default:
        return;
    }

    setIntentos(intentos + 1);

    if (
      nuevaPosicion.x === posicionSalida.x &&
      nuevaPosicion.y === posicionSalida.y
    ) {
      setMensaje("¡Felicidades, has encontrado la salida!");
      setOpen(true);
    } else {
      setMensaje(
        `${evaluarMovimiento(nuevaPosicion)}. Intentos restantes: ${
          8 - intentos
        }`
      );
      setPosicionJugador(nuevaPosicion);
    }
  }

  // Reinicia el juego
  function reiniciarJuego() {
    setPosicionJugador({ x: 0, y: 0 });
    setPosicionSalida(generarPosicionAleatoria());
    setIntentos(0);
    setMensaje("Encuentra la salida antes de 8 movimientos.");
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
        <Link href="/">
          <p className="absolute top-4 left-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none">
            Volver al otro juego
          </p>
        </Link>
        <h1 className="text-3xl font-bold mb-6 text-blue-600">
          Escapando del Laberinto
        </h1>
        <p className="mb-4 text-gray-700">{mensaje}</p>

        <div className="flex space-x-4 mb-4">
          {["arriba", "abajo", "izquierda", "derecha"].map((dir) => (
            <button
              key={dir}
              onClick={() => mover(dir)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
            >
              {dir.charAt(0).toUpperCase() + dir.slice(1)}
            </button>
          ))}
        </div>

        <div className="text-lg text-gray-800">
          <p>
            <strong>Posición del Jugador:</strong> ({posicionJugador.x + 1},{" "}
            {posicionJugador.y + 1})
          </p>
          <p>
            <strong>Intentos:</strong> {intentos} / 8
          </p>
        </div>

        {intentos >= 8 && (
          <p className="mt-4 text-red-600 font-semibold">
            Has alcanzado el límite de movimientos. La salida estaba en (
            {posicionSalida.x + 1}, {posicionSalida.y + 1}).
          </p>
        )}

        <button
          onClick={reiniciarJuego}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none"
        >
          Reiniciar Juego
        </button>
        <div className="grid grid-cols-5 gap-1 mt-4">
          {Array.from({ length: LABERINTO_SIZE }).map((_, rowIndex) =>
            Array.from({ length: LABERINTO_SIZE }).map((_, colIndex) => {
              const isPlayer =
                posicionJugador.x === colIndex &&
                posicionJugador.y === rowIndex;
              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`w-12 h-12 flex items-center justify-center border ${
                    isPlayer ? "bg-green-500" : "bg-white"
                  }`}
                >
                  {isPlayer ? "P" : ""}
                </div>
              );
            })
          )}
        </div>
      </div>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-white p-6 rounded-md shadow-md text-center">
            <h1 className="text-2xl font-bold mb-4">¡Felicidades!</h1>
            <p className="text-lg">{mensaje}</p>
            <button
              onClick={() => {
                setOpen(false);
                reiniciarJuego();
              }}
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
