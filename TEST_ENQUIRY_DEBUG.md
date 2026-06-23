# Enquiry Debug Steps

## To debug the issue:

1. **Restart your dev server** (Ctrl+C and run `npm run dev` again) to load the updated API route

2. **Check browser console** when submitting enquiry:
   - Open DevTools (F12)
   - Go to Console tab
   - Try submitting enquiry
   - Look for logs about session/token

3. **Check if token is being validated correctly**:
   - The API route now validates token properly
   - Service role key is in .env.local

## Quick test in browser console:

```javascript
// Check if session exists
const { data } = await supabaseClient.auth.getSession();
console.log('Session:', data.session);
console.log('Has token:', !!data.session?.access_token);
```

## If still failing, likely causes:

1. Dev server not restarted after API route changes
2. Browser cache - try hard refresh (Ctrl+Shift+R)
3. Session expired - sign out and sign in again
