module.exports = {
  mongodbMemoryServerOptions: {
    instance: {
      dbName: "test",
    },
    binary: {
      version: "4.0.23",
      skipMD5: true,
    },
    autoStart: false,
  },
};
