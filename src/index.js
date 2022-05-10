import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

/*
TODOs
1. DONE Display the location for each move in the format (col, row) in the move history list.
2. DONE Bold the currently selected item in the move list. 
3. DONE Rewrite Board to use two loops to make the squares instead of hardcoding them.
4. DONE Add a toggle button that lets you sort the moves in either ascending or descending order.
5. When someone wins, highlight the three squares that caused the win.
6. When no one wins, display a message about the result being a draw.
*/

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square 
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
      />
    );
  }

  createGrid = () => {
    // some vars, ie size of grid
    let cols = 3;
    let rows = 3;

    let grid = []; // container where the whole grid goes

    let count = 0;

    //outer loop to create rows
    for (let i = 0; i < rows; i++) {
      let rowItems = [];

      //inner loop to create colums
      for (let j = 0; j < cols; j++) {
        rowItems.push(this.renderSquare(count));
        count++;
      }

      //insert rowItems into grid as row
      grid.push(<div className="board-row"> {rowItems} </div>);
    }

    return grid;
  }

  render() {

    return (
      <div>
        {this.createGrid()}
      </div>
      );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        location: null,
      }],
      stepNumber: 0,
      xIsNext: true,
      ascending: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        location: i,  
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0, 
    });
  }

  reverseOrder() {
    this.setState({
      ascending: !this.state.ascending
    });
  }

  renderMoves(history, current) {
    const moves = history.map((step, move) => {
      const locCurr = getColRow(step.location);
      const desc = move ?
        'Go to move #' + move + ' at (' + locCurr[0] + ', ' + locCurr[1] + ')': //col + row need to be added still
        'Go to game start';

      if (step === current) {
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}> <b>{desc}</b> </button>
          </li>
        );
      } else {
          return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      }

    });

    return moves;
  }

  copyToState(list) {
    this.setState({
      moves: list,
    })
  }


  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const ascending = this.state.ascending;

    const moves = this.renderMoves(history, current);
    //this.copyToState(moves);

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <button onClick={() => this.reverseOrder()}> Reverse order </button>
          <div>{status}</div>
          <ol>{ascending ? moves : moves.reverse()}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function getColRow(input) {
    switch (input) {
      case 0:
        return [0, 0];
      case 1:
        return [1, 0];
      case 2:
        return [2, 0];
      case 3:
        return [0, 1];
      case 4:
        return [1, 1];
      case 5: 
        return [2, 1];
      case 6:
        return [0, 2];
      case 7:
        return [1, 2];
      case 8:
        return [2, 2];
    }
  }

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

