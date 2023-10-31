# API Star Seg

## Requisitos
01. cadastrar usuarios
02. fazer login
03. cadastrar dispositivo
04. cadastrar portarias
05. cadastrar moradores
    - dados pessoais
    - foto
    - senha
06. cadastrar visitantes
    - dados pessoais
07. cadastrar prestadores de serviço
08. abrir porta
    - por reconhecimento facial
    - por senha
    - por portaria
09. agendar liberações
10. registrar problemas na portaria
11. registrar acessos
12. gerar relatórios
13. registrar ocorrências

## Entidades
- usuarios (User)
- moradores (Resident)
- portarias (Lobby)
- visitantes (Visitor)
- acessos (Access)
- agendamentos (Schedule)
- teletfones (Telephone)
- veiculos (Vehicle)
- tipos_endereco (AddressType)
- tipos_visitante (VisitorType)
- ocorrencias (Ocurrence)
- problemas_portaria (LobbyProblem)
- calendarios_portaria (LobbyCalendar)
- ramais (Extension)
## Enum
- tipos_usuario (UserType)
- tipos_acesso (AccessType)
- status (Status)
- acoes (Action)