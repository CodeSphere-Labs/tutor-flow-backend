export const configuration = () => ({
  cookie: {
    secure: process.env.COOKIE_SECURE,
  },
  db: {
    connectUrl: process.env.DATABASE_URL,
    name: process.env.DATABASE_NAME,
    pass: process.env.DATABASE_PASSWORD,
    username: process.env.DATABASE_USERNAME,
  },
  email: {
    inviteUrl: process.env.EMAIL_INVITE_URL,
    pass: process.env.SMTP_PASS,
    user: process.env.SMTP_USER,
  },
  jwt: {
    access: process.env.JWT_ACCESS_SECRET,
    invite: process.env.JWT_INVITE_SECRET,
    refresh: process.env.JWT_REFRESH_SECRET,
  },
  NODE_ENV: process.env.NODE_ENV,
  port: parseInt(process.env.PORT || '3000', 10),
});
