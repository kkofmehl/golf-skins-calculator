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
    <div className="golf-card">
      <div className="flex justify-center mb-6">
        <img 
          src="/images/golfer_celebrating.png" 
          alt="Golfer Celebrating" 
          className="h-32"
        />
      </div>
      
      <h2 className="text-2xl font-bold mb-6 text-center text-golf-green-800">Game Results</h2>
      
      <div className="mb-8 p-5 bg-fairway-50 rounded-md border border-fairway-200">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xl font-semibold text-golf-green-700">Pot Summary</h3>
          <span className="font-medium text-golf-green-700 text-xl">${totalPot.toFixed(2)}</span>
        </div>
        <p className="text-gray-700 mb-2">
          Total Skins: {totalSkins} × ${settings.skinValue.toFixed(2)} = ${totalPot.toFixed(2)}
        </p>
        <p className="text-gray-700">
          Fair Share per Player: ${(totalPot / sortedResults.length).toFixed(2)}
        </p>
      </div>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-golf-green-700 border-b border-golf-green-200 pb-2">Player Results</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-fairway-100">
                <th className="p-3 text-left font-semibold text-golf-green-800">Player</th>
                <th className="p-3 text-center font-semibold text-golf-green-800">Skins</th>
                <th className="p-3 text-right font-semibold text-golf-green-800">Expected</th>
                <th className="p-3 text-right font-semibold text-golf-green-800">Fair Share</th>
                <th className="p-3 text-right font-semibold text-golf-green-800">Net</th>
              </tr>
            </thead>
            <tbody>
              {sortedResults.map(result => (
                <tr key={result.playerId} className="border-t border-fairway-200">
                  <td className="p-3 font-medium">{result.playerName}</td>
                  <td className="p-3 text-center">
                    {result.skinsWon}
                  </td>
                  <td className="p-3 text-right">
                    ${result.expectedWinnings.toFixed(2)}
                  </td>
                  <td className="p-3 text-right">
                    ${result.fairShare.toFixed(2)}
                  </td>
                  <td className={`p-3 text-right font-bold ${
                    result.totalWinnings > 0 
                      ? 'text-golf-green-600' 
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
        <h3 className="text-xl font-semibold mb-4 text-golf-green-700 border-b border-golf-green-200 pb-2">Payment Summary</h3>
        <div className="bg-white p-4 rounded-md border border-fairway-200">
          {sortedResults.flatMap(result => 
            result.payments.map((payment, index) => (
              <div key={`${result.playerId}-${payment.toPlayerId}-${index}`} className="mb-3 text-lg">
                <span className="font-medium">{result.playerName}</span> pays{' '}
                <span className="font-medium">{payment.toPlayerName}</span>:{' '}
                <span className="text-golf-green-600 font-bold">${payment.amount.toFixed(2)}</span>
              </div>
            ))
          )}
          {!sortedResults.some(r => r.payments.length > 0) && (
            <p className="text-gray-500 italic text-center py-3">No payments needed - game is even</p>
          )}
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-golf-green-700 border-b border-golf-green-200 pb-2">Hole Results</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
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
              <div key={hole.holeNumber} className="border-2 border-golf-green-100 rounded-md p-3 text-center">
                <div className="font-bold text-lg text-golf-green-800">Hole {hole.holeNumber}</div>
                <div className="text-lg my-1">
                  {hole.winnerId === null 
                    ? <span className="font-medium text-gray-600">Halved</span> 
                    : <span className="font-medium">{winner?.playerName}</span>}
                </div>
                {hole.winnerId !== null && (
                  <div className="text-sm text-blue-600">
                    {accumulatedSkins} skin{accumulatedSkins !== 1 ? 's' : ''}
                    {hole.isBirdie && settings.birdieDoublesValue && ' + 1 birdie skin'}
                  </div>
                )}
                {hole.winnerId !== null && (
                  <div className="text-golf-green-600 font-medium mt-1">
                    ${holeValue.toFixed(2)}
                  </div>
                )}
                {hole.isBirdie && (
                  <div className="text-sm text-golf-green-600 mt-2 bg-golf-green-50 py-1 px-2 rounded-full inline-block">
                    Birdie
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="mb-8 p-5 bg-fairway-50 rounded-md border border-fairway-200">
        <h3 className="text-xl font-semibold mb-3 text-golf-green-700">How Skins & Payouts Work</h3>
        <ul className="text-gray-700 list-disc pl-5 space-y-1">
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
        className="golf-btn-primary w-full flex items-center justify-center gap-2"
      >
        <img src="/images/golf_flag.png" alt="" className="h-6" />
        New Game
      </button>
    </div>
  );
};

export default ResultsDisplay; 