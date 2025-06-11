import { useState } from 'react';
import type { Player, HoleResult } from '../types';

interface HoleInputProps {
  holeNumber: number;
  players: Player[];
  onSubmit: (result: HoleResult) => void;
  accumulatedSkins: number;
  skinValue: number;
  birdieDoublesValue: boolean;
}

const HoleInput: React.FC<HoleInputProps> = ({
  holeNumber,
  players,
  onSubmit,
  accumulatedSkins,
  skinValue,
  birdieDoublesValue
}) => {
  const [winnerId, setWinnerId] = useState<string | null>(null);
  const [isBirdie, setIsBirdie] = useState<boolean>(false);
  const [isHalved, setIsHalved] = useState<boolean>(false);

  const handleWinnerChange = (id: string) => {
    setWinnerId(id);
    setIsHalved(false);
  };

  const handleHalvedChange = (halved: boolean) => {
    setIsHalved(halved);
    if (halved) {
      setWinnerId(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const result: HoleResult = {
      holeNumber,
      winnerId: isHalved ? null : winnerId,
      isBirdie
    };
    
    onSubmit(result);
  };

  // Calculate the current skin value
  const currentSkinValue = accumulatedSkins * skinValue;
  const displayValue = isBirdie && birdieDoublesValue 
    ? currentSkinValue * 2 
    : currentSkinValue;

  return (
    <div className="golf-card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-golf-green-800">
          Hole {holeNumber}
        </h2>
        <div className="text-xl font-medium text-golf-green-700 bg-fairway-100 py-1 px-4 rounded-lg">
          ${displayValue.toFixed(2)} {accumulatedSkins > 1 ? `(${accumulatedSkins} skins)` : ''}
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <div className="bg-fairway-100 p-4 rounded-lg">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                id="halved"
                checked={isHalved}
                onChange={(e) => handleHalvedChange(e.target.checked)}
                className="golf-checkbox mr-3"
              />
              <span className="text-lg font-medium">Hole was halved (carry over)</span>
            </label>
          </div>
          
          {!isHalved && (
            <div className="mt-5">
              <label className="golf-label">Who won the hole?</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {players.map(player => (
                  <div 
                    key={player.id} 
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      winnerId === player.id 
                        ? 'border-golf-green-500 bg-golf-green-50' 
                        : 'border-gray-200 hover:border-golf-green-300'
                    }`}
                    onClick={() => handleWinnerChange(player.id)}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id={`winner-${player.id}`}
                        name="winner"
                        checked={winnerId === player.id}
                        onChange={() => handleWinnerChange(player.id)}
                        className="golf-radio mr-3"
                      />
                      <label 
                        htmlFor={`winner-${player.id}`}
                        className="text-lg font-medium cursor-pointer flex-grow"
                      >
                        {player.name}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {!isHalved && (
          <div className="mb-6">
            <div className="bg-fairway-100 p-4 rounded-lg">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="birdie"
                  checked={isBirdie}
                  onChange={(e) => setIsBirdie(e.target.checked)}
                  className="golf-checkbox mr-3"
                />
                <span className="text-lg font-medium">
                  Birdie {birdieDoublesValue ? "(Double Value)" : ""}
                </span>
              </label>
            </div>
          </div>
        )}
        
        <button
          type="submit"
          disabled={!isHalved && !winnerId}
          className={`w-full py-3 px-4 rounded-md text-white text-lg font-medium transition-all ${
            isHalved || winnerId
              ? 'golf-btn-primary'
              : 'golf-btn-disabled'
          }`}
        >
          Submit Hole {holeNumber}
        </button>
      </form>
    </div>
  );
};

export default HoleInput; 