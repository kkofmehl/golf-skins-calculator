import { useState } from 'react'
import PlayerSetup from './components/PlayerSetup'
import GameProgress from './components/GameProgress'
import type { GameSettings } from './types'

function App() {
  const [gameSettings, setGameSettings] = useState<GameSettings | null>(null)
  const [gameStarted, setGameStarted] = useState<boolean>(false)

  const handleSettingsConfirmed = (settings: GameSettings) => {
    setGameSettings(settings)
    setGameStarted(true)
  }

  const handleRestart = () => {
    setGameSettings(null)
    setGameStarted(false)
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Golf Skins Calculator</h1>
      </header>
      
      <main className="container mx-auto">
        {!gameStarted ? (
          <PlayerSetup onSettingsConfirmed={handleSettingsConfirmed} />
        ) : (
          gameSettings && <GameProgress settings={gameSettings} onRestart={handleRestart} />
        )}
      </main>
      
      <footer className="mt-12 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Golf Skins Calculator</p>
      </footer>
    </div>
  )
}

export default App
