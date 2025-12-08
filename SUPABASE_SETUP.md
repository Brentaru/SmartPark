# Supabase Storage Setup Instructions

## Profile Picture Storage Configuration

To enable profile picture uploads, you need to create a storage bucket in your Supabase project:

### Steps:

1. **Go to your Supabase Dashboard**: https://app.supabase.com
2. **Navigate to Storage** (left sidebar)
3. **Create a new bucket**:
   - Click "New Bucket"
   - Name: `smartpark-profiles`
   - Make it **Public** (check "Public bucket")
   - Click "Create bucket"

4. **Set Storage Policies** (Optional but recommended for security):
   
   **Allow Anyone to Read (View) Profile Pictures:**
   - Click on the `smartpark-profiles` bucket
   - Go to "Policies" tab
   - Click "New Policy"
   - Choose "For full customization" → Click "Create policy"
   - Policy Name: `Public Access - SELECT`
   - Allowed operation: Check **SELECT** (read/view files)
   - Policy definition: 
     ```sql
     true
     ```
   - Click "Review" then "Save policy"

   **Allow Authenticated Users to Upload:**
   - Click "New Policy" again
   - Choose "For full customization" → Click "Create policy"
   - Policy Name: `Authenticated Upload - INSERT`
   - Allowed operation: Check **INSERT** (upload files)
   - Policy definition:
     ```sql
     (bucket_id = 'smartpark-profiles'::text)
     ```
   - Click "Review" then "Save policy"

   **Allow Users to Update Their Own Pictures:**
   - Click "New Policy" again
   - Choose "For full customization" → Click "Create policy"
   - Policy Name: `Authenticated Update - UPDATE`
   - Allowed operation: Check **UPDATE** (modify files)
   - Policy definition:
     ```sql
     (bucket_id = 'smartpark-profiles'::text)
     ```
   - Click "Review" then "Save policy"

   **Allow Users to Delete Their Own Pictures:**
   - Click "New Policy" again
   - Choose "For full customization" → Click "Create policy"
   - Policy Name: `Authenticated Delete - DELETE`
   - Allowed operation: Check **DELETE** (remove files)
   - Policy definition:
     ```sql
     (bucket_id = 'smartpark-profiles'::text)
     ```
   - Click "Review" then "Save policy"

   **Note:** Since you're using the anon key (not authenticated users yet), the policies above will work for public access. Once you implement Supabase authentication, you can make them more restrictive by using `auth.uid()` in the policy definitions.

### Bucket Details:
- **Bucket Name**: `smartpark-profiles`
- **Access**: Public (for profile pictures to be viewable)
- **Path Structure**: `profile-pictures/{userId}-{timestamp}.{extension}`

### File Restrictions:
- **Allowed Types**: JPG, PNG
- **Max Size**: 2MB
- **Storage Location**: `smartpark-profiles/profile-pictures/`

### Usage in App:
The profile picture upload is implemented in:
- `frontend/src/pages/ProfileSettings.jsx` - Upload functionality
- Uses Supabase client initialized with your anon key
- Uploads to: `smartpark-profiles/profile-pictures/`
- Returns public URL for storing in user profile

### Next Steps:
1. Update your backend API to store the profile picture URL in the User entity
2. Add a `profilePictureUrl` field to your User model
3. Update the profile display components to show the uploaded picture instead of initials

### Security Notes:
- The anon key is safe to use in frontend code
- Consider adding Row Level Security (RLS) policies for production
- Implement file name sanitization if needed
- Add virus scanning for production environments
