export type SelectType = {
    value: string;
    label: string;
};

export type LoginType = {
    username?: string;
    password?: string;
};

export type RouterError = {
    status?: number;
    statusText?: string;
    message?: string;
};
