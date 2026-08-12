const { withXcodeProject } = require('expo/config-plugins');

/**
 * Pins the Apple development team on the app target.
 *
 * Without this the team lives only in ios/SilentWill.xcodeproj, which prebuild
 * regenerates — so it silently disappears and the next device build fails with
 * "No profiles for 'com.silentwill.app' were found", which reads like a
 * provisioning problem rather than a wiped setting.
 *
 * R3EB9NGFFD is the personal team ("Raja velu", rocketrajacsc@gmail.com),
 * deliberately NOT the company orgs also present on this machine — Jambav, Inc
 * (7VPXG96P25) and Zoho Corporation (TZ824L8Y37). This keeps SilentWill's App
 * ID out of a shared company account.
 *
 * Note it is NOT 3ZQ36R8Y5N, despite a keychain certificate reading
 * "Apple Development: rocketrajacsc@gmail.com (3ZQ36R8Y5N)". That cert is
 * orphaned from an older membership and no account owns that team any more;
 * building against it fails with "No Account for Team 3ZQ36R8Y5N".
 *
 * Requires the Apple ID signed into Xcode (Settings ▸ Accounts) — a keychain
 * certificate alone is not enough for automatic provisioning.
 */
const TEAM_ID = 'R3EB9NGFFD';

module.exports = function withDevelopmentTeam(config) {
  return withXcodeProject(config, (cfg) => {
    const project = cfg.modResults;
    const buildConfigs = project.pbxXCBuildConfigurationSection();
    let applied = 0;

    for (const key of Object.keys(buildConfigs)) {
      const entry = buildConfigs[key];
      if (!entry || typeof entry !== 'object' || !entry.buildSettings) continue;

      const bundleId = entry.buildSettings.PRODUCT_BUNDLE_IDENTIFIER;
      if (!bundleId) continue;
      // pbxproj values may or may not be quoted.
      if (bundleId.replace(/"/g, '') !== 'com.silentwill.app') continue;

      entry.buildSettings.DEVELOPMENT_TEAM = TEAM_ID;
      entry.buildSettings.CODE_SIGN_STYLE = 'Automatic';
      applied += 1;
    }

    if (applied === 0) {
      throw new Error(
        'withDevelopmentTeam: no build configuration matched com.silentwill.app. ' +
          'If the bundle identifier changed, update plugins/withDevelopmentTeam.js.',
      );
    }

    return cfg;
  });
};
