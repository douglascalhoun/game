# Deployment Guide - Nova iOS

## Overview

This guide covers deploying Nova iOS to real devices and (eventually) the App Store.

---

## Stage 1: Personal Testing (Free)

### Requirements
- macOS with Xcode
- Free Apple ID
- USB cable for device

### Steps

1. **Connect device** to Mac via USB
2. **Open project** in Xcode
3. **Modify Bundle ID**:
   - Select project → Target "NovaIOS"
   - Change Bundle Identifier to `com.yourname.NovaIOS`
4. **Enable automatic signing**:
   - Check "Automatically manage signing"
   - Select your Apple ID as Team
5. **Build to device** (⌘R)
6. **Trust developer on device**:
   - Settings → General → VPN & Device Management
   - Trust your Apple ID

### Limitations
- App expires after **7 days** (must rebuild)
- Maximum **3 apps** at a time
- No TestFlight or App Store access

---

## Stage 2: TestFlight Beta (Recommended)

TestFlight lets you share the game with up to 10,000 testers before App Store release.

### Requirements
- **Apple Developer Program** ($99/year)
- **App Store Connect** account
- Completed app with icon and screenshots

### Enrollment Process

1. **Join Apple Developer Program**:
   - Visit https://developer.apple.com/programs/
   - Enroll with your Apple ID
   - Pay $99 annual fee
   - Verification takes 24-48 hours

2. **Create App Store Connect App**:
   - Go to https://appstoreconnect.apple.com
   - Click "My Apps" → "+"
   - Fill in app details:
     - Name: "Nova iOS"
     - Bundle ID: `com.yourcompany.NovaIOS`
     - SKU: `NovaIOS001`
     - Primary Language: English

3. **Prepare App for Upload**:
   
   **A. Create App Icon** (required):
   ```
   Required sizes:
   - 1024×1024 (App Store)
   - 180×180 (iPhone)
   - 167×167 (iPad Pro)
   - 152×152 (iPad)
   - 120×120 (iPhone small)
   - 76×76 (iPad)
   ```
   
   Tools to create icons:
   - [AppIconGenerator.net](https://appicon.co)
   - Figma or Sketch
   - Photoshop or Pixelmator
   
   Add to Xcode:
   - Assets.xcassets → AppIcon
   - Drag all sizes into appropriate slots

   **B. Update Info.plist**:
   - Add privacy descriptions (required):
   ```xml
   <key>NSPhotoLibraryUsageDescription</key>
   <string>Share your achievements</string>
   ```

   **C. Archive the app**:
   - In Xcode: Product → Archive
   - Wait for build to complete
   - Opens Organizer window

4. **Upload to App Store Connect**:
   - In Organizer: Distribute App → App Store Connect
   - Choose "Upload"
   - Select automatic signing
   - Click "Upload"
   - Wait 5-10 minutes for processing

5. **Submit for TestFlight**:
   - In App Store Connect → TestFlight tab
   - Wait for "Processing" to finish (~15 min)
   - Add "Export Compliance" info (No encryption for this app)
   - Build changes to "Ready to Test"

6. **Invite Testers**:
   
   **Internal Testing** (up to 100 testers, instant):
   - Add testers by email in App Store Connect
   - They get email invitation
   - Install TestFlight app from App Store
   - Accept invite and install game
   
   **External Testing** (up to 10,000 testers, requires review):
   - Create test group
   - Add testers or create public link
   - Submit for Beta App Review (~24 hours)
   - Share TestFlight link with testers

### TestFlight Benefits
- ✅ No 7-day expiration
- ✅ Automatic updates
- ✅ Crash reports and analytics
- ✅ Tester feedback
- ✅ Up to 10,000 testers
- ✅ Builds last 90 days

---

## Stage 3: App Store Release

Once the game is polished (likely after Phase 5), you can release publicly.

### Requirements Checklist

#### Technical Requirements
- [ ] No crashes or major bugs
- [ ] Runs on iOS 16.0+
- [ ] Supports iPhone and iPad
- [ ] Works in landscape and portrait (or specify orientation)
- [ ] App icon (1024×1024)
- [ ] Launch screen
- [ ] Privacy policy (if collecting data)

#### Content Requirements
- [ ] Age rating (likely 9+ for mild fantasy violence)
- [ ] Screenshots (all required sizes):
  - 6.7" iPhone (1290×2796)
  - 6.5" iPhone (1284×2778)
  - 5.5" iPhone (1242×2208)
  - 12.9" iPad Pro (2048×2732)
- [ ] App preview video (optional but recommended)
- [ ] Description text
- [ ] Keywords
- [ ] Support URL
- [ ] Copyright notice

#### Legal Requirements
- [ ] No copyright infringement (Nova is trademarked by Ambrosia)
- [ ] No private APIs
- [ ] Follows Human Interface Guidelines
- [ ] COPPA compliant if targeting kids
- [ ] GDPR compliant if in EU

### Submission Process

1. **Prepare Metadata** in App Store Connect:
   - App Name: "Nova iOS - Space Adventure"
   - Subtitle: "Trade, Fight, Explore"
   - Description (up to 4000 characters)
   - Keywords: "space,trading,combat,rpg,exploration"
   - Category: Games → Simulation
   - Content Rights: Own or licensed

2. **Upload Screenshots**:
   - Use Xcode Simulator
   - Take screenshots at required sizes
   - Add text overlays to highlight features
   - Tools: Figma, Canva, Apple's Screenshots tool

3. **Set Pricing**:
   - Free (recommended for indie game)
   - Or: $0.99, $1.99, $2.99, etc.
   - Can monetize later with IAP

4. **Submit for Review**:
   - Click "Submit for Review"
   - Answer questionnaires:
     - Export compliance: No encryption
     - Advertising: No third-party ads (yet)
     - Content rights: Original work
   - Wait for review (typically 24-48 hours)

5. **Review Process**:
   - Apple tests the app manually
   - Checks for bugs, guideline violations, content issues
   - May request changes
   - Approval or rejection within 1-3 days

6. **Release Options**:
   - **Manual release**: Release when you click a button
   - **Automatic release**: Live immediately after approval
   - **Scheduled release**: Choose a date/time

---

## Continuous Deployment (Advanced)

### Fastlane Setup

Automate TestFlight uploads:

```ruby
# Fastfile
lane :beta do
  increment_build_number
  build_app(scheme: "NovaIOS")
  upload_to_testflight
end
```

### GitHub Actions CI/CD

```yaml
# .github/workflows/deploy.yml
name: Deploy to TestFlight
on:
  push:
    tags:
      - 'v*'
jobs:
  deploy:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build and upload
        run: fastlane beta
        env:
          FASTLANE_USER: ${{ secrets.APPLE_ID }}
          FASTLANE_PASSWORD: ${{ secrets.APP_SPECIFIC_PASSWORD }}
```

---

## Distribution Methods Comparison

| Method | Cost | Audience | Duration | Updates |
|--------|------|----------|----------|---------|
| Free Apple ID | $0 | You only | 7 days | Manual rebuild |
| Developer Account | $99/yr | Direct install | 1 year | Manual |
| TestFlight | $99/yr | 10k testers | 90 days | Automatic |
| App Store | $99/yr | Everyone | Forever | Automatic |
| Enterprise | $299/yr | Your org | 1 year | Custom |

---

## Recommended Path for This Project

### Phase 1 (Now)
- ✅ Test in Xcode Simulator (free, instant)

### Phase 2-3 (Development)
- Test on personal device with free Apple ID
- Share .ipa with close friends (requires their device IDs)

### Phase 4 (Beta Testing)
- Enroll in Apple Developer Program ($99)
- Upload to TestFlight
- Invite 10-50 beta testers
- Gather feedback

### Phase 5 (Polish & Release)
- Fix all bugs from beta testing
- Create marketing materials
- Submit to App Store
- 🎉 Public launch!

---

## Cost Summary

**Free Testing:**
- $0 - Simulator and personal device only
- Limited to 7-day installs

**Beta Testing:**
- $99/year - Apple Developer Program
- TestFlight access
- Up to 10,000 testers

**App Store Release:**
- $99/year - Apple Developer Program (same as above)
- 30% revenue share if selling app or IAP
- First $1M in revenue = 15% share (Small Business Program)

---

## Common Deployment Issues

### "Unable to install"
- Check device iOS version matches deployment target
- Verify provisioning profile matches device

### "App is damaged"
- Certificate or signing issue
- Clean build and try again
- Regenerate certificates in Developer Portal

### "Missing compliance info"
- Add export compliance in App Store Connect
- Most games don't use encryption

### Rejected for Guideline 4.3 (spam)
- Make app unique and valuable
- Add distinctive features
- Not applicable for original games

---

## Important Notes

### Copyright Notice
"Escape Velocity Nova" is a trademark of Ambrosia Software. This project should:
- Use a different name for App Store ("Nova iOS" is risky)
- Consider "Space Trader Legacy" or similar
- Include disclaimer: "Inspired by Escape Velocity Nova"
- Don't use any original game assets

### Age Rating
Likely **9+ for Infrequent/Mild:**
- Cartoon or Fantasy Violence (Phase 2: combat)
- No other concerning content

### Privacy Policy
Not required unless:
- Collecting user data
- Using analytics (AdMob, Firebase)
- Social features
- In-app purchases

---

## Next Steps

1. **Right now**: Test in Xcode Simulator (see TESTING.md)
2. **This week**: Test on your iPhone/iPad
3. **After Phase 2-3**: Consider TestFlight
4. **After Phase 5**: Submit to App Store

---

## Resources

- [App Store Connect](https://appstoreconnect.apple.com)
- [Apple Developer Portal](https://developer.apple.com)
- [App Store Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [TestFlight Documentation](https://developer.apple.com/testflight/)
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)

---

## Questions?

- **How long until I can play on my iPhone?**
  - 5 minutes if you have Xcode + free Apple ID

- **Do I need to pay $99 now?**
  - No, only for TestFlight or App Store

- **Can I make money from this?**
  - Yes, with IAP or paid app (requires $99 developer account)

- **How long does App Store review take?**
  - Usually 24-48 hours, sometimes up to a week

- **What if Apple rejects the app?**
  - Fix issues and resubmit (common for first-time developers)
