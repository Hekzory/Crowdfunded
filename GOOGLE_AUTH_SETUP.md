# Setting Up Google OAuth

This document explains how to set up Google OAuth for this application.

## 1. Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing one.
3. Navigate to "APIs & Services" > "OAuth consent screen".
4. Select "External" user type (unless you're using Google Workspace).
5. Fill in the required information:
   - App name
   - User support email
   - Developer contact information
6. Click "Save and Continue".
7. You can skip adding scopes for now and click "Save and Continue".
8. Add test users if you're in testing mode, then click "Save and Continue".
9. Review your settings and click "Back to Dashboard".

## 2. Create OAuth Credentials

1. Navigate to "APIs & Services" > "Credentials".
2. Click "Create Credentials" and select "OAuth client ID".
3. Select "Web application" as the Application type.
4. Give it a name like "Crowdfunded Web Client".
5. Add authorized JavaScript origins:
   - For local development: `http://localhost:3000`
   - For production: `https://your-production-domain.com`
6. Add authorized redirect URIs:
   - For local development: `http://localhost:3000/api/auth/google/callback`
   - For production: `https://your-production-domain.com/api/auth/google/callback`
7. Click "Create".
8. You'll get a client ID and client secret. Save these securely.

## 3. Add Environment Variables

Create or update your `.env.local` file with the following variables:

```
# Google OAuth
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
REDIRECT_URI=http://localhost:3000/api/auth/google/callback

# JWT Secret (generate a strong random string)
JWT_SECRET=your_jwt_secret_here
```

For production, set these environment variables on your hosting platform.

## 4. Restart the Application

After adding the environment variables, restart your development server

## Troubleshooting

- **Redirect URI Mismatch**: Ensure that the redirect URI in your Google Cloud Console matches exactly with the one in your `.env.local` file.
- **Cookies Not Working**: Ensure your app is using HTTPS in production, as secure cookies require HTTPS.
- **Consent Screen Issues**: If the consent screen doesn't appear, check your OAuth consent screen configuration in Google Cloud Console. 