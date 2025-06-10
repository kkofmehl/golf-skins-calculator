import type { GameSettings, HoleResult, Player, PlayerResult, Payment } from '../types';

export const calculateResults = (
  settings: GameSettings,
  holeResults: HoleResult[]
): PlayerResult[] => {
  const { players, skinValue, birdieDoublesValue } = settings;
  
  // Initialize player skins count
  const playerSkinsCount: Record<string, number> = {};
  
  players.forEach(player => {
    playerSkinsCount[player.id] = 0;
  });

  // Calculate skins won based on hole results
  let accumulatedSkins = 1;
  
  for (let i = 0; i < holeResults.length; i++) {
    const holeResult = holeResults[i];
    
    if (holeResult.winnerId === null) {
      // Halved hole, carry over skin
      accumulatedSkins += 1;
    } else {
      // Someone won the hole - they get the accumulated skins
      playerSkinsCount[holeResult.winnerId] += accumulatedSkins;
      
      // If they made a birdie and birdies are double, add an extra skin
      if (holeResult.isBirdie && birdieDoublesValue) {
        playerSkinsCount[holeResult.winnerId] += 1;
      }
      
      // Reset accumulated skins
      accumulatedSkins = 1;
    }
  }

  // Calculate total skins won and total pot
  const totalSkinsWon = Object.values(playerSkinsCount).reduce((sum, count) => sum + count, 0);
  const totalPot = totalSkinsWon * skinValue;
  
  // Calculate winnings for each player
  const playerResults: PlayerResult[] = players.map(player => {
    const skinsWon = playerSkinsCount[player.id];
    const expectedWinnings = skinsWon * skinValue;
    const fairShare = totalPot / players.length;
    const netWinnings = expectedWinnings - fairShare;
    
    return {
      playerId: player.id,
      playerName: player.name,
      skinsWon,
      expectedWinnings,
      fairShare,
      totalWinnings: netWinnings,
      payments: [] // Will be filled in later
    };
  });

  // Calculate payments (who pays what to whom)
  calculatePayments(playerResults);
  
  return playerResults;
};

export const calculatePayments = (results: PlayerResult[]): void => {
  // Separate winners from losers
  const winners = results.filter(player => player.totalWinnings > 0)
    .sort((a, b) => b.totalWinnings - a.totalWinnings); // Sort highest winnings first
  
  const losers = results.filter(player => player.totalWinnings < 0)
    .sort((a, b) => a.totalWinnings - b.totalWinnings); // Sort biggest losers first
  
  // If no winners or losers, no payments needed
  if (winners.length === 0 || losers.length === 0) return;
  
  // For each loser, distribute their payments to winners
  losers.forEach(loser => {
    let remainingDebt = Math.abs(loser.totalWinnings);
    
    // Distribute to winners proportionally to their winnings
    const totalWinnings = winners.reduce((sum, winner) => sum + winner.totalWinnings, 0);
    
    winners.forEach(winner => {
      // Calculate proportion of this winner's share
      const proportion = winner.totalWinnings / totalWinnings;
      let payment = Math.round(remainingDebt * proportion * 100) / 100; // Round to 2 decimals
      
      // Last winner gets any remaining amount to avoid rounding errors
      if (winner === winners[winners.length - 1]) {
        payment = Math.round(remainingDebt * 100) / 100;
      }
      
      // Only add payment if it's significant
      if (payment > 0.01) {
        loser.payments.push({
          toPlayerId: winner.playerId,
          toPlayerName: winner.playerName,
          amount: payment
        });
        
        remainingDebt -= payment;
      }
    });
  });
}; 