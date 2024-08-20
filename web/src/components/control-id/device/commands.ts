// LIST COMMAND
export const listUsersCommand = {
  verb: "POST",
  endpoint: "load_objects",
  body: { object: "users" },
  contentType: "application/json",
};
export const listAccessRulesCommand = {
  verb: "POST",
  endpoint: "load_objects",
  body: { object: "access_rules" },
  contentType: "application/json",
};
export const listAccessRuleTimeZonesCommand = {
  verb: "POST",
  endpoint: "load_objects",
  body: { object: "access_rule_time_zones" },
  contentType: "application/json",
};
export const listTimeZonesCommand = {
  verb: "POST",
  endpoint: "load_objects",
  body: { object: "time_zones" },
  contentType: "application/json",
};
export const listTimeSpansCommand = {
  verb: "POST",
  endpoint: "load_objects",
  body: { object: "time_spans" },
  contentType: "application/json",
};
export const listAreasCommand = {
  verb: "POST",
  endpoint: "load_objects",
  body: { object: "areas" },
  contentType: "application/json",
};
export const listGroupsCommand = {
  verb: "POST",
  endpoint: "load_objects",
  body: { object: "groups" },
  contentType: "application/json",
};
export const listPortalsCommand = {
  verb: "POST",
  endpoint: "load_objects",
  body: { object: "portals" },
  contentType: "application/json",
};
export const GetUserByIdCommand = (id: number) => {
  return {
    verb: "POST",
    endpoint: "load_objects",
    body: {
      object: "users",
      where: [
        {
          object: "users",
          field: "id",
          operator: "=",
          value: id,
        },
      ],
    },
    contentType: "application/json",
  };
};

// CREATION COMMANDS
export const createUserCommand = (
  id: number,
  name: string,
  registration: string = "",
  password: string = "",
  salt: string = ""
) => {
  return {
    verb: "POST",
    endpoint: "create_objects",
    body: {
      object: "users",
      values: [
        {
          id: id,
          name: name,
          registration: registration,
          password: password,
          salt: salt,
        },
      ],
    },
    contentType: "application/json",
  };
};
export const setUserFaceCommand = (
  user: number,
  file: string,
  timestamp: number
) => {
  return {
    verb: "POST",
    endpoint: `user_set_image_list`,
    contentType: "application/json",
    body: {
      match: true,
      user_images: [
        {
          user_id: user,
          image: file,
          timestamp: timestamp,
        },
      ],
    },
  };
};
export const createTimeZoneCommand = (id: number, name: string) => {
  return {
    verb: "POST",
    endpoint: "create_objects",
    body: {
      object: "time_zones",
      values: [
        {
          id: id,
          name: name,
        },
      ],
    },
    contentType: "application/json",
  };
};
export const createTimeSpanCommand = (
  id: number,
  time_zone_id: number,
  start: number,
  end: number,
  sun: number,
  mon: number,
  tue: number,
  wed: number,
  thu: number,
  fri: number,
  sat: number,
  hol1: number,
  hol2: number,
  hol3: number
) => {
  return {
    verb: "POST",
    endpoint: "create_objects",
    body: {
      object: "time_spans",
      values: [
        {
          id: id,
          time_zone_id: time_zone_id,
          start: start,
          end: end,
          sun: sun,
          mon: mon,
          tue: tue,
          wed: wed,
          thu: thu,
          fri: fri,
          sat: sat,
          hol1: hol1,
          hol2: hol2,
          hol3: hol3,
        },
      ],
    },
    contentType: "application/json",
  };
};
export const createAccessRuleCommand = (
  id: number,
  name: string,
  type: number,
  priority: number
) => {
  return {
    verb: "POST",
    endpoint: "create_objects",
    body: {
      object: "access_rules",
      values: [
        {
          id: id,
          name: name,
          type: type,
          priority: priority,
        },
      ],
    },
    contentType: "application/json",
  };
};
export const createGroupCommand = (id: number, name: string) => {
  return {
    verb: "POST",
    endpoint: "create_objects",
    body: {
      object: "groups",
      values: [
        {
          id: id,
          name: name,
        },
      ],
    },
    contentType: "application/json",
  };
};
export const createAreaCommand = (id: number, name: string) => {
  return {
    verb: "POST",
    endpoint: "create_objects",
    body: {
      object: "areas",
      values: [
        {
          id: id,
          name: name,
        },
      ],
    },
    contentType: "application/json",
  };
};
export const takePhotoCommand = {
  verb: "POST",
  endpoint: "remote_enroll",
  body: {
    type: "face",
    save: false,
    sync: true,
    auto: true,
    countdown: 5,
  },
  contentType: "application/json",
};

// RELATION COMMANDS
export const createUserGroupRelationCommand = (
  user_id: number,
  group_id: number
) => {
  return {
    verb: "POST",
    endpoint: "create_objects",
    body: {
      object: "user_groups",
      values: [
        {
          user_id: user_id,
          group_id: group_id,
        },
      ],
    },
    contentType: "application/json",
  };
};
export const createGroupAccessRuleRelationCommand = (
  group_id: number,
  access_rule_id: number
) => {
  return {
    verb: "POST",
    endpoint: "create_objects",
    body: {
      object: "group_access_rules",
      values: [
        {
          group_id: group_id,
          access_rule_id: access_rule_id,
        },
      ],
    },
    contentType: "application/json",
  };
};
export const createAreaAccessRuleRelationCommand = (
  area_id: number,
  access_rule_id: number
) => {
  return {
    verb: "POST",
    endpoint: "create_objects",
    body: {
      object: "area_access_rules",
      values: [
        {
          area_id: area_id,
          access_rule_id: access_rule_id,
        },
      ],
    },
    contentType: "application/json",
  };
};
export const createAccessRuleTimeZoneRelationCommand = (
  access_rule_id: number,
  time_zone_id: number
) => {
  return {
    verb: "POST",
    endpoint: "create_objects",
    body: {
      object: "access_rule_time_zones",
      values: [
        {
          access_rule_id: access_rule_id,
          time_zone_id: time_zone_id,
        },
      ],
    },
    contentType: "application/json",
  };
};
export const createPortalAccessRuleRelationCommand = (
  portal_id: number,
  access_rule_id: number
) => {
  return {
    verb: "POST",
    endpoint: "create_objects",
    body: {
      object: "portal_access_rules",
      values: [
        {
          portal_id: portal_id,
          access_rule_id: access_rule_id,
        },
      ],
    },
    contentType: "application/json",
  };
};

// MODIFY OBJECT
export const modifyObjectCommand = (
  object: string,
  values: object,
  where: object
) => {
  return {
    verb: "POST",
    endpoint: "modify_objects",
    body: {
      object: object,
      values: values,
      where: where,
    },
    contentType: "application/json",
  };
};

//DESTRUCTION COMMAND
export const destroyObjectCommand = (name: string, where: object = {}) => {
  return {
    verb: "POST",
    endpoint: "destroy_objects",
    body: {
      object: name,
      where: where,
    },
    contentType: "application/json",
  };
};

//OPEN DOOR
export const openDoorCommand = {
  verb: "POST",
  endpoint: "execute_actions",
  body: { actions: [{ action: "sec_box", parameters: "id=65793, reason=3" }] },
  contentType: "application/json",
};
