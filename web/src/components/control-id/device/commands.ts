export const listUsersCommand = {
  verb: "POST",
  endpoint: "load_objects",
  body: { object: "users" },
  contentType: "application/json",
};

export const createUserCommand = (
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
