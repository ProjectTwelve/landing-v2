import React, { useEffect, useRef, useState } from 'react';
import { HomeGL } from './components/HomeGL';
import './Home.less';

export const Home: React.FC = () => {
    return (
        <div className='home'>
            <HomeGL />
        </div>
    );
};
