# Nova iOS - Escape Velocity Nova Remake

A simple iOS remake of the classic space trading and combat game Escape Velocity Nova, built with SwiftUI and SpriteKit.

## Project Status: Phase 1 (Proof of Concept) ✅

### Implemented Features

**Phase 1 - Proof of Concept:**
- ✅ Single star system (Sol) with one space station
- ✅ Player ship with physics-based movement
- ✅ Touch controls for ship navigation
- ✅ Camera follows player ship
- ✅ Landing mechanics at space station
- ✅ Station menu UI with tabs (Info, Refuel, Trade)
- ✅ HUD showing ship status (shields, armor, fuel)
- ✅ Refueling system with credit cost
- ✅ Visual effects (engine glow, particles, stars)
- ✅ Landing proximity detection
- ✅ Fuel consumption during flight

### How to Play

1. **Movement**: Touch anywhere on screen - your ship will rotate and thrust toward that location
2. **Landing**: Fly close to the space station (within the cyan ring) and tap it to land
3. **Station Menu**: While docked, you can:
   - View system info and your ship status
   - Refuel your ship (costs 2 credits per fuel unit)
   - Access trading (coming in Phase 4)
4. **Departing**: Tap "Depart Station" to launch back into space

### Project Structure

```
NovaIOS/
├── NovaIOSApp.swift          # App entry point
├── ContentView.swift         # Main view coordinator
├── GameState.swift           # Observable game state
├── Game/
│   └── GameScene.swift       # SpriteKit scene (physics, rendering)
├── Models/
│   ├── Ship.swift           # Ship specifications
│   ├── Station.swift        # Station data
│   └── StarSystem.swift     # System layout
└── Views/
    ├── HUDView.swift        # Heads-up display
    └── StationMenuView.swift # Station interface
```

### Technical Details

- **Platform**: iOS 16.0+
- **Language**: Swift 5.0
- **Frameworks**: SwiftUI, SpriteKit
- **Orientation**: Landscape only
- **Architecture**: MVVM with reactive state management

### Building the Project

1. Open `NovaIOS.xcodeproj` in Xcode 14.0+
2. Select your target device or simulator
3. Build and run (⌘R)

### Next Steps (Upcoming Phases)

**Phase 2 - Basic Combat:**
- Enemy ships and AI
- Weapon systems
- Combat mechanics
- Damage system

**Phase 3 - Multi-System Universe:**
- Multiple star systems
- Hyperspace jumps
- System map navigation

**Phase 4 - Economy & Progression:**
- Commodity trading
- Ship upgrades
- Cargo management

**Phase 5 - Mission System:**
- Mission board
- Quest types (delivery, combat, patrol)
- Rewards and progression

## Development Notes

### Current Game Balance
- Starting credits: 10,000
- Fuel consumption: 0.02% per frame while thrusting
- Refuel cost: 2 credits per unit
- Ship stats: Max speed 300, Acceleration 150, Turn rate 3.0

### Known Limitations
- Single system only (Phase 1 scope)
- No combat yet (Phase 2)
- Trading UI placeholder (Phase 4)
- No persistence/save system yet

## License

This is a fan remake for educational purposes. Escape Velocity Nova is originally by Ambrosia Software.
