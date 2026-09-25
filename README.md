#  Gasto na Foto

Controle financeiro pessoal que usa Inteligência Artificial para registrar gastos de três formas diferentes: **por foto do comprovante**, **por comando de voz** ou **manualmente**.

##  Funcionalidades

- 📷 **Leitura de comprovantes por foto** — envie a imagem de uma nota fiscal ou comprovante e a IA extrai automaticamente categoria, estabelecimento, itens, valor, forma de pagamento, parcelas e data.
- 🎙️ **Registro por voz** — fale o gasto naturalmente (ex: *"gastei 50 reais no mercado Guanabara no crédito em duas vezes"*) e a IA interpreta e estrutura as informações.
- ✍️ **Registro manual** — cadastre um gasto digitando os dados diretamente.
- ✅ **Confirmação antes de salvar** — todo gasto extraído por foto ou voz passa por uma tela de conferência, onde os dados podem ser revisados e corrigidos antes de serem salvos.
- ✏️ **Edição de gastos** — qualquer gasto já lançado pode ser editado depois.
- 🗑️ **Exclusão de gastos** — remove um lançamento e atualiza os totais automaticamente.
- 🔐 **Login de usuário** — cada pessoa tem sua própria conta (email e senha), com dados privados e isolados.
- ☁️ **Dados na nuvem** — os gastos ficam salvos no banco de dados e sincronizam entre diferentes dispositivos e navegadores.
- 🏷️ **Categorização automática** — Mercado, Transporte, Comida, Saúde, Lazer, Casa e Outros, com totais calculados por categoria.
- ⚠️ **Tratamento de erros** — mensagens claras em caso de falha de internet ou indisponibilidade da IA.

##  Tecnologias utilizadas

- **HTML, CSS e JavaScript** (puro, sem frameworks)
- **Firebase Authentication** — autenticação de usuários por email/senha
- **Firebase Firestore** — banco de dados na nuvem (NoSQL)
- **Web Speech API** (`webkitSpeechRecognition`) — reconhecimento de voz no navegador
- **IA generativa** (via `puter.ai`) — interpretação de linguagem natural e leitura de imagens de comprovantes

##  Como funciona

1. O usuário cria uma conta ou faz login.
2. Escolhe uma das três formas de registrar um gasto: foto, voz ou manual.
3. No caso de foto ou voz, a IA analisa o conteúdo e devolve os dados estruturados (categoria, estabelecimento, valor, forma de pagamento, parcelas e data).
4. Uma tela de confirmação exibe os dados extraídos, permitindo revisão antes de salvar.
5. O gasto é salvo no Firestore, vinculado ao usuário logado, e os totais (geral e por categoria) são atualizados em tempo real.

## 🔒 Segurança

- As credenciais de configuração do Firebase presentes no código são seguras para exposição pública — esse é o comportamento padrão de qualquer aplicação Firebase para web.
- A segurança dos dados é garantida pelas **regras do Firestore**, que permitem que cada usuário acesse exclusivamente os próprios dados, e pela exigência de login via Firebase Authentication.

## 📌 Status do projeto

Projeto em desenvolvimento contínuo. Próximas melhorias planejadas:
- Gráfico de gastos por categoria
- Filtro de gastos por mês

## 👤 Autor

Desenvolvido por **Jhony Santos**.
