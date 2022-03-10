module.exports = {
  apps: [
    {
      name: 'Burn-Bridge server',
      exec_mode: 'fork',
      instances: 1, // Or a number of instances
      script: 'yarn',
      args: 'start',
    },
  ],
};
