//
//  ContentView.swift
//  NovaIOS
//
//  Main view that hosts the game scene
//

import SwiftUI
import SpriteKit

struct ContentView: View {
    @StateObject private var gameState = GameState()
    
    var body: some View {
        ZStack {
            // Game Scene
            SpriteView(scene: createGameScene())
                .ignoresSafeArea()
            
            // Station Menu Overlay
            if gameState.showStationMenu {
                StationMenuView(gameState: gameState)
                    .transition(.move(edge: .bottom))
            }
            
            // HUD Overlay
            if !gameState.showStationMenu {
                HUDView(gameState: gameState)
            }
        }
        .animation(.easeInOut, value: gameState.showStationMenu)
    }
    
    private func createGameScene() -> GameScene {
        let scene = GameScene(gameState: gameState)
        scene.size = CGSize(width: UIScreen.main.bounds.width, 
                           height: UIScreen.main.bounds.height)
        scene.scaleMode = .aspectFill
        return scene
    }
}

#Preview {
    ContentView()
}
