# Quick Start - Nova iOS

**Want to play the game in 5 minutes?** Follow these steps:

---

## Prerequisites

- **Mac** with macOS 12.0+
- **Xcode** 14.0+ (free from Mac App Store)

Don't have a Mac? See `TESTING.md` for alternatives.

---

## Steps

### 1. Get the Code

```bash
git clone https://github.com/douglascalhoun/game.git
cd game
git checkout cursor/phase1-proof-of-concept-a198
```

### 2. Open in Xcode

```bash
open NovaIOS.xcodeproj
```

### 3. Select a Device

Click the device dropdown (top left) → Choose **iPhone 15 Pro**

### 4. Run It

Press `⌘R` or click the ▶️ Play button

### 5. Play!

- **Fly**: Touch anywhere on screen
- **Land**: Fly near station → tap it
- **Refuel**: In menu → Refuel tab
- **Launch**: Tap "Depart Station"

---

## Testing on Your iPhone

1. **Plug in** your iPhone via USB
2. **Select it** in Xcode's device dropdown
3. **Change Bundle ID**:
   - Click project → Signing & Capabilities
   - Change `com.example.NovaIOS` to `com.YOURNAME.NovaIOS`
4. **Press** `⌘R` to run
5. **Trust** yourself in iPhone Settings → General → Device Management

The app works for 7 days, then rebuild.

---

## Troubleshooting

**"No scheme"**: Product → Scheme → NovaIOS

**Simulator won't start**: Quit Xcode, reopen

**Build failed**: Product → Clean Build Folder (⌘⇧K)

**More help**: See `TESTING.md`

---

## What's Next?

- Read `README.md` for project overview
- See `TESTING.md` for complete testing guide
- Check `DEPLOYMENT.md` for TestFlight/App Store
- Read `PHASE1_PLAN.md` for technical details

---

## Game Controls Reference

| Action | How |
|--------|-----|
| Fly ship | Touch anywhere |
| Change direction | Touch different location |
| Land at station | Fly close + tap station |
| Open menu | Land at station |
| Refuel | Menu → Refuel tab → Refuel button |
| Depart | Menu → Depart Station button |

---

**Enjoy flying! 🚀**
