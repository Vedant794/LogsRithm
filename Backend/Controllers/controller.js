require("dotenv").config();
const axios = require("axios");
const AdmZip = require("adm-zip");
const { processLogs, cleanLogs } = require("../Services/logExtract");

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const REDIRECT_URL = process.env.REDIRECT_URL;

const authentication = async (req, res) => {
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${REDIRECT_URL}&scope=repo,workflow`;
  res.redirect(githubAuthUrl);
};

const authenticationCallback = async (req, res) => {
  const code = req.query.code;
  if (!code)
    return res.status(400).json({ error: "Authorization code missing" });

  try {
    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: REDIRECT_URL,
      },
      { headers: { Accept: "application/json" } }
    );

    const accessToken = tokenResponse.data.access_token;
    if (!accessToken)
      return res.status(400).json({ error: "Failed to get access token" });

    console.log(accessToken);

    const userResponse = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const ownerName = userResponse.data.login;

    return res.redirect(
      `http://localhost:5000/dashboard?accessToken=${accessToken}&ownerName=${ownerName}`
    );
  } catch (error) {
    console.error("OAuth error:", error);
    res.status(500).json({ error: "OAuth failed" });
  }
};

const repositories = async (req, res) => {
  const accessToken = req.params.token;
  console.log(accessToken);
  if (!accessToken) return res.status(401).json({ error: "Unauthorized" });

  try {
    const response = await axios.get("https://api.github.com/user/repos", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const repoNames = response.data.map((a) => a.name);
    res.json({ repoNames });
  } catch (error) {
    console.error("GitHub API error:", error);
    res.status(500).json({ error: "Failed to fetch repositories" });
  }
};

const repoCommits = async (req, res) => {
  try {
    const { owner, repo } = req.params;
    if (!owner || !repo) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    const accessToken = req.params.token;

    if (!accessToken) {
      return res.status(401).json({ error: "Unauthorized User" });
    }

    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/commits`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(
      "GitHub Commit request error:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to fetch commits" });
  }
};

const extractId = async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const accessToken = req.params.token;
    if (!accessToken)
      return res.status(401).json({ error: "Unauthorized user" });
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/actions/runs`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    const temp = response.data.workflow_runs;

    let storeIds = temp.map(({ id, display_title }) => ({
      id,
      display_title,
    }));

    let successCount = 0;
    let failureCount = 0;
    let inProgressCount = 0;
    let cancelledCount = 0;

    temp.forEach((run) => {
      if (run.status === "completed") {
        if (run.conclusion === "success") successCount++;
        else if (run.conclusion === "failure") failureCount++;
        else if (run.conclusion === "cancelled") cancelledCount++;
      } else if (run.status === "in_progress") {
        inProgressCount++;
      }
    });

    // console.log(temp);

    res.json({
      storeIds,
      total_count: temp.total_count,
      success: successCount,
      failure: failureCount,
      Progress: inProgressCount,
      Cancel: cancelledCount,
    });
    // res.send(temp);
  } catch (error) {
    console.log("Action error:", error);
    res.status(500).json({ error: "Failed to fetch the Github Actions" });
  }
};

const getLogs = async (req, res) => {
  try {
    const { owner, repo, run_id } = req.params;
    const accessToken = req.params.token;
    if (!accessToken)
      return res.status(401).json({ error: "Unauthorized user" });

    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/actions/runs/${run_id}/logs`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        responseType: "arraybuffer", // 👈 Important: Fetch as binary data
      }
    );

    const zip = new AdmZip(response.data); // Extract the ZIP
    const zipEntries = zip.getEntries();

    let logs = {};
    zipEntries.forEach((entry) => {
      if (!entry.isDirectory) {
        const parts = entry.entryName.split("/");

        // Ensure we process files only inside a folder (not root-level files)
        if (parts.length > 1) {
          const folderName = parts[0]; // Extract the folder name
          const logText = entry.getData().toString("utf-8");

          // Initialize folder structure if it doesn't exist
          if (!logs[folderName]) logs[folderName] = {};

          // Process log text and store it under the correct folder
          logs[folderName][entry.entryName] = processLogs(logText);
        }
      }
    });

    const cleanedLog = cleanLogs(logs);

    // let sortedLogs = Object.keys(logs)
    //   .sort()
    //   .reduce((acc, key) => {
    //     acc[key] = logs[key];
    //     return acc;
    //   }, {});

    res.json({ cleanedLog });
  } catch (error) {
    console.log("Logs Error:", error);
    res.status(500).json({ error: "Failed to fetch Logs" });
  }
};

module.exports = {
  authentication,
  authenticationCallback,
  repositories,
  repoCommits,
  getLogs,
  extractId,
};
