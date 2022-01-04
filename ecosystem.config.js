module.exports = {
  apps: [
    {
      name: "shield",
      script: "node_modules/.bin/next",
      args: "start -p 3000",
      cwd: "/home/administrator/Application/shield",
      instances: 5,
      exec_mode: "cluster",
      autorestart: true,
      watch: true,
      max_memory_restart: "1G",
    },
  ],
};
