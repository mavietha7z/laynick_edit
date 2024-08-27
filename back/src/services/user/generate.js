import moment from 'moment-timezone';

export const nicknames = [
    'ha',
    'linh',
    'khanh',
    'lan',
    'hoa',
    'c4hihi',
    'nhat',
    'thao',
    'bequynh',
    'thanh',
    'thu',
    'locff',
    'anh1273',
    'nam',
    'dang',
    'phuong',
    'nhu',
    'diep',
    'thuylinh',
    'minh',
    'khanhlinh',
    'van11',
    'quyen',
    'kien',
    'quang',
    'binh',
    'nhan',
    'huyen',
    'hong',
    'viet',
    'phuc',
    'ngoc',
    'dat',
    'huy',
    'thien',
    'thang',
    'thuong',
    'thinh',
    'huong',
    'huy',
    'trang',
    'tuas',
    'trinh',
    'vudz',
    'ha834',
    'haidang234',
    'tdat12',
    'vip33',
    'xtech',
    'bacgau',
    'c4hihi',
    'gbtvcom',
    'namlay',
];

const generateRandomTimeWithinLastMinute = () => {
    const now = moment().tz('Asia/Ho_Chi_Minh');
    const oneMinuteAgo = now.clone().subtract(1, 'minutes');
    const randomTime = oneMinuteAgo.clone().add(Math.random() * 60000, 'milliseconds');
    return randomTime.format('HH:mm:ss');
};

function generateRandomNickname() {
    const randomIndex = Math.floor(Math.random() * nicknames.length);
    return `${nicknames[randomIndex]}***`;
}

const generateUsers = (numUsers) => {
    const users = [];
    for (let i = 1; i <= numUsers; i++) {
        users.push({
            nickname: generateRandomNickname(),
            created_at: generateRandomTimeWithinLastMinute(),
        });
    }

    users.sort((a, b) => {
        return a.created_at.localeCompare(b.created_at);
    });
    return users;
};

export default generateUsers;
