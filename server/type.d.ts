type ConfigType = {
    user: string;
    password: string;
    tokenList: string[];
};

type GithubFrpRelasesReturnType = {
    url: string;
    assets: {
        browser_download_url: string;
    }[];
}[];
