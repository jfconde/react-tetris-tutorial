import React, { useEffect } from 'react';
import Board from './Board';
import { getSeedFn } from './util';
import LineCounter from './widgets/LineCounter';

const Game = ({}) => {
    let seed = null;
    useEffect (() => seed = getSeedFn());

    return (
        <div className="game">
            <div className="left-container">
                <LineCounter lines={223} />
            </div>
            <Board seed={seed} />
            <div className="right-container">

            </div>
        </div>
    );
};

Game.propTypes = {};

export default Game;