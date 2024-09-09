import { TypeTeamTable } from "../team/team";

export type TMemberTable = {
    id: string;
    groupName: string;
    name: string;
    description: string;
    phone: string;
    email: string;
    updateDate: string | null;
    deleteDate: string | null;
    group: TypeTeamTable;
    groupId: string;
};

export type TMemberField = {
    id?: string;
    name?: string;
    email?: string;
    phone?: string;
    description?: string;
    group?: TypeTeamTable;
    groupId?: string;
};
