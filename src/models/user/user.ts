import { TMemberTable } from "../member/member";

export type TUser = {
    id: string;
    email: string;
    role: {
        id: string;
        name: string;
    };
};

export type TUserOption = {
    id: string;
    name: string;
};

export type TSystemUser = {
    email: string;
    password?: string;
    roleId?: string;
};

export type TAdUser = {
    employeeId: string;
    accountID: string;
};

export type TAdUserTable = {
    accountId: string;
    name: string;
    employee: TMemberTable;
    employeeName: string;
    isActive?: boolean;
};
