import got from 'got';
import { configDev } from './config/index.js';

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

class ThreadsAuthSDK {
    private authorizeEndpoint = 'https://threads.net/oauth/authorize';
    private tokenEndpoint = 'https://graph.threads.net/oauth/access_token';

    getAuthorizationUrl(params: AuthParams): string {
        const queryString = `client_id=${params.client_id}&redirect_uri=${params.redirect_uri}&scope=${params.scope}&response_type=code&state=${params.state ?? 'static'}`;

        return `${this.authorizeEndpoint}?${queryString}`;
    }

    async exchangeCodeForToken(params: TokenParams): Promise<TokenResponse> {
        console.log(params);
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

        console.log(response);

        if (response.statusCode === 200) {
            return response.body as TokenResponse;
        } else {
            throw new Error((response.body as ErrorResponse).error_message);
        }
    }
}

// Usage Example
const threadsAuthSDK = new ThreadsAuthSDK();

// Step 1: Get Authorization URL
const authUrl = threadsAuthSDK.getAuthorizationUrl({
    client_id: configDev.appId,
    redirect_uri: 'https://pixeltest.requestcatcher.com/test',
    scope: 'threads_basic,threads_content_publish',
});

console.log('Authorization URL:', authUrl);

// Step 2: Exchange Code for Token
async function getAccessToken(code: string) {
    try {
        const tokenResponse = await threadsAuthSDK.exchangeCodeForToken({
            client_id: configDev.appId,
            client_secret: configDev.secret,
            code: code,
            redirect_uri: 'https://pixeltest.requestcatcher.com/test',
        });

        console.log('Access Token:', tokenResponse.access_token);
        console.log('User ID:', tokenResponse.user_id);
    } catch (error: any) {
        console.error('Error exchanging code for token:', error.message);
    }
}

getAccessToken(configDev.oauthCode);
