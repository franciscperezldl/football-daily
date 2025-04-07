import { useState, useEffect } from 'react'
import axios from 'axios'
import './index.css'
import { initDarkMode, toggleDarkMode } from './darkMode'

// 👉 Función utilitaria para formatear la hora de los partidos
function formatMatchTime(dateString) {
  const date = new Date(dateString)
  return date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function App() {
  const [matches, setMatches] = useState([])

  useEffect(() => {
    initDarkMode()
    fetchMatches()
  }, [])

  // 👉 Función para obtener partidos de la API
  const fetchMatches = async () => {
    try {
      const apiKey = '27a0807e5bac42a08ae944225c1361a0'
      const url = '/api/v4/matches'
      const config = { headers: { 'X-Auth-Token': apiKey } }

      const response = await axios.get(url, config)
      setMatches(response.data.matches)
    } catch (error) {
      console.error('Error fetching football data:', error)
    }
  }

  // 👉 Agrupar partidos por competición
  const groupedMatches = matches.reduce((groups, match) => {
    const competitionName = match.competition.name

    if (!groups[competitionName]) {
      groups[competitionName] = {
        emblem: match.competition.emblem,
        matches: [],
      }
    }

    groups[competitionName].matches.push(match)
    return groups
  }, {})

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 flex flex-col">
      {/* Header */}
      <Header />

      {/* Contenido principal */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200 text-center">
          Partidos del Día
        </h2>

        {matches.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            Cargando partidos...
          </p>
        ) : (
          Object.entries(groupedMatches).map(([competitionName, { emblem, matches }]) => (
            <CompetitionSection
              key={competitionName}
              name={competitionName}
              emblem={emblem}
              matches={matches}
            />
          ))
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default App

// 👉 Componentes limpios

function Header() {
  return (
    <header className="bg-white dark:bg-gray-900 shadow-md py-6">
      <div className="container mx-auto text-center">
        <h1 className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">⚽ Football Daily</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Descubre los partidos de fútbol del día
        </p>
        <button
          onClick={toggleDarkMode}
          className="mt-4 bg-blue-500 dark:bg-blue-700 text-white px-4 py-2 rounded shadow hover:bg-blue-600 dark:hover:bg-blue-800 transition"
        >
          Cambiar modo
        </button>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 shadow-inner py-4">
      <div className="text-center text-gray-500 dark:text-gray-400">
        ¡Disfruta del fútbol diario! ⚽
      </div>
    </footer>
  )
}

function CompetitionSection({ name, emblem, matches }) {
  return (
    <section className="mb-10">
      <div className="flex items-center space-x-2 mb-4">
        {emblem && (
          <img
            src={emblem}
            alt={`${name} emblem`}
            className="w-8 h-8 object-contain"
          />
        )}
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
          {name}
        </h3>
      </div>

      <ul className="space-y-4">
        {matches
          .sort((a, b) => new Date(a.utcDate) - new Date(b.utcDate))
          .map((match, index) => (
            <MatchItem key={index} match={match} />
          ))}
      </ul>
    </section>
  )
}

function MatchItem({ match }) {
  return (
    <li className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center">
      <div className="flex items-center space-x-2">
        <img
          src={match.homeTeam.crest}
          alt={`${match.homeTeam.name} crest`}
          className="w-8 h-8 object-contain"
        />
        <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
          {match.homeTeam.name}
        </span>
        <span className="text-gray-500 dark:text-gray-400">vs</span>
        <img
          src={match.awayTeam.crest}
          alt={`${match.awayTeam.name} crest`}
          className="w-8 h-8 object-contain"
        />
        <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
          {match.awayTeam.name}
        </span>
      </div>

      <div className="text-right mt-2 sm:mt-0">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {formatMatchTime(match.utcDate)}
        </p>
        <p className={`text-xs font-medium mt-1 ${
          match.status === 'FINISHED'
            ? 'text-green-600 dark:text-green-400'
            : match.status === 'IN_PLAY'
            ? 'text-yellow-600 dark:text-yellow-400'
            : 'text-blue-600 dark:text-blue-400'
        }`}>
          {match.status === 'FINISHED'
            ? 'Finalizado'
            : match.status === 'IN_PLAY'
            ? 'En juego'
            : 'Programado'}
        </p>
      </div>
    </li>
  )
}
