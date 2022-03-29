let environment: string | null = null;
export const getEnvironment = () => {
  if (environment === null) {
    environment = process.env.NODE_ENV ?? "development";
  }
  return environment;
};

export const isProduction = () => getEnvironment() === "production";
