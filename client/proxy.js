const proxyURI = require("http-proxy-middleware");
module.exports = function (app) {
  app.use(
    proxyURI("/api", { target: "http://localhost:5000/", secure: false })
  );
};
