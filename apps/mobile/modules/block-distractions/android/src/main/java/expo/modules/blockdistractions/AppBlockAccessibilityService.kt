package expo.modules.blockdistractions

import android.accessibilityservice.AccessibilityService
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.os.Handler
import android.os.Looper
import android.view.accessibility.AccessibilityEvent

class AppBlockAccessibilityService : AccessibilityService() {
    private val handler = Handler(Looper.getMainLooper())
    private lateinit var prefs: SharedPreferences

    override fun onServiceConnected() {
        super.onServiceConnected()
        prefs = getSharedPreferences("BlockDistractionsPrefs", Context.MODE_PRIVATE)
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        if (event == null || event.eventType != AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED) return

        val packageName = event.packageName?.toString() ?: return
        
        // Skip our own app
        if (packageName == this.packageName) {
            return
        }

        // Get blocked apps from SharedPreferences
        val blockedApps = prefs.getStringSet("blocked_apps", emptySet()) ?: emptySet()
        val isBlocked = blockedApps.contains(packageName)
        val pendingTasks = prefs.getString("pending_tasks", "No pending tasks") ?: "No pending tasks"

        if (isBlocked) {
            // Only block if there are actual pending tasks
            if (pendingTasks == "No pending tasks" || pendingTasks.isBlank()) {
                return
            }
            val intent = Intent(this, BlockerActivity::class.java).apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP)
                putExtra("pending_tasks", pendingTasks)
                putExtra("blocked_package", packageName)
            }
            startActivity(intent)
        }
    }

    override fun onInterrupt() {
    }
}
