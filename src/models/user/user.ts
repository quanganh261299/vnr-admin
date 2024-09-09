import { TypeTeamTable } from "../team/team";

export type TUser = {
    id: string;
    email: string;
    role: {
        id: string;
        name: string;
    };
    group: TypeTeamTable;
};

export type TUserOption = {
    id: string;
    name: string;
};

export type TCreateUser = {
    email: string;
    password?: string;
    roleId: string;
    groupId?: string;
};
