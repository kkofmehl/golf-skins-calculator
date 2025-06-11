git l# Golf Skins Calculator

A web application for tracking and calculating skins in a golf game. This application allows you to:

- Enter players' names and the value of skins
- Choose between 9 or 18 hole rounds
- Set "birdies are double" option
- Track hole-by-hole results:
  - Who won each hole
  - If the hole was halved (skins carry over)
  - If the winner made a birdie
- View final results and payment summaries

## Features

- Clean, responsive UI
- Automatic calculation of winnings
- Payment settlement calculation (who pays what to whom)
- Track skins that carry over from halved holes
- Support for "birdies are double" rule

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or higher recommended)
- npm (v6.0.0 or higher recommended)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/golf-skins-calculator.git
   cd golf-skins-calculator
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

1. Enter player names (2-8 players)
2. Set the skin value (in dollars)
3. Choose 9 or 18 holes
4. Optionally enable "birdies are double"
5. For each hole, enter:
   - If the hole was halved
   - Who won the hole (if not halved)
   - If the winner made a birdie
6. After the final hole, view the results and payment summary

## Building for Production

To create a production build:

```
npm run build
```

The build will be available in the `dist` directory.

## Technologies Used

- React
- TypeScript
- Tailwind CSS
- Vite

## License

This project is licensed under the MIT License - see the LICENSE file for details.
