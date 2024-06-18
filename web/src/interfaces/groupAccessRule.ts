interface GroupAccessRule {
  groupAccessRuleId: number;
  accessRuleId: number;
  accessRule: {
    name: string;
  };
  groupId: number;
  group: {
    name: string;
  };
}
