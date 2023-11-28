export const env = {
  facebookApi: {
    clientId: process.env.FB_CLIENT_ID ?? '847045040762575',
    clientSecret: process.env.FB_CLIENT_SECRET ?? 'e4dd49ba911529530b75e35122011891'
  },
  appPort: process.env.PORT ?? 8080
}
