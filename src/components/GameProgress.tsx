import { useState } from 'react';
import type { GameSettings, HoleResult, PlayerResult } from '../types';
import HoleInput from './HoleInput';
import ResultsDisplay from './ResultsDisplay';
import { calculateResults } from '../utils/calculations';

interface GameProgressProps {
  settings: GameSettings;
  onRestart: () => void;
}

const GameProgress: React.FC<GameProgressProps> = ({ settings, onRestart }) => {
  const [holeResults, setHoleResults] = useState<HoleResult[]>([]);
  const [currentHole, setCurrentHole] = useState<number>(1);
  const [gameComplete, setGameComplete] = useState<boolean>(false);
  const [results, setResults] = useState<PlayerResult[]>([]);

  // Track accumulated skins
  const [accumulatedSkins, setAccumulatedSkins] = useState<number>(1);

  const handleHoleSubmit = (result: HoleResult) => {
    // Add the hole result to our array
    const updatedResults = [...holeResults, result];
    setHoleResults(updatedResults);
    
    // Update accumulated skins
    if (result.winnerId === null) {
      // Hole was halved, skins carry over
      setAccumulatedSkins(accumulatedSkins + 1);
    } else {
      // Hole was won, reset accumulated skins
      setAccumulatedSkins(1);
    }
    
    // Check if the game is complete
    if (currentHole >= settings.numberOfHoles) {
      setGameComplete(true);
      setResults(calculateResults(settings, updatedResults));
    } else {
      // Move to the next hole
      setCurrentHole(currentHole + 1);
    }
  };

  return (
    <div>
      {gameComplete ? (
        <ResultsDisplay 
          results={results} 
          holeResults={holeResults}
          settings={settings} 
          onRestart={onRestart} 
        />
      ) : (
        <div>
          <div className="golf-card mb-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-golf-green-800">
                Golf Skins Game
              </h2>
              <div className="text-lg font-medium bg-golf-green-100 text-golf-green-800 px-3 py-1 rounded-full">
                Hole {currentHole} of {settings.numberOfHoles}
              </div>
            </div>
            
            <div className="mt-4 border-t border-b border-golf-green-100 py-3 my-3">
              <p className="mb-2">
                <span className="font-medium">Players:</span> {settings.players.map(p => p.name).join(', ')}
              </p>
              <p>
                <span className="font-medium">Skin Value:</span> ${settings.skinValue.toFixed(2)}
                {settings.birdieDoublesValue && ' (Birdies are double)'}
              </p>
            </div>
            
            {/* Display the progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
              <div 
                className="bg-golf-green-500 h-3 rounded-full transition-all duration-500" 
                style={{ width: `${(currentHole / settings.numberOfHoles) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <HoleInput
            holeNumber={currentHole}
            players={settings.players}
            onSubmit={handleHoleSubmit}
            accumulatedSkins={accumulatedSkins}
            skinValue={settings.skinValue}
            birdieDoublesValue={settings.birdieDoublesValue}
          />
          
          {/* Summary of previous holes */}
          {holeResults.length > 0 && (
            <div className="golf-card mt-6">
              <h3 className="text-xl font-semibold mb-4 text-golf-green-700">Previous Holes</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {holeResults.map(hole => {
                  const winner = settings.players.find(p => p.id === hole.winnerId);
                  return (
                    <div key={hole.holeNumber} className="border-2 border-golf-green-100 rounded-md p-3 text-center">
                      <div className="font-medium text-lg">Hole {hole.holeNumber}</div>
                      <div className="my-1 font-medium">
                        {hole.winnerId === null 
                          ? 'Halved' 
                          : winner?.name}
                      </div>
                      {hole.isBirdie && (
                        <div className="text-sm text-golf-green-600 mt-1 bg-golf-green-50 py-1 px-2 rounded-full inline-block">
                          Birdie
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GameProgress; 