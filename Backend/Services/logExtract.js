function processLogs(logText) {
  const structuredLogs = {};
  let currentGroup = null;
  let stepLogs = [];
  let hasGroups = false;
  let hasContent = false;

  function removeANSI(line) {
    return line.replace(/\x1B\[[0-9;]*[mK]/g, "").trim();
  }

  // Remove unwanted GitHub setup logs
  const IGNORED_PATTERNS = [
    "Starting workflow run",
    "Complete job name",
    "Temporarily overriding HOME",
    "Adding repository directory to the temporary git global config",
    "Disabling automatic garbage collection",
    "Setting up auth",
    "Fetching repository",
    "Determining the checkout info",
    "Post job cleanup",
    "[command]/usr/bin/git",
  ];

  const logLines = logText.includes("\n") ? logText.split("\n") : [logText];

  logLines.forEach((line) => {
    // Remove timestamps
    line = removeANSI(line);
    line = line
      .replace(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{6,7}Z\s/, "")
      .trim();

    // Ignore unwanted metadata
    if (IGNORED_PATTERNS.some((pattern) => line.includes(pattern))) return;

    // 🔹 Handle Grouped Logs
    if (line.startsWith("##[group]")) {
      if (currentGroup !== null) {
        structuredLogs[currentGroup] = stepLogs.length
          ? stepLogs
          : ["(No additional logs)"];
      }
      currentGroup = line.replace("##[group]", "").trim();
      stepLogs = [];
      hasGroups = true;
    } else if (line.startsWith("##[endgroup]")) {
      if (currentGroup !== null) {
        structuredLogs[currentGroup] = stepLogs.length
          ? stepLogs
          : ["(No additional logs)"];
      }
      currentGroup = null;
      stepLogs = [];
    } else {
      hasContent = true;
      if (currentGroup) {
        stepLogs.push(line);
      } else {
        if (!structuredLogs["SingleLogs"]) {
          structuredLogs["SingleLogs"] = [];
        }
        structuredLogs["SingleLogs"].push(line);
      }
    }
  });

  // Store last group if exists
  if (currentGroup !== null) {
    structuredLogs[currentGroup] = stepLogs.length
      ? stepLogs
      : ["(No additional logs)"];
  }

  // Ensure single-line logs are stored
  if (!hasGroups && hasContent) {
    structuredLogs["SingleLogs"] = logLines.length
      ? logLines
      : ["(No additional logs)"];
  }

  // If file is completely empty, add a placeholder
  if (!hasContent) {
    structuredLogs["(No logs found)"] = [];
  }

  // Sort grouped logs alphabetically
  return sortLogsByStepNumber(structuredLogs);
}

function cleanLogs(logs) {
  const REMOVE_PATTERNS = [
    "Fetching the repository",
    "remote: Enumerating objects",
    "remote: Counting objects",
    "remote: Compressing objects",
    "remote: Total",
    "From https://github.com/",
    "[command]/usr/bin/git",
    "hint:",
  ];

  function process(logData) {
    if (Array.isArray(logData)) {
      return logData
        .map((line) =>
          line
            .replace(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{6,7}Z\s/, "")
            .trim()
        ) // Remove timestamps
        .filter(
          (line) => !REMOVE_PATTERNS.some((pattern) => line.includes(pattern))
        ) // Remove unwanted logs
        .filter((line) => line !== ""); // Remove empty lines
    } else if (typeof logData === "object" && logData !== null) {
      const cleanedObject = {};
      for (const key in logData) {
        const cleanedValue = process(logData[key]);
        if (cleanedValue && Object.keys(cleanedValue).length > 0) {
          cleanedObject[key] = cleanedValue;
        }
      }
      return Object.keys(cleanedObject).length > 0 ? cleanedObject : null; // Remove empty objects
    }
    return logData;
  }

  return process(logs);
}

function sortLogsByStepNumber(logs) {
  return Object.keys(logs)
    .sort((a, b) => {
      const numA =
        parseInt(
          a
            .split("/")
            .pop()
            .match(/^(\d+)_/)?.[1]
        ) || 0;
      const numB =
        parseInt(
          b
            .split("/")
            .pop()
            .match(/^(\d+)_/)?.[1]
        ) || 0;
      return numA - numB;
    })
    .reduce((acc, key) => {
      acc[key] = logs[key];
      return acc;
    }, {});
}

module.exports = { processLogs, cleanLogs };
