# API Star Condomine

## Requisitos
- registrar operadores do sistema
- registrar portarias
- registrar membros da portaria
- registrar visitantes
- registrar acesso à portaria
- registrar telefones do membro
- registrar veículos do membro
- registrar tags de acesso do membro
- registrar problemas na portaria
- registrar calendários de feriado da portaria
- registrar dispositivos de acesso da portaria
- entrar na plataforma (login)
- sair da plataforma (logoff)
- gerar relatórios
- monitorar acessos
- registrar saída do visitante


## Modelagem do banco de dados
### Entidades primárias
- Operadores (Operator)
- portarias (Lobby)
- membros (Member)
- visitantes (Visitor)
- acessos (Access)
- agendamentos (Schedule)
- telefones (Telephone)
- veiculos (Vehicle)
- tags (Tag)
- problemas_portaria (LobbyProblem)
- calendarios_portaria (LobbyCalendar)
- dispositivos (Device)
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

¹ = entidades que necessitam um CRUD (total: 12) <br>
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

## Ambiente de testes (insomnia)
- requisições http (http://localhost:3000/[parametros])
- padronização dos verbos http nas chamadas das funções:
    - BUSCAR TODOS:  method=GET     ("/entidade_plural")
    - BUSCAR UM:     method=GET     ("/entidade_plural/:id")
    - REGISTRAR:     method=POST    ("/entidade_plural") + body{json}
    - EDITAR:        method=PUT     ("/entidade_plural") + body{json}
    - DELETAR:       method=delete  ("/entidade_plural/:id")
