import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  clearScreen: false,
  server: {
    host: "0.0.0.0", // Changed localhost to 0.0.0.0
    cors: true,
    allowedHosts: [
      "fced7515-fb16-4e19-b53a-6186490e5ee4-00-3hi0fjy6x7qz8.riker.replit.dev",
    ],
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
