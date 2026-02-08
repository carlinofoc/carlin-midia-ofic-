import UIKit
import WebKit
import AVFoundation

class ViewController: UIViewController, WKUIDelegate, WKNavigationDelegate {

    var webView: WKWebView!

    override func viewDidLoad() {
        super.viewDidLoad()
        
        setupWebView()
        loadApp()
    }

    private func setupWebView() {
        let webConfiguration = WKWebViewConfiguration()
        
        // Permite autoplay de vídeos (essencial para Rios e Stories)
        webConfiguration.allowsInlineMediaPlayback = true
        webConfiguration.mediaTypesRequiringUserActionForPlayback = []
        
        // Configuração do User Agent para identificação do ecossistema Carlin
        let userAgent = "CarlinNativeApp/v3.5.2 (iOS)"
        
        webView = WKWebView(frame: .zero, configuration: webConfiguration)
        webView.uiDelegate = self
        webView.navigationDelegate = self
        webView.customUserAgent = userAgent
        
        // Desabilita o scroll elástico para uma sensação mais "nativa" de app
        webView.scrollView.bounces = false
        
        view.addSubview(webView)
        webView.translatesAutoresizingMaskIntoConstraints = false
        
        // Respeita as Safe Areas do iPhone (Notch e Home Indicator)
        NSLayoutConstraint.activate([
            webView.topAnchor.constraint(equalTo: view.topAnchor),
            webView.bottomAnchor.constraint(equalTo: view.bottomAnchor),
            webView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            webView.trailingAnchor.constraint(equalTo: view.trailingAnchor)
        ])
    }

    private func loadApp() {
        if let url = URL(string: "https://carlin-m-dia-ofic-823291538952.us-west1.run.app/") {
            let request = URLRequest(url: url)
            webView.load(request)
        }
    }

    // Suporte a permissões de Câmera/Microfone para Face ID e Gravação
    func webView(_ webView: WKWebView, requestDeviceCapability capability: WKDeviceCapability, decisionHandler: @escaping (WKDeviceCapabilityDecision) -> Void) {
        decisionHandler(.grant)
    }
}
