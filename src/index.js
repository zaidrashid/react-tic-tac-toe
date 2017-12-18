import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const COORDINATES = createCoordinates();
const LINES = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

function createCoordinates() {
    let coordinates = [];
    for(let i=0; i<3; i++){
        for(let j=0; j<3; j++){
            coordinates.push({x:j, y:i});
        }
    }
    return coordinates;
}

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

function calculateWinner(squares) {
    for (let i = 0; i < LINES.length; i++) {
        const [a, b, c] = LINES[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                key= {i}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        const renderBoard = () => {
            let boardRow = [];
            for(let i=0; i<3; i++) {
                let row = [];
                for (let j=0; j<3; j++) {
                  row.push(this.renderSquare(i*3+j));
                };
                boardRow.push(<div key={i} className="board-row">{row}</div>);
            }
            return boardRow;
        }

        return (
            <div>
                {renderBoard()}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: {
                    value: Array(9).fill(null),
                    coordinates: {x:0, y:0},
                },
            }],
            xIsNext: true,
            stepNumber: 0,
        }
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.value.slice();
        if (squares[i] || calculateWinner(squares)) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        let newCoordinate = {...COORDINATES[i], ...{index:i}};

        this.setState({
            history: history.concat([{
                squares: {value: squares, coordinates: newCoordinate},
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

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares.value);
        const setStyle = (move) => { return this.state.stepNumber === move ? {fontWeight: 'bolder'} : null; };
        const moves = history.map((step, move) => {
            let coor = step.squares.coordinates;
            const desc = move ?
                'Go to move #' + move + ' of ' + step.squares.value[coor.index] + ' at ' + coor.x + ',' + coor.y :
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)} style={setStyle(move)}>{desc}</button>
                </li>
            );
        });

        let status = winner ? 'Winner is ' + winner : 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares.value}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
