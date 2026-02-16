# Ahmed Kapadia Real Estate - Estate Project

A premium Next.js application for real estate consulting and luxury property portfolio management in Dubai.

## 🌟 Features

- **Dynamic Homepage** - Customizable hero section, portfolio showcase, services, and blog preview
- **Admin Panel** - Complete CMS for managing blog posts, forms, media, and site settings
- **Blog System** - Rich text editor with EditorJS for creating and managing blog content
- **Inquiry Forms** - Secure form submissions with email notifications and Supabase storage
- **Authentication** - Google OAuth integration with role-based access control
- **Media Library** - Upload and manage images with Supabase storage
- **Theme System** - Light, dark, and cosmic nebula themes
- **SEO Optimized** - Automatic sitemap generation, robots.txt, and meta tags
- **Responsive Design** - Mobile-first, premium glassmorphism UI

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Supabase account
- Gmail account (for email notifications)
- Google Cloud Console account (for OAuth)

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd estate
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Gmail Configuration (for email notifications)
GMAIL_USER=your-gmail-address@gmail.com
GMAIL_APP_PASSWORD=your-app-specific-password

# Site Configuration  
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Google Verification (optional, for production)
NEXT_PUBLIC_GOOGLE_VERIFICATION=your-google-verification-code
```

### 3. Database Setup

1. **Go to your Supabase SQL Editor**
2. **Run the complete schema**:
   - Copy all SQL from `supabase/complete_schema.sql`
   - Paste and execute in Supabase SQL Editor
3. **Run media schema** (if not already done):
   - Copy SQL from `supabase/media-schema.sql`
   - Execute in Supabase SQL Editor
4. **Verify tables created**:
   - `profiles`
   - `client_forms`
   - `site_settings`
   - `posts`
   - `media`

### 4. Create Your First Admin User

After running the schema, you need to make yourself an admin:

1. Sign up through your app (use Google OAuth)
2. Go to Supabase Dashboard → Table Editor → `profiles`
3. Find your user record
4. Change `role` from `user` to `admin`
5. Save changes
6. Now you can access `/admin` routes

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📧 Email Configuration

### Setting Up Gmail App Password

1. Go to your [Google Account](https://myaccount.google.com/)
2. Navigate to **Security**
3. Enable **2-Step Verification** (required)
4. Go to **App passwords**
5. Generate a new app password for "Mail"
6. Copy the 16-character password
7. Add it to your `.env.local` as `GMAIL_APP_PASSWORD`

## 🔐 Google OAuth Setup (FREE)

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable the **Google+ API** for your project

### Step 2: Create OAuth 2.0 Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
3. Select **Application type**: **Web application**
4. **Name**: "Estate App" (or any name you prefer)
5. **Authorized JavaScript origins**:
   - For development: `http://localhost:3000`
   - For production: `https://yourdomain.com`
6. **Authorized redirect URIs**: Leave empty for now
7. Click **CREATE**
8. **Copy the Client ID** (you'll need this)
9. **Copy the Client Secret** (you'll need this)

### Step 3: Configure Supabase Authentication

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to **Authentication** → **Providers**
3. Find **Google** and click to expand
4. Enable **"Enable Sign in with Google"**
5. Fill in the fields:
   - **Client ID (for OAuth)**: Paste your Google Client ID
   - **Client Secret (for OAuth)**: Paste your Google Client Secret
   - **Skip nonce checks**: Leave unchecked (more secure)
   - **Allow users without an email**: Leave unchecked
6. **Copy the Callback URL** shown:
   ```
   https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback
   ```

### Step 4: Add Callback URL to Google

1. Go back to [Google Cloud Console](https://console.cloud.google.com/)
2. Go to **APIs & Services** → **Credentials**
3. Click on your OAuth 2.0 Client ID
4. Under **Authorized redirect URIs**, click **+ ADD URI**
5. Paste the Supabase callback URL:
   ```
   https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback
   ```
6. Click **SAVE**

### Step 5: Test Authentication

1. Go to your app: `http://localhost:3000/submit-form`
2. Click on Google Sign In
3. You should see Google's consent screen
4. After authentication, you'll be redirected back to your app
5. Check Supabase Dashboard → **Authentication** → **Users** to see your user

## 📁 Project Structure

```
estate/
├── app/                      # Next.js app directory
│   ├── admin/               # Admin panel pages
│   │   ├── blogs/          # Blog management
│   │   ├── forms/          # Form submissions
│   │   ├── media/          # Media library
│   │   ├── pages/          # Page editor
│   │   └── settings/       # Site settings
│   ├── api/                # API routes
│   │   ├── send-email/    # Email sending endpoint
│   │   └── upload/        # File upload endpoint
│   ├── auth/              # Authentication pages
│   ├── blog/              # Public blog pages
│   ├── contact/           # Contact page
│   ├── portfolio/         # Portfolio page
│   └── submit-form/       # Inquiry form page
├── components/            # React components
│   ├── admin/            # Admin-specific components
│   ├── auth/             # Auth provider
│   ├── blog/             # Blog components
│   ├── landing/          # Landing page sections
│   ├── layout/           # Layout components
│   ├── theme/            # Theme provider
│   └── ui/               # Reusable UI components
├── lib/                  # Utility libraries
│   ├── actions/         # Server actions
│   ├── email/           # Email templates & mailer
│   ├── supabase/        # Supabase clients
│   └── utils.js         # Helper functions
├── public/              # Static assets
├── supabase/            # Database schemas
│   ├── complete_schema.sql    # Main database schema
│   └── media-schema.sql       # Media table schema
└── .env.local          # Environment variables (not committed)
```

## 🗄️ Database Schema

### Tables

- **profiles** - User profiles with roles (user/admin)
- **client_forms** - Inquiry form submissions
- **site_settings** - Dynamic site content (JSON)
- **posts** - Blog posts with rich content
- **media** - Uploaded media files

All tables have:
- Row Level Security (RLS) enabled
- Proper indexes for performance
- Automated `updated_at` triggers
- Admin-only policies where appropriate

## 🚢 Deployment (Vercel)

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo>
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [Vercel](https://vercel.com/)
2. Import your GitHub repository
3. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
4. Add all environment variables from `.env.local`
5. Deploy!

### 3. Update Google OAuth

After deployment, add your production domain to Google OAuth:

1. Authorized JavaScript origins: `https://yourdomain.com`
2. Supabase will work automatically with your production domain

### 4. Update Environment Variables

Set `NEXT_PUBLIC_SITE_URL` in Vercel to your production domain:
```
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## 🧪 Testing

### Form Submission Flow

1. Navigate to `/submit-form` or `/contact`
2. Sign in with Google OAuth
3. Fill out the form with valid data
4. Submit
5. Verify:
   - Success message appears
   - User receives confirmation email
   - Admin receives notification email
   - Data appears in Supabase `client_forms` table
   - Data visible in `/admin/forms`

### Email Testing

Check both inboxes:
- **User email**: Should receive professional confirmation
- **Admin email**: Should receive lead notification with all form data

## 🔧 Troubleshooting

### Email Not Sending

1. **Check environment variables**:
   ```bash
   echo $GMAIL_USER
   echo $GMAIL_APP_PASSWORD
   ```
2. **Verify Gmail App Password** is correct (16 characters)
3. **Check Vercel logs** for error messages
4. **Test locally first** before deploying

### Google OAuth Not Working

1. **Verify callback URL** matches exactly in Google Console
2. **Check Client ID and Secret** in Supabase
3. **Ensure 2-Step Verification** is enabled on Gmail
4. **Clear browser cache** and cookies
5. **Check browser console** for errors

### Database Errors

1. **Verify RLS policies** are set correctly
2. **Check your user has admin role** in `profiles` table
3. **Run validation queries** from `complete_schema.sql`
4. **Check Supabase logs** for detailed errors

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

## 📝 Common Tasks

### Adding a New Blog Post

1. Go to `/admin/blogs`
2. Click "New Post"
3. Fill in title, slug, excerpt
4. Use rich editor for content
5. Add featured image
6. Toggle "Published" when ready
7. Save

### Editing Site Content

1. Go to `/admin/settings`
2. Choose section (Hero, About, Services, etc.)
3. Edit content using editor
4. Save changes
5. Visit homepage to see updates

### Managing Form Submissions

1. Go to `/admin/forms`
2. View all submissions in card format
3. See contact details, property interest, and messages
4. Filter by status (if implemented)

## 🎨 Customization

### Changing Theme Colors

Edit `app/globals.css` and modify CSS variables:

```css
:root {
  --primary-500: #c29d59; /* Gold color */
  --bg-main: #ffffff;
  /* ... more variables */
}
```

### Adding New Pages

1. Create file in `app/your-page/page.js`
2. Add to sitemap in `app/sitemap.js`
3. Add navigation link in `components/layout/Navbar.jsx`

## 📊 Performance

- **Lighthouse Score**: 90+ target
- **SEO**: Optimized meta tags, sitemap, robots.txt
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic with Next.js
- **Edge Functions**: API routes on Vercel Edge

## 🔒 Security

- ✅ Row Level Security (RLS) on all tables
- ✅ Environment variables for secrets
- ✅ CSRF protection with Next.js
- ✅ OAuth 2.0 for authentication
- ✅ Input validation and sanitization
- ✅ SQL injection prevention
- ✅ XSS protection

## 📧 Support

For issues or questions:
1. Check this README
2. Review Supabase documentation
3. Check Next.js documentation
4. Review code comments

## 📄 License

Private project - All rights reserved.

---

**Built with ❤️ using Next.js, Supabase, and Tailwind CSS**
