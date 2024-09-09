export type TSystemTable = {
    id: string;
    name: string;
    description: string;
    updateDate: string | null;
    deleteDate: string | null;
};

export type TSystemField = {
    id?: string;
    name?: string;
    description?: string;
};
