import { CreationSvg } from '../../../components/svg/CreationSvg';
import { DevelopsSvg } from '../../../components/svg/DevelopsSvg';
import { LoadingSvg } from '../../../components/svg/LoadingSvg';
import { VoteSvg } from '../../../components/svg/VoteSvg';
import { useFetchUserAndGameCount } from '../../../hooks/p12/useFetchUserAndGameCount';
import { shortenNumber } from '../../../utils/shorten';
import './PosterSummary.less';

export default function PosterSummary() {
    const { data, isLoading } = useFetchUserAndGameCount();
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
            {isLoading ? (
                <LoadingSvg color="white" className="poster-summary__loading" />
            ) : (
                showData.map(({ title, icon, value }) => (
                    <div className="poster-summary__item">
                        {icon}
                        {title}
                        <p className="poster-summary__value">{value}</p>
                    </div>
                ))

                // <div className="flex-center gap-1.5">
                //     <img src={require('../../../assets/poster/creations.svg')} className="h-4" alt="creations" />
                //     Creations:
                //     <p className="ml-1 font-poppins text-lg/5 font-semibold text-yellow">{data?.gamesCount ?? 0}</p>
                // </div>
                // <div className="flex-center gap-1.5">
                //     <VoteSvg className="h-4 fill-white" />
                //     Valid Voters:
                //     <p className="ml-1 font-poppins text-lg/5 font-semibold text-red-300">{data?.participantCount ?? 0}</p>
                // </div>
                // <div className="flex-center gap-1.5">
                //     <VoteSvg className="h-4 fill-white" />
                //     Votes:
                //     <p className="ml-1 font-poppins text-lg/5 font-semibold text-red-300">
                //         {shortenNumber(data?.votesCount ?? 0)}
                //     </p>
                // </div>
            )}
        </div>
    );
}
