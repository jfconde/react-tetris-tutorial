import React, { useState, useEffect, useCallback, useRef } from 'react';

const SlideCharacter = ({ letter = ' ' }) => {
    const [currentLetter, setCurrentLetter] = useState(letter || ' ');
    const [nextLetter, setNextLetter] = useState(letter || ' ');
    const [inTransition, setInTransition] = useState(false);

    useEffect(() => {
        if (letter === nextLetter) return;
        if (inTransition) {
            //setNextLetter(letter);
        } else {
            setNextLetter(letter);
            setInTransition(true);
            setTimeout(() => {
                setInTransition(false);
            }, 1000);
        }
    }, [inTransition, letter, nextLetter]);

    useEffect(() => {
        if (!inTransition) {
            setCurrentLetter(nextLetter);
        }
    }, [inTransition, nextLetter, letter]);

    return (
        <div className="slide-character">
            <span className={`current-letter ${inTransition ? 'transition' : ''}`}>{currentLetter}</span>
            <span className={`next-letter ${inTransition ? 'transition' : ''}`}>{nextLetter}</span>
        </div>
    );
};

export default SlideCharacter;
