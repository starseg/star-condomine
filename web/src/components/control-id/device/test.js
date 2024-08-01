const access_rules = {
  access_rules: [
    {
      id: 11,
      name: "Regra de acesso total",
      type: 1,
      priority: 1,
    },
    {
      id: 12,
      name: "Regra de Funcionários Padrão",
      type: 1,
      priority: 1,
    },
    {
      id: 13,
      name: "Regra Dia",
      type: 1,
      priority: 1,
    },
    {
      id: 14,
      name: "Regra Noite",
      type: 1,
      priority: 1,
    },
    {
      id: 22,
      name: "(access_rules automatically created for groups 6)",
      type: 1,
      priority: 0,
    },
    {
      id: 23,
      name: "(access_rules automatically created for groups 7)",
      type: 1,
      priority: 0,
    },
    {
      id: 24,
      name: "(access_rules automatically created for groups 10)",
      type: 1,
      priority: 0,
    },
  ],
};

const time_zones = {
  time_zones: [
    { id: 1, name: "Sempre Liberado" },
    { id: 2, name: "Horário Comercial" },
    { id: 5, name: "Horário Total" },
    { id: 6, name: "Horário Noturno" },
    { id: 7, name: "Horário Diurno" },
  ],
};

const access_rule_time_zones = {
  access_rule_time_zones: [
    {
      access_rule_id: 22,
      time_zone_id: 7,
    },
    {
      access_rule_id: 12,
      time_zone_id: 2,
    },
    {
      access_rule_id: 23,
      time_zone_id: 6,
    },
    {
      access_rule_id: 11,
      time_zone_id: 5,
    },
    {
      access_rule_id: 24,
      time_zone_id: 5,
    },
  ],
};
