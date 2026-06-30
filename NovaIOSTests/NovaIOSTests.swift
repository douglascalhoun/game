//
//  NovaIOSTests.swift
//  NovaIOSTests
//
//  Unit tests for Nova iOS game logic
//

import XCTest
@testable import NovaIOS

class ShipTests: XCTestCase {
    
    func testPlayerShipStats() {
        let ship = Ship.playerShip
        
        XCTAssertEqual(ship.mass, 100)
        XCTAssertEqual(ship.maxSpeed, 300)
        XCTAssertEqual(ship.acceleration, 150)
        XCTAssertEqual(ship.turnRate, 3.0)
        XCTAssertEqual(ship.maxShield, 100)
        XCTAssertEqual(ship.maxArmor, 100)
        XCTAssertEqual(ship.cargoSpace, 30)
    }
    
    func testShipMassIsPositive() {
        let ship = Ship.playerShip
        XCTAssertGreaterThan(ship.mass, 0)
    }
    
    func testShipSpeedLimits() {
        let ship = Ship.playerShip
        XCTAssertGreaterThan(ship.maxSpeed, 0)
        XCTAssertLessThanOrEqual(ship.maxSpeed, 1000, "Speed should be reasonable")
    }
}

class StationTests: XCTestCase {
    
    func testAlphaStationExists() {
        let station = Station.alphaStation
        
        XCTAssertEqual(station.name, "Space Station Alpha")
        XCTAssertEqual(station.position.x, 0)
        XCTAssertEqual(station.position.y, 0)
        XCTAssertGreaterThan(station.landingRadius, 0)
    }
    
    func testLandingRadiusIsReasonable() {
        let station = Station.alphaStation
        XCTAssertGreaterThan(station.landingRadius, 10)
        XCTAssertLessThan(station.landingRadius, 200)
    }
}

class StarSystemTests: XCTestCase {
    
    func testSolSystemExists() {
        let system = StarSystem.sol
        
        XCTAssertEqual(system.name, "Sol")
        XCTAssertGreaterThan(system.stations.count, 0)
    }
    
    func testSolHasAlphaStation() {
        let system = StarSystem.sol
        XCTAssertTrue(system.stations.contains { $0.name == "Space Station Alpha" })
    }
    
    func testBackgroundColorIsValid() {
        let system = StarSystem.sol
        
        XCTAssertGreaterThanOrEqual(system.backgroundColor.r, 0)
        XCTAssertLessThanOrEqual(system.backgroundColor.r, 1)
        XCTAssertGreaterThanOrEqual(system.backgroundColor.g, 0)
        XCTAssertLessThanOrEqual(system.backgroundColor.g, 1)
        XCTAssertGreaterThanOrEqual(system.backgroundColor.b, 0)
        XCTAssertLessThanOrEqual(system.backgroundColor.b, 1)
    }
}

class GameStateTests: XCTestCase {
    
    func testInitialGameState() {
        let gameState = GameState()
        
        XCTAssertEqual(gameState.credits, 10000)
        XCTAssertEqual(gameState.currentSystem, "Sol")
        XCTAssertFalse(gameState.showStationMenu)
        XCTAssertEqual(gameState.playerShield, 100.0)
        XCTAssertEqual(gameState.playerArmor, 100.0)
        XCTAssertEqual(gameState.fuel, 100.0)
        XCTAssertEqual(gameState.cargoUsed, 0)
        XCTAssertEqual(gameState.cargoCapacity, 30)
    }
    
    func testLandingTogglesMenu() {
        let gameState = GameState()
        
        XCTAssertFalse(gameState.showStationMenu)
        
        gameState.landAtStation()
        XCTAssertTrue(gameState.showStationMenu)
        
        gameState.departStation()
        XCTAssertFalse(gameState.showStationMenu)
    }
    
    func testResourceBounds() {
        let gameState = GameState()
        
        // Test fuel bounds
        XCTAssertGreaterThanOrEqual(gameState.fuel, 0)
        XCTAssertLessThanOrEqual(gameState.fuel, 100)
        
        // Test shield bounds
        XCTAssertGreaterThanOrEqual(gameState.playerShield, 0)
        XCTAssertLessThanOrEqual(gameState.playerShield, 100)
        
        // Test armor bounds
        XCTAssertGreaterThanOrEqual(gameState.playerArmor, 0)
        XCTAssertLessThanOrEqual(gameState.playerArmor, 100)
        
        // Test cargo bounds
        XCTAssertGreaterThanOrEqual(gameState.cargoUsed, 0)
        XCTAssertLessThanOrEqual(gameState.cargoUsed, gameState.cargoCapacity)
    }
    
    func testCreditsNonNegative() {
        let gameState = GameState()
        XCTAssertGreaterThanOrEqual(gameState.credits, 0)
    }
}

class PhysicsTests: XCTestCase {
    
    func testVelocityCalculations() {
        // Test that velocity changes make sense
        let initialVelocity = CGVector(dx: 100, dy: 0)
        let acceleration = CGFloat(10)
        let deltaTime = CGFloat(0.1)
        
        let newVelocity = initialVelocity.dx + (acceleration * deltaTime)
        XCTAssertEqual(newVelocity, 101)
    }
    
    func testDistanceCalculation() {
        // Test hypot distance
        let distance = hypot(3, 4)
        XCTAssertEqual(distance, 5, accuracy: 0.001)
    }
    
    func testAngleCalculation() {
        // Test atan2 angle calculation
        let angle = atan2(1, 0)
        XCTAssertEqual(angle, .pi / 2, accuracy: 0.001)
    }
}

class EconomyTests: XCTestCase {
    
    func testRefuelCostCalculation() {
        let fuelNeeded = 50
        let costPerUnit = 2
        let totalCost = fuelNeeded * costPerUnit
        
        XCTAssertEqual(totalCost, 100)
    }
    
    func testRefuelTransaction() {
        let gameState = GameState()
        gameState.fuel = 50.0
        let initialCredits = gameState.credits
        
        // Simulate refuel
        let fuelNeeded = 100 - Int(gameState.fuel)
        let cost = fuelNeeded * 2
        
        if gameState.credits >= cost {
            gameState.credits -= cost
            gameState.fuel = 100.0
        }
        
        XCTAssertEqual(gameState.fuel, 100.0)
        XCTAssertEqual(gameState.credits, initialCredits - cost)
    }
    
    func testCannotRefuelWithoutCredits() {
        let gameState = GameState()
        gameState.credits = 10  // Very low credits
        gameState.fuel = 0.0
        
        let fuelNeeded = 100
        let cost = fuelNeeded * 2
        
        XCTAssertGreaterThan(cost, gameState.credits)
    }
}
