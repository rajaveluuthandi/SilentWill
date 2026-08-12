Pod::Spec.new do |s|
  s.name           = 'ARVault'
  s.version        = '1.0.0'
  s.summary        = 'ARKit/RealityKit visualisation of SilentWill vault holdings'
  s.description    = 'Renders asset holdings as procedurally generated RealityKit geometry anchored to a detected horizontal plane.'
  s.author         = 'SilentWill'
  s.homepage       = 'https://docs.expo.dev/modules/'
  s.platforms      = { :ios => '15.1' }
  s.source         = { git: '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  # ARKit provides world tracking; RealityKit provides ARView and the mesh
  # primitives. Both are OS frameworks — nothing is vendored.
  s.frameworks = 'ARKit', 'RealityKit'

  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'SWIFT_COMPILATION_MODE' => 'wholemodule'
  }

  s.source_files = "**/*.{h,m,mm,swift,hpp,cpp}"
end
