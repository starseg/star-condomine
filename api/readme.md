<div style="display: flex; align-items: center; gap: 24px;">
  <img src="../web/public/logo.svg" alt="Logo do Star Condomine">
  <img height="48" src="https://github.com/micaelmi/star-condomine/assets/66328408/c9c754e5-5ebd-426c-bf90-01bc7ae383af" alt="Logo do Node">
  <img height="48" src="https://github.com/micaelmi/star-condomine/assets/66328408/c90d9b62-a5e7-43be-ad74-3e5f18392378" alt="Logo do Typescript">
  <img height="48" src="https://github.com/micaelmi/star-condomine/assets/66328408/3893a8c7-5ebf-40b1-8181-b3dc8001869a" alt="Logo do Prisma">
  <img height="48" src="https://github.com/micaelmi/star-condomine/assets/66328408/59c5a3da-012b-4208-bdb9-11b945bcbb26" alt="Logo do MySql">
</div>

# API
A API foi desenvolvida com Express (Node.js) + Typescript, para realizar interações com o banco de dados, atuando como um intermediário entre a aplicação web frontend e o banco de dados MySQL. 
Cada entidade do banco que necessita um CRUD tem seu arquivo com as devidas funções, que foram desenvolvidas para atender a cada chamada do frontend.
O banco de dados foi modelado com o Prisma ORM, de forma a ser integrado ao sistema e facilmente alterável, a partir das migrations.

## Modelagem do banco de dados
### Entidades primárias
- acessos (Access)
- dispositivos (Device)
- feedbacks (Feedback)
- portarias (Lobby)
- calendarios_portaria (LobbyCalendar)
- problemas_portaria (LobbyProblem)
- histórico de movimentações (Logging)
- membros (Member)
- notificações (Notification)
- operadores (Operator)
- agendamentos (Scheduling)
- listas de agendamentos (SchedulingList)
- tags (Tag)
- telefones (Telephone)
- veiculos (Vehicle)
- visitantes (Visitor)
### Entidades Auxiliares²
- modelos_dispositivo (DeviceModel)
- tipos_veiculo (VehicleType)
- tipos_endereco (AddressType)
- tipos_visitante (VisitorType)
- tipos_tag (TagType)
### Enum³
- tipos_membro (MemberType)
- tipos_portaria (LobbyType)
- tipos_usuario (UserType)
- status (Status)

¹ = entidades que necessitam um CRUD (total: 16) <br>
² = entidades que podem ser manipuladas diretamente no banco (total: 5) <br>
³ = enum, tipos já definidos diretamente no banco (total: 4)

## Estrutura da aplicação
- prisma:
    - definições do banco de dados (schema.prisma)
    - histórico de versões
- src:
    - app.ts:
        - arquivo principal
        - chamadas das funções de cada entidade
        - definição de rotas
        - definições de acesso
    - controllers:
        - um arquivo para cada entidade primária
        - funções do banco (CRUD)
        - filtros e validações
        - tratamento de erros
        - envio de respostas
    - middlewares:
        - funções especiais que executam juntamente a outras chamadas:
              - auth
              - logging
              - permissions
    - routes:
        - definições de rotas para cada função definida nos controllers.
        - seguem um padrão:
          - Buscar todos: GET "/"
          - Buscar por ID: GET "/find/:id"
          - Buscar por portaria: GET "/lobby/:lobby"
          - Cadastrar: POST "/"
          - Editar: PUT "/:id"
          - Deletar: DELETE "/:id"
        - Cada módulo pode ter suas peculiaridades
        - O Router de cada módulo é importado no app.ts, e a base da url é /nome_do_modulo
