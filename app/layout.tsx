// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // O la fuente que prefieras
import './globals.css'; // Importa los estilos globales de Tailwind

const inter = Inter({ subsets: ['latin'] });

// Define Metadata para toda la aplicación (puede ser sobreescrito por páginas)
export const metadata: Metadata = {
  title: 'Cripto App',
  description: 'Visualización de criptomonedas en tiempo real',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      {/* Aplica la fuente y las clases base de Tailwind */}
      {/* El modo oscuro se gestiona mejor aquí o en page.tsx con 'use client' */}
      <body className={`${inter.className} bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300`}>
        {children} {/* Aquí se renderizará el contenido de page.tsx */}
      </body>
    </html>
  );
}