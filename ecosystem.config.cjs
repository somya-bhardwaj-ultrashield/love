module.exports = {
    apps: [
      {
        name: "love-today-admin",
        script: "npm",
        args: "start",  // change if your entry file is different
        instances: 1,
        exec_mode: "fork",
        autorestart: true,
        watch: false,
        max_memory_restart: "500M",
        env: {
          NODE_ENV: "production",
          PORT: 8081
        }
      }
    ]
  };