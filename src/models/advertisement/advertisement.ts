export type TAdvertisementTable = {
    account_id: string; //id tài khoản
    employeeId: string; // id thành viên
    name: string; // tên tài khoản
    account_status: number; // trạng thái tài khoản
    currency: string; // đơn vị tiền tệ
    spend_cap: string; // hạn mức chi tiêu
    amount_spent: string; // số tiền đã chi tiêu
    balance: string; //  số tiền nợ
    created_time: string; // thời gian tạo tài khoản
    owner: string; // id chủ tài khoản quảng cáo
    timezone_name: string; // múi giờ
    disable_reason: number; // mã lí do tài khoản bị vô hiệu hóa
    inforCardBanking: string;
    typeCardBanking: number;
    min_campaign_group_spend_cap: string; // hạn mức chi tiêu tối thiểu cho nhóm chiến dịch
    min_daily_budget: number; // ngân sách tối thiểu hàng ngày cho các chiến dịch
    is_person: number;
    update_data_time: string;
};

export type TAdvertisementField = {
    organizationId?: string;
    branchId?: string;
    groupId?: string;
    employeeId?: string;
    id?: string;
};

export type TCampaignTable = {
    id: string; //id chiến dịch
    name: string; // tên chiến dịch
    budget_rebalance_flag: boolean;
    //Xác định liệu ngân sách của chiến dịch có được tự động cân bằng lại giữa các nhóm quảng cáo trong chiến dịch hay không.
    buying_type: string; // Loại mua quảng cáo của chiến dịch.
    created_time: string; // Thời gian chiến dịch được tạo ra
    start_time: string; // Thời gian bắt đầu của chiến dịch
    effective_status: string; // Trạng thái thực tế hiện tại của chiến dịch
    configured_status: string; // Trạng thái mà bạn đã cấu hình cho chiến dịch
    status: string; // Trạng thái mà bạn đã đặt cho chiến dịch khi tạo hoặc cập nhật nó
    account_id: string; //  ID của tài khoản quảng cáo mà chiến dịch này thuộc về
    budget_remaining: string; // Số tiền ngân sách còn lại cho chiến dịch
    special_ad_category_country: string[]; //Các quốc gia mà danh mục quảng cáo đặc biệt áp dụng. Thường là mã quốc gia
    updated_time: string; //Thời gian cập nhật cuối cùng của chiến dịch, theo định dạng ISO 8601
};

export type TypeTargeting = {
    age_max: number; // Giới hạn độ tuổi tối đa cho đối tượng mục tiêu
    age_min: number; // Giới hạn độ tuổi tối thiểu cho đối tượng mục tiêu
    geo_locations: {
        // địa điểm mục tiêu quảng cáo
        countries: string[]; // Danh sách quốc gia được nhắm mục tiêu
    };
    targeting_automation: {
        // Tự động hóa nhắm mục tiêu
        advantage_audience: number;
    };
    publisher_platforms: string[]; // Các nền tảng xuất bản mà quảng cáo sẽ hiển thị
    facebook_positions: string[]; // Các vị trí trên Facebook nơi quảng cáo sẽ hiển thị
    device_platforms: string[]; // Các nền tảng thiết bị mà quảng cáo sẽ hiển thị
};

export type TAdSetsTable = {
    id: string; // id nhóm quảng cáo
    lifetime_imps: number;
    // Tổng số lần hiển thị (impressions) mà nhóm quảng cáo này đã đạt được trong suốt thời gian hoạt động
    name: string; // Tên của nhóm quảng cáo
    targeting: TypeTargeting; // Cấu hình mục tiêu quảng cáo
    effective_status: string; // Trạng thái hiện tại của nhóm quảng cáo sau khi áp dụng các quy tắc phân phối.
    start_time: string; // Thời gian bắt đầu của nhóm quảng cáo
    budget_remaining: string; // Ngân sách còn lại của nhóm quảng cáo
    configured_status: string; // Trạng thái được cấu hình của nhóm quảng cáo
    created_time: string; // Thời gian tạo nhóm quảng cáo
    daily_budget: string; // Ngân sách hàng ngày của nhóm quảng cáo
    lifetime_budget: string; // Ngân sách trọn đời của nhóm quảng cáo
    promoted_object: {
        page_id: string; // Đối tượng được quảng cáo, vd như page_id
    };
    status: string; // Trạng thái hiện tại của nhóm quảng cáo
    updated_time: string; // Thời gian cập nhật cuối cùng của nhóm quảng cáo
    campaign: {
        // Thông tin về chiến dịch chứa nhóm quảng cáo này
        id: string; // id của chiến dịch
    };
    campaign_id: string; // Mã định danh của chiến dịch chứa nhóm quảng cáo này
};

export type TAdsTable = {
    id: string; // id của quảng cáo
    name: string; // tên quảng cáo
    adset_id: string; // id nhóm quảng cáo
    configured_status: string; // trạng thái cấu hình của quảng cáo
    effective_status: string; // trạng thái hiệu quả hiện tại của quảng cáo
    status: string; // trạng thái hiện tại của quảng cáo

    adcreatives: string;
    created_time: string;
    updated_time: string;
    start_time: string;
};
