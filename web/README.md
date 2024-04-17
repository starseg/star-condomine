<div style="display: flex; align-items: center; gap: 24px;">
  <img src="public/logo.svg" alt="Logo do Star Condomine">
  <img height="48" src="https://github.com/micaelmi/star-condomine/assets/66328408/bad49011-b501-4818-8ff0-be52b991b7c9" alt="Logo do Next">
  <img height="48" src="https://github.com/micaelmi/star-condomine/assets/66328408/c90d9b62-a5e7-43be-ad74-3e5f18392378" alt="Logo do Typescript">
</div>

# Frontend

O frontend foi desenvolvido com Next.js + Typescript.
Os módulos seguem mais ou menos um padrão:

- formulário de cadastro
- formulário de atualização
- listagem de dados (geralmente tabela)
  - opção de exclusão
  - opção de visualização detalhada

Todas as ações relacionadas à manipulação de dados são realizadas a partir de requisições para a API. Estas requisições são realizadas com o Axios, passando sempre o token de autenticação do usuário como header da requisição.

## Principais Bibliotecas Utilizadas

### shadcn/ui

Biblioteca de componentes de interface de usuário para React.

### sweetalert

Biblioteca para criar alertas e modais com uma experiência de usuário agradável.

### react-input-mask

Componente React para mascarar inputs de texto conforme o usuário digita.

### date-fns

Biblioteca JavaScript moderna para manipulação de datas.

### firebase

Plataforma de desenvolvimento de aplicativos móveis e da web desenvolvida pela Google.

### jwt

Biblioteca para lidar com JSON Web Tokens (JWT) em aplicativos JavaScript.

### tailwind

Framework de design CSS de baixo nível que oferece utilitários prontos para uso.

### zod

Biblioteca de validação de esquemas para TypeScript e JavaScript.

### axios

Biblioteca para fazer requisições HTTP no navegador e no Node.js.

### phosphor-icons

Conjunto de ícones para projetos web.

### next-auth

Biblioteca de autenticação para Next.js, que oferece suporte para autenticação social, JWT, cookies, etc.

## Estrutura de Pastas

<p>
public </br>
src </br>
│ </br>
├── app </br>
│   ├── dashboard-routes </br>
│   └── api  </br>
│ </br>
├── components </br>
│ </br>
├── interfaces </br>
│ </br>
├── lib </br>
│ </br>
├── providers   </br>
│ </br>
└── types  </br>
</p>

### public

Esta pasta contém os arquivos estáticos do projeto, como imagens, fontes, etc.

### src

O código-fonte do projeto está localizado dentro desta pasta.

#### app

- **dashboard-routes:** Pasta protegida com as páginas internas do sistema, só é acessada após autenticação.
- **api:** Rotas para autenticação com Next Auth.

#### components

Contém arquivos de componentes genéricos e pastas de componentes relacionados a cada módulo da aplicação.

#### interfaces

Contém as principais interfaces utilizadas para relação com os dados providos pela API.

#### lib

Funções genéricas para reutilização em diversos arquivos.

#### providers

Configuração de autenticação.

#### types

Módulos de interfaces e construtores de componentes específicos do sistema.
