import { ContactInfoType } from '../About.config';
import './AboutCard.less';

type AboutCardProps = {
    info: ContactInfoType;
};
const AboutCard = ({ info }: AboutCardProps) => {
    const { name, desc, socials } = info;
    return (
        <div className="about__card">
            <div className="about__card--name">
                {name}
                <span className="sep">|</span>
                <span className="about__card--name-sub">{desc}</span>
            </div>
            {socials?.email && <div className="about__card--social email">{socials.email}</div>}
            {socials?.phone && <div className="about__card--social phone">{socials.phone}</div>}
            {socials?.location && <div className="about__card--social location">{socials.location}</div>}
        </div>
    );
};
export default AboutCard;
