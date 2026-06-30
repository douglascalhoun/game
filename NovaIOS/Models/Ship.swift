//
//  Ship.swift
//  NovaIOS
//
//  Ship model representing player and NPC ships
//

import Foundation
import CoreGraphics

struct Ship {
    var mass: CGFloat
    var maxSpeed: CGFloat
    var acceleration: CGFloat
    var turnRate: CGFloat
    var maxShield: CGFloat
    var maxArmor: CGFloat
    var cargoSpace: Int
    
    static let playerShip = Ship(
        mass: 100,
        maxSpeed: 300,
        acceleration: 150,
        turnRate: 3.0,
        maxShield: 100,
        maxArmor: 100,
        cargoSpace: 30
    )
}
