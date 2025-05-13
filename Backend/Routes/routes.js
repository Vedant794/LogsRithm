const express = require("express");

const router = express.Router();

const {
  authentication,
  authenticationCallback,
  repositories,
  repoCommits,
  extractId,
  getLogs,
} = require("../Controllers/controller");

const {
  gitlabAuthentication,
  gitlabCallback,
  getProjects,
  getPipelines,
  getJobs,
  getGitlabLogs,
} = require("../Gitlab/authentication");
router
  .get("/auth/github", authentication)
  .get("/auth/github/callback", authenticationCallback)
  .get("/user/repos/:token", repositories) //Gives aauthorized user repositories
  .get("/user/repos/:token/:owner/:repo/commits", repoCommits) //Gives all the commits in repos
  .get("/user/repos/:token/:owner/:repo/getId", extractId) //Gives me Id's for Logs
  .get("/user/repos/:token/:owner/:repo/:run_id/getLogs", getLogs) //Get logs of Day by day
  .get("/auth/gitlab", gitlabAuthentication) //Gitlab Authentication
  .get("/auth/gitlab/callback", gitlabCallback) //Gitlab Callback
  .get("/user/gitlab/projects", getProjects) //Gitlab Project URI
  .get("/user/gitlab/projects/:projectId/pipelines", getPipelines) //GitLab Pipelines
  .get("/user/gitlab/projects/:projectId/:pipelineId/jobs", getJobs) //GitLab Pipeline Jobs
  .get("/user/gitlab/projects/:projectId/:jobId/logs", getGitlabLogs);
module.exports = router;
