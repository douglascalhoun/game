//
//  Station.swift
//  NovaIOS
//
//  Space station model
//

import Foundation
import CoreGraphics

struct Station {
    var name: String
    var position: CGPoint
    var landingRadius: CGFloat
    
    static let alphaStation = Station(
        name: "Space Station Alpha",
        position: CGPoint(x: 0, y: 0),
        landingRadius: 80
    )
}
