module.exports = {
  apps: [
    {
      name: "Shield",
      script: "node_modules/.bin/next",
      args: "start -p 3000",
      cwd: "/home/blaviken/work-projects/shield",
      instances: "max",
      exec_mode: "cluster",
      autorestart: true,
      watch: true,
      max_memory_restart: "1G",
    },
  ],
};
