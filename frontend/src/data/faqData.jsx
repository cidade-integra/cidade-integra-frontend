import { Link } from "react-router-dom";

export const faqCategories = [
  {
    id: "platform",
    label: "Sobre a Plataforma",
    items: [
      {
        id: "item-1",
        question: "O que é o Cidade Integra?",
        answer:
          "O Cidade Integra é uma plataforma que permite aos cidadãos reportar problemas ambientais e urbanos em sua cidade. Nossa missão é conectar a comunidade aos órgãos responsáveis para solucionar questões como poluição, descarte irregular de lixo, problemas de infraestrutura urbana e outros desafios ambientais.",
      },
      {
        id: "item-2",
        question: "Como a plataforma funciona?",
        answer:
          "O funcionamento é simples: você registra o problema encontrado através do aplicativo, adicionando fotos, descrição e localização precisa. Nossa equipe analisa e encaminha a denúncia para o órgão responsável. Você pode acompanhar todo o processo de solução e será notificado quando o problema for resolvido.",
      },
      {
        id: "item-3",
        question: "É necessário pagar para usar o Cidade Integra?",
        answer:
          "Não! O Cidade Integra é uma plataforma totalmente gratuita para todos os cidadãos. Nosso objetivo é facilitar a comunicação entre a população e os órgãos públicos responsáveis por solucionar os problemas reportados.",
      },
      {
        id: "item-4",
        question: "Como o Cidade Integra lida com as minhas informações?",
        answer:
            "No Cidade Integra, levamos a sua privacidade a sério. As informações que você compartilha como nome, e-mail, localização e fotos dos problemas reportados são utilizadas exclusivamente para encaminhar suas denúncias aos órgãos competentes, manter você informado sobre o andamento e melhorar continuamente a plataforma.",
      },
    ],
  },
  {
    id: "reports",
    label: "Denúncias",
    items: [
      {
        id: "item-1",
        question: "Como faço uma denúncia?",
        answer: (
          <>
            Para fazer uma denúncia, clique no botão{" "}
            <Link
              to="/nova-denuncia"
              className="text-verde font-bold hover:text-verde-escuro hover:underline"
            >
              Nova Denúncia
            </Link>{" "}
            disponível no menu superior. Preencha o formulário com os detalhes
            do problema, adicione fotos que mostrem claramente a situação e
            marque a localização exata. Quanto mais informações você fornecer,
            mais rapidamente o problema poderá ser resolvido.
          </>
        ),
      },
      {
        id: "item-2",
        question: "Posso fazer denúncias anônimas?",
        answer:
          "Sim, você pode optar por fazer denúncias anônimas. Durante o preenchimento do formulário de denúncia, há uma opção para manter sua identidade privada. Mesmo em denúncias anônimas, você poderá acompanhar o progresso de solução através de um código único fornecido ao final do envio.",
      },
      {
        id: "item-3",
        question: "Como acompanho o status da minha denúncia?",
        answer: (
          <>
            Você pode acompanhar suas denúncias através da seção{" "}
            <Link
              to="/perfil"
              className="text-verde font-bold hover:text-verde-escuro hover:underline"
            >
              Minhas Denúncias
            </Link>{" "}
            no seu perfil. Lá você encontrará todas as suas denúncias e seus
            respectivos status atuais. Também enviamos notificações por email
            quando houver atualizações importantes sobre o andamento da solução.
          </>
        ),
      },
    ],
  },
  {
    id: "account",
    label: "Conta e Perfil",
    items: [
      {
        id: "item-1",
        question: "Como criar uma conta no Cidade Integra?",
        answer: (
          <>
            Para criar uma conta, clique em{" "}
            <Link
              to="/login"
              className="text-verde font-bold hover:text-verde-escuro hover:underline"
            >
              Entrar
            </Link>{" "}
            no menu superior e depois selecione a opção "Cadastrar". Você
            precisará fornecer seu nome, email e criar uma senha. Também é
            possível se cadastrar utilizando sua conta do Google ou Facebook
            para maior praticidade.
          </>
        ),
      },
      {
        id: "item-2",
        question: "Como editar meus dados pessoais?",
        answer: (
          <>
            Para editar seus dados pessoais, acesse a página de{" "}
            <Link
              to="/perfil"
              className="text-verde font-bold hover:text-verde-escuro hover:underline"
            >
              Perfil
            </Link>{" "}
            e clique no botão "Editar Perfil". Lá você poderá atualizar seu
            nome, email, telefone e senha. Após fazer as alterações desejadas,
            clique em "Salvar" para confirmar as mudanças.
          </>
        ),
      },
      {
        id: "item-3",
        question: "Esqueci minha senha. Como recuperá-la?",
        answer: (
          <>
            Se você esqueceu sua senha, clique em{" "}
            <Link
              to="/login"
              className="text-verde font-bold hover:text-verde-escuro hover:underline"
            >
              Entrar
            </Link>{" "}
            e depois na opção{" "}
            <Link
              to="/recuperar-senha"
              className="text-verde font-bold hover:text-verde-escuro hover:underline"
            >
              Esqueceu a senha?
            </Link>
            . Você será redirecionado para a página de recuperação, onde deverá
            informar o email cadastrado. Enviaremos um link para você criar uma
            nova senha de acesso.
          </>
        ),
      },
    ],
  },
];
