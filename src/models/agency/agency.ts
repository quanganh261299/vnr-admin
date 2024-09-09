import { TSystemTable } from "../system/system";

export type TAgencyTable = {
    id: string;
    name: string;
    description: string;
    updateDate: string | null;
    deleteDate: string | null;
    organizationId: string;
    organization: TSystemTable;
};

export type TAgencyField = {
    id?: string;
    name?: string;
    description?: string;
    organizationId?: string;
    organization?: TSystemTable;
};
