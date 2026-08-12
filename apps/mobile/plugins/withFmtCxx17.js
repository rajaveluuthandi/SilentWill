const { withDangerousMod } = require('expo/config-plugins');
const fs = require('fs');
const path = require('path');

/**
 * React Native 0.76.9 pins fmt 11.0.2, whose `consteval` usage Xcode 26's Clang
 * rejects — `call to consteval function ... is not a constant expression` in
 * fmt/format-inl.h. The build fails before it ever reaches app code.
 *
 * A -D define cannot fix it: fmt's base.h sets FMT_USE_CONSTEVAL in an unguarded
 * #if/#elif chain, so the header always overrides the command line. That chain
 * does disable consteval below C++20, and fmt supports C++11+, so compiling this
 * one pod as C++17 flips the guard without patching vendored source.
 *
 * This lives in a config plugin rather than ios/Podfile because prebuild
 * regenerates the Podfile. Delete this plugin once Expo/RN are upgraded to a
 * version whose pinned fmt supports the current Xcode.
 */
const PATCH = `    installer.pods_project.targets.each do |t|
      next unless t.name == 'fmt'
      t.build_configurations.each do |c|
        # See plugins/withFmtCxx17.js for why C++17 rather than a -D define.
        c.build_settings['CLANG_CXX_LANGUAGE_STANDARD'] = 'c++17'
      end
    end`;

const ANCHOR = '    # This is necessary for Xcode 14';
const SENTINEL = "next unless t.name == 'fmt'";

module.exports = function withFmtCxx17(config) {
  return withDangerousMod(config, [
    'ios',
    (cfg) => {
      const podfile = path.join(cfg.modRequest.platformProjectRoot, 'Podfile');
      const contents = fs.readFileSync(podfile, 'utf8');

      if (contents.includes(SENTINEL)) return cfg;

      if (!contents.includes(ANCHOR)) {
        // Fail loudly: silently skipping leaves a Podfile that cannot build,
        // and the resulting fmt errors look nothing like a missing patch.
        throw new Error(
          'withFmtCxx17: expected anchor not found in ios/Podfile. The Expo ' +
            'template changed — update ANCHOR in plugins/withFmtCxx17.js.',
        );
      }

      fs.writeFileSync(podfile, contents.replace(ANCHOR, `${PATCH}\n\n${ANCHOR}`));
      return cfg;
    },
  ]);
};
