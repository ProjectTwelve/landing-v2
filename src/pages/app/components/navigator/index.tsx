import classnames from 'classnames';
import { useAtom } from 'jotai';
import { currentPageAtom, mobileNavMenuOpenAtom } from '../../../../store/app/state';
import { IS_MOBILE, playClickAudio } from '../../../../utils';
import { CONTENT_PAGES } from '../../App.config';
import './index.less';
import { useCallback, useRef } from 'react';
import { gsap } from 'gsap';
import classNames from 'classnames';
import CloseSrc from '../../../../assets/app/close.png';
import MenuSrc from '../../../../assets/app/menu.png';
import { usePageLockScroll } from '../../../../hooks/usePageLockScroll';
import { Socials } from '../../../../components/socials';
export const Navigator: React.FC = () => {
    const [current, setCurrent] = useAtom(currentPageAtom);
    const [menuOpen, setMenuOpen] = useAtom(mobileNavMenuOpenAtom);
    const buttonRef = useRef<HTMLImageElement>(null);
    usePageLockScroll(menuOpen); // 弹窗时阻止滚动

    const toggleMenu = useCallback(() => {
        if (!buttonRef?.current) return;
        const imgElement = buttonRef.current;
        gsap.to(imgElement, {
            duration: 0.25,
            opacity: 0,
            onComplete: () => {
                imgElement.src = menuOpen ? CloseSrc : MenuSrc;
                gsap.to(imgElement, { duration: 0.25, opacity: 1 });
                setMenuOpen(!menuOpen);
            },
        });
    }, [setMenuOpen, menuOpen, buttonRef]);

    return IS_MOBILE ? (
        <>
            <div className="mobile-nav">
                <div className="mobile-nav__button" onClick={toggleMenu}>
                    <img ref={buttonRef} src={menuOpen ? CloseSrc : MenuSrc} alt="mobile-nav__button" />
                </div>
                <div className={classNames('mobile-nav__wrapper', { show: menuOpen })}>
                    <div className="mobile-nav__wrapper-mask" />
                    <div className="mobile-nav__wrapper-logo" />
                    <div className="mobile-nav__wrapper-list">
                        {CONTENT_PAGES.map((p, i) => {
                            return (
                                p.NavText && (
                                    <div
                                        key={`${p.type}-${i}`}
                                        className={classnames(
                                            'nav__item',
                                            p.type === current && 'active',
                                            !p.Content && 'nav__item--no-content',
                                            p.dropdown && 'nav__item--dropdown',
                                        )}
                                        onClick={() => {
                                            playClickAudio();
                                            p.type && setCurrent(p.type);
                                        }}
                                    >
                                        {p.NavText}
                                    </div>
                                )
                            );
                        })}
                    </div>
                    <Socials className="mobile-nav__wrapper-links" />
                </div>
            </div>
        </>
    ) : (
        <div className="nav">
            {CONTENT_PAGES.map((p, i) => {
                return (
                    p.NavText && (
                        <div
                            key={`${p.type}-${i}`}
                            className={classnames(
                                'nav__item',
                                p.type === current && 'active',
                                !p.Content && 'nav__item--no-content',
                                p.dropdown && 'nav__item--dropdown',
                            )}
                            onClick={() => {
                                playClickAudio();
                                p.type && setCurrent(p.type);
                            }}
                        >
                            {p.NavText}
                        </div>
                    )
                );
            })}
        </div>
    );
};
