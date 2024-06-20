# threads-api : a NodeJS SDK for Threads API

![GitHub package.json version](https://img.shields.io/github/package-json/v/mikescops/node-threads-api)
![GitHub](https://img.shields.io/github/license/mikescops/node-threads-api)

> [!WARNING]
> This project is work in progress and contributions are very welcome!
>
> It is in early development and is not yet ready for production use.

SDK in Javascript / Typescript for Threads API

## Installation

```bash
npm install threads-api
```

## Usage

```typescript
import ThreadsSDK from 'threads-api';

const threadsApi = new ThreadsSDK();

const url = threadsApi.getAuthorizationUrl({
    clientId: '<your_client_id>',
    redirectUri: '<your_redirect_uri>',
    scopes: ['<your_scope>'],
});
```

> [!NOTE]
> Other methods are available, documentation will be updated soon.

## Maintainer

| [![twitter/mikescops](https://avatars0.githubusercontent.com/u/4266283?s=100&v=4)](https://pixelswap.fr 'Personal Website') |
| --------------------------------------------------------------------------------------------------------------------------- |
| [Corentin Mors](https://pixelswap.fr/)                                                                                      |
