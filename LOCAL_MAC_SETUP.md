# LOCAL MAC SETUP CHECKLIST

Before you can run Nova iOS, verify your Mac has these requirements:

## Check Your Mac Requirements

### 1. Check macOS Version

Open Terminal and run:
```bash
sw_vers
```

**Need:** macOS 12.0 or later  
**Recommended:** macOS 13.0+

### 2. Check if Xcode is Installed

```bash
xcode-select -p
```

**If you see a path** (like `/Applications/Xcode.app/Contents/Developer`):
✅ Xcode is installed!

**If you see an error**:
❌ Need to install Xcode

### 3. Install Xcode (if needed)

**Option A: Mac App Store (Recommended)**
1. Open App Store
2. Search "Xcode"
3. Click "Get" or "Install"
4. Wait 15-30 minutes (~15 GB download)

**Option B: Command Line**
```bash
xcode-select --install
```
This installs command line tools only (smaller, but you'll need full Xcode)

### 4. Verify Xcode Command Line Tools

```bash
xcode-select --install
```

If already installed, it will say so. If not, it will install them.

### 5. Check Git Installation

```bash
git --version
```

**If you see a version number:** ✅ Git is installed  
**If not:** Install Xcode Command Line Tools (step 4)

---

## Quick Setup Script (Run on Your Mac)

Copy and paste this into Terminal on your Mac:

```bash
#!/bin/bash

echo "🚀 Nova iOS Setup Check"
echo ""

# Check macOS version
echo "📍 Checking macOS version..."
sw_vers
echo ""

# Check Xcode
echo "📍 Checking for Xcode..."
if xcode-select -p &> /dev/null; then
    echo "✅ Xcode is installed at: $(xcode-select -p)"
else
    echo "❌ Xcode not found. Install from App Store."
fi
echo ""

# Check Git
echo "📍 Checking for Git..."
if command -v git &> /dev/null; then
    echo "✅ Git is installed: $(git --version)"
else
    echo "❌ Git not found. Install Xcode Command Line Tools."
fi
echo ""

# Check if already cloned
echo "📍 Checking if project exists..."
if [ -d "NovaIOS.xcodeproj" ]; then
    echo "✅ Project found in current directory!"
    echo "Run: open NovaIOS.xcodeproj"
else
    echo "ℹ️  Project not in current directory."
    echo "Clone with: git clone https://github.com/douglascalhoun/game.git"
fi
echo ""

echo "🎯 Next Steps:"
echo "1. Install Xcode if needed (App Store)"
echo "2. Clone the repo: git clone https://github.com/douglascalhoun/game.git"
echo "3. cd game"
echo "4. git checkout cursor/phase1-proof-of-concept-a198"
echo "5. open NovaIOS.xcodeproj"
echo "6. Press ⌘R to run!"
```

---

## Clone and Run (Complete Commands)

Once Xcode is installed, run this on your Mac:

```bash
# Create a projects folder (optional)
mkdir -p ~/Projects
cd ~/Projects

# Clone the repository
git clone https://github.com/douglascalhoun/game.git

# Enter the directory
cd game

# Check out the Phase 1 branch
git checkout cursor/phase1-proof-of-concept-a198

# Verify files are there
ls -la NovaIOS.xcodeproj

# Open in Xcode
open NovaIOS.xcodeproj

# Xcode will open - then press ⌘R to build and run!
```

---

## Troubleshooting

### "xcrun: error: invalid active developer path"
**Solution:** Install Xcode Command Line Tools
```bash
xcode-select --install
```

### "git: command not found"
**Solution:** Install Xcode or Command Line Tools (same as above)

### "No such file or directory"
**Solution:** Make sure you're in the right directory
```bash
cd ~/Projects/game  # or wherever you cloned it
ls -la  # Should see NovaIOS/ and NovaIOS.xcodeproj/
```

### "Project file cannot be opened"
**Solution:** Download Xcode from App Store (not just Command Line Tools)

### Can't find the repository on GitHub
**Solution:** Make sure you're logged into GitHub and have access to:
https://github.com/douglascalhoun/game

---

## Don't Have a Mac?

If you don't have access to a Mac computer:

### Option A: Cloud Mac Services
- **MacStadium**: https://macstadium.com ($30-100/month)
- **MacinCloud**: https://macincloud.com ($20-50/month)  
- **AWS EC2 Mac**: https://aws.amazon.com/ec2/instance-types/mac/ ($1.08/hour)

### Option B: Borrow One
- Friend's Mac
- Work Mac (if allowed for personal projects)
- Apple Store (use display Macs - free!)
- Library or university with Macs

### Option C: Buy One
- Used Mac Mini: ~$300-500 on eBay/Craigslist
- Used MacBook Air: ~$400-700
- New Mac Mini: ~$599 (M2 chip)

---

## Alternative: iOS App Development Without Mac

Unfortunately, there's no official way to build iOS apps without a Mac:
- ❌ No Xcode for Windows or Linux
- ❌ Cross-platform tools (React Native, Flutter) still require Mac for iOS builds
- ❌ Online simulators can't run custom apps
- ⚠️ Hackintosh (legally gray area, unreliable)

**Bottom line:** You need macOS to build iOS apps.

---

## Summary

**WHERE YOU ARE NOW:**
- Linux cloud agent environment
- Cannot run Xcode here

**WHAT TO DO:**
1. Open Terminal **on your Mac** (not in this cloud environment)
2. Run the clone commands above
3. Open `NovaIOS.xcodeproj` in Xcode
4. Press ⌘R to run the game

**Repository URL:**
https://github.com/douglascalhoun/game

**Branch:**
`cursor/phase1-proof-of-concept-a198`

---

## Quick Reference Card

Save this for later:

```
┌─────────────────────────────────────────────┐
│  NOVA iOS - RUN ON YOUR MAC                 │
├─────────────────────────────────────────────┤
│                                             │
│  1. cd ~/Desktop                            │
│  2. git clone                               │
│     https://github.com/douglascalhoun/game  │
│  3. cd game                                 │
│  4. git checkout                            │
│     cursor/phase1-proof-of-concept-a198     │
│  5. open NovaIOS.xcodeproj                  │
│  6. Press ⌘R                                │
│                                             │
│  Repository:                                │
│  github.com/douglascalhoun/game             │
│                                             │
└─────────────────────────────────────────────┘
```
