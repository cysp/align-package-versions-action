import * as core from "@actions/core";
import {
  alignPackageVersions,
  loadConfiguration,
  loadWorkspacePackageJsons,
} from "@cysp/align-package-versions";

async function main() {
  const config = await loadConfiguration();
  if (!config) {
    core.debug("No configuration found.");
    return;
  }

  const packageJsons = await loadWorkspacePackageJsons(".", ".");
  let anyModified = false;

  for (const pattern of config.patterns) {
    core.info(`${pattern}`);
    const [modified, version] = alignPackageVersions(packageJsons, pattern);
    if (modified) {
      core.info(`  ${version}`);
    } else {
      core.info("  ~");
    }
    anyModified ||= modified;
  }

  await Promise.all(packageJsons.map((packageJson) => packageJson.save()));

  core.setOutput("modified", anyModified);
}

void main();
