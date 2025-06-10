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
          <div className="bg-white p-4 rounded-lg shadow-md max-w-2xl mx-auto mb-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold">
                Golf Skins Game
              </h2>
              <div className="text-sm">
                Hole {currentHole} of {settings.numberOfHoles}
              </div>
            </div>
            
            <div className="mt-2 text-sm">
              <p>
                <span className="font-medium">Players:</span> {settings.players.map(p => p.name).join(', ')}
              </p>
              <p>
                <span className="font-medium">Skin Value:</span> ${settings.skinValue.toFixed(2)}
                {settings.birdieDoublesValue && ' (Birdies are double)'}
              </p>
            </div>
            
            {/* Display the progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
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
            <div className="bg-white p-4 rounded-lg shadow-md max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold mb-2">Previous Holes</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {holeResults.map(hole => {
                  const winner = settings.players.find(p => p.id === hole.winnerId);
                  return (
                    <div key={hole.holeNumber} className="border rounded-md p-2 text-center text-sm">
                      <div className="font-medium">Hole {hole.holeNumber}</div>
                      <div>
                        {hole.winnerId === null 
                          ? 'Halved' 
                          : winner?.name}
                      </div>
                      {hole.isBirdie && (
                        <div className="text-xs text-green-600 mt-1">Birdie</div>
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