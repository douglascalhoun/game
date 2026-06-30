//
//  GameState.swift
//  NovaIOS
//
//  Observable game state shared between SwiftUI and SpriteKit
//

import Foundation
import Combine

class GameState: ObservableObject {
    @Published var credits: Int = 10000
    @Published var currentSystem: String = "Sol"
    @Published var showStationMenu: Bool = false
    @Published var playerShield: Double = 100.0
    @Published var playerArmor: Double = 100.0
    @Published var fuel: Double = 100.0
    @Published var cargoUsed: Int = 0
    @Published var cargoCapacity: Int = 30
    
    weak var gameScene: GameScene?
    
    func landAtStation() {
        showStationMenu = true
    }
    
    func departStation() {
        showStationMenu = false
    }
}
