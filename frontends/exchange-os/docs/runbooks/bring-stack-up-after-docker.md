# Bring Stack Up After Docker Recovery

## Step 1 - Verify Docker and WSL
1. Run scripts/windows/docker-health.ps1.
2. Confirm Docker engine reports healthy.
3. Confirm required WSL distros are in Running or Stopped (not error) state.

## Step 2 - Start Core Services
1. Start Docker Desktop if not already running.
2. From repository root, run compose or service start commands used by this project.
3. Wait for all required containers/services to reach healthy state.

## Step 3 - Validate App Runtime
1. Run existing smoke checks if available.
2. Confirm local web app endpoint responds.
3. Confirm background workers and API endpoints start without crash loops.

## Step 4 - Validate Trade Desk Docs Tooling
1. Run npm run validate:trade-desk-docs.
2. Confirm validation returns PASS.

## Step 5 - Capture Evidence
1. Save command outputs to terminal log or ticket.
2. Note date/time, operator, and outcome.
3. Escalate if any service remains degraded after one retry cycle.
