import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  clearScreen: false,
  server: {
    host: '0.0.0.0',  // Changed localhost to 0.0.0.0
    cors: true,
    allowedHosts: true,
    watch: {
      usePolling: true,
      interval: 500,
    },
  },
  plugins: [
    react(),
    {
      name: "chariot",
      configureServer(server) {
        server.middlewares.use("/@chariot-logger", (req, res) => {
          let body = "";
          req.on("data", (chunk) => (body += chunk));
          req.on("end", () => {
            console.log("Client log:", body);
            res.statusCode = 200;
            res.end();
          });
        });
        server.middlewares.use("/@chariot-reload", (_req, res) => {
          server.ws.send({ type: "full-reload", path: "*" });
          res.end("Reload triggered");
        });
      },
    },
  ],
});