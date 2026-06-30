//
//  StarSystem.swift
//  NovaIOS
//
//  Star system model containing stations and celestial bodies
//

import Foundation
import CoreGraphics

struct StarSystem {
    var name: String
    var stations: [Station]
    var backgroundColor: (r: Double, g: Double, b: Double)
    
    static let sol = StarSystem(
        name: "Sol",
        stations: [Station.alphaStation],
        backgroundColor: (r: 0.05, g: 0.05, b: 0.15)
    )
}
