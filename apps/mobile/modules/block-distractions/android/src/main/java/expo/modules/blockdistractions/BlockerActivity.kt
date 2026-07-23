package expo.modules.blockdistractions

import android.app.Activity
import android.content.Context
import android.os.Bundle
import android.view.Gravity
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView

class BlockerActivity : Activity() {
    private var blockedPackage: String? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        blockedPackage = intent.getStringExtra("blocked_package")
        val pendingTasks = intent.getStringExtra("pending_tasks") ?: "No pending tasks"
        
        val layout = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            gravity = Gravity.CENTER
            setBackgroundColor(0xFF051424.toInt()) // App theme background
            setPadding(64, 64, 64, 64)
            
            val titleText = TextView(this@BlockerActivity).apply {
                text = "App Blocked"
                textSize = 28f
                setTextColor(0xFFD4E4FA.toInt())
                gravity = Gravity.CENTER
                setPadding(0, 0, 0, 16)
            }
            
            val subtitleText = TextView(this@BlockerActivity).apply {
                text = "Complete your pending tasks to unlock:"
                textSize = 16f
                setTextColor(0xFFA4C4EA.toInt())
                gravity = Gravity.CENTER
                setPadding(0, 0, 0, 32)
            }
            
            val tasksText = TextView(this@BlockerActivity).apply {
                text = pendingTasks
                textSize = 18f
                setTextColor(0xFF44E2CD.toInt()) // Cyan accent color
                gravity = Gravity.CENTER
                setPadding(0, 0, 0, 64)
            }
            
            val submitButton = Button(this@BlockerActivity).apply {
                text = "Submit Proof"
                setTextColor(0xFF051424.toInt()) // Dark text
                setBackgroundColor(0xFF44E2CD.toInt()) // Cyan button
                setOnClickListener {
                    val launchIntent = packageManager.getLaunchIntentForPackage(packageName)
                    if (launchIntent != null) {
                        startActivity(launchIntent)
                    }
                    finish()
                }
            }
            
            addView(titleText)
            addView(subtitleText)
            addView(tasksText)
            addView(submitButton)
        }
        
        setContentView(layout)
    }

    override fun onResume() {
        super.onResume()
        // If the app is no longer blocked, finish immediately so user can use the app
        val pkg = blockedPackage
        if (pkg != null) {
            val prefs = getSharedPreferences("BlockDistractionsPrefs", Context.MODE_PRIVATE)
            val blockedApps = prefs.getStringSet("blocked_apps", emptySet()) ?: emptySet()
            if (!blockedApps.contains(pkg)) {
                finish()
            }
        }
    }
    
    override fun onBackPressed() {
        // Prevent going back to the blocked app, go to launcher home screen instead
        val homeIntent = android.content.Intent(android.content.Intent.ACTION_MAIN)
        homeIntent.addCategory(android.content.Intent.CATEGORY_HOME)
        homeIntent.flags = android.content.Intent.FLAG_ACTIVITY_NEW_TASK
        startActivity(homeIntent)
    }
}
