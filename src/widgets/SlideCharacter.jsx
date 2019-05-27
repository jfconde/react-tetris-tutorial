import React, {useState, useEffect, useCallback, useRef} from 'react';

const SlideCharacter = ({className = '', letter = ' '}) => {
    const [currentLetter, setCurrentLetter] = useState(letter || ' ');
    const nextLetter = useRef(letter || ' ');
    const [inTransition, setInTransition] = useState(false);

    const cL = useRef(null);
    const nL = useRef(null);

    useEffect(() => {
        if (letter === currentLetter || inTransition) return;

        nextLetter.current = letter;
        setTimeout(() => {
            if (letter !== currentLetter) {
                setCurrentLetter(letter);
            }
            setInTransition(false);
        }, 1000);
        setInTransition(true);

    }, [inTransition, letter, nextLetter, currentLetter]);

    useEffect( () => {
        debugger
        setCurrentLetter(letter);
        nextLetter.current = letter;
    }, []);

    return (
        <div className={`slide-character ${className}`}>
            <span ref={cL} className={`current-letter ${inTransition ? 'transition' : ''}`}>{currentLetter}</span>
            <span ref={nL} className={`next-letter ${inTransition ? 'transition' : ''}`}>{nextLetter.current || ''}</span>
        </div>
    );
};

export default SlideCharacter;
