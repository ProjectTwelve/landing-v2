import React, { useEffect, useRef, useState } from 'react';
import './Loading.less';

export const Loading: React.FC = () => {
    return (
        <div className='loading'>
            <div className='loading__info'></div>
        </div>
    );
};
