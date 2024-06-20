import got from 'got';
import { AuthParams, ErrorResponse, TokenParams, TokenResponse } from './types';

export class BaseResource {
    public graphApiVersion = 'v1.0';
    public graphApiBaseUrl = 'https://graph.threads.net/' + (this.graphApiVersion ? this.graphApiVersion + '/' : '');
    public authorizationBaseUrl = 'https://threads.net';

    public buildGraphApiUrl = (
        path: string,
        searchParams: string | Record<string, string> | string[][] | URLSearchParams | undefined,
        accessToken?: string | null,
        base_url?: string | null
    ) => {
        const url = new URL(path, base_url ?? this.graphApiBaseUrl);

        url.search = new URLSearchParams(searchParams).toString();
        if (accessToken) {
            url.searchParams.append('access_token', accessToken);
        }

        return url.toString();
    };

    public getAuthorizationUrl = (params: AuthParams): string => {
        const url = this.buildGraphApiUrl(
            'oauth/authorize',
            {
                ['scope']: params.scopes.join(','),
                ['client_id']: params.clientId,
                ['redirect_uri']: params.redirectUri,
                ['response_type']: 'code',
            },
            null,
            this.authorizationBaseUrl
        );

        return url;
    };

    public exchangeCodeForToken = async (params: TokenParams): Promise<TokenResponse> => {
        const uri = this.buildGraphApiUrl('oauth/access_token', {}, null, this.graphApiBaseUrl);

        const response = await got.post(uri, {
            form: {
                client_id: params.clientId,
                client_secret: params.clientSecret,
                code: params.code,
                grant_type: 'authorization_code',
                redirect_uri: params.redirectUri,
            },
            throwHttpErrors: false,
        });

        const body = response.body.replace(/([\[:])?(\d+)([,\}\]])/g, '$1"$2"$3');

        if (response.statusCode === 200) {
            return JSON.parse(body) as TokenResponse;
        } else {
            throw new Error((JSON.parse(body) as ErrorResponse).error.message);
        }
    };
}
