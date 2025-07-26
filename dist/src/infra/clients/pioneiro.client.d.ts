export declare const createPioneiroClient: () => {
    getTodayEdition: () => Promise<any>;
    getPagesData: (edition: string) => Promise<any[]>;
    fetchPageText: (url: string) => Promise<string>;
};
