import React, { useState, useEffect } from 'react';
import styles from './Teams.module.scss';
import classNames from 'classnames/bind';
import Title from '~/components/Title/Title';
import PushNotification from '~/components/PushNotification/PushNotification';
import LoadingScreen from '~/components/LoadingScreen/LoadingScreen';
import TeamModal from '~/components/TeamModal/TeamModal';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';
import { getMembers } from 'services/teamService';
import axios from 'axios';

const cx = classNames.bind(styles);

function Teams() {
    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [slidesPerView, setSlidesPerView] = useState(4);

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/team`);
                console.log('Team response:', response.data);
                setTeam(response.data);
                setLoading(false);
            } catch (err) {
                setError(err);
                console.error('Error fetching team:', err);
                setLoading(false);
            }
        };

        fetchTeam();
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 1280) {
                setSlidesPerView(4);
            } else if (window.innerWidth >= 1024) {
                setSlidesPerView(3);
            } else if (window.innerWidth >= 768) {
                setSlidesPerView(2);
            } else {
                setSlidesPerView(1);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    if (error) {
        return <div>Error loading team members: {error.message}</div>;
    }

    if (loading) {
        return <LoadingScreen isLoading={loading} />;
    }

    const handleOpenDetail = (team) => {
        setSelectedTeam(team);
    };

    const handleCloseDetail = () => {
        setSelectedTeam(null);
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <Title text="THÀNH VIÊN HỢP TÁC XÃ" showSeeAll={false} />
                <div className={cx('team-container')}>
                    {team.map((member) => (
                        <div key={member.id} className={cx('member-card')}>
                            <div className={cx('member-avatar-container')}>
                                <img src={member.avatar} alt={member.name} className={cx('member-avatar')} />
                            </div>
                            <h3 className={cx('member-name')}>{member.name}</h3>
                            <p className={cx('member-position')}>{member.position}</p>
                        </div>
                    ))}
                </div>
            </div>
            <TeamModal visible={!!selectedTeam} onClose={handleCloseDetail} team={selectedTeam} />
        </div>
    );
}

export default Teams;
