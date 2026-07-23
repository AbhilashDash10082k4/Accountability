const { withAndroidManifest, withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const withAppBlocker = (config) => {
  config = withAndroidManifest(config, (config) => {
    const mainApplication = config.modResults.manifest.application[0];
    
    // Add Service
    if (!mainApplication.service) {
      mainApplication.service = [];
    }
    
    const hasService = mainApplication.service.some(
      (s) => s.$['android:name'] === 'expo.modules.blockdistractions.AppBlockAccessibilityService'
    );
    
    if (!hasService) {
      mainApplication.service.push({
        $: {
          'android:name': 'expo.modules.blockdistractions.AppBlockAccessibilityService',
          'android:permission': 'android.permission.BIND_ACCESSIBILITY_SERVICE',
          'android:exported': 'true',
        },
        'intent-filter': [
          {
            action: [
              { $: { 'android:name': 'android.accessibilityservice.AccessibilityService' } }
            ]
          }
        ],
        'meta-data': [
          {
            $: {
              'android:name': 'android.accessibilityservice',
              'android:resource': '@xml/accessibility_service_config'
            }
          }
        ]
      });
    }

    // Add Blocker Activity
    if (!mainApplication.activity) {
      mainApplication.activity = [];
    }
    const hasActivity = mainApplication.activity.some(
      (a) => a.$['android:name'] === 'expo.modules.blockdistractions.BlockerActivity'
    );
    
    if (!hasActivity) {
      mainApplication.activity.push({
        $: {
          'android:name': 'expo.modules.blockdistractions.BlockerActivity',
          'android:theme': '@android:style/Theme.NoTitleBar.Fullscreen',
          'android:exported': 'true',
          'android:launchMode': 'singleInstance'
        }
      });
    }

    // Add Permissions
    const manifest = config.modResults.manifest;
    if (!manifest['uses-permission']) {
      manifest['uses-permission'] = [];
    }
    
    const requiredPermissions = [
      'android.permission.SYSTEM_ALERT_WINDOW',
      'android.permission.QUERY_ALL_PACKAGES'
    ];
    
    requiredPermissions.forEach((perm) => {
      const hasPerm = manifest['uses-permission'].some((p) => p.$['android:name'] === perm);
      if (!hasPerm) {
        manifest['uses-permission'].push({ $: { 'android:name': perm } });
      }
    });

    return config;
  });

  // Copy XML config
  config = withDangerousMod(config, [
    'android',
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const resDir = path.join(projectRoot, 'android', 'app', 'src', 'main', 'res', 'xml');
      const sourceFile = path.join(
        projectRoot,
        'modules',
        'block-distractions',
        'android',
        'src',
        'main',
        'res',
        'xml',
        'accessibility_service_config.xml'
      );
      
      fs.mkdirSync(resDir, { recursive: true });
      if (fs.existsSync(sourceFile)) {
        fs.copyFileSync(sourceFile, path.join(resDir, 'accessibility_service_config.xml'));
      } else {
        console.warn('Source accessibility_service_config.xml not found at:', sourceFile);
      }
      
      return config;
    }
  ]);

  return config;
};

module.exports = withAppBlocker;
