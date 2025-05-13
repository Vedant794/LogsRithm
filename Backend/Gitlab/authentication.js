require("dotenv").config();
const axios = require("axios");

const GITLAB_AUTHENTICATION_ID = process.env.GITLAB_AUTHENTICATION_ID;
const GITLAB_SECRET_ID = process.env.GITLAB_SECRET_ID;
const GITLAB_REDIRECT_URL = process.env.GITLAB_REDIRECT_URL;

const GITLAB_AUTH_URL = "https://gitlab.com/oauth/authorize";
const GITLAB_TOKEN_URL = "https://gitlab.com/oauth/token";
const GITLAB_API_URL = "https://gitlab.com/api/v4";

//Authenticate User
const gitlabAuthentication = async (req, res) => {
  const authUrl = `${GITLAB_AUTH_URL}?client_id=${GITLAB_AUTHENTICATION_ID}&redirect_uri=${GITLAB_REDIRECT_URL}&response_type=code&scope=read_api`;
  res.redirect(authUrl);
};

//Callback Function
const gitlabCallback = async (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(400).send("Missing code");

  try {
    const response = await axios.post(GITLAB_TOKEN_URL, null, {
      params: {
        client_id: GITLAB_AUTHENTICATION_ID,
        client_secret: GITLAB_SECRET_ID,
        code,
        grant_type: "authorization_code",
        redirect_uri: GITLAB_REDIRECT_URL,
      },
    });

    const { access_token } = response.data;
    res.cookie("gitlab_token", access_token, { httpOnly: true });
    res.redirect("http://localhost:3000/auth/gitlab/callback"); // Redirect to your frontend
  } catch (error) {
    res.status(500).send("OAuth error: " + error.message);
  }
};

//Generate all Projects
const getProjects = async (req, res) => {
  const access_token = req.cookies.gitlab_token;
  if (!access_token) res.status(404).send("Authentication Failed...");
  try {
    const response = await axios.get(
      `${GITLAB_API_URL}/projects?membership=true`,
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );
    const projects = response.data;
    if (!projects)
      res
        .status(404)
        .send("Unable to fetch the Project or You don't have any project");
    const projectName = projects.map((a) => a.name);
    const projectId = projects.map((a) => a.id);
    res.status(201).json({ projectName, projectId, projects });
  } catch (error) {
    res.status(500).json({
      Issue: `Due to some technical reason our server is not responding : ${error}`,
    });
  }
};

//Inside projects get all the pipelines
const getPipelines = async (req, res) => {
  const { projectId } = req.params;
  const access_token = req.cookies.gitlab_token;
  if (!projectId) res.status(404).send("No Project Found....");
  try {
    const response = await axios.get(
      `${GITLAB_API_URL}/projects/${projectId}/pipelines`,
      { headers: { Authorization: `Bearer ${access_token}` } }
    );
    const pipeline = response.data;
    if (!pipeline)
      res.status(404).send("Pipeline dosen't exists in your Project");
    const pipelineId = pipeline.map((a) => a.id);
    const status = pipeline.map((a) => a.status);
    res.status(200).json({ pipelineId, status });
  } catch (error) {
    res.status(500).send(`Some issue occured in our side : ${error}`);
  }
};

//Inside Pipeline get all the jobs
const getJobs = async (req, res) => {
  const access_token = req.cookies.gitlab_token;
  const { projectId, pipelineId } = req.params;
  try {
    const response = await axios.get(
      `${GITLAB_API_URL}/projects/${projectId}/pipelines/${pipelineId}/jobs`,
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );
    const jobs = response.data;
    if (!jobs) res.status(404).send("Unable to fetch Jobs");
    res.status(201).send(jobs);
  } catch (error) {
    res
      .status(500)
      .send(`Due to some issues at our end this issue occured : ${error}`);
  }
};

const getGitlabLogs = async (req, res) => {
  const { projectId, jobId } = req.params;
  const access_token = req.cookies.gitlab_token;

  try {
    const stripAnsi = (await import("strip-ansi")).default;

    const response = await axios.get(
      `${GITLAB_API_URL}/projects/${projectId}/jobs/${jobId}/trace`,
      {
        headers: { Authorization: `Bearer ${access_token}` },
        responseType: "arraybuffer",
      }
    );

    const rawLog = Buffer.from(response.data).toString("utf-8");
    const cleanLog = stripAnsi(rawLog);
    const logLines = cleanLog.split("\n").filter(Boolean);

    res.status(200).json({ logs: logLines });
  } catch (error) {
    res
      .status(500)
      .send(`Due to some issues at our end this issue occurred: ${error}`);
  }
};

module.exports = {
  gitlabAuthentication,
  gitlabCallback,
  getProjects,
  getPipelines,
  getJobs,
  getGitlabLogs,
};
