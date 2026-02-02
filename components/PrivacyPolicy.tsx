
import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="flex flex-col bg-black text-zinc-300 p-6 lg:p-12 max-w-3xl mx-auto leading-relaxed">
      <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2 uppercase tracking-tight flex items-center gap-3">
        <span className="text-blue-500 text-3xl">🔐</span> Política de Privacidade
      </h1>
      <h2 className="text-xl font-bold text-blue-500 mb-6">CARLIN MÍDIA OFIC</h2>
      
      <p className="mb-8 font-medium italic border-l-4 border-blue-600 pl-4 py-2 bg-zinc-900/50">
        Última atualização: 24/05/2024
      </p>

      <div className="space-y-8 text-sm lg:text-base">
        <p>
          A sua privacidade é importante para nós. Esta Política de Privacidade descreve como o <strong>Carlin Mídia Ofic</strong> coleta, usa, armazena, protege e compartilha informações dos usuários ao utilizar nosso aplicativo e serviços.
        </p>

        <section>
          <h3 className="text-lg font-bold text-white mb-3">1. INFORMAÇÕES QUE COLETAMOS</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-zinc-100">1.1 Informações fornecidas pelo usuário</h4>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Nome e Nome de usuário</li>
                <li>E-mail e Número de telefone</li>
                <li>Foto de perfil, biografia e links</li>
                <li>Conteúdos publicados (fotos, vídeos, mensagens)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-zinc-100">1.2 Informações coletadas automaticamente</h4>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Endereço IP e Tipo de dispositivo</li>
                <li>Sistema operacional e Dados de navegação</li>
                <li>Cookies e tecnologias semelhantes</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-bold text-white mb-3">2. COMO UTILIZAMOS OS DADOS</h3>
          <p>Os dados coletados são utilizados para gerenciar contas, permitir interações sociais, personalizar sua experiência, exibir conteúdos relevantes, garantir segurança e cumprir obrigações legais.</p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-white mb-3">3. COMPARTILHAMENTO DE DADOS</h3>
          <p>O <strong>Carlin Mídia Ofic</strong> <strong>não vende dados pessoais</strong> dos usuários. Compartilhamos apenas com prestadores de serviços essenciais ou por exigência legal.</p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-white mb-3">5. SEGURANÇA DOS DADOS</h3>
          <p>Adotamos medidas técnicas como criptografia e controle de acesso para proteger seus dados contra acessos não autorizados.</p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-white mb-3">7. DIREITOS DO USUÁRIO (LGPD)</h3>
          <p>De acordo com a <strong>Lei Geral de Proteção de Dados</strong>, você tem direito a acessar, corrigir ou excluir seus dados, além de revogar seu consentimento a qualquer momento.</p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-white mb-3">11. CONTATO</h3>
          <p>Para dúvidas sobre privacidade, entre em contato: <span className="text-blue-400">carlinmidiaofic@gmail.com</span></p>
        </section>
      </div>
      <div className="h-20"></div>
    </div>
  );
};

export default PrivacyPolicy;
