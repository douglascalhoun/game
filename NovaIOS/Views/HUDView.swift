//
//  HUDView.swift
//  NovaIOS
//
//  Heads-up display showing ship status
//

import SwiftUI

struct HUDView: View {
    @ObservedObject var gameState: GameState
    
    var body: some View {
        VStack {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text("System: \(gameState.currentSystem)")
                        .font(.system(size: 14, weight: .semibold))
                    Text("Credits: \(gameState.credits)")
                        .font(.system(size: 12))
                }
                .padding(8)
                .background(Color.black.opacity(0.6))
                .cornerRadius(8)
                
                Spacer()
                
                VStack(alignment: .trailing, spacing: 4) {
                    StatusBar(label: "Shield", value: gameState.playerShield, color: .blue)
                    StatusBar(label: "Armor", value: gameState.playerArmor, color: .green)
                    StatusBar(label: "Fuel", value: gameState.fuel, color: .orange)
                }
                .padding(8)
                .background(Color.black.opacity(0.6))
                .cornerRadius(8)
            }
            .padding()
            
            Spacer()
            
            // Landing hint
            if let scene = gameState.gameScene, scene.canLand {
                Text("Tap Station to Land")
                    .font(.system(size: 16, weight: .bold))
                    .foregroundColor(.white)
                    .padding(12)
                    .background(Color.blue.opacity(0.8))
                    .cornerRadius(12)
                    .padding(.bottom, 100)
            }
        }
    }
}

struct StatusBar: View {
    let label: String
    let value: Double
    let color: Color
    
    var body: some View {
        HStack(spacing: 4) {
            Text(label)
                .font(.system(size: 10))
                .frame(width: 45, alignment: .leading)
            
            GeometryReader { geometry in
                ZStack(alignment: .leading) {
                    Rectangle()
                        .fill(Color.gray.opacity(0.3))
                    
                    Rectangle()
                        .fill(color)
                        .frame(width: geometry.size.width * CGFloat(value / 100.0))
                }
            }
            .frame(width: 60, height: 8)
            .cornerRadius(4)
            
            Text("\(Int(value))")
                .font(.system(size: 10))
                .frame(width: 25, alignment: .trailing)
        }
    }
}

#Preview {
    HUDView(gameState: GameState())
        .background(Color.black)
}
