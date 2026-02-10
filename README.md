# l_4oto Portfolio Website

A multifaceted portfolio showcasing photography and UX design work.

## 🚀 Setup for Netlify CMS

### Step 1: Deploy to Netlify
1. Push this repository to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect to GitHub and select this repository
5. Deploy!

### Step 2: Enable Netlify Identity
1. In your Netlify dashboard, go to **Site settings** → **Identity**
2. Click **Enable Identity**
3. Under **Registration preferences**, select "Invite only"
4. Under **External providers**, you can enable Google, GitHub, etc. (optional)
5. Under **Services** → **Git Gateway**, click **Enable Git Gateway**

### Step 3: Invite Yourself
1. Go to **Identity** tab in Netlify dashboard
2. Click **Invite users**
3. Enter your email
4. Check your email and accept the invitation
5. Set your password

### Step 4: Access Admin Panel
1. Go to `https://your-site-name.netlify.app/admin`
2. Login with your credentials
3. Start uploading photos and managing albums!

## 📁 Project Structure

```
l_4oto/
├── index.html              # Home page
├── photography.html        # Photography portfolio page
├── ux.html                # UX design page (placeholder)
├── contact.html           # Contact page (placeholder)
├── styles.css             # All styles
├── admin/
│   ├── index.html         # CMS admin interface
│   └── config.yml         # CMS configuration
├── content/
│   ├── albums/            # Album markdown files
│   └── settings/          # Site settings (profile info)
└── assets/
    └── uploads/           # CMS uploaded images go here
```

## 🎨 Using the CMS

### Managing Albums
- **Create Album**: Click "Photo Albums" → "New Album"
- **Add Photos**: In album editor, click "Add Photos" to upload multiple images
- **Reorder**: Change the "Order" field to control album display order
- **Cover Image**: Upload a cover image for the album thumbnail

### Updating Profile
- Go to "Site Settings" → "Profile Info"
- Update your photo, bio, social links, hero images
- Changes save to `content/settings/profile.json`

### Where Images Go
- All uploads go to `/assets/uploads/`
- Images are committed to your GitHub repo
- Netlify auto-deploys when you save in CMS

## 🔧 Local Development

Simply open `index.html` in a browser. No build process needed!

For CMS to work locally, you'll need to run through a local server and use Netlify's proxy mode.

## 📝 TODO

- [ ] Connect CMS data to photography.html dynamically (requires JavaScript)
- [ ] Implement UX portfolio page
- [ ] Create contact form
- [ ] Add album detail pages
- [ ] Update social media links in profile.json

## 👤 Contact

**Liam De Shane-Gill** (l_4oto)
- Email: [Your email]
- Instagram: [@l_4oto](https://instagram.com/l_4oto)
- LinkedIn: [Your profile]
