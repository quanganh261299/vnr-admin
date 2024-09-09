import { TAgencyTable } from "../agency/agency";

export type TypeTeamTable = {
    id: string;
    branchName?: string;
    name: string;
    description: string;
    updateDate: string | null;
    deleteDate: string | null;
    branchId: string;
    branch: TAgencyTable;
};

export type TypeTeamField = {
    id?: string;
    name?: string;
    description?: string;
    branch?: TAgencyTable;
    branchId?: string;
};
