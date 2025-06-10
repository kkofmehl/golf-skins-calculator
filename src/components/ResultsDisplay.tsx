import type { PlayerResult, HoleResult, GameSettings } from '../types';

interface ResultsDisplayProps {
  results: PlayerResult[];
  holeResults: HoleResult[];
  settings: GameSettings;
  onRestart: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ 
  results, 
  holeResults,
  settings,
  onRestart 
}) => {
  // Sort results by total winnings (highest to lowest)
  const sortedResults = [...results].sort((a, b) => b.totalWinnings - a.totalWinnings);
  
  // Calculate total pot
  const totalSkins = sortedResults.reduce((sum, player) => sum + player.skinsWon, 0);
  const totalPot = totalSkins * settings.skinValue;
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Game Results</h2>
      
      <div className="mb-6 p-4 bg-gray-50 rounded-md">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Pot Summary</h3>
          <span className="font-medium text-green-600">${totalPot.toFixed(2)}</span>
        </div>
        <p className="text-sm text-gray-700">
          Total Skins: {totalSkins} × ${settings.skinValue.toFixed(2)} = ${totalPot.toFixed(2)}
        </p>
        <p className="text-sm text-gray-700">
          Fair Share per Player: ${(totalPot / sortedResults.length).toFixed(2)}
        </p>
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">Player Results</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Player</th>
                <th className="p-2 text-center">Skins</th>
                <th className="p-2 text-right">Expected</th>
                <th className="p-2 text-right">Fair Share</th>
                <th className="p-2 text-right">Net</th>
              </tr>
            </thead>
            <tbody>
              {sortedResults.map(result => (
                <tr key={result.playerId} className="border-t">
                  <td className="p-2">{result.playerName}</td>
                  <td className="p-2 text-center">
                    {result.skinsWon}
                  </td>
                  <td className="p-2 text-right">
                    ${result.expectedWinnings.toFixed(2)}
                  </td>
                  <td className="p-2 text-right">
                    ${result.fairShare.toFixed(2)}
                  </td>
                  <td className={`p-2 text-right font-medium ${
                    result.totalWinnings > 0 
                      ? 'text-green-600' 
                      : result.totalWinnings < 0 
                        ? 'text-red-600' 
                        : ''
                  }`}>
                    ${Math.abs(result.totalWinnings).toFixed(2)}
                    {result.totalWinnings !== 0 && (result.totalWinnings > 0 ? ' win' : ' loss')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">Payment Summary</h3>
        {sortedResults.flatMap(result => 
          result.payments.map((payment, index) => (
            <div key={`${result.playerId}-${payment.toPlayerId}-${index}`} className="mb-1">
              <span className="font-medium">{result.playerName}</span> pays{' '}
              <span className="font-medium">{payment.toPlayerName}</span>:{' '}
              <span className="text-green-600 font-medium">${payment.amount.toFixed(2)}</span>
            </div>
          ))
        )}
        {!sortedResults.some(r => r.payments.length > 0) && (
          <p className="text-gray-500 italic">No payments needed - game is even</p>
        )}
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">Hole Results</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {holeResults.map((hole, index) => {
            const winner = sortedResults.find(r => r.playerId === hole.winnerId);
            
            // Calculate accumulated skins for this hole
            let accumulatedSkins = 1;
            for (let i = 0; i < index; i++) {
              if (holeResults[i].winnerId === null) {
                accumulatedSkins++;
              } else {
                accumulatedSkins = 1;
              }
            }
            
            // Calculate total skins won for this hole (include birdie skin if applicable)
            const totalSkinsWon = hole.winnerId === null 
              ? 0 
              : hole.isBirdie && settings.birdieDoublesValue
                ? accumulatedSkins + 1  // Regular skins + 1 for birdie
                : accumulatedSkins;
                
            // Calculate the hole value
            const holeValue = totalSkinsWon * settings.skinValue;
            
            return (
              <div key={hole.holeNumber} className="border rounded-md p-2 text-center">
                <div className="font-medium">Hole {hole.holeNumber}</div>
                <div className="text-sm">
                  {hole.winnerId === null 
                    ? 'Halved' 
                    : winner?.playerName}
                </div>
                {hole.winnerId !== null && (
                  <div className="text-xs text-blue-600">
                    {accumulatedSkins} skin{accumulatedSkins !== 1 ? 's' : ''}
                    {hole.isBirdie && settings.birdieDoublesValue && ' + 1 birdie skin'}
                  </div>
                )}
                {hole.winnerId !== null && (
                  <div className="text-xs text-green-600">
                    ${holeValue.toFixed(2)}
                  </div>
                )}
                {hole.isBirdie && (
                  <div className="text-xs text-green-600 mt-1">Birdie</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="mb-8 p-4 bg-gray-50 rounded-md">
        <h3 className="text-lg font-semibold mb-2">How Skins & Payouts Work</h3>
        <ul className="text-sm text-gray-700 list-disc pl-5">
          <li>Each hole is worth 1 skin</li>
          <li>If a hole is halved (tied), the skin carries over to the next hole</li>
          <li>A birdie {settings.birdieDoublesValue ? 'earns an extra skin' : 'doesn\'t earn an extra skin'}</li>
          <li>Each skin is worth ${settings.skinValue.toFixed(2)}</li>
          <li>Each player's expected winnings = their won skins × ${settings.skinValue.toFixed(2)}</li>
          <li>Fair share = total pot ÷ number of players</li>
          <li>Net winnings/losses = expected winnings − fair share</li>
        </ul>
      </div>
      
      <button
        onClick={onRestart}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
      >
        New Game
      </button>
    </div>
  );
};

export default ResultsDisplay; 