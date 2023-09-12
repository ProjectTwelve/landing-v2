import { useLocalStorageState } from 'ahooks';
import './ComingButton.less';
import classnames from 'classnames';

const ComingButton = () => {
    const [pulseState, setPulseState] = useLocalStorageState('hasPulse', { defaultValue: 'pulse' });

    return (
        <div
            className={classnames(['coming-btn', pulseState])}
            onMouseEnter={() => setPulseState('')}
            onClick={() => window.open('https://arcana.p12.games/', '_blank')}
        >
            <p>Arcana</p>
        </div>
    );
};
export default ComingButton;
