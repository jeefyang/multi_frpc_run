type ConfigType = {
    user: string;
    password: string;
    token: string;
};

type GithubFrpRelasesReturnType = {
    url: string;
    assets: {
        browser_download_url: string;
    }[];
}[];
