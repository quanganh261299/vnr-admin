/* eslint-disable @typescript-eslint/no-explicit-any */
import { Tag } from "antd";

export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const PHONE_REGEX = /^0\d{8,10}$/;

export const statisticType = [
    {
        value: 1,
        label: 'Thống kê tổng tiền chi tiêu cho Facebook'
    },
    {
        value: 2,
        label: 'Thống kê nhân sự có số lượng kết quả cao nhất'
    },
    {
        value: 3,
        label: 'Thống kê tổng chiến dịch'
    },
    {
        value: 4,
        label: 'Thống kê ngưỡng chi tiêu còn lại'
    }
]

export const systemStatisticType = [
    {
        value: 0,
        label: 'Hệ thống'
    },
    {
        value: 1,
        label: 'Chi nhánh'
    },
    {
        value: 2,
        label: 'Đội nhóm'
    },
    {
        value: 3,
        label: 'Thành viên'
    },
]

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
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export const handleEffectiveStatus = (value: string) => {
    switch (value) {
        case "ACTIVE": return <Tag color="green">Đang hoạt động</Tag>
        case "PAUSED": return <Tag color="gray">Đã tạm dừng</Tag>
        case "IN_PROCESS": return <Tag color="lightblue">Đang xử lí</Tag>
        case "WITH_ISSUES": return <Tag color="orange">Có vấn đề</Tag>
        case "PENDING_REVIEW": return <Tag color="yellow">Chờ phê duyệt</Tag>
        case "DISAPPROVED": return <Tag color="red">Bị từ chối</Tag>
        case "ARCHIVED": return <Tag color="gray">Đã lưu trữ</Tag>
        case "DELETE": return <Tag color="black">Đã bị xóa</Tag>
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

