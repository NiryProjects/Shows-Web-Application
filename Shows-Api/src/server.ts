import debugModule from "debug";
import http from "http";
import app from "./app";

const debug = debugModule("node-angular");

// ─── Port Normalization ─────────────────────────────────────────────────────

const normalizePort = (val: string): string | number | false => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
};

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

// ─── HTTP Server ────────────────────────────────────────────────────────────

const server = http.createServer(app);

const onError = (error: NodeJS.ErrnoException): void => {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind =
    typeof port === "string" ? "pipe " + port : "port " + port;

  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = (): void => {
  const addr = server.address();
  const bind =
    typeof addr === "string" ? "pipe " + addr : "port " + port;
  debug("Listening on " + bind);
};

server.on("error", onError);
server.on("listening", onListening);
server.listen(port);
