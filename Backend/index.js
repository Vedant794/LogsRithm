//Import Dependencies
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const router = require("./Routes/routes");
const { Server } = require("socket.io");
const http = require("http");
const cookieParser = require("cookie-parser");

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});
//Add Some middlewares
app.use(express.json());
app.use(cors({ credentials: true }));
app.use(cookieParser());

app.use("/", router);

//Webhook Setup kardiya

app.post("/webhook", async (req, res) => {
  const payload = req.body;

  if (payload.workflow_run) {
    const { id, status, conclusion } = payload.workflow_run;
    const owner = payload.repository.owner.login;
    const repo = payload.repository.name;

    if (status === "in_progress") {
      io.emit("workflowStarted", { owner, repo, run_id: id });
    }

    if (status === "completed") {
      io.emit("workflowCompleted", { owner, repo, run_id: id, conclusion });

      // Create a fake logs zip file or get the real one
      const zipFilePath = path.join(__dirname, "logs", `logs-${id}.zip`);

      // Ensure file exists
      if (fs.existsSync(zipFilePath)) {
        const form = new FormData();
        form.append("service_id", process.env.SERVICE_ID);
        form.append("template_id", process.env.TEMPLATE_ID);
        form.append("user_id", process.env.PUBLIC_KEY);

        form.append(
          "template_params[message]",
          `Workflow ${id} completed with status: ${conclusion}`
        );
        form.append("template_params[owner]", owner);
        form.append("template_params[repo]", repo);

        // Add file
        form.append(
          "files.zip",
          fs.createReadStream(zipFilePath),
          `logs-${id}.zip`
        );

        try {
          const response = await axios.post(
            "https://api.emailjs.com/api/v1.0/email/send-form",
            form,
            {
              headers: form.getHeaders(),
            }
          );

          console.log("Email sent:", response.data);
        } catch (error) {
          console.error("EmailJS error:", error.message);
        }
      } else {
        console.warn("No log file found to send.");
      }
    }
  }

  res.status(200).send("Webhook received");
});

io.on("connection", (socket) => {
  console.log("A client connected");
  socket.on("disconnect", () => console.log("Client disconnected"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on Port:${PORT}`));
