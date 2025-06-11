import { useState, useMemo } from 'react';
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

  // Calculate fair share in real-time
  const fairShareCalculation = useMemo(() => {
    // Total pot = number of holes × skin value
    const totalPot = numberOfHoles * skinValue;
    // Fair share = total pot / number of players
    const fairShare = totalPot / players.length;
    
    return {
      totalPot: totalPot.toFixed(2),
      fairShare: fairShare.toFixed(2),
      skinsPerPlayer: (numberOfHoles / players.length).toFixed(1)
    };
  }, [numberOfHoles, skinValue, players.length]);

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
    <div className="golf-card">
      <div className="flex justify-center mb-6">
        <img 
          src="/images/golf_ball_dude_with_sunglasses.png" 
          alt="Golf Ball Character" 
          className="h-24"
        />
      </div>

      <h2 className="text-2xl font-bold mb-6 text-center text-golf-green-800">Golf Skins Game Setup</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-golf-green-700 border-b border-golf-green-200 pb-2">Players</h3>
          {players.map(player => (
            <div key={player.id} className="flex items-center mb-3">
              <input
                type="text"
                value={player.name}
                onChange={(e) => updatePlayerName(player.id, e.target.value)}
                placeholder={`Player ${player.id} name`}
                className="golf-input"
              />
              {players.length > 2 && (
                <button
                  type="button"
                  onClick={() => removePlayer(player.id)}
                  className="ml-3 p-3 text-red-500 bg-red-50 rounded-full hover:bg-red-100 transition"
                  aria-label="Remove player"
                >
                  <span className="text-xl">✕</span>
                </button>
              )}
            </div>
          ))}
          
          {players.length < 8 && (
            <button
              type="button"
              onClick={addPlayer}
              className="mt-3 golf-btn-secondary w-full flex items-center justify-center gap-2"
            >
              <span className="text-xl">+</span> Add Player
            </button>
          )}
        </div>
        
        <div className="mb-8 grid grid-cols-1 gap-6">
          <div>
            <label className="golf-label">Skin Value ($)</label>
            <input
              type="number"
              min="0.5"
              step="0.5"
              value={skinValue}
              onChange={(e) => setSkinValue(Number(e.target.value))}
              className="golf-input"
            />
          </div>
          
          <div>
            <label className="golf-label">Number of Holes</label>
            <select
              value={numberOfHoles}
              onChange={(e) => setNumberOfHoles(Number(e.target.value) as 9 | 18)}
              className="golf-select"
            >
              <option value={9}>9 Holes</option>
              <option value={18}>18 Holes</option>
            </select>
          </div>
        </div>
        
        {/* Fair Share Calculator */}
        <div className="mb-8 bg-fairway-100 p-5 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-golf-green-700">Round Estimate</h3>
          <div className="space-y-2">
            <p><span className="font-medium">Total Pot:</span> ${fairShareCalculation.totalPot}</p>
            <p><span className="font-medium">Fair Share:</span> ${fairShareCalculation.fairShare} per player</p>
            <p><span className="font-medium">Expected Skins:</span> ~{fairShareCalculation.skinsPerPlayer} per player</p>
            <p className="text-sm text-gray-600 mt-2">*Assumes each hole has a winner (no carryovers or birdies)</p>
          </div>
        </div>
        
        <div className="mb-8 bg-fairway-100 p-4 rounded-lg">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={birdieDoublesValue}
              onChange={(e) => setBirdieDoublesValue(e.target.checked)}
              className="golf-checkbox mr-3"
            />
            <span className="text-lg">Birdies are double value</span>
          </label>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <button
          type="submit"
          className="golf-btn-primary w-full flex items-center justify-center gap-2"
        >
          <img src="/images/golf_flag.png" alt="" className="h-6" />
          Start Game
        </button>
      </form>
    </div>
  );
};

export default PlayerSetup; 