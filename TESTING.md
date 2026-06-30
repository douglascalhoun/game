# Testing Guide - Nova iOS

## Quick Start Testing (macOS Required)

iOS development requires macOS and Xcode. Here's how to test the game:

---

## Option 1: Test in Xcode Simulator (Easiest)

### Prerequisites
- macOS 12.0 or later
- Xcode 14.0 or later (free from Mac App Store)
- No Apple Developer account needed for simulator testing

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/douglascalhoun/game.git
   cd game
   git checkout cursor/phase1-proof-of-concept-a198
   ```

2. **Open the project**
   ```bash
   open NovaIOS.xcodeproj
   ```
   
   Or: Double-click `NovaIOS.xcodeproj` in Finder

3. **Select a simulator**
   - Click the device selector in Xcode's toolbar (top left)
   - Choose any iPhone or iPad simulator
   - Recommended: **iPhone 15 Pro** or **iPad Pro 12.9"**

4. **Build and Run**
   - Press `⌘R` or click the Play button
   - Wait for the simulator to launch (first time may take a minute)
   - The game will start automatically in landscape mode

5. **Play the game!**
   - Touch anywhere to fly toward that location
   - Fly near the space station (cyan ring)
   - Tap the station to land and open the menu
   - Refuel if needed
   - Depart and fly around

### Simulator Controls
- **Click** = Touch
- **Option + Click** = Pinch to zoom (not used in game)
- **⌘ + Arrow Keys** = Rotate device
- **⌘ + K** = Toggle software keyboard

---

## Option 2: Test on Real iPhone/iPad

Testing on a real device provides the true gameplay experience with actual touch input.

### For Free (No Developer Account)

1. **Connect your device** via USB to your Mac
2. **Trust the computer** when prompted on your device
3. **Select your device** in Xcode's device selector
4. **Change the Bundle ID** (required):
   - Click on the project in the left sidebar
   - Under "Signing & Capabilities"
   - Change Bundle Identifier to something unique (e.g., `com.yourname.NovaIOS`)
5. **Select "Automatically manage signing"**
6. **Choose your Apple ID** as the team
7. **Build and Run** (⌘R)
8. **Trust the developer** on your device:
   - Go to Settings → General → VPN & Device Management
   - Tap your Apple ID
   - Tap "Trust"

**Limitations with free account:**
- App expires after 7 days (rebuild to refresh)
- Limited to 3 apps at a time on device

### With Apple Developer Account ($99/year)

1. **Add your account** in Xcode → Settings → Accounts
2. **Select your team** in project settings
3. **Build and run** - no 7-day expiration!

---

## Option 3: Cloud Testing Services

If you don't have a Mac:

### BrowserStack, Sauce Labs, or AWS Device Farm
- Upload the `.app` file (requires building on Mac first)
- Test remotely in browser
- $$$ Paid services

### MacStadium or MacinCloud
- Rent a Mac in the cloud
- Access via VNC
- Install Xcode and test normally

---

## Testing Checklist

Use this to verify all Phase 1 features work:

### Flight Controls ✓
- [ ] Ship rotates toward touch location
- [ ] Ship moves smoothly when touching screen
- [ ] Ship maintains momentum when not touching
- [ ] Engine glow appears when thrusting
- [ ] Particle effects trail behind ship

### HUD ✓
- [ ] Shields bar displays correctly (blue)
- [ ] Armor bar displays correctly (green)
- [ ] Fuel bar displays correctly (orange)
- [ ] Credits display correct amount
- [ ] System name shows "Sol"
- [ ] All bars update in real-time

### Landing System ✓
- [ ] Can fly toward space station
- [ ] Station pulses when in landing range
- [ ] "Tap Station to Land" message appears when close
- [ ] Tapping station opens menu
- [ ] Menu slides up smoothly

### Station Menu ✓
- [ ] Info tab shows correct information
- [ ] Refuel tab shows current fuel level
- [ ] Refuel button works (deducts credits)
- [ ] Cannot refuel without enough credits
- [ ] "Depart Station" button closes menu
- [ ] X button closes menu
- [ ] Menu tabs are tappable and switch correctly

### Resources ✓
- [ ] Fuel depletes when thrusting
- [ ] Credits decrease when refueling
- [ ] Refuel cost calculation is correct (2 credits/unit)
- [ ] Can't refuel when tanks are full

### Performance ✓
- [ ] Game runs at 60 FPS
- [ ] No visible lag or stuttering
- [ ] Touch input is responsive
- [ ] Menu animations are smooth
- [ ] No crashes or errors in console

### Visual Polish ✓
- [ ] Starfield visible in background
- [ ] Ship triangle renders correctly
- [ ] Station has docking ring
- [ ] Engine particles fade out naturally
- [ ] Camera follows player smoothly

---

## Debugging Tips

### View Console Logs
- In Xcode, open the Debug area (⌘⇧Y)
- Console shows print statements and errors

### Performance Monitoring
- While running, click "Debug Navigator" (⌘7)
- View CPU, Memory, and FPS metrics

### Common Issues

**App won't build:**
- Clean build folder: Product → Clean Build Folder (⌘⇧K)
- Restart Xcode
- Delete DerivedData: `~/Library/Developer/Xcode/DerivedData`

**Simulator is slow:**
- Close other apps
- Use a newer simulator (iPhone 15 vs iPhone 8)
- Reduce graphics quality in settings

**Touch not working:**
- Make sure simulator window is focused
- Try clicking different areas
- Restart the simulator

**App crashes on launch:**
- Check console for error messages
- Verify all files are included in build target
- Clean and rebuild

---

## Performance Testing

### Target Metrics
- **Frame Rate**: 60 FPS constant
- **Memory Usage**: < 100 MB
- **Launch Time**: < 2 seconds
- **Touch Latency**: < 16ms (imperceptible)

### How to Measure

1. **FPS**: Xcode Debug Navigator while running
2. **Memory**: Instruments → Allocations
3. **Launch Time**: Instruments → App Launch
4. **Touch Latency**: Feel test (should be instant)

---

## Automated Testing (Future)

For Phase 2+, we can add:

```swift
// XCTest unit tests
func testShipPhysics() {
    let ship = Ship.playerShip
    XCTAssertEqual(ship.maxSpeed, 300)
}

// XCTest UI tests
func testLanding() {
    let app = XCUIApplication()
    app.launch()
    // Tap station location
    // Verify menu appears
}
```

---

## Next Steps

Once testing is complete:
1. See `DEPLOYMENT.md` for App Store submission
2. Share TestFlight builds with friends
3. Gather feedback for Phase 2
4. Report any bugs in GitHub Issues

---

## Need Help?

**Xcode won't run?**
- Install from Mac App Store (it's free)
- Requires ~15 GB disk space

**Don't have a Mac?**
- Borrow one from a friend
- Visit an Apple Store
- Use cloud Mac service
- Consider buying a used Mac Mini

**Other issues?**
- Check Xcode console for errors
- Search error messages online
- Open a GitHub issue with details
