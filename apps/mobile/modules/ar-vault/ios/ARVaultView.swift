import ARKit
import ExpoModulesCore
import RealityKit
import UIKit

/// RealityKit AR view that renders holdings as procedural geometry anchored to a
/// detected horizontal plane. No 3D asset pipeline: every mesh is generated from
/// RealityKit primitives, so the visuals are driven directly by the data.
public class ARVaultView: ExpoView {
  private let arView = ARView(frame: .zero, cameraMode: .ar, automaticallyConfigureSession: false)
  private let coachingOverlay = ARCoachingOverlayView()
  private var pending: [ARVaultItemRecord] = []

  // Metres. Tuned for a table-top scene viewed from ~1m away.
  private static let maxHeight: Float = 0.40
  private static let minHeight: Float = 0.02
  private static let columnWidth: Float = 0.05
  private static let columnSpacing: Float = 0.07

  public required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    clipsToBounds = true

    addSubview(arView)

    // Apple's own "move your phone to find a surface" guidance — better than
    // anything hand-rolled, and it disappears once a plane is found.
    coachingOverlay.session = arView.session
    coachingOverlay.goal = .horizontalPlane
    coachingOverlay.activatesAutomatically = true
    coachingOverlay.translatesAutoresizingMaskIntoConstraints = false
    addSubview(coachingOverlay)
    NSLayoutConstraint.activate([
      coachingOverlay.leadingAnchor.constraint(equalTo: leadingAnchor),
      coachingOverlay.trailingAnchor.constraint(equalTo: trailingAnchor),
      coachingOverlay.topAnchor.constraint(equalTo: topAnchor),
      coachingOverlay.bottomAnchor.constraint(equalTo: bottomAnchor),
    ])

    startSession()
  }

  public override func layoutSubviews() {
    super.layoutSubviews()
    arView.frame = bounds
  }

  private func startSession() {
    guard ARWorldTrackingConfiguration.isSupported else { return }
    let config = ARWorldTrackingConfiguration()
    config.planeDetection = [.horizontal]
    config.environmentTexturing = .automatic
    arView.session.run(config, options: [.resetTracking, .removeExistingAnchors])
  }

  /// Called from the `items` prop. Rebuilds the scene wholesale — the item count
  /// is small (one per category) so diffing would be more code than it saves.
  func render(_ items: [ARVaultItemRecord]) {
    pending = items
    arView.scene.anchors.removeAll()
    guard !items.isEmpty else { return }

    let anchor = AnchorEntity(plane: .horizontal, classification: .any, minimumBounds: [0.2, 0.2])
    let totalWidth = Float(items.count - 1) * Self.columnSpacing
    let startX = -totalWidth / 2

    for (index, item) in items.enumerated() {
      let x = startX + Float(index) * Self.columnSpacing
      let entity = makeEntity(for: item)
      entity.position = [x, entity.position.y, 0]
      anchor.addChild(entity)

      if let label = makeLabel(item.label) {
        // Laid flat on the surface in front of its column, readable from above.
        // A camera-facing label would need BillboardComponent, which is iOS 18+.
        label.position = [x, 0.002, Self.columnWidth + 0.02]
        anchor.addChild(label)
      }
    }

    arView.scene.addAnchor(anchor)
  }

  // MARK: - Geometry

  private func height(for magnitude: Double) -> Float {
    let clamped = Float(max(0, min(1, magnitude)))
    return Self.minHeight + clamped * (Self.maxHeight - Self.minHeight)
  }

  private func makeEntity(for item: ARVaultItemRecord) -> ModelEntity {
    let h = height(for: item.magnitude)

    switch item.kind {
    case "gold":
      // A stack of bars, so quantity reads as physical accumulation.
      return goldStack(totalHeight: h)
    case "land":
      // Land is area, not height: a flat slab that grows outward.
      let side = 0.06 + Float(max(0, min(1, item.magnitude))) * 0.20
      let mesh = MeshResource.generatePlane(width: side, depth: side, cornerRadius: 0.008)
      let entity = ModelEntity(mesh: mesh, materials: [material(for: item.kind)])
      entity.position.y = 0.001
      return entity
    case "shield":
      // Protection reads as an enclosing dome rather than a quantity.
      let mesh = MeshResource.generateSphere(radius: max(0.02, h / 2))
      let entity = ModelEntity(mesh: mesh, materials: [material(for: item.kind)])
      entity.position.y = h / 2
      return entity
    default:
      let mesh = MeshResource.generateBox(
        width: Self.columnWidth, height: h, depth: Self.columnWidth, cornerRadius: 0.004)
      let entity = ModelEntity(mesh: mesh, materials: [material(for: item.kind)])
      entity.position.y = h / 2
      return entity
    }
  }

  private func goldStack(totalHeight: Float) -> ModelEntity {
    let barHeight: Float = 0.012
    let gap: Float = 0.002
    let count = max(1, Int(totalHeight / (barHeight + gap)))
    let container = ModelEntity()
    let mat = material(for: "gold")

    for i in 0..<count {
      let mesh = MeshResource.generateBox(
        width: Self.columnWidth, height: barHeight, depth: Self.columnWidth * 0.6,
        cornerRadius: 0.002)
      let bar = ModelEntity(mesh: mesh, materials: [mat])
      bar.position.y = barHeight / 2 + Float(i) * (barHeight + gap)
      container.addChild(bar)
    }
    container.position.y = 0
    return container
  }

  private func material(for kind: String) -> SimpleMaterial {
    switch kind {
    case "gold":
      return SimpleMaterial(color: UIColor(red: 0.83, green: 0.66, blue: 0.26, alpha: 1),
                            roughness: 0.25, isMetallic: true)
    case "land":
      return SimpleMaterial(color: UIColor(red: 0.35, green: 0.48, blue: 0.42, alpha: 1),
                            roughness: 0.9, isMetallic: false)
    case "shield":
      return SimpleMaterial(color: UIColor(red: 0.31, green: 0.38, blue: 0.45, alpha: 1),
                            roughness: 0.4, isMetallic: false)
    default:
      return SimpleMaterial(color: UIColor(red: 0.16, green: 0.47, blue: 0.84, alpha: 1),
                            roughness: 0.35, isMetallic: false)
    }
  }

  private func makeLabel(_ text: String) -> ModelEntity? {
    guard !text.isEmpty else { return nil }
    let mesh = MeshResource.generateText(
      text,
      extrusionDepth: 0.001,
      font: .systemFont(ofSize: 0.018, weight: .semibold),
      containerFrame: .zero,
      alignment: .center,
      lineBreakMode: .byTruncatingTail)
    let entity = ModelEntity(
      mesh: mesh, materials: [SimpleMaterial(color: .white, roughness: 1, isMetallic: false)])
    // Rotate from RealityKit's default vertical text plane down onto the surface.
    entity.orientation = simd_quatf(angle: -.pi / 2, axis: [1, 0, 0])
    return entity
  }
}
