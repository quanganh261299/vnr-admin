import { TMemberTable } from "../member/member";
import { TypeTeamTable } from "../team/team";

export type TUser = {
    id: string;
    email: string;
    role: {
        id: string;
        name: string;
    };
    organizationId?: string;
    branchId?: string;
    groupId?: string;
};

export type TUserOption = {
    id: string;
    name: string;
};

export type TSystemUser = {
    id?: string;
    email: string;
    password?: string;
    roleId?: string;
    organizationId?: string;
    branchId?: string;
    groupId?: string;
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
    pms?: string[] | { id: string }[];
    typeAccount?: string;
    sourceAccount?: string;
    cost?: string;
    informationLogin?: string;
};

type TBmList = {
    id: string;
    userId: string;
};

export type TBmUser = {
    id: string;
    email: string;
    group: TypeTeamTable;
    pms: TBmList[];
    chatId: string;
    tokenTelegram: string;
};

export type TBmUserField = {
    id?: string;
    email: string;
    groupId: string;
    bmsId: string | string[];
    chatId: string;
    tokenTelegram: string;
};
