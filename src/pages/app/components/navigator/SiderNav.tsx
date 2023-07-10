import classnames from 'classnames';
import { useAtom } from 'jotai';
import { currentPageAtom } from '../../../../store/app/state';
import { CONTENT_PAGES } from '../../App.config';
import './SiderNav.less';
const arr6 = new Array(6).fill(0);
export const SiderNav: React.FC = () => {
    const [current, setCurrent] = useAtom(currentPageAtom);
    return (
        <div className="sider-nav">
            {CONTENT_PAGES.map((p, i) => {
                return (
                    p.NavText && (
                        <div key={`${p.type}-${i}`} className={classnames('sider-nav__item', p.type === current && 'active')}>
                            <span></span>
                            {i !== CONTENT_PAGES.length - 1 && arr6.map(() => <i></i>)}
                        </div>
                    )
                );
            })}
        </div>
    );
};
