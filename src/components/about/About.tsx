import classnames from 'classnames';
import React, { useMemo, useState } from 'react';
import { ABOUT_PARTNERS, CONTACT_INFO, PartnerInfo } from './About.config';
import './About.less';
import AboutCard from './components/AboutCard';
import { useIsPortrait } from '../../hooks/useIsPortrait';

export const About: React.FC = () => {
    const isPortrait = useIsPortrait();
    const showNum = isPortrait ? 3 : 5;
    const [currentPartner, setCurrentPartner] = useState(0);
    const [currentAbouts, setCurrentAbouts] = useState<PartnerInfo[]>(ABOUT_PARTNERS);
    const showingAbouts = useMemo(
        () => (currentAbouts.length > showNum ? currentAbouts.slice(0, showNum) : currentAbouts),
        [currentAbouts],
    );

    const handlePrev = () => {
        setCurrentAbouts((prevState) => {
            const last = prevState.pop();
            return last ? [last, ...prevState] : [...prevState];
        });
    };

    const handleNext = () => {
        setCurrentAbouts((prevState) => {
            const [first, ...rest] = prevState;
            return [...rest, first];
        });
    };

    return (
        <div className="about">
            <div className="about__partner">
                <div className="about__btn about__btn--left" onClick={() => handlePrev()}></div>
                <i className="about__partner-dot about__partner-dot--left"></i>
                {showingAbouts.map((v, i) => {
                    return (
                        <div
                            key={v.name}
                            className={classnames(
                                'about__partner-item',
                                `about__partner-item--${i + 1}`,
                                i === currentPartner && 'active',
                            )}
                            onClick={() => setCurrentPartner(i)}
                        >
                            <img src={v.img} alt="avatar" />
                            <div className="about__partner-text">
                                <div className="about__partner-text-name">{v.name}</div>
                                <div className="about__partner-text-desc">{v.desc}</div>
                                <div className="about__partner-text-links">
                                    {!!v.links.linkedin && (
                                        <a
                                            className="about__partner-text-link about__partner-text-link--linkedin"
                                            href={v.links.linkedin}
                                            target="_blank"
                                            rel="noreferrer"
                                        ></a>
                                    )}
                                    {!!v.links.twitter && (
                                        <a
                                            className="about__partner-text-link about__partner-text-link--twitter"
                                            href={v.links.twitter}
                                            target="_blank"
                                            rel="noreferrer"
                                        ></a>
                                    )}
                                    {!!v.links.github && (
                                        <a
                                            className="about__partner-text-link about__partner-text-link--github"
                                            href={v.links.github}
                                            target="_blank"
                                            rel="noreferrer"
                                        ></a>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <i className="about__partner-dot about__partner-dot--right"></i>
                <div className="about__btn about__btn--right" onClick={() => handleNext()}></div>
            </div>
            <div className="about__helper">
                <div className="about__helper-item">
                    <div className="about__icon--contact"></div>
                    <div className="about__helper-item--contact">Contact</div>
                    <div className="about__contact">
                        <div className="about__contact-container">
                            <AboutCard info={CONTACT_INFO} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
