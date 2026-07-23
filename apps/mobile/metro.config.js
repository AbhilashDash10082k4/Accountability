const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');
 
const config = getDefaultConfig(__dirname)

// Required for Prisma in Expo API routes
config.resolver.unstable_enablePackageExports = true;
config.resolver.unstable_conditionNames = ['node', 'require', 'react-native']; 
module.exports = withNativeWind(config, { input: './global.css' })