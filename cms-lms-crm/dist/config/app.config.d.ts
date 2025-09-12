declare const _default: () => {
    port: number;
    database: {
        host: string;
        port: number;
        username: string;
        password: string;
        name: string;
    };
    jwt: {
        secret: string;
        expiresIn: string;
    };
    email: {
        host: string | undefined;
        port: number;
        username: string | undefined;
        password: string | undefined;
        from: string;
    };
    whatsapp: {
        apiUrl: string | undefined;
        apiKey: string | undefined;
        phoneNumber: string | undefined;
    };
    upload: {
        maxFileSize: number;
        allowedTypes: string[];
    };
};
export default _default;
