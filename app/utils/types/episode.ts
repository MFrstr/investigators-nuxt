export type SprecherArray = string[][];

export interface Sprecher {
    rolle: string,
    sprecher: string
}

export interface Chapter {
    titel: string;
    start: number;
    end: number
}

export interface Episode {
    nummer: number;
    titel: string;
    autor?: string;
    hörspielskriptautor?: string;
    beschreibung?: string;
    veröffentlichungsdatum: string;
    kapitel?: Chapter[];
    sprecher?: Sprecher[] | SprecherArray;
    links: {
        cover?: string,
    };
    unvollständig?: boolean;
}