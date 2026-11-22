export interface Roles {
    episodeNumbers: number[];
    roleName: string;
}

export interface Voice {
    name: string;
    episodes: Roles[];
    nameCode: string;
};