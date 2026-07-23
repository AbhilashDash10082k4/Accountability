package expo.modules.blockdistractions

import android.content.Intent
import android.content.pm.ApplicationInfo
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.provider.Settings
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.drawable.BitmapDrawable
import android.graphics.drawable.Drawable
import java.io.File
import java.io.FileOutputStream
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class BlockDistractionsModule : Module() {
    override fun definition() = ModuleDefinition {
        Name("BlockDistractions")

        Function("getInstalledApps") { ->
            val context = appContext.reactContext
            if (context == null) {
                return@Function emptyList<Map<String, String>>()
            }
            val pm = context.packageManager
            
            val intent = Intent(Intent.ACTION_MAIN, null)
            intent.addCategory(Intent.CATEGORY_LAUNCHER)
            
            // Query only apps that have a launchable UI (app drawer icon)
            val resolveInfos = pm.queryIntentActivities(intent, 0)
            val apps = mutableListOf<Map<String, String>>()
            val processedPackages = mutableSetOf<String>()
            
            for (resolveInfo in resolveInfos) {
                val appInfo = resolveInfo.activityInfo.applicationInfo
                val packageName = appInfo.packageName
                
                // Prevent duplicates if an app has multiple launcher activities
                if (processedPackages.contains(packageName)) continue
                processedPackages.add(packageName)
                
                val appName = pm.getApplicationLabel(appInfo).toString()
                
                // Extract and save icon
                var iconUri = ""
                try {
                    val file = File(context.cacheDir, "app_icon_${packageName}.png")
                    if (file.exists()) {
                        iconUri = "file://" + file.absolutePath
                    } else {
                        val drawable = pm.getApplicationIcon(appInfo)
                        val bitmap = if (drawable is BitmapDrawable) {
                            drawable.bitmap
                        } else {
                            val bmp = Bitmap.createBitmap(
                                drawable.intrinsicWidth.takeIf { it > 0 } ?: 100,
                                drawable.intrinsicHeight.takeIf { it > 0 } ?: 100,
                                Bitmap.Config.ARGB_8888
                            )
                            val canvas = Canvas(bmp)
                            drawable.setBounds(0, 0, canvas.width, canvas.height)
                            drawable.draw(canvas)
                            bmp
                        }
                        FileOutputStream(file).use { out ->
                            bitmap.compress(Bitmap.CompressFormat.PNG, 100, out)
                        }
                        iconUri = "file://" + file.absolutePath
                    }
                } catch (e: Exception) {
                    e.printStackTrace()
                }
                
                apps.add(
                    mapOf(
                        "name" to appName,
                        "packageName" to packageName,
                        "icon" to iconUri
                    )
                )
            }
            
            return@Function apps
        }

        Function("openAccessibilitySettings") { ->
            val context = appContext.reactContext
            if (context == null) {
                return@Function false
            }
            val intent = Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS)
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            context.startActivity(intent)
            return@Function true
        }

        Function("hasAccessibilityPermission") { ->
            val context = appContext.reactContext ?: return@Function false
            var accessibilityEnabled = 0
            try {
                accessibilityEnabled = Settings.Secure.getInt(
                    context.contentResolver,
                    Settings.Secure.ACCESSIBILITY_ENABLED
                )
            } catch (e: Settings.SettingNotFoundException) {
                // ignore
            }
            if (accessibilityEnabled == 1) {
                val settingValue = Settings.Secure.getString(
                    context.contentResolver,
                    Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES
                )
                if (settingValue != null) {
                    val serviceName = context.packageName + "/expo.modules.blockdistractions.AppBlockAccessibilityService"
                    return@Function settingValue.contains(serviceName)
                }
            }
            return@Function false
        }

        Function("hasOverlayPermission") { ->
            val context = appContext.reactContext
            if (context == null) {
                return@Function false
            }
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                return@Function Settings.canDrawOverlays(context)
            }
            return@Function true
        }

        Function("openOverlaySettings") { ->
            val context = appContext.reactContext
            if (context == null) {
                return@Function false
            }
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                val intent = Intent(
                    Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                    Uri.parse("package:${context.packageName}")
                )
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                context.startActivity(intent)
            }
            return@Function true
        }

        Function("setBlockedApps") { apps: List<String> ->
            val context = appContext.reactContext
            if (context == null) {
                return@Function false
            }
            val prefs = context.getSharedPreferences("BlockDistractionsPrefs", android.content.Context.MODE_PRIVATE)
            prefs.edit().putStringSet("blocked_apps", apps.toSet()).apply()
            return@Function true
        }

        Function("setPendingTasks") { tasks: String ->
            val context = appContext.reactContext
            if (context == null) {
                return@Function false
            }
            val prefs = context.getSharedPreferences("BlockDistractionsPrefs", android.content.Context.MODE_PRIVATE)
            prefs.edit().putString("pending_tasks", tasks).apply()
        }

        Function("getBlockedApps") { ->
            val context = appContext.reactContext
            if (context == null) {
                return@Function emptyList<String>()
            }
            val prefs = context.getSharedPreferences("BlockDistractionsPrefs", android.content.Context.MODE_PRIVATE)
            return@Function prefs.getStringSet("blocked_apps", emptySet<String>())?.toList() ?: emptyList<String>()
        }
    }
}
