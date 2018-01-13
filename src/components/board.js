import React, { Component } from 'react';
import Square from './square';

class Board extends Component {
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

export default Board;