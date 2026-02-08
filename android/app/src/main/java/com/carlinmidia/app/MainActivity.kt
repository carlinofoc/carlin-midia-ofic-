package com.carlinmidia.app

import android.annotation.SuppressLint
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.view.View
import android.view.WindowManager
import android.webkit.*
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.OnBackPressedCallback
import androidx.activity.result.contract.ActivityResultContracts
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen

/**
 * MainActivity v3.6.1 - Produção Carlin Mídia (Segurança Avançada)
 * Implementa FLAG_SECURE para bloquear screenshots e gravações de tela.
 */
class MainActivity : ComponentActivity() {

    private lateinit var webView: WebView
    private var filePathCallback: ValueCallback<Array<Uri>>? = null

    // Registra o contrato para seleção de arquivos (Reels/Posts/Avatar)
    private val filePickerLauncher = registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
        if (result.resultCode == RESULT_OK) {
            val data: Intent? = result.data
            val results = WebChromeClient.FileChooserParams.parseResult(result.resultCode, data)
            filePathCallback?.onReceiveValue(results)
        } else {
            filePathCallback?.onReceiveValue(null)
        }
        filePathCallback = null
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        // Inicializa Splash Screen nativa do Android 12+
        installSplashScreen()
        
        // PROTEÇÃO: Desativa screenshots e gravações de tela em todo o ciclo de vida da Activity
        window.setFlags(
            WindowManager.LayoutParams.FLAG_SECURE,
            WindowManager.LayoutParams.FLAG_SECURE
        )
        
        super.onCreate(savedInstanceState)

        setupWebView()
        setupBackNavigation()
        
        setContentView(webView)
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun setupWebView() {
        webView = WebView(this).apply {
            // Estética de fundo para evitar flashes brancos
            setBackgroundColor(android.graphics.Color.BLACK)
            
            webViewClient = object : WebViewClient() {
                override fun onReceivedError(view: WebView?, request: WebResourceRequest?, error: WebResourceError?) {
                    if (request?.isForMainFrame == true) {
                        Toast.makeText(context, "Erro de conexão: Verifique sua internet", Toast.LENGTH_SHORT).show()
                    }
                }

                override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                    val url = request?.url.toString()
                    return if (url.contains("carlin-m-dia-ofic-823291538952.us-west1.run.app") || 
                               url.contains("carlinmidia.app")) {
                        false // Abre no WebView
                    } else {
                        // Abre links externos no navegador do sistema
                        try {
                            startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url)))
                        } catch (e: Exception) {}
                        true
                    }
                }
            }

            webChromeClient = object : WebChromeClient() {
                override fun onPermissionRequest(request: PermissionRequest) {
                    runOnUiThread {
                        request.grant(request.resources)
                    }
                }

                override fun onShowFileChooser(
                    webView: WebView?,
                    callback: ValueCallback<Array<Uri>>?,
                    params: FileChooserParams?
                ): Boolean {
                    filePathCallback?.onReceiveValue(null)
                    filePathCallback = callback
                    
                    val intent = params?.createIntent()
                    try {
                        filePickerLauncher.launch(intent)
                    } catch (e: Exception) {
                        filePathCallback?.onReceiveValue(null)
                        filePathCallback = null
                        return false
                    }
                    return true
                }
            }

            settings.apply {
                javaScriptEnabled = true
                domStorageEnabled = true
                databaseEnabled = true
                allowFileAccess = true
                allowContentAccess = true
                loadWithOverviewMode = true
                useWideViewPort = true
                mediaPlaybackRequiresUserGesture = false
                cacheMode = WebSettings.LOAD_DEFAULT
                setSupportMultipleWindows(false)
                
                // PRIVACIDADE: Desativa salvamento de dados de formulário
                saveFormData = false
                
                // SEGURANÇA: Restringe conteúdo misto
                mixedContentMode = WebSettings.MIXED_CONTENT_NEVER_ALLOW
                
                // User Agent customizado para identificação técnica
                userAgentString = "$userAgentString CarlinNativeApp/v3.6.1 (Android Secure Production)"
            }
        }

        webView.loadUrl("https://carlin-m-dia-ofic-823291538952.us-west1.run.app/")
    }

    private fun setupBackNavigation() {
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (webView.canGoBack()) {
                    webView.goBack()
                } else {
                    finish()
                }
            }
        })
    }

    override fun onPause() {
        webView.onPause()
        webView.pauseTimers()
        super.onPause()
    }

    override fun onResume() {
        super.onResume()
        webView.onResume()
        webView.resumeTimers()
    }

    override fun onDestroy() {
        webView.destroy()
        super.onDestroy()
    }
}