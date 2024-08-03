module.exports = {
  apps: [
    {
      name: "primary",
      script: "./server.js",
      instances: "1",
      exec_mode: "cluster",
      env_production: {
        name: "prod-primary",
        PORT: 3000,
        NODE_ENV: "PRODUCTION",
      },
      env_development: {
        name: "dev-primary",
        PORT: 3000,
        NODE_ENV: "DEVELOPMENT",
      },
    },
    {
      name: "replica",
      script: "./server.js",
      instances: "-1", //it will create max capacity-1 instances
      exec_mode: "cluster",
      env_production: {
        name: "prod-replica",
        PORT: 3000,
        NODE_ENV: "PRODUCTION",
      },
      env_development: {
        name: "dev-replica",
        PORT: 3000,
        NODE_ENV: "DEVELOPMENT",
      },
    },
  ],
};
