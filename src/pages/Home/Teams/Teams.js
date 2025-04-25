import React, { useState } from 'react';
import styles from './Teams.module.scss';
import classNames from 'classnames/bind';
import Title from '~/components/Title/Title';
import TeamModal from '~/components/TeamModal/TeamModal';
import teamImages from '~/assets/images/teams';

const cx = classNames.bind(styles);

function Teams() {
    const [selectedTeam, setSelectedTeam] = useState(null);
    
    // Static team data
    const team = [
        {
            id: 1,
            name: 'Nguyễn Hữu Quyền',
            position: 'Giám đốc HTX',
            avatar: teamImages.director,
            description: 'Giám đốc HTX với nhiều năm kinh nghiệm trong lĩnh vực nông nghiệp và quản lý.'
        },
        {
            id: 2,
            name: 'Võ Tá Quỳnh',
            position: 'Quản Lý Thôn Trang Liên Nhật',
            avatar: teamImages.manager,
            description: 'Quản lý thôn Trang Liên Nhật, phụ trách các hoạt động du lịch sinh thái và trải nghiệm nông nghiệp.'
        }
    ];

    const handleOpenDetail = (member) => {
        setSelectedTeam(member);
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
