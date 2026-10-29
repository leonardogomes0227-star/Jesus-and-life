import { Link } from 'react-router-dom'

const Block = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="space-y-2">
    <h2 className="font-display text-2xl font-semibold">{title}</h2>
    <div className="space-y-2 leading-relaxed text-muted">{children}</div>
  </section>
)

/** Avisos de segurança, uso dos dados e créditos, em linguagem simples. */
export default function Sobre() {
  return (
    <main className="space-y-8 pb-8">
      <div>
        <Link to="/ajustes" className="flex min-h-[48px] items-center text-sm font-semibold text-muted">← Ajustes</Link>
        <h1 className="font-display text-4xl font-semibold leading-tight">Sobre e privacidade</h1>
      </div>

      <section className="rounded-3xl border border-sun/50 p-6">
        <h2 className="font-display text-2xl font-semibold">Se você precisa de ajuda agora</h2>
        <p className="mt-2">Se você está pensando em se machucar, ou sente que não vê saída, fale com alguém neste momento.</p>
        <div className="mt-4 grid gap-3">
          <a className="btn-primary" href="tel:188">Ligar para o CVV, 188</a>
          <a className="btn-ghost" href="tel:192">Emergência médica, 192 (SAMU)</a>
        </div>
        <p className="mt-3 text-sm text-muted">O CVV atende 24 horas, de graça e com sigilo.</p>
      </section>

      <Block title="O que o Livre é">
        <p>Um espaço para ler a Bíblia, orar e acompanhar hábitos que você quer mudar, com acolhimento e sem cobrança.</p>
        <p><strong className="text-ink">O Livre não substitui acompanhamento pastoral, psicológico ou médico.</strong> Se a ansiedade, a tristeza ou um hábito estiverem atrapalhando seu sono, seus estudos, seu trabalho ou suas relações, procure um profissional ou um líder de confiança. Fé e acompanhamento caminham juntos.</p>
      </Block>

      <Block title="Seus dados">
        <p><strong className="text-ink">Tudo o que você escreve fica só neste aparelho.</strong> Diário, pedidos de oração, humor, plano, quedas, anotações e destaques não são enviados para nenhum servidor. O Livre não tem conta, não usa anúncios e não faz rastreamento.</p>
        <p>O que isso significa na prática: se você apagar os dados do navegador ou trocar de aparelho, perde o que escreveu. Use <Link to="/ajustes" className="font-semibold underline">Ajustes → Backup em texto</Link> para guardar uma cópia.</p>
        <p>Você pode proteger o app com um PIN de 4 dígitos. Ele é uma trava simples de privacidade neste aparelho, e não uma proteção forte.</p>
        <p>Quando você usa um atalho do WhatsApp (parceiro, plano, resumo da semana), o texto sai do Livre apenas depois que <em>você</em> revisa e envia. O Livre nunca envia mensagens sozinho.</p>
      </Block>

      <Block title="Apagar tudo">
        <p>Em <Link to="/ajustes" className="font-semibold underline">Ajustes</Link> há o botão “Apagar todos os dados”. Ele remove tudo deste aparelho, e não dá para desfazer.</p>
      </Block>

      <Block title="O texto bíblico">
        <p>As passagens usam a versão Almeida Corrigida Fiel (ACF), em português. Os arquivos vêm do projeto aberto thiagobodruk/biblia. Os direitos da tradução pertencem aos seus titulares.</p>
      </Block>

      <Block title="Conteúdo">
        <p>As reflexões, orações, lições e roteiros do Livre são textos de apoio. Algumas explicações usam resultados gerais da psicologia do comportamento (hábito, pausa, vínculo) apenas como ajuda prática, sem prometer cura nem prazo para mudança.</p>
      </Block>

      <p className="text-center text-sm text-muted">Livre · feito com cuidado para quem quer caminhar com Deus um dia de cada vez.</p>
    </main>
  )
}
