import { useState } from 'react';
import type { Player, GameSettings } from '../types';

interface PlayerSetupProps {
  onSettingsConfirmed: (settings: GameSettings) => void;
}

const PlayerSetup: React.FC<PlayerSetupProps> = ({ onSettingsConfirmed }) => {
  const [players, setPlayers] = useState<Player[]>([
    { id: '1', name: '' },
    { id: '2', name: '' }
  ]);
  const [skinValue, setSkinValue] = useState<number>(1);
  const [birdieDoublesValue, setBirdieDoublesValue] = useState<boolean>(false);
  const [numberOfHoles, setNumberOfHoles] = useState<9 | 18>(18);
  const [error, setError] = useState<string>('');

  const addPlayer = () => {
    if (players.length < 8) {
      setPlayers([...players, { id: String(players.length + 1), name: '' }]);
    }
  };

  const removePlayer = (id: string) => {
    if (players.length > 2) {
      setPlayers(players.filter(player => player.id !== id));
    }
  };

  const updatePlayerName = (id: string, name: string) => {
    setPlayers(
      players.map(player => (player.id === id ? { ...player, name } : player))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate player names
    const emptyNames = players.some(player => !player.name.trim());
    if (emptyNames) {
      setError('All players must have names');
      return;
    }
    
    // Check for duplicate names
    const names = players.map(p => p.name.trim());
    const uniqueNames = new Set(names);
    if (uniqueNames.size !== players.length) {
      setError('Player names must be unique');
      return;
    }
    
    // Clear error if validation passes
    setError('');
    
    // Create settings object
    const settings: GameSettings = {
      players,
      skinValue,
      birdieDoublesValue,
      numberOfHoles
    };
    
    onSettingsConfirmed(settings);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Golf Skins Game Setup</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Players</h3>
          {players.map(player => (
            <div key={player.id} className="flex items-center mb-2">
              <input
                type="text"
                value={player.name}
                onChange={(e) => updatePlayerName(player.id, e.target.value)}
                placeholder={`Player ${player.id} name`}
                className="flex-grow p-2 border rounded-md"
              />
              {players.length > 2 && (
                <button
                  type="button"
                  onClick={() => removePlayer(player.id)}
                  className="ml-2 p-2 text-red-500"
                  aria-label="Remove player"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          
          {players.length < 8 && (
            <button
              type="button"
              onClick={addPlayer}
              className="mt-2 bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600 transition"
            >
              + Add Player
            </button>
          )}
        </div>
        
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-medium">Skin Value ($)</label>
            <input
              type="number"
              min="0.5"
              step="0.5"
              value={skinValue}
              onChange={(e) => setSkinValue(Number(e.target.value))}
              className="w-full p-2 border rounded-md"
            />
          </div>
          
          <div>
            <label className="block mb-2 font-medium">Number of Holes</label>
            <select
              value={numberOfHoles}
              onChange={(e) => setNumberOfHoles(Number(e.target.value) as 9 | 18)}
              className="w-full p-2 border rounded-md"
            >
              <option value={9}>9 Holes</option>
              <option value={18}>18 Holes</option>
            </select>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={birdieDoublesValue}
              onChange={(e) => setBirdieDoublesValue(e.target.checked)}
              className="mr-2"
            />
            <span>Birdies are double value</span>
          </label>
        </div>
        
        {error && <div className="text-red-500 mb-4">{error}</div>}
        
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition"
        >
          Start Game
        </button>
      </form>
    </div>
  );
};

export default PlayerSetup; 