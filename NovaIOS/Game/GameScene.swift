//
//  GameScene.swift
//  NovaIOS
//
//  Main SpriteKit game scene handling rendering and game logic
//

import SpriteKit
import CoreGraphics

class GameScene: SKScene {
    
    // Game State
    private var gameState: GameState
    private let starSystem = StarSystem.sol
    
    // Nodes
    private var playerNode: SKShapeNode!
    private var stationNode: SKShapeNode!
    private var cameraNode: SKCameraNode!
    private var backgroundNode: SKNode!
    
    // Player Physics
    private var playerVelocity = CGVector.zero
    private var playerRotationVelocity: CGFloat = 0
    private let ship = Ship.playerShip
    
    // Input
    private var touchLocation: CGPoint?
    private var isTouching = false
    
    // Landing
    var canLand: Bool = false
    
    init(gameState: GameState) {
        self.gameState = gameState
        super.init(size: .zero)
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    override func didMove(to view: SKView) {
        gameState.gameScene = self
        setupScene()
        setupBackground()
        setupStation()
        setupPlayer()
        setupCamera()
    }
    
    private func setupScene() {
        backgroundColor = SKColor(
            red: starSystem.backgroundColor.r,
            green: starSystem.backgroundColor.g,
            blue: starSystem.backgroundColor.b,
            alpha: 1.0
        )
        physicsWorld.gravity = .zero
    }
    
    private func setupBackground() {
        backgroundNode = SKNode()
        addChild(backgroundNode)
        
        // Add stars
        for _ in 0..<200 {
            let star = SKShapeNode(circleOfRadius: CGFloat.random(in: 0.5...2.0))
            star.fillColor = .white
            star.strokeColor = .clear
            star.position = CGPoint(
                x: CGFloat.random(in: -2000...2000),
                y: CGFloat.random(in: -2000...2000)
            )
            star.alpha = CGFloat.random(in: 0.3...1.0)
            backgroundNode.addChild(star)
        }
    }
    
    private func setupStation() {
        // Create station visual
        stationNode = SKShapeNode(circleOfRadius: 40)
        stationNode.fillColor = .gray
        stationNode.strokeColor = .white
        stationNode.lineWidth = 3
        stationNode.position = starSystem.stations[0].position
        stationNode.name = "station"
        
        // Add station details
        let innerCircle = SKShapeNode(circleOfRadius: 20)
        innerCircle.fillColor = .darkGray
        innerCircle.strokeColor = .lightGray
        innerCircle.lineWidth = 2
        stationNode.addChild(innerCircle)
        
        // Add docking ring
        let dockingRing = SKShapeNode(circleOfRadius: 60)
        dockingRing.fillColor = .clear
        dockingRing.strokeColor = .cyan
        dockingRing.lineWidth = 1
        dockingRing.alpha = 0.3
        stationNode.addChild(dockingRing)
        
        addChild(stationNode)
    }
    
    private func setupPlayer() {
        // Create player ship (triangle)
        let shipPath = CGMutablePath()
        shipPath.move(to: CGPoint(x: 0, y: 20))
        shipPath.addLine(to: CGPoint(x: -10, y: -10))
        shipPath.addLine(to: CGPoint(x: 0, y: -5))
        shipPath.addLine(to: CGPoint(x: 10, y: -10))
        shipPath.closeSubpath()
        
        playerNode = SKShapeNode(path: shipPath)
        playerNode.fillColor = .cyan
        playerNode.strokeColor = .white
        playerNode.lineWidth = 2
        playerNode.position = CGPoint(x: 300, y: 0)
        playerNode.name = "player"
        
        // Add engine glow
        let engineGlow = SKShapeNode(circleOfRadius: 5)
        engineGlow.fillColor = .orange
        engineGlow.strokeColor = .clear
        engineGlow.alpha = 0.7
        engineGlow.position = CGPoint(x: 0, y: -8)
        engineGlow.name = "engineGlow"
        playerNode.addChild(engineGlow)
        
        addChild(playerNode)
    }
    
    private func setupCamera() {
        cameraNode = SKCameraNode()
        camera = cameraNode
        addChild(cameraNode)
    }
    
    override func touchesBegan(_ touches: Set<UITouch>, with event: UIEvent?) {
        guard let touch = touches.first else { return }
        let location = touch.location(in: self)
        
        // Check if tapping station for landing
        if canLand {
            let stationTouchArea = stationNode.frame.insetBy(dx: -20, dy: -20)
            if stationTouchArea.contains(location) {
                gameState.landAtStation()
                return
            }
        }
        
        isTouching = true
        touchLocation = location
    }
    
    override func touchesMoved(_ touches: Set<UITouch>, with event: UIEvent?) {
        guard let touch = touches.first else { return }
        touchLocation = touch.location(in: self)
    }
    
    override func touchesEnded(_ touches: Set<UITouch>, with event: UIEvent?) {
        isTouching = false
        touchLocation = nil
    }
    
    override func touchesCancelled(_ touches: Set<UITouch>, with event: UIEvent?) {
        isTouching = false
        touchLocation = nil
    }
    
    override func update(_ currentTime: TimeInterval) {
        guard !gameState.showStationMenu else { return }
        
        let deltaTime: CGFloat = 1.0 / 60.0
        
        updatePlayerInput(deltaTime: deltaTime)
        updatePlayerPhysics(deltaTime: deltaTime)
        updateCamera()
        updateEngineEffects()
        checkLandingProximity()
        
        // Update fuel consumption
        if isTouching {
            gameState.fuel = max(0, gameState.fuel - 0.02)
        }
    }
    
    private func updatePlayerInput(deltaTime: CGFloat) {
        guard let touch = touchLocation, isTouching else {
            playerRotationVelocity *= 0.9
            return
        }
        
        // Calculate direction to touch
        let playerPos = playerNode.position
        let dx = touch.x - playerPos.x
        let dy = touch.y - playerPos.y
        let targetAngle = atan2(dy, dx) - .pi / 2
        
        // Calculate angle difference
        var angleDiff = targetAngle - playerNode.zRotation
        
        // Normalize angle to -π to π
        while angleDiff > .pi { angleDiff -= 2 * .pi }
        while angleDiff < -.pi { angleDiff += 2 * .pi }
        
        // Rotate towards target
        let turnSpeed = ship.turnRate * deltaTime
        if abs(angleDiff) < turnSpeed {
            playerNode.zRotation = targetAngle
            playerRotationVelocity = 0
        } else {
            playerRotationVelocity = angleDiff > 0 ? turnSpeed : -turnSpeed
        }
        
        // Apply thrust in forward direction
        let thrustDirection = CGVector(
            dx: sin(playerNode.zRotation),
            dy: -cos(playerNode.zRotation)
        )
        
        let thrust = ship.acceleration * deltaTime
        playerVelocity.dx += thrustDirection.dx * thrust
        playerVelocity.dy += thrustDirection.dy * thrust
    }
    
    private func updatePlayerPhysics(deltaTime: CGFloat) {
        // Apply velocity damping (space friction for gameplay)
        playerVelocity.dx *= 0.98
        playerVelocity.dy *= 0.98
        
        // Limit max speed
        let speed = sqrt(playerVelocity.dx * playerVelocity.dx + 
                        playerVelocity.dy * playerVelocity.dy)
        if speed > ship.maxSpeed {
            let scale = ship.maxSpeed / speed
            playerVelocity.dx *= scale
            playerVelocity.dy *= scale
        }
        
        // Update position
        playerNode.position.x += playerVelocity.dx * deltaTime
        playerNode.position.y += playerVelocity.dy * deltaTime
        
        // Update rotation
        playerNode.zRotation += playerRotationVelocity
    }
    
    private func updateCamera() {
        cameraNode.position = playerNode.position
    }
    
    private func updateEngineEffects() {
        guard let engineGlow = playerNode.childNode(withName: "engineGlow") as? SKShapeNode else {
            return
        }
        
        if isTouching {
            engineGlow.alpha = 0.7 + CGFloat.random(in: -0.2...0.3)
            
            // Add particle effect occasionally
            if Int.random(in: 0..<3) == 0 {
                let particle = SKShapeNode(circleOfRadius: 2)
                particle.fillColor = .orange
                particle.strokeColor = .clear
                particle.alpha = 0.8
                particle.position = engineGlow.position
                playerNode.addChild(particle)
                
                let fadeOut = SKAction.fadeOut(withDuration: 0.3)
                let remove = SKAction.removeFromParent()
                particle.run(SKAction.sequence([fadeOut, remove]))
            }
        } else {
            engineGlow.alpha = 0.2
        }
    }
    
    private func checkLandingProximity() {
        let distance = hypot(
            playerNode.position.x - stationNode.position.x,
            playerNode.position.y - stationNode.position.y
        )
        
        let previousCanLand = canLand
        canLand = distance < starSystem.stations[0].landingRadius
        
        // Update visual feedback
        if canLand != previousCanLand {
            if canLand {
                let pulse = SKAction.sequence([
                    SKAction.scale(to: 1.1, duration: 0.3),
                    SKAction.scale(to: 1.0, duration: 0.3)
                ])
                stationNode.run(SKAction.repeatForever(pulse), withKey: "pulse")
            } else {
                stationNode.removeAction(forKey: "pulse")
                stationNode.setScale(1.0)
            }
        }
    }
}
