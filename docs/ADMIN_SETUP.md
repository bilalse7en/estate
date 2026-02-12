# Admin Setup Guide

## Setting Up Admin Access

### Step 1: Sign Up for Account
1. Navigate to your application (locally or deployed): `http://localhost:3000` or your production URL
2. Click on **CLIENT LOGIN** in the top-right corner
3. Click **Sign Up** and create an account with your email

### Step 2: Assign Admin Role in Supabase

> [!IMPORTANT]
> **Admin privileges are granted through the Supabase database, not hardcoded in the application.**

1. **Navigate to Supabase Dashboard**:
   - Go to: https://supabase.com/dashboard/project/uykgpmgcayncaddtsspu
   - Sign in with your Supabase account

2. **Find Your User**:
   - Click on **Authentication** → **Users** in the left sidebar
   - Look for the user `bilalghaffar46@gmail.com` (or your email)
   - Copy the **User ID** (UUID format)

3. **Update Profile Role**:
   - Click on **Table Editor** in the left sidebar
   - Select the `profiles` table
   - Find the row with your User ID
   - Click on the `role` column for that row
   - Change the value from `user` to `admin`
   - Click the checkmark to save

4. **Verify Admin Access**:
   - Sign out from your application
   - Sign back in
   - You should now see "Control Center" button in the navigation
   - Click it to access `/admin`

---

## Configuring Resend for Emails

### Step 1: Create Resend Account
1. Go to https://resend.com
2. Sign up for a free account (3,000 emails/month)
3. Verify your email address

### Step 2: Get API Key
1. In Resend dashboard, go to **API Keys**
2. Click **Create API Key**
3. Give it a name (e.g., "Dubai Real Estate Dev")
4. Copy the generated API key

### Step 3: Configure Environment Variable
1. Open your `.env.local` file
2. Find the line: `RESEND_API_KEY=`
3. Paste your API key: `RESEND_API_KEY=re_xxxxxxxxxxxxx`
4. Save the file
5. **Restart your development server**: Stop `npm run dev` and start it again

### Step 4: Verify Domain (For Production)
For production, you need to verify a sending domain:

1. In Resend dashboard, go to **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `kapadia-real-estate.com`)
4. Add the DNS records provided by Resend to your domain's DNS settings
5. Wait for verification (usually minutes to hours)

6. Update the email template:
   - Open `d:\estate\lib\email\resend.js`
   - Change `from: 'Ahmed Kapadia Private Office <noreply@yourdomain.com>'`
   - To: `from: 'Ahmed Kapadia Private Office <noreply@your-verified-domain.com>'`

---

## Using the Admin Panel

### Dashboard Overview
- **URL**: `/admin`
- **Features**: Stats overview, recent activity, quick links

### Blog Management

#### Creating a New Blog Post

1. **Navigate to Blogs**:
   - Go to `/admin/blogs`
   - Click **Create New Blog**

2. **Fill in Details**:
   - **Title**: Enter your blog post title (e.g., "Dubai Real Estate Market Trends 2026")
   - **Slug**: Auto-generated from title, or customize (e.g., `dubai-trends-2026`)
   - **Excerpt**: Optional brief summary for preview cards
   - **Featured Image**: Upload a featured image (optional but recommended)

3. **Create Content with Editor.js**:
   - Use the **block-based editor** with these tools:
     - **Header (H1-H6)**: Click + → Header
     - **Paragraph**: Default block for text
     - **List**: Ordered or unordered lists
     - **Quote**: Highlighted quote blocks
     - **Code**: Code snippets with syntax
     - **Image**: Upload inline images
     - **Embed**: YouTube, Twitter, etc.
     - **Table**: Data tables

4. **Publish or Save Draft**:
   - Check **Publish immediately** to make it live
   - Leave unchecked to save as draft
   - Click **Publish** or **Save Draft**

#### Editing a Blog Post
1. Go to `/admin/blogs`
2. Find your blog in the list
3. Click **Edit**
4. Make your changes
5. Click **Save Changes**

#### Deleting a Blog Post
1. Open the blog in edit mode
2. Click the red **Delete** button in the top-right
3. Confirm the deletion

### Viewing Form Submissions
1. Navigate to `/admin/forms`
2. View all client inquiries
3. Filter or search if needed

---

## Troubleshooting

### "Access Denied" when visiting `/admin`
- **Cause**: Your user role is not set to `admin`
- **Fix**: Follow **Step 2: Assign Admin Role in Supabase** above

### "Email delivery failed" after form submission
- **Cause**: Resend API key not configured or invalid
- **Fix**: 
  1. Check `.env.local` has correct `RESEND_API_KEY`
  2. Restart development server
  3. Verify API key is active in Resend dashboard

### Editor.js not loading
- **Cause**: JavaScript bundle issue or client-side rendering problem
- **Fix**:
  1. Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)
  2. Clear browser cache
  3. Check browser console for errors

### Images not uploading in Editor.js
- **Cause**: Supabase Storage bucket not configured
- **Fix**:
  1. Go to Supabase Dashboard → **Storage**
  2. Create a bucket named `blog-uploads`
  3. Make it **Public** (in bucket settings)
  4. Save changes

### Session lost on page reload
- **Cause**: Cookie configuration issue
- **Fix**: Verify `NEXT_PUBLIC_SITE_URL` in `.env.local` matches your current URL
  - For local: `http://localhost:3000`
  - For production: `https://yourdomain.com`

---

## Best Practices

### Blog Content
- ✅ Use high-quality featured images (recommended: 1200x630px)
- ✅ Write clear, engaging excerpts (150-200 characters)
- ✅ Use headings (H2, H3) to structure content
- ✅ Add images to break up text
- ✅ Keep paragraphs short and scannable

### SEO
- ✅ Use descriptive slugs (e.g., `luxury-villas-palm-jumeirah`)
- ✅ Include keywords in title and excerpt
- ✅ Write compelling meta descriptions (excerpt field)

### Email Templates
- ✅ Keep emails professional and concise
- ✅ Include clear next steps
- ✅ Test email delivery before going live

---

## Security Checklist

- [ ] Admin role is only assigned to trusted users
- [ ] Resend API key is kept secret (never commit to Git)
- [ ] Supabase Row Level Security (RLS) policies are enabled
- [ ] Only authenticated users can access `/submit-form`
- [ ] Only admins can access `/admin` routes

---

## Support

For technical issues or questions:
- Check browser console for error messages
- Review Supabase logs for database/auth issues
- Check Resend dashboard for email delivery status
