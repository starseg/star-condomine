# API Star Seg

## Requisitos
- CRUD nas tabelas:
    - usuarios
    - moradores
        - telefones
        - veiculos
    - portarias
        - ramais
    - visitantes
    - acessos
    - agendamentos
    - ocorrencias
    - problemas_portaria
    - calendarios_portaria
    - dispositivos
- login
- gerar relatórios
- abrir porta
    - senha
    - tag
    - facial

## Entidades
- usuarios (User)
- moradores (Resident)
- portarias (Lobby)
- visitantes (Visitor)
- acessos (Access)
- agendamentos (Schedule)
- telefones (Telephone)
- veiculos (Vehicle)
- tipos_endereco (AddressType)
- tipos_visitante (VisitorType)
- ocorrencias (Ocurrence)
- problemas_portaria (LobbyProblem)
- calendarios_portaria (LobbyCalendar)
- ramais (Extension)
- dispositivos (Device)
- modelos_dispositivo (DeviceModel)

## Enum
- tipos_usuario (UserType)
- tipos_acesso (AccessType)
- status (Status)
- acoes (Action)