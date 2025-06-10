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
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto mb-4">
      <h2 className="text-xl font-bold mb-4">
        Hole {holeNumber} 
        <span className="ml-2 text-green-600">
          (${displayValue.toFixed(2)} {accumulatedSkins > 1 ? `- ${accumulatedSkins} skins` : ''})
        </span>
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="halved"
              checked={isHalved}
              onChange={(e) => handleHalvedChange(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="halved" className="font-medium">Hole was halved (carry over)</label>
          </div>
          
          {!isHalved && (
            <div className="mt-4">
              <label className="block mb-2 font-medium">Who won the hole?</label>
              <div className="grid grid-cols-2 gap-2">
                {players.map(player => (
                  <div key={player.id} className="flex items-center">
                    <input
                      type="radio"
                      id={`winner-${player.id}`}
                      name="winner"
                      checked={winnerId === player.id}
                      onChange={() => handleWinnerChange(player.id)}
                      className="mr-2"
                    />
                    <label htmlFor={`winner-${player.id}`}>{player.name}</label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {!isHalved && (
          <div className="mb-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="birdie"
                checked={isBirdie}
                onChange={(e) => setIsBirdie(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="birdie" className="font-medium">
                Birdie {birdieDoublesValue ? "(Double Value)" : ""}
              </label>
            </div>
          </div>
        )}
        
        <button
          type="submit"
          disabled={!isHalved && !winnerId}
          className={`w-full py-2 px-4 rounded-md text-white transition ${
            isHalved || winnerId
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Submit Hole {holeNumber}
        </button>
      </form>
    </div>
  );
};

export default HoleInput; 