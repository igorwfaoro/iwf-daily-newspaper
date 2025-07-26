import 'dotenv/config';
export declare const CONFIG: {
    port: string | number;
    pioneiro: {
        cd: string;
        baseUrl: string;
    };
    groq: {
        apiKey: string;
        chatUrl: string;
    };
    openrouter: {
        apiKey: string;
        chatUrl: string;
    };
    mail: {
        resend: {
            key: string;
        };
        to: string[];
    };
};
