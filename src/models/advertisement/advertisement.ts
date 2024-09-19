import { TMemberTable } from "../member/member";

export type TAdvertisementTable = {
    accountId: string; //id tài khoản
    employeeId: string; // id thành viên
    name: string; // tên tài khoản
    accountStatus: number; // trạng thái tài khoản
    currency: string; // đơn vị tiền tệ
    spendCap: string; // hạn mức chi tiêu
    amountSpent: string; // số tiền đã chi tiêu
    balance: string; //  số tiền nợ
    createdTime: string; // thời gian tạo tài khoản
    owner: string; // id chủ tài khoản quảng cáo
    timezoneName: string; // múi giờ
    disableReason: number; // mã lí do tài khoản bị vô hiệu hóa
    inforCardBanking: string; // số thẻ
    typeCardBanking: number; // loại thẻ
    minCampaignGroupSpendCap: string; // hạn mức chi tiêu tối thiểu cho nhóm chiến dịch
    minDailyBudget: number; // ngân sách tối thiểu hàng ngày cho các chiến dịch
    isPersonal: number; // Cá nhân hóa
    updateDataTime: string; // Thời gian cập nhật
    employee: TMemberTable;
};

export type TAdvertisementField = {
    organizationId?: string;
    branchId?: string;
    groupId?: string;
    employeeId?: string;
    id?: string;
    pms?: string[] | { value: string; label: string }[];
};

export type TCampaignTable = {
    id: string; //id chiến dịch
    accountId: string; // id tài khoản quảng cáo
    name: string; // tên chiến dịch
    budgetRebalanceFlag: boolean; // tự động điều chỉnh ngân sách
    //Xác định liệu ngân sách của chiến dịch có được tự động cân bằng lại giữa các nhóm quảng cáo trong chiến dịch hay không.
    buyingType: string; // Loại mua quảng cáo của chiến dịch.
    createdTime: string; // Thời gian chiến dịch được tạo ra
    startTime: string; // Thời gian bắt đầu của chiến dịch
    effectiveStatus: string; // Trạng thái thực tế hiện tại của chiến dịch
    configuredStatus: string; // Trạng thái mà bạn đã cấu hình cho chiến dịch
    status: string; // Trạng thái mà bạn đã đặt cho chiến dịch khi tạo hoặc cập nhật nó
    dailyBudget: string; // Ngân sách hàng ngày
    lifetimeBudget: string; // Ngân sách trọn đời
    budgetRemaining: string; // Số tiền ngân sách còn lại cho chiến dịch
    specialAdCategoryCountry: string[]; //Các quốc gia mà danh mục quảng cáo đặc biệt áp dụng. Thường là mã quốc gia
    specialAdCategory: string[]; // đối tượng quảng cáo
    updatedTime: string; //Thời gian cập nhật data của facebook
    objective: string; // Mục tiêu chiến dịch
    updateDataTime: string; // Thời gian cập nhật dữ liệu
    account?: TAdvertisementTable;
};

// export type TypeTargeting = {
//     age_max: number; // Giới hạn độ tuổi tối đa cho đối tượng mục tiêu
//     age_min: number; // Giới hạn độ tuổi tối thiểu cho đối tượng mục tiêu
//     geo_locations: {
//         // địa điểm mục tiêu quảng cáo
//         countries: string[]; // Danh sách quốc gia được nhắm mục tiêu
//     };
//     targeting_automation: {
//         // Tự động hóa nhắm mục tiêu
//         advantage_audience: number;
//     };
//     publisher_platforms: string[]; // Các nền tảng xuất bản mà quảng cáo sẽ hiển thị
//     facebook_positions: string[]; // Các vị trí trên Facebook nơi quảng cáo sẽ hiển thị
//     device_platforms: string[]; // Các nền tảng thiết bị mà quảng cáo sẽ hiển thị
// };

export type TAdSetsTable = {
    id: string; // id nhóm quảng cáo
    campaignId: string; // id chiến dịch
    name: string; // Tên của nhóm quảng cáo
    lifetimeImps: number;
    // Tổng số lần hiển thị (impressions) mà nhóm quảng cáo này đã đạt được trong suốt thời gian hoạt động
    targeting: string; // Cấu hình mục tiêu quảng cáo
    effectiveStatus: string; // Trạng thái hiện tại của nhóm quảng cáo sau khi áp dụng các quy tắc phân phối.
    configuredStatus: string; // Trạng thái được cấu hình của nhóm quảng cáo
    startTime: string; // Thời gian bắt đầu của nhóm quảng cáo
    createdTime: string; // Thời gian tạo nhóm quảng cáo
    dailyBudget: string; // Ngân sách hàng ngày của nhóm quảng cáo
    budgetRemaining: string; // Ngân sách còn lại
    lifetimeBudget: string; // Ngân sách trọn đời của nhóm quảng cáo
    promoteObjectPageId: string; //
    status: string; // Trạng thái hiện tại của nhóm quảng cáo
    updatedTime: string; // Thời gian cập nhật cuối cùng theo facebook
    updateDataTime: string; // Thời gian cập nhật dữ liệu lần cuối theo database
    campaign?: TCampaignTable;
};

// export type TAdsTable = {
//     id: string; // id của quảng cáo
//     name: string; // tên quảng cáo
//     adset_id: string; // id nhóm quảng cáo
//     configured_status: string; // trạng thái cấu hình của quảng cáo
//     effective_status: string; // trạng thái hiệu quả hiện tại của quảng cáo
//     status: string; // trạng thái hiện tại của quảng cáo
//     conversion_specs: string; // các sự kiện chuyển đổi mà quảng cáo này tối ưu hóa cho
//     adcreatives: string; // Thông tin về các sáng tạo quảng cáo
//     // data: thông tin bên trong
//     // body: nội dung chính của quảng cáo
//     // call_to_action_type: loại hành động kêu gọi
//     // id: id của sáng tạo quảng cáo
//     tracking_specs: string; // Các đặc tả theo dõi cho quảng cáo
//     created_time: string; // Thời gian quảng cáo được tạo ra
//     start_time: string; // Thời gian chạy quảng cáo
//     updated_time: string; // Thời gian quảng cáo được cập nhật theo facebook
//     impressions: string; // Số lần quảng cáo được hiển thị
//     clicks: string; // số lần người dùng nhấp vào quảng cáo
//     spend: string; // tổng chi phí quảng cáo
//     ctr: string; // tỉ lệ nhấp chuột
//     cpm: string; // chi phí mỗi 1000 lượt hiển thị
//     cpc: string; // chi phí mỗi lần nhấp chuột
//     cpp: string; // chi phí mỗi hành động
//     reach: string; // số lượng người dùng quảng cáo đã tiếp cận
//     frequency: string; // tần suất trung bình mà mỗi người dùng thấy quảng cáo
//     onsite_conversion: {
//         total_messaging_connection: string; // số lần người dùng kết nối qua nhắn tin từ quảng cáo
//         messaging_first_reply: string; // số lần người dùng gửi trả lời đầu tiên qua nhắn tin sau khi kết nối từ quảng cáo
//         messaging_welcome_message_view: string; // số lần người dùng xem tin nhắn chào mừng từ quảng cáo
//         messaging_conversation_started_7d: string; // số lần cuộc trò chuyện qua nhắn tin bắt đầu trong vòng 7 ngày sau khi quảng cáo được hiển thị
//     };
//     post_engagement: string; // số lần người dùng tương tác với bài viết
//     page_engagement: string; // số lần người dùng tương tác với trang
//     photo_view: string; // số lần người dùng xem ảnh từ quảng cáo
//     link_click: string; // số lần người dùng nhấp vào liên kết trong quảng cáo
//     // mấy cái sau là chi phí từ cái onsite_conversion trở đi
// };

export type TAdsTable = {
    id: string; // id của quảng cáo
    adsetId: string; // id nhóm quảng cáo
    name: string; // tên quảng cáo
    actionType: string; // chưa rõ
    trackingSpecs: string; // chưa rõ
    adcreatives: string; // chưa rõ
    configuredStatus: string; // trạng thái cấu hình của quảng cáo
    effectiveStatus: string; // trạng thái hiệu quả hiện tại của quảng cáo
    status: string; // trạng thái hiện tại của quảng cáo
    startTime: string; // thời gian chạy quảng cáo
    updatedTime: string; // thời gian cập nhật dữ liệu facebook
    updateDataTime: string; // thời gian cập nhật dữ liệu database
    insight: {
        id: string; // id của insight
        impressions: string; // Số lần quảng cáo được hiển thị
        clicks: string; // số lần người dùng nhấp vào quảng cáo
        spend: string; // tổng chi phí quảng cáo
        reach: string; // số lượng người dùng quảng cáo đã tiếp cận
        ctr: string; // tỉ lệ nhấp chuột
        cpm: string; // chi phí mỗi 1000 lượt hiển thị
        cpc: string; // chi phí mỗi lần nhấp chuột
        cpp: string; // chi phí mỗi hành động
        frequency: string; // tần suất trung bình mà mỗi người dùng thấy quảng cáo
        actions: string | null;
        dateAt: string | null;
        updateDataTime: string | null;
        adsId: string; // id quảng cáo
        ads?: null; // để sau
        costPerAction: string | null;
    };
};

export type TCreateAdsAccount = {
    accountID: string;
    employeeID: string;
};
