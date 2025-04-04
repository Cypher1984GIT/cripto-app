# Cripto App

Cripto App is a real-time cryptocurrency tracker built with Next.js that allows users to monitor cryptocurrency prices, rankings, and market trends.

![Cripto App Screenshot](public/cripto-app-screenshot.png)

## Features

- **Real-time Data**: Updates cryptocurrency information every minute
- **Cryptocurrency Listings**: View top cryptocurrencies with key market data
- **Multi-currency Support**: Track prices in various currencies (USD, EUR, ARS, COP, MXN, UYU, CLP)
- **Sortable Table**: Sort cryptocurrencies by rank, price, or 24h price change
- **Responsive Design**: Works across mobile, tablet, and desktop devices

## Technologies Used

- [Next.js 15](https://nextjs.org/) - React framework with App Router
- [React 19](https://react.dev/) - JavaScript library for building user interfaces
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Axios](https://axios-http.com/) - HTTP client for API requests
- [CoinGecko API](https://www.coingecko.com/api/documentation) - Cryptocurrency data source
- [React Icons](https://react-icons.github.io/react-icons/) - Popular icons for React applications

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/cripto-app.git
   cd cripto-app
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application

## Project Structure

```
cripto-app/
├── app/                # Next.js App Router directory
│   ├── page.tsx        # Main cryptocurrency listing page
│   ├── layout.tsx      # Root layout with Providers
│   └── globals.css     # Global styles
├── public/             # Static assets
├── next.config.ts      # Next.js configuration
└── package.json        # Project dependencies and scripts
```

## Deployment

This application is configured for easy deployment on [Vercel](https://vercel.com/).

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [CoinGecko](https://www.coingecko.com/) for providing the cryptocurrency API
- [Next.js](https://nextjs.org/) for the amazing React framework