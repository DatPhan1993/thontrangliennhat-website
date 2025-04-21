import React, { useState } from 'react';
import styles from './Teams.module.scss';
import classNames from 'classnames/bind';
import Title from '~/components/Title/Title';
import TeamModal from '~/components/TeamModal/TeamModal';

// Import ảnh thành viên từ assets
import teamImages from '~/assets/images/teams';

const cx = classNames.bind(styles);

function Teams() {
    const [selectedTeam, setSelectedTeam] = useState(null);

    // Thông tin mới của thành viên hợp tác xã
    const teamMembers = [
        {
            id: 1,
            name: 'Nguyễn Hữu Quyền',
            position: 'Giám đốc HTX',
            avatar: teamImages.director,
            description: 'Giám đốc HTX Sản xuất nông nghiệp và dịch vụ tổng hợp Liên Nhật'
        },
        {
            id: 2,
            name: 'Võ Tá Quỳnh',
            position: 'Quản Lý Thôn Trang Liên Nhật',
            avatar: teamImages.manager,
            description: 'Quản lý thôn Trang Liên Nhật và các hoạt động sản xuất nông nghiệp của HTX'
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
                    {teamMembers.map((member) => (
                        <div 
                            key={member.id} 
                            className={cx('member-card')}
                            onClick={() => handleOpenDetail(member)}
                        >
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
