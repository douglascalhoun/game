//
//  StationMenuView.swift
//  NovaIOS
//
//  Station menu for trading, outfitting, and missions
//

import SwiftUI

struct StationMenuView: View {
    @ObservedObject var gameState: GameState
    @State private var selectedTab = 0
    
    var body: some View {
        VStack(spacing: 0) {
            Spacer()
            
            VStack(spacing: 0) {
                // Header
                HStack {
                    Text("Space Station Alpha")
                        .font(.title2)
                        .fontWeight(.bold)
                    
                    Spacer()
                    
                    Button(action: {
                        gameState.departStation()
                    }) {
                        Image(systemName: "xmark.circle.fill")
                            .font(.title2)
                            .foregroundColor(.gray)
                    }
                }
                .padding()
                .background(Color(UIColor.systemBackground))
                
                Divider()
                
                // Tab Selection
                Picker("Menu", selection: $selectedTab) {
                    Text("Info").tag(0)
                    Text("Refuel").tag(1)
                    Text("Trade").tag(2)
                }
                .pickerStyle(.segmented)
                .padding()
                
                // Content
                TabView(selection: $selectedTab) {
                    InfoTabView(gameState: gameState)
                        .tag(0)
                    
                    RefuelTabView(gameState: gameState)
                        .tag(1)
                    
                    TradeTabView(gameState: gameState)
                        .tag(2)
                }
                .frame(height: 400)
                
                // Depart Button
                Button(action: {
                    gameState.departStation()
                }) {
                    Text("Depart Station")
                        .font(.headline)
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color.blue)
                        .cornerRadius(12)
                }
                .padding()
            }
            .background(Color(UIColor.systemBackground))
            .cornerRadius(20)
            .shadow(radius: 20)
        }
    }
}

struct InfoTabView: View {
    @ObservedObject var gameState: GameState
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Welcome to Space Station Alpha!")
                .font(.headline)
            
            Text("This station offers basic services including refueling and commodity trading.")
                .font(.body)
                .foregroundColor(.secondary)
            
            Divider()
            
            VStack(alignment: .leading, spacing: 8) {
                InfoRow(label: "System", value: gameState.currentSystem)
                InfoRow(label: "Your Credits", value: "\(gameState.credits)")
                InfoRow(label: "Cargo", value: "\(gameState.cargoUsed) / \(gameState.cargoCapacity) tons")
            }
            
            Spacer()
        }
        .padding()
    }
}

struct RefuelTabView: View {
    @ObservedObject var gameState: GameState
    
    var body: some View {
        VStack(spacing: 20) {
            Text("Fuel Status")
                .font(.headline)
            
            HStack {
                Text("Current Fuel:")
                Spacer()
                Text("\(Int(gameState.fuel))%")
                    .fontWeight(.semibold)
            }
            .padding()
            .background(Color.gray.opacity(0.1))
            .cornerRadius(8)
            
            if gameState.fuel < 100 {
                let fuelNeeded = 100 - Int(gameState.fuel)
                let cost = fuelNeeded * 2
                
                VStack(spacing: 12) {
                    Text("Refuel to 100%")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                    
                    Text("Cost: \(cost) credits")
                        .font(.title3)
                        .fontWeight(.bold)
                    
                    Button(action: {
                        if gameState.credits >= cost {
                            gameState.credits -= cost
                            gameState.fuel = 100.0
                        }
                    }) {
                        Text(gameState.credits >= cost ? "Refuel" : "Not Enough Credits")
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(gameState.credits >= cost ? Color.green : Color.gray)
                            .cornerRadius(8)
                    }
                    .disabled(gameState.credits < cost)
                }
            } else {
                Text("Your tanks are full!")
                    .font(.title3)
                    .foregroundColor(.green)
                    .padding()
            }
            
            Spacer()
        }
        .padding()
    }
}

struct TradeTabView: View {
    @ObservedObject var gameState: GameState
    
    var body: some View {
        VStack {
            Text("Commodity Trading")
                .font(.headline)
                .padding()
            
            Text("Trading system coming in Phase 4!")
                .font(.subheadline)
                .foregroundColor(.secondary)
                .padding()
            
            Spacer()
        }
    }
}

struct InfoRow: View {
    let label: String
    let value: String
    
    var body: some View {
        HStack {
            Text(label)
                .foregroundColor(.secondary)
            Spacer()
            Text(value)
                .fontWeight(.semibold)
        }
    }
}

#Preview {
    StationMenuView(gameState: GameState())
}
