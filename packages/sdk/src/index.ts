import got from 'got';

interface AuthParams {
    client_id: string;
    redirect_uri: string;
    scope: string;
    state?: string;
}

interface TokenParams {
    client_id: string;
    client_secret: string;
    code: string;
    redirect_uri: string;
}

interface TokenResponse {
    access_token: string;
    user_id: string;
}

interface ErrorResponse {
    error_type: string;
    code: number;
    error_message: string;
}

export interface ProfileResponse {
    id: string;
    username: string;
    threads_profile_picture_url: string;
    threads_biography: string;
}

enum ProfileFieldsEnum {
    ID = 'id',
    USERNAME = 'username',
    BIOGRAPHY = 'threads_biography',
    PROFILE_PICTURE = 'threads_profile_picture_url',
}
// values of ProfileFieldsEnum
type ProfileFields = `${ProfileFieldsEnum}`;

class ThreadsSDK {
    private authorizeEndpoint = 'https://threads.net/oauth/authorize';
    private tokenEndpoint = 'https://graph.threads.net/oauth/access_token';

    getAuthorizationUrl(params: AuthParams): string {
        const queryString = `client_id=${params.client_id}&redirect_uri=${params.redirect_uri}&scope=${params.scope}&response_type=code&state=${params.state ?? 'static'}`;

        return `${this.authorizeEndpoint}?${queryString}`;
    }

    async exchangeCodeForToken(params: TokenParams): Promise<TokenResponse> {
        const response = await got.post(this.tokenEndpoint, {
            form: {
                client_id: params.client_id,
                client_secret: params.client_secret,
                code: params.code,
                grant_type: 'authorization_code',
                redirect_uri: params.redirect_uri,
            },
            responseType: 'json',
            throwHttpErrors: false,
        });

        if (response.statusCode === 200) {
            return response.body as TokenResponse;
        } else {
            throw new Error((response.body as ErrorResponse).error_message);
        }
    }

    async getUserProfile(accessToken: string, username: string, fields: ProfileFields[]): Promise<ProfileResponse> {
        const concatenatedFields = fields.join(',');
        const url = `https://graph.threads.net/v1.0/me?fields=${concatenatedFields}&access_token=${accessToken}&username=${username}`;

        const response = await got.get(url, { responseType: 'json' });

        if (response.statusCode === 200) {
            return response.body as ProfileResponse;
        } else {
            throw new Error((response.body as ErrorResponse).error_message);
        }
    }
}

export default ThreadsSDK;
