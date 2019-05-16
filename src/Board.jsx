import React from 'react';
import Row from './Row';
import Block from './Block';

const board = new Array(20).fill(new Array(10).fill(null));

const Board = () => {
    return (
        <div className="tetris-board">
            {
                board.map(
                    (row, i) => (
                        <Row key={i}>
                            {
                                row.map(
                                    (block, j) => (
                                        <Block key={[i,j]} />
                                    ))
                            }
                        </Row>
                    ))
            }
        </div>
    );
};

export default Board;