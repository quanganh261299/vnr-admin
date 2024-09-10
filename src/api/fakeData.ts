import { SelectType } from "../models/common";
import { TSystemTable } from "../models/system/system";

export const fakeSystemTableData: TSystemTable[] = [
    {
        id: "1",
        name: "Công ty cổ phần ABC",
        description: "Công ty chuyên về sản xuất và kinh doanh ABC",
        updateDate: "2023-08-29",
        deleteDate: null,
    },
    {
        id: "2",
        name: "Công ty cổ phần BCD",
        description:
            "Công ty chuyên cung cấp dịch vụ BCD trong ngành công nghiệp",
        updateDate: "2023-08-29",
        deleteDate: null,
    },
    {
        id: "3",
        name: "Công ty cổ phần EFG",
        description: "Công ty nổi tiếng với sản phẩm công nghệ EFG",
        updateDate: "2023-08-29",
        deleteDate: null,
    },
    {
        id: "4",
        name: "Công ty cổ phần XYZ",
        description: "Công ty dẫn đầu trong lĩnh vực phát triển phần mềm XYZ",
        updateDate: "2023-08-29",
        deleteDate: null,
    },
    {
        id: "5",
        name: "Công ty cổ phần UVW",
        description: "Công ty chuyên về giải pháp UVW cho doanh nghiệp",
        updateDate: "2023-08-29",
        deleteDate: null,
    },
    {
        id: "6",
        name: "Công ty cổ phần RST",
        description: "Công ty hoạt động trong lĩnh vực tài chính RST",
        updateDate: "2023-08-29",
        deleteDate: null,
    },
    {
        id: "7",
        name: "Công ty cổ phần LMN",
        description: "Công ty cung cấp dịch vụ viễn thông LMN",
        updateDate: "2023-08-29",
        deleteDate: null,
    },
    {
        id: "8",
        name: "Công ty cổ phần OPQ",
        description: "Công ty phát triển công nghệ tiên tiến OPQ",
        updateDate: "2023-08-29",
        deleteDate: null,
    },
    {
        id: "9",
        name: "Công ty cổ phần HJK",
        description:
            "Công ty hoạt động trong lĩnh vực sản xuất hàng tiêu dùng HJK",
        updateDate: "2023-08-29",
        deleteDate: null,
    },
    {
        id: "10",
        name: "Công ty cổ phần VWX",
        description: "Công ty nổi tiếng với sản phẩm công nghệ VWX",
        updateDate: "2023-08-29",
        deleteDate: null,
    },
    {
        id: "11",
        name: "Công ty cổ phần YZA",
        description: "Công ty cung cấp giải pháp môi trường YZA",
        updateDate: "2023-08-29",
        deleteDate: null,
    },
    {
        id: "12",
        name: "Công ty cổ phần BNM",
        description:
            "Công ty dẫn đầu trong lĩnh vực sản xuất và kinh doanh BNM",
        updateDate: "2023-08-29",
        deleteDate: null,
    },
];

export const fakeSelectSystemData: SelectType[] = [
    {
        value: "1",
        label: "Công ty cổ phần VWX",
    },
    {
        value: "2",
        label: "Công ty cổ phần BNM",
    },
    {
        value: "3",
        label: "Công ty cổ phần OPQ",
    },
];

export const fakeSelectAgencyData: SelectType[] = [
    {
        value: "1",
        label: "Chi nhánh cổ phần ABC",
    },
    {
        value: "2",
        label: "Chi nhánh cổ phần DEF",
    },
    {
        value: "3",
        label: "Chi nhánh cổ phần GHI",
    },
];

export const fakeSelectTeamData: SelectType[] = [
    {
        value: "1",
        label: "Đội 1",
    },
    {
        value: "2",
        label: "Đội 2",
    },
    {
        value: "3",
        label: "Đội 3",
    },
];

export const fakeSelectMemberData: SelectType[] = [
    {
        value: "1",
        label: "Member 1",
    },
    {
        value: "2",
        label: "Member 2",
    },
    {
        value: "3",
        label: "Member 3",
    },
];
