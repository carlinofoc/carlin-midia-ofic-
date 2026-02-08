package com.carlinmidia.app

import android.os.Bundle
import android.webkit.PermissionRequest
import android.webkit.WebChromeClient
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.activity.OnBackPressedCallback

/**
 * MainActivity do Carlin Mídia Ofic.
 * Atua como o bridge nativo para a aplicação web, garantindo acesso aos sensores
 * biométricos e controle de navegação fluido.
 */
class MainActivity : ComponentActivity() {

    private lateinit var webView: WebView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Inicialização da WebView nativa
        webView = WebView(this)
        
        // Garante que a navegação permaneça dentro da WebView
        webView.webViewClient = WebViewClient()
        
        /**
         * WebChromeClient avançado para suporte a recursos de hardware.
         * Crucial para o funcionamento do Face ID Carlin e gravação de Reels/Stories.
         */
        webView.webChromeClient = object : WebChromeClient() {
            override fun onPermissionRequest(request: PermissionRequest) {
                // Autoriza o uso de câmera e microfone solicitados pela aplicação web
                runOnUiThread {
                    request.grant(request.resources)
                }
            }
        }

        // Configurações de Engenharia da WebView v5.9
        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            allowFileAccess = true
            allowContentAccess = true
            
            // Otimização para Redes Sociais:
            // Permite autoplay de vídeo sem interação (essencial para Stories e Rios/Reels)
            mediaPlaybackRequiresUserGesture = false
            
            // Custom User Agent para identificação técnica no servidor
            userAgentString = "$userAgentString CarlinNativeApp/v3.5.2 (Android)"
        }

        // Conecta ao endpoint de produção seguro
        webView.loadUrl("https://carlin-m-dia-ofic-823291538952.us-west1.run.app/")

        // Renderiza a interface
        setContentView(webView)

        /**
         * Gerenciamento de Back Navigation.
         * Implementa o padrão UX do Android onde o botão de voltar navega no histórico 
         * da rede social antes de sair da aplicação.
         */
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
}