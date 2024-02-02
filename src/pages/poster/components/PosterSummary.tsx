import { useAtomValue } from 'jotai';
import { CreationSvg } from '../../../components/svg/CreationSvg';
import { DevelopsSvg } from '../../../components/svg/DevelopsSvg';
import { LoadingSvg } from '../../../components/svg/LoadingSvg';
import { VoteSvg } from '../../../components/svg/VoteSvg';
import { posterSummaryAtom } from '../../../store/poster/state';
import { shortenNumber } from '../../../utils/shorten';
import './PosterSummary.less';

export default function PosterSummary() {
    const data = useAtomValue(posterSummaryAtom);
    const showData = [
        {
            icon: <DevelopsSvg color="white" />,
            title: 'Developers:',
            value: data?.regUserCount ?? 0,
        },
        {
            icon: <CreationSvg color="white" />,
            title: 'Creations:',
            value: data?.gamesCount ?? 0,
        },
        {
            icon: <VoteSvg color="white" />,
            title: 'Valid Voters:',
            value: data?.participantCount ?? 0,
        },
        {
            icon: <VoteSvg color="white" />,
            title: 'Votes:',
            value: shortenNumber(data?.votesCount ?? 0),
        },
    ];
    return (
        <div className="poster-summary">
            {data ? (
                showData.map(({ title, icon, value }) => (
                    <div className="poster-summary__item">
                        {icon}
                        {title}
                        <p className="poster-summary__value">{value}</p>
                    </div>
                ))
            ) : (
                <LoadingSvg color="white" className="poster-summary__loading" />
            )}
        </div>
    );
}
