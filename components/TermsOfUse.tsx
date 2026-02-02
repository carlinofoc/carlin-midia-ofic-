
import React from 'react';

interface TermsOfUseProps {
  onAccept?: () => void;
  showAcceptButton?: boolean;
}

const TermsOfUse: React.FC<TermsOfUseProps> = ({ onAccept, showAcceptButton = false }) => {
  return (
    <div className="flex flex-col bg-black text-zinc-300 p-6 lg:p-12 max-w-3xl mx-auto leading-relaxed overflow-y-auto">
      <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2 uppercase tracking-tight">Termo de Uso do Aplicativo</h1>
      <h2 className="text-xl font-bold text-blue-500 mb-6">CARLIN MÍDIA OFIC</h2>
      
      <p className="mb-8 font-medium italic border-l-4 border-blue-600 pl-4 py-2 bg-zinc-900/50">
        Última atualização: 24/05/2024
      </p>

      <div className="space-y-8 text-sm lg:text-base">
        <section className="bg-zinc-900/50 p-6 rounded-3xl border border-blue-500/20">
          <h3 className="text-lg font-bold text-blue-400 mb-3">⚖️ TERMOS DE USO DO ALGORITMO</h3>
          <p className="text-sm mb-4">O algoritmo do Carlin Mídia Ofic foi desenvolvido para promover uma distribuição justa, transparente e baseada em relevância real.</p>
          <ul className="list-disc pl-5 space-y-2 text-sm">
             <li>O alcance do conteúdo <strong>não é determinado</strong> pelo tamanho da conta.</li>
             <li>Conteúdos relevantes podem ser entregues tanto a seguidores quanto a não seguidores.</li>
             <li><strong>Não existem penalizações ocultas ("shadowban")</strong> para conteúdos que respeitam as diretrizes.</li>
             <li>A entrega do conteúdo é reavaliada continuamente ao longo do tempo.</li>
          </ul>
          <p className="text-xs text-zinc-500 mt-4">Nosso compromisso é com um ecossistema saudável, transparente e favorável ao crescimento sustentável de criadores.</p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-white mb-3">1. ACEITAÇÃO DOS TERMOS</h3>
          <p>Ao criar uma conta, acessar ou utilizar qualquer funcionalidade do <strong>Carlin Mídia Ofic</strong>, o usuário concorda automaticamente com este Termo de Uso, bem como com a Política de Privacidade da plataforma.</p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-white mb-3">2. SOBRE O APLICATIVO</h3>
          <p>O <strong>Carlin Mídia Ofic</strong> é uma plataforma digital de rede social destinada ao compartilhamento de conteúdos como fotos, vídeos, textos, stories, mensagens e interações sociais entre usuários.</p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-white mb-3">3. ELEGIBILIDADE</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Possui <strong>idade mínima de 13 anos</strong>, ou a idade mínima exigida por lei em seu país;</li>
            <li>Possui capacidade legal para aceitar este Termo;</li>
            <li>Forneceu informações verdadeiras, completas e atualizadas no cadastro.</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-bold text-white mb-3">4. CONTA DO USUÁRIO</h3>
          <p>Cada usuário é responsável por manter a segurança e confidencialidade de sua conta e senha. O usuário é integralmente responsável por todas as atividades realizadas em sua conta. É proibido criar contas falsas, duplicadas, automatizadas ou se passar por terceiros.</p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-white mb-3">6. CONDUTAS PROIBIDAS</h3>
          <p>É proibido publicar conteúdo ilegal, praticar assédio, utilizar bots ou tentar hackear sistemas. O descumprimento resultará em suspensão temporária ou exclusão definitiva da conta.</p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-white mb-3">13. LEGISLAÇÃO APLICÁVEL</h3>
          <p>Este Termo é regido pelas leis da <strong>República Federativa do Brasil</strong>. Fica eleito o foro competente para dirimir eventuais controvérsias.</p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-white mb-3">14. CONTATO</h3>
          <p>Para dúvidas, suporte ou solicitações, entre em contato: <span className="text-blue-400">contato@carlinmidiaofic.com</span></p>
        </section>
      </div>

      {showAcceptButton && (
        <div className="mt-12 p-8 bg-zinc-900 rounded-2xl border border-zinc-800 text-center sticky bottom-4 shadow-2xl">
          <p className="text-sm mb-4">Ao clicar no botão abaixo, você confirma que leu e aceita todos os termos acima.</p>
          <button 
            onClick={onAccept}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-8 rounded-xl transition-all active:scale-95 text-lg"
          >
            ✅ Aceito os Termos de Uso
          </button>
        </div>
      )}
      <div className="h-20"></div>
    </div>
  );
};

export default TermsOfUse;
