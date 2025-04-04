// app/page.tsx
"use client";

// --- React Hooks e Imports ---
import { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios'; // Asegúrate de tener axios instalado (npm install axios)
import Image from 'next/image';
// Asegúrate de tener react-icons instalado (npm install react-icons)
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

// --- Interfaces y Tipos ---
interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  market_cap: number;
}
// Eliminamos 'market_cap' de SortKey
type SortKey = 'market_cap_rank' | 'current_price' | 'price_change_percentage_24h';
type SortOrder = 'asc' | 'desc';

// --- Constantes ---
// Se agrega la variable para la moneda
const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3/coins/markets';
const CURRENCIES = [
  { value: 'usd', label: 'Dólar (USD)' },
  { value: 'eur', label: 'Euro (EUR)' },
  { value: 'ars', label: 'Peso Argentino (ARS)' },
  { value: 'cop', label: 'Peso Colombiano (COP)' },
  { value: 'mxn', label: 'Peso Mexicano (MXN)' },
  { value: 'uyu', label: 'Peso Uruguayo (UYU)' },
  { value: 'clp', label: 'Peso Chileno (CLP)' },
];

// --- Componente Principal ---
export default function HomePage() {
  // --- Estado del Componente (Asegúrate que todos estén aquí) ---
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Inicia cargando
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('market_cap_rank'); // Orden inicial por ranking
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc'); // Orden inicial ascendente
  // Se agrega el estado para la moneda
  const [currency, setCurrency] = useState<string>('usd');
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // --- Obtención de Datos ---
  const fetchData = useCallback(async () => {
    console.log("fetchData: Iniciando...");
    setError(null); // Limpiar error previo en cada fetch
    setLoading(true); // Inicia la carga
    try {
      console.log("fetchData: Realizando llamada a API con moneda:", currency);
      // Se agrega la moneda a la url
      const response = await axios.get<Coin[]>(`${COINGECKO_BASE_URL}?vs_currency=${currency}&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`);
      console.log("fetchData: Respuesta recibida:", response.status);
      if (Array.isArray(response.data)) {
        setCoins(response.data);
        console.log("fetchData: Estado 'coins' actualizado con", response.data.length, "elementos.");
      } else {
        console.error("fetchData: La respuesta de la API no es un array!", response.data);
        setError("Error: Formato de datos inesperado recibido de la API.");
      }
    } catch (err) {
      console.error("fetchData: ¡ERROR CAPTURADO!", err);
      if (axios.isAxiosError(err)) {
        console.error("fetchData: Es un AxiosError - Status:", err.response?.status, "Mensaje:", err.message);
        const status = err.response?.status ? ` (Código: ${err.response.status})` : '';
        setError(`Error al contactar la API${status}. Verifica tu conexión o inténtalo más tarde.`);
      } else if (err instanceof Error) {
          console.error("fetchData: Es un Error estándar - Nombre:", err.name, "Mensaje:", err.message, "Stack:", err.stack);
          setError(`Error interno en la aplicación: ${err.message}`);
      } else {
          console.error("fetchData: Es un error de tipo desconocido:", typeof err);
          setError('Ocurrió un error inesperado y no clasificado al procesar los datos.');
      }
    } finally {
      console.log("fetchData: Bloque finally - Estableciendo loading a false.");
      setLoading(false); // Es crucial que esto se ejecute siempre
    }
  }, [currency]);

  // --- Efecto para Carga Inicial e Intervalo ---
  useEffect(() => {
    console.log("useEffect: Montando componente y llamando a fetchData por primera vez.");
    document.title = 'Cripto App';
    fetchData(); // Carga inicial
    const intervalId = setInterval(() => {
        console.log("useEffect: Intervalo - llamando a fetchData para actualizar.");
        fetchData();
    }, 60000); // Actualizar cada minuto
    return () => {
        console.log("useEffect: Desmontando componente, limpiando intervalo.");
        clearInterval(intervalId);
    };
    // Se elimina currency de las dependencias
  }, []); // Dependencia vacía para ejecutar solo al montar

  // --- Efecto para actualizar cuando cambia la moneda ---
  useEffect(() => {
    console.log("useEffect: La moneda ha cambiado a:", currency);
    fetchData();
  }, [currency, fetchData]);

  // --- Efecto para cerrar el menú al hacer clic fuera ---
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isOpen && !target.closest('.currency-selector')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  // --- Manejador de Ordenación ---
  const handleSort = (key: SortKey) => {
    console.log(`handleSort: Clic en ${key}. Estado actual: ${sortKey} (${sortOrder})`);
    if (sortKey === key) {
      setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortOrder(key === 'market_cap_rank' ? 'asc' : 'desc');
    }
  };

  // --- Memorización de Datos Ordenados ---
  const sortedCoins = useMemo(() => {
    console.log(`useMemo: Recalculando sortedCoins. Ordenando por ${sortKey} (${sortOrder}).`);
    const sorted = [...coins];
    sorted.sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [coins, sortKey, sortOrder]);

  // --- Funciones de Formato ---
  const formatPrice = (price: number): string => {
    const options: Intl.NumberFormatOptions = {
      style: 'currency',
      currency: currency.toUpperCase(), // Usa la moneda seleccionada
      minimumFractionDigits: 2,
      maximumFractionDigits: price < 1 ? 6 : 2,
    };
    return (price ?? 0).toLocaleString('en-US', options); // Añadido ?? 0 por seguridad
  };
  const formatPercentage = (percentage: number): string => {
    return (percentage ?? 0).toFixed(2) + '%'; // Añadido ?? 0 por seguridad
  };

  const formatMarketCap = (marketCap: number): string => {
    if (marketCap >= 1_000_000_000_000) {
      return (marketCap / 1_000_000_000_000).toFixed(2) + 'T';
    } else if (marketCap >= 1_000_000_000) {
      return (marketCap / 1_000_000_000).toFixed(2) + 'B';
    } else if (marketCap >= 1_000_000) {
      return (marketCap / 1_000_000).toFixed(2) + 'M';
    } else {
      return marketCap.toLocaleString('en-US');
    }
  };

  // --- Componente Auxiliar para Iconos de Ordenación ---
  const SortIcon = ({ columnKey, currentSortKey, currentSortOrder }: {
    columnKey: SortKey;
    currentSortKey: SortKey;
    currentSortOrder: SortOrder;
  }) => {
    if (currentSortKey !== columnKey) {
      return <FaSort className="inline-block ml-1 text-gray-400 hover:text-gray-500" size={12} />;
    }
    return currentSortOrder === 'asc'
      ? <FaSortUp className="inline-block ml-1 text-indigo-600 dark:text-indigo-400" size={12} />
      : <FaSortDown className="inline-block ml-1 text-indigo-600 dark:text-indigo-400" size={12} />;
  };

  // Log de estado antes de renderizar
  console.log("Renderizando HomePage - Estado:", { loading, error, coinsLength: coins.length, sortKey, sortOrder });

  // --- Renderizado del Componente ---
  return (
    <main className="w-full max-w-7xl mx-auto px-4 pt-12 pb-10 md:pt-20 md:pb-16 overflow-x-hidden">

      {/* --- Sección del Encabezado Mejorada --- */}
      <div className="text-center mb-12 md:mb-20 relative overflow-visible p-4 flex flex-col items-center justify-center w-full" style={{ zIndex: 40 }}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-blue-900/10 dark:via-purple-900/10 dark:to-pink-900/10 opacity-50 transform rotate-3 scale-105"></div>
        <h1 className="relative text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 md:mb-6 hover:scale-105 transition-transform duration-300 ease-in-out">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 animate-gradient-x">Cripto App</span> 
          <span className="inline-block text-2xl md:text-3xl lg:text-4xl hover:rotate-12 transition-transform duration-300 ml-2">📈</span>
        </h1>
        <p className="relative text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
          Monitoriza las <span className="font-semibold text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300">10 principales criptomonedas</span> por capitalización de mercado con precios actualizados.
        </p>
        {/* Selector de Moneda */}
        <div className="mt-4 relative currency-selector max-w-[240px] w-full" style={{ position: 'relative', zIndex: 50 }}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600 flex items-center justify-between relative"
          >
            <span>{CURRENCIES.find(c => c.value === currency)?.label || 'Seleccionar moneda'}</span>
            <span className="ml-2">{isOpen ? '▲' : '▼'}</span>
          </button>
          {isOpen && (
            <div className="fixed mt-1 bg-white rounded-md shadow-xl dark:bg-gray-700 ring-1 ring-black ring-opacity-5 overflow-hidden max-w-[240px] w-full" style={{ zIndex: 9999, left: '50%', transform: 'translateX(-50%)' }}>

              <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                {CURRENCIES.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => {
                      console.log('Moneda seleccionada:', c.value);
                      setCurrency(c.value);
                      setIsOpen(false);
                    }}
                    className={`${c.value === currency ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-200'} w-full px-4 py-2.5 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-600/50 transition-colors duration-150 flex items-center justify-between`}
                    role="menuitem"
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- Estado de Carga --- */}
      {loading && (!coins.length || !error) && (
        <div className="text-center py-10">
          <p className="text-xl text-gray-500 dark:text-gray-400 animate-pulse">Cargando datos...</p>
        </div>
      )}

      {/* --- Estado de Error --- */}
      {error && (
        <div className="text-center py-10 px-4">
          <p className="text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 p-4 rounded-lg font-medium shadow-md max-w-md mx-auto">{error}</p>
        </div>
      )}

      {/* --- Contenido Principal (Tabla/Lista) --- */}
      {!loading && !error && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700 w-full max-w-full" style={{ zIndex: 30 }}>
          {/* Cabecera Desktop Interactiva */}
          <div className="hidden md:grid grid-cols-6 gap-4 px-6 py-4 border-b border-gray-200 dark:border-gray-700 font-semibold text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wider items-center">
             <div className="text-center cursor-pointer hover:text-gray-900 dark:hover:text-gray-200 transition-colors" onClick={() => handleSort('market_cap_rank')}>
                # <SortIcon columnKey="market_cap_rank" currentSortKey={sortKey} currentSortOrder={sortOrder} />
             </div>
              <div className="col-span-2 pl-3">Moneda</div>
              <div className="text-center cursor-pointer hover:text-gray-900 dark:hover:text-gray-200 transition-colors" onClick={() => handleSort('current_price')}>
                 Precio <SortIcon columnKey="current_price" currentSortKey={sortKey} currentSortOrder={sortOrder} />
              </div>
              <div className="text-center pr-2 cursor-pointer hover:text-gray-900 dark:hover:text-gray-200 transition-colors" onClick={() => handleSort('price_change_percentage_24h')}>
                 Cambio (24h) <SortIcon columnKey="price_change_percentage_24h" currentSortKey={sortKey} currentSortOrder={sortOrder} />
              </div>
              <div className="text-center">
                Market Cap
              </div>
              <div></div>
          </div>

          {/* Lista de Monedas (Usa sortedCoins) */}
          <ul>
            {sortedCoins.map((coin) => (
              <li key={coin.id} className="px-4 md:px-6 py-4 border-t first:border-t-0 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors duration-150 ease-in-out cursor-default">
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4 items-center">
                  {/* Rank (Desktop) */}
                  <div className="hidden md:flex justify-center items-center">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-full w-6 h-6 flex items-center justify-center">
                      {coin.market_cap_rank}
                    </span>
                  </div>
                  {/* Moneda Info */}
                  <div className="col-span-2 md:col-span-2 flex items-center space-x-3 md:space-x-4">
                    <Image
                      src={coin.image} alt={`${coin.name} logo`} width={36} height={36}
                      className="rounded-full flex-shrink-0 ring-1 ring-gray-200 dark:ring-gray-600 p-0.5"
                      priority={coin.market_cap_rank <= 3}
                    />
                    <div className="flex-grow min-w-0">
                      <p className="font-semibold text-base md:text-lg text-gray-900 dark:text-gray-100 truncate">{coin.name}</p>
                      <div className="flex items-center space-x-2">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">
                          {coin.symbol.toUpperCase()}
                        </p>
                        {/* Rank (Móvil) */}
                        <span className="md:hidden text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-full w-5 h-5 flex items-center justify-center">
                          #{coin.market_cap_rank}
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Precio */}
                  {/* Se cambia text-right por text-center */}
                  <div className="text-center font-medium tabular-nums text-gray-800 dark:text-gray-200 text-sm md:text-base">
                    {formatPrice(coin.current_price)}
                  </div>
                  {/* Cambio 24h */}
                  {/* Se cambia text-right por text-center */}
                  <div className={`text-center font-semibold tabular-nums text-sm md:text-base pr-2 ${ (coin.price_change_percentage_24h ?? 0) >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                    {(coin.price_change_percentage_24h ?? 0) >= 0 ? '+' : ''}{formatPercentage(coin.price_change_percentage_24h)}
                  </div>
                  {/* Market Cap */}
                  {/* Se cambia text-right por text-center */}
                  <div className="text-center font-medium tabular-nums text-gray-800 dark:text-gray-200 text-sm md:text-base">
                    {formatMarketCap(coin.market_cap)}
                  </div>
                  {/* Columna vacía (Desktop) */}
                  <div className="hidden md:block"></div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* --- Footer --- */}
      <footer className="text-center mt-12 text-sm text-gray-500 dark:text-gray-400">
        Datos proporcionados por{' '}
        <a href="https://www.coingecko.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
          CoinGecko
        </a>. Actualizado cada minuto.
      </footer>
    </main>
  );
}
