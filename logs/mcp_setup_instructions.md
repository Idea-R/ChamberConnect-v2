# ChamberConnect MCP Server Setup Instructions

*Created: December 2025*
*Purpose: Configure MCP servers in Cursor IDE for enhanced development*

---

## 🔧 Current MCP Setup Status

### ✅ What's Already Done:
- MCP packages installed (`@supabase/mcp-server-supabase`, `@supabase/mcp-server-postgrest`)
- `.cursor` directory created at `C:\Users\palli\.cursor\`
- **MCP configuration file created at `C:\Users\palli\.cursor\mcp.json`** ✅

### ❌ What Needs Your Action:
- **CRITICAL**: Replace placeholder values with actual Supabase credentials
- Set up environment variables in `.env` file
- Restart Cursor IDE to activate MCP servers

---

## 🚨 IMMEDIATE ACTION REQUIRED

### Your MCP Configuration File Location:
```
C:\Users\palli\.cursor\mcp.json
```

### You Must Replace These Placeholder Values:

1. **`YOUR_PROJECT_REF_HERE`** (appears 2 times)
   - Replace with your Supabase project reference ID
   - Found in your Supabase dashboard URL

2. **`YOUR_PERSONAL_ACCESS_TOKEN_HERE`**
   - Replace with your Supabase personal access token
   - Create at: https://supabase.com/dashboard/account/tokens

3. **`YOUR_ANON_KEY_HERE`**
   - Replace with your Supabase anonymous/public key
   - Found in: Project Settings > API

---

## 🚀 Step-by-Step Setup Guide

### Step 1: Get Your Supabase Credentials

You need to gather these values from your Supabase project:

1. **Project Reference ID**: 
   - Go to your Supabase dashboard
   - Select your project
   - Look at the URL: `https://supabase.com/dashboard/project/[PROJECT_REF]`
   - Copy the `PROJECT_REF` part

2. **Personal Access Token**:
   - Go to https://supabase.com/dashboard/account/tokens
   - Create a new token with appropriate permissions
   - Copy the token value

3. **Anonymous Key**:
   - In your Supabase project dashboard
   - Go to Settings > API
   - Copy the "anon public" key

### Step 2: Update MCP Configuration

**File to edit**: `C:\Users\palli\.cursor\mcp.json`

**Current content** (with placeholders):
```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--project-ref=YOUR_PROJECT_REF_HERE"
      ],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "YOUR_PERSONAL_ACCESS_TOKEN_HERE"
      }
    },
    "supabase-postgrest": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-postgrest@latest",
        "--apiUrl",
        "https://YOUR_PROJECT_REF_HERE.supabase.co/rest/v1",
        "--apiKey",
        "YOUR_ANON_KEY_HERE",
        "--schema",
        "public"
      ]
    },
    "context7": {
      "command": "npx",
      "args": [
        "-y",
        "@context7/mcp-server@latest"
      ]
    }
  }
}
```

### Step 3: Update Environment Variables

Create/update your `.env` file with:
```env
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
EXPO_PUBLIC_SUPABASE_SERVICE_KEY=your-service-key-here
```

### Step 4: Restart Cursor IDE

1. Close Cursor IDE completely
2. Reopen Cursor IDE
3. Open Composer (Ctrl+L)
4. Switch to Agent mode
5. You should now see MCP tools available in the sidebar

---

## 🛠️ Available MCP Tools

Once configured, you'll have access to:

### Supabase MCP Server Tools:
- Database operations
- Table management
- Row operations
- Authentication management
- Storage operations

### Supabase PostgREST MCP Server Tools:
- Direct REST API operations
- Query building
- Data filtering
- Relationship handling

### Context7 MCP Server Tools:
- Library documentation access
- Code context enhancement
- API reference lookup

---

## 🔍 Testing Your Setup

To verify MCP servers are working:

1. Open Cursor Composer
2. Switch to Agent mode
3. Type: "Show me available MCP tools"
4. You should see Supabase tools listed
5. Try: "Connect to my Supabase database and show me the chambers table"

---

## 🐛 Troubleshooting

### Common Issues:

**MCP servers not showing up:**
- Check file path: `C:\Users\palli\.cursor\mcp.json`
- Verify JSON syntax is correct
- Restart Cursor IDE completely

**Authentication errors:**
- Verify your Supabase credentials are correct
- Check token permissions
- Ensure project reference ID is accurate

**Connection timeouts:**
- Check your internet connection
- Verify Supabase project is active
- Try using local MCP server installation

### Debug Commands:
```powershell
# Test if MCP servers can start manually
npx @supabase/mcp-server-supabase@latest --project-ref=YOUR_PROJECT_REF

# Check if Node.js and npx are working
node --version
npx --version
```

---

## 📋 Next Steps After Setup

Once MCP is working:

1. **Database Operations**: Use MCP to interact with your Supabase database
2. **Code Generation**: Generate database queries using AI with full context
3. **API Testing**: Test your Supabase APIs directly through Cursor
4. **Documentation**: Access real-time documentation for your database schema

---

## 🔐 Security Notes

- Never commit your `.cursor/mcp.json` file with real credentials
- Use environment variables for sensitive data when possible
- Regularly rotate your Supabase access tokens
- Keep your MCP server packages updated

---

## 📞 Support

If you encounter issues:
1. Check the Cursor MCP documentation
2. Review Supabase MCP server GitHub repositories
3. Test MCP servers independently before integrating
4. Verify all prerequisites are installed (Node.js, npm, etc.)

*Remember: MCP servers need to be restarted when configuration changes are made.*

---

## 🎯 Summary of What We've Done

1. ✅ **Identified the issue**: Wrong configuration file location and missing credentials
2. ✅ **Created proper MCP config**: `C:\Users\palli\.cursor\mcp.json`
3. ✅ **Set up three MCP servers**: Supabase, Supabase PostgREST, and Context7
4. ❌ **Still needed**: Replace placeholder values with your actual Supabase credentials

**Next action**: Edit the MCP configuration file and replace the placeholder values with your real Supabase credentials. 