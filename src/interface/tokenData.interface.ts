interface Token {
    pggId: Number;
    token: String;
    providerData: {
        refToken: String;
        acToken: String;
    };
};

export default Token;