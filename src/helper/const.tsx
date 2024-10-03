/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppstoreAddOutlined, BankOutlined, CloseCircleOutlined, CreditCardOutlined, DollarOutlined, GiftOutlined, PayCircleOutlined, PushpinOutlined } from "@ant-design/icons";
import { Tag } from "antd";
import { EPath } from "../routes/routesConfig";

export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@.*$/;

export const PHONE_REGEX = /^0\d{8,10}$/;

export const NUMBER_REGEX = /^[0-9]*$/;

export const DEFAULT_PAGE_SIZE = 10;

export const statisticType = [
    {
        value: 1,
        label: 'Thống kê tổng tiền chi tiêu cho Facebook'
    },
    {
        value: 2,
        label: 'Thống kê kết quả tin nhắn'
    },
    {
        value: 3,
        label: 'Thống kê chi phí / kết quả'
    },
    {
        value: 4,
        label: 'Thống kê tổng số lượng chiến dịch'
    },
    {
        value: 5,
        label: 'Thống kê tổng tiền mua nguyên liệu'
    }
]

export const ROLE = {
    ADMIN: 'ADMIN',
    ORGANIZATION: 'ORGANIZATION',
    BRANCH: 'BRANCH',
    GROUP: 'GROUP'
}

export const formatDateTime = (dateTime: string) => {
    if (dateTime) {
        const date = new Date(dateTime);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");
        return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    }
    return "";
};

export const formatNumberWithCommas = (number: number | string) => {
    if (number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
};

export const formatNumberWithCommasNotZero = (number: number | string) => {
    if (number && number !== 0) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    else return 0
};

export const convertStringToRoundNumber = (number: string | number) => {
    if (number) {
        return Math.round(Number(number))
    }
    else return 0
}

export const handleStatus = (value: string) => {

    let status = ''

    if (value.includes('ACTIVE')) status = 'ACTIVE'
    else if (value.includes('PAUSED')) status = 'PAUSED'
    else if (value.includes('IN_PROCESS')) status = 'IN_PROCESS'
    else if (value.includes('WITH_ISSUES')) status = 'WITH_ISSUES'
    else if (value.includes('PENDING_REVIEW')) status = 'PENDING_REVIEW'
    else if (value.includes('DISAPPROVED')) status = 'DISAPPROVED'
    else if (value.includes('ARCHIVED')) status = 'ARCHIVED'
    else if (value.includes('DELETE')) status = 'DELETE'

    switch (status) {
        case "ACTIVE": return <Tag color="green">Đang hoạt động</Tag>
        case "PAUSED": return <Tag color="gray">Đã tạm dừng</Tag>
        case "IN_PROCESS": return <Tag color="lightblue">Đang xử lí</Tag>
        case "WITH_ISSUES": return <Tag color="orange">Có vấn đề</Tag>
        case "PENDING_REVIEW": return <Tag color="yellow">Chờ phê duyệt</Tag>
        case "DISAPPROVED": return <Tag color="red">Bị từ chối</Tag>
        case "ARCHIVED": return <Tag color="gray">Đã lưu trữ</Tag>
        case "DELETE": return <Tag color="black">Đã bị xóa</Tag>
    }
    return '-'
}

export const handleCallToActionType = (value: string) => {
    switch (value) {
        case "BUY_NOW": return "Mua ngay"
        case "CONTACT_US": return "Liên hệ với chúng tôi"
        case "DOWNLOAD": return "Tải xuống"
        case "LEARN_MORE": return "Tìm hiểu thêm"
        case "MESSAGE_PAGE": return "Gửi tin nhắn đến trang"
        case "NO_BUTTON": return "Không có nút"
        case "ORDER_NOW": return "Đặt hàng ngay"
        case "PLAY_GAME": return "Chơi game"
        case "SHOP_NOW": return "Mua sắm ngay"
        case "SIGN_UP": return "Đăng ký"
        case "WATCH_MORE": return "Xem thêm"
        case "GET_DIRECTIONS": return "Xem chỉ đường"
    }
    return '-'
}

export const handleFacebookPosition = (value: string) => {
    switch (value) {
        case 'feed': return 'Bảng tin'
        case 'profile_feed': return 'Bảng tin trang cá nhân'
        case 'facebook_reels': return 'Reels (video ngắn)'
        case 'facebook_reels_overlay': return 'Quảng cáo trên Facebook Reels'
        case 'video_feeds': return 'Video'
        case 'instream_video': return 'Video trong luồng trên Facebook'
        case 'marketplace': return 'Marketplace'
        case 'story': return 'Facebook Stories'
        case 'search': return 'Kết quả tìm kiếm'
    }
}

export const handleDevice = (value: string) => {
    switch (value) {
        case 'mobile': return 'Thiết bị di động'
        case 'desktop': return 'Máy tính'
    }
}

export const handleObjective = (value: string) => {
    switch (value) {
        case "BRAND_AWARENESS": return "Tăng độ nhận diện thương hiệu";
        case "REACH": return "Tối ưu hóa lượng người dùng tiếp cận quảng cáo";
        case "TRAFFIC": return "Tăng lượng truy cập";
        case "ENGAGEMENT": return "Tăng lượt tương tác";
        case "APP_INSTALLS": return "Tăng số lượng cài đặt ứng dụng";
        case "VIDEO_VIEWS": return "Tăng lượt xem video";
        case "LEAD_GENERATION": return "Thu thập thông tin người dùng";
        case "MESSAGES": return "Thúc đẩy người dùng gửi tin nhắn tới doanh nghiệp qua Messenger, Instagram và WhatsApp";
        case "CONVERSIONS": return "Tối ưu hóa hành động chuyển đổi";
        case "CATALOG_SALES": return "Tự động hiển thị sản phẩm cho người có khả năng mua cao nhất";
        case "STORE_VISITS": return "Tăng lượng khách hàng ghé thăm cửa hàng";
        case "OUTCOME_ENGAGEMENT": return "Tăng chất lượng tương tác";
        case "OUTCOME_LEADS": return "Thu thập thông tin khách hàng tiềm năng";
        case "OUTCOME_AWARENESS": return "Tăng độ nhận diện thương hiệu";
        case "OUTCOME_SALES": return "Tăng doanh số trên trang web hoặc ứng dụng";
        case "CALLS": return "Tăng doanh số và chuyển đổi qua cuộc gọi điện thoại";
    }
    return '-';
}


export const handleBuyingType = (value: string) => {
    switch (value) {
        case "AUCTION": return <Tag color="green" icon={<DollarOutlined />}>Đấu giá</Tag>
        case "RESERVED": return <Tag color="gold" icon={<PushpinOutlined />}>RESERVED - Đặt chỗ</Tag>
    }
    return '-'
}

export const handleAccountStatus = (value: number) => {
    switch (value) {
        case 1: return <Tag color='green' className='text-wrap'>Tài khoản đang hoạt động</Tag>
        case 2: return <Tag color='orange' className='text-wrap'>Tài khoản bị tạm dừng</Tag>
        case 3: return <Tag color='red' className='text-wrap'>Tài khoản bị vô hiệu hóa</Tag>
        case 7: return <Tag color='gold' className='text-wrap'>Tài khoản đang trong quá trình xem xét</Tag>
        case 100: return <Tag color='red' className='text-wrap'>Tài khoản bị khóa do vi phạm chính sách</Tag>
    }
}

export const handleDisableReason = (value: number) => {
    switch (value) {
        case 0: return <Tag color='darkgrey' className='text-wrap'>Không có lí do</Tag>
        case 1: return (
            <Tag color='red' className='text-wrap'>
                Tài khoản bị vô hiệu hóa do vi phạm chính sách quảng cáo Facebook
            </Tag>
        )
        case 2: return (
            <Tag color='red' className='text-wrap'>
                Tài khoản bị vô hiệu hóa do nghi ngờ hoạt động gian lận
            </Tag>
        )
        case 3: return (
            <Tag color='red' className='text-wrap'>
                Tài khoản bị vô hiệu hóa do không thanh toán hoặc vấn đề liên quan đến thanh toán
            </Tag>
        )
        case 4: return (
            <Tag color='red' className='text-wrap'>
                Tài khoản bị vô hiệu hóa do yêu cầu của chủ tài khoản
            </Tag>
        )
        case 5: return (
            <Tag color='red' className='text-wrap'>
                Tài khoản bị vô hiệu hóa với các lý do khác
            </Tag>
        )
    }
}

export const handleTypeCardBanking = (value: number) => {
    switch (value) {
        case 1: return <Tag color="blue" icon={<CreditCardOutlined />}>Thẻ tín dụng</Tag>
        case 2: return <Tag color="green" icon={<CreditCardOutlined />}>Thẻ ghi nợ</Tag>
        case 3: return <Tag color="lightgrey" icon={<BankOutlined />}>Tài khoản ngân hàng</Tag>
        case 4: return <Tag color="#003087" icon={<PayCircleOutlined />}>PayPal</Tag>
        case 5: return <Tag color="orange" icon={<BankOutlined />}>Thanh toán trực tiếp</Tag>
        case 6: return <Tag color="red" icon={<GiftOutlined />}>Voucher hoặc mã giảm giá</Tag>
        case 20: return <Tag color="#00aaff" icon={<AppstoreAddOutlined />}>Các phương thức thanh toán khác</Tag>
        case -1: return <Tag color="darkgrey" icon={<CloseCircleOutlined />}>Chưa có phương thức thanh toán</Tag>
    }
}

export const formatDateYMD = (date: Date) => {
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    return `${year}-${month}-${day}`
}

export const convertArrayToObject = (dataArray: any) => {
    if (!Array.isArray(dataArray)) {
        throw new TypeError('Input phải là một mảng.');
    }
    return dataArray.reduce((acc, item) => {
        if (item && typeof item.action_type === 'string' && typeof item.value === 'string') {
            acc[item.action_type] = item.value;
        }
        return acc;
    }, {});
}

export const handleDisplay = (roles: string[], role: string) => {
    if (roles.includes(role)) return ''
    else return 'none'
}

export const hasRole = (roles: string[], role: string) => {
    return roles.includes(role)
}

export const handleHomePageLink = (role: string) => {
    switch (role) {
        case ROLE.ADMIN: return EPath.dashboard
        case ROLE.ORGANIZATION: return EPath.agencyManagement
        case ROLE.BRANCH: return EPath.teamManagement
        case ROLE.GROUP: return EPath.memberManagement
        default: return EPath.dashboard
    }
}

export const handleNumber = (event: any) => {
    let value = event.target.value.replace(/\D/g, '');
    if (value.startsWith('00')) {
        value = '0';
    }
    return value;
}

