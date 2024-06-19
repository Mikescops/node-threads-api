// create sample express app in typescript

import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import path from 'path';
import { configDev } from './config/index.js';
import https from 'https';
import fs from 'fs';

declare module 'express-session' {
    interface SessionData {
        access_token: string;
        user_id: string;
    }
}

const { INITIAL_ACCESS_TOKEN, INITIAL_USER_ID } = process.env;

const HOST = 'threads-sdk.com';
const PORT = 3000;
const APP_ID = configDev.appId;
const API_SECRET = configDev.secret;
const REDIRECT_URI = `https://${HOST}:${PORT}/callback`;
const GRAPH_API_VERSION = 'v1.0';

const GRAPH_API_BASE_URL = 'https://graph.threads.net/' + (GRAPH_API_VERSION ? GRAPH_API_VERSION + '/' : '');
const AUTHORIZATION_BASE_URL = 'https://threads.net';

const DEFAULT_THREADS_QUERY_LIMIT = 10;

const FIELD__ERROR_MESSAGE = 'error_message';
const FIELD__FOLLOWERS_COUNT = 'followers_count';
const FIELD__HIDE_STATUS = 'hide_status';
const FIELD__IS_REPLY = 'is_reply';
const FIELD__LIKES = 'likes';
const FIELD__MEDIA_TYPE = 'media_type';
const FIELD__MEDIA_URL = 'media_url';
const FIELD__PERMALINK = 'permalink';
const FIELD__REPLIES = 'replies';
const FIELD__REPOSTS = 'reposts';
const FIELD__QUOTES = 'quotes';
const FIELD__REPLY_AUDIENCE = 'reply_audience';
const FIELD__STATUS = 'status';
const FIELD__TEXT = 'text';
const FIELD__TIMESTAMP = 'timestamp';
const FIELD__THREADS_BIOGRAPHY = 'threads_biography';
const FIELD__THREADS_PROFILE_PICTURE_URL = 'threads_profile_picture_url';
const FIELD__USERNAME = 'username';
const FIELD__VIEWS = 'views';

const MEDIA_TYPE__CAROUSEL = 'CAROUSEL';
const MEDIA_TYPE__IMAGE = 'IMAGE';
const MEDIA_TYPE__TEXT = 'TEXT';
const MEDIA_TYPE__VIDEO = 'VIDEO';

const PARAMS__ACCESS_TOKEN = 'access_token';
const PARAMS__CLIENT_ID = 'client_id';
const PARAMS__CONFIG = 'config';
const PARAMS__FIELDS = 'fields';
const PARAMS__HIDE = 'hide';
const PARAMS__METRIC = 'metric';
const PARAMS__QUOTA_USAGE = 'quota_usage';
const PARAMS__REDIRECT_URI = 'redirect_uri';
const PARAMS__REPLY_CONFIG = 'reply_config';
const PARAMS__REPLY_CONTROL = 'reply_control';
const PARAMS__REPLY_QUOTA_USAGE = 'reply_quota_usage';
const PARAMS__REPLY_TO_ID = 'reply_to_id';
const PARAMS__RESPONSE_TYPE = 'response_type';
const PARAMS__RETURN_URL = 'return_url';
const PARAMS__SCOPE = 'scope';
const PARAMS__TEXT = 'text';

let initial_access_token = INITIAL_ACCESS_TOKEN;
let initial_user_id = INITIAL_USER_ID;

const SCOPES = [
    'threads_basic',
    'threads_content_publish',
    'threads_manage_insights',
    'threads_manage_replies',
    'threads_read_replies',
];

const app = express();

const __dirname = import.meta.url.replace('file://', '');

app.use(express.static('public'));
app.set('views', path.join(__dirname, '../../views'));
app.set('view engine', 'pug');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    session({
        secret: process.env.SESSION_SECRET ?? 'unsafe-secret',
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 6000000,
        },
    })
);

https
    .createServer(
        {
            key: fs.readFileSync(path.join(__dirname, '../../assets/threads-sdk.com-key.pem')),
            cert: fs.readFileSync(path.join(__dirname, '../../assets/threads-sdk.com.pem')),
        },
        app
    )
    .listen(PORT, HOST, undefined, () => {
        console.log(`listening on https://${HOST}:${PORT} !`);
    });

const useInitialAuthenticationValues = (req: express.Request) => {
    // Use initial values
    req.session.access_token = initial_access_token;
    req.session.user_id = initial_user_id;
    // Clear initial values to enable signing out
    initial_access_token = undefined;
    initial_user_id = undefined;
};

const buildGraphAPIURL = (
    path: string,
    searchParams: Record<string, string>,
    accessToken: string | null,
    base_url: string | null
) => {
    const url = new URL(path, base_url ?? GRAPH_API_BASE_URL);

    url.search = new URLSearchParams(searchParams).toString();
    if (accessToken) {
        url.searchParams.append(PARAMS__ACCESS_TOKEN, accessToken);
    }

    return url.toString();
};

app.get('/', async (req, res) => {
    if (!(req.session.access_token || req.session.user_id) && initial_access_token && initial_user_id) {
        useInitialAuthenticationValues(req);
        res.redirect('/account');
    } else {
        res.render('index', {
            title: 'Index',
            returnUrl: req.query[PARAMS__RETURN_URL],
        });
    }
});

app.get('/login', (req, res) => {
    const url = buildGraphAPIURL(
        'oauth/authorize',
        {
            [PARAMS__SCOPE]: SCOPES.join(','),
            [PARAMS__CLIENT_ID]: APP_ID,
            [PARAMS__REDIRECT_URI]: REDIRECT_URI,
            [PARAMS__RESPONSE_TYPE]: 'code',
        },
        null,
        AUTHORIZATION_BASE_URL
    );

    res.redirect(url);
});