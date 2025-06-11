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
    <div className="golf-app-container">
      <header className="mb-8 text-center">
        <div className="flex justify-center items-center gap-3">
          <img 
            src="/images/golf_flag.png" 
            alt="Golf Flag" 
            className="h-10 md:h-12"
          />
          <h1 className="text-3xl md:text-4xl font-bold text-golf-green-800">Golf Skins Calculator</h1>
        </div>
      </header>
      
      <main className="container mx-auto">
        {!gameStarted ? (
          <PlayerSetup onSettingsConfirmed={handleSettingsConfirmed} />
        ) : (
          gameSettings && <GameProgress settings={gameSettings} onRestart={handleRestart} />
        )}
      </main>
      
      <footer className="mt-12 text-center text-gray-600 text-sm">
        <p>&copy; {new Date().getFullYear()} Golf Skins Calculator</p>
      </footer>
    </div>
  )
}

export default App
