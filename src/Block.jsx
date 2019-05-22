import React from 'react';

const Block = ({type}) => {
    return (
        <div className={`block ${type ? 'fill ' + type : 'empty'}`}>
            <div className="decorator">
                <div className="misc misc1">
                </div>
                <div className="misc misc1">
                </div>
            </div>
        </div>
    );
};

export default Block;