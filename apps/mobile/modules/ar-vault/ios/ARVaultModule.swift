import ARKit
import ExpoModulesCore

/// One holding to visualise. A Record (rather than [String: Any]) so Expo
/// validates and coerces the payload at the bridge instead of failing silently.
struct ARVaultItemRecord: Record {
  @Field var id: String = ""
  @Field var label: String = ""
  /// 0...1, normalised against the largest holding on the JS side.
  @Field var magnitude: Double = 0
  /// "gold" | "land" | "tower" | "shield"
  @Field var kind: String = "tower"
}

public class ARVaultModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ARVault")

    // World tracking is unavailable on the Simulator and on pre-A9 hardware,
    // so the JS layer gates the whole screen on this.
    Function("isSupported") { () -> Bool in
      ARWorldTrackingConfiguration.isSupported
    }

    View(ARVaultView.self) {
      Prop("items") { (view: ARVaultView, items: [ARVaultItemRecord]) in
        view.render(items)
      }
    }
  }
}
