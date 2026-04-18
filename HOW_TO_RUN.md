# TECH2102 Group 2 — How to Run & Submit

This guide walks you from zero to a green Jenkins pipeline and the three required screenshots for submission. Estimated time: 20–40 minutes.

## 0. Project Layout

```
tech2102-project/
├── Dockerfile              # Builds & runs the app with Node.js
├── Jenkinsfile             # 4 stages: Build, Test, Docker Build, Run Container
├── package.json            # React + testing deps
├── public/
│   └── index.html
└── src/
    ├── App.js              # Shows "Group 2" + team member "Tom"
    ├── App.test.js         # 4 tests that verify what's rendered
    ├── App.css
    ├── index.css
    ├── index.js
    └── setupTests.js
```

## 1. Prerequisites (verify these first)

Open **Command Prompt** (not PowerShell — Jenkins' `bat` step matches cmd behavior) and run:

```cmd
node --version        REM should be v18+ (v22 is fine)
npm  --version
docker --version
docker ps             REM must succeed; proves Docker daemon is running
```

Jenkins needs `npm` and `docker` on its PATH. Quickest check: in Jenkins UI go to **Manage Jenkins → System Information** and look at the `PATH` variable. If either is missing, either:
- add them to the Windows System PATH and restart the Jenkins service, OR
- set them explicitly in the Jenkinsfile `environment { ... }` block using `PATH = "C:\\Program Files\\nodejs;${env.PATH}"` style.

Also confirm Jenkins is reachable — typically at **http://localhost:8080**.

## 2. Put the project where Jenkins can read it

You have two reasonable options. Option A (local folder) is the simplest if you don't want to touch git.

### Option A — Point Jenkins at the local folder

1. Copy the entire `tech2102-project` folder somewhere stable, e.g. `C:\jenkins-work\tech2102-project`.
2. (Optional smoke test) Open Command Prompt in that folder and run:
   ```cmd
   npm install
   npm test -- --watchAll=false
   npm start
   ```
   This launches the app at http://localhost:3000. Confirm it shows "Group 2" and "Tom". Stop with `Ctrl+C`. (This is optional — Jenkins will do the same thing.)

### Option B — Push to GitHub (recommended for realism)

1. Create a new GitHub repo (e.g. `tech2102-group2`).
2. In Command Prompt in the project folder:
   ```cmd
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<your-username>/tech2102-group2.git
   git push -u origin main
   ```

## 3. Create the Jenkins Pipeline job

1. Open Jenkins at **http://localhost:8080** and sign in.
2. Click **New Item** (top-left).
3. Name it `tech2102-group2`, choose **Pipeline**, click **OK**.
4. Scroll down to the **Pipeline** section and configure it based on the option you picked:

   **If you chose Option A (local folder):**
   - Definition: **Pipeline script from SCM** won't help here — use **Pipeline script** instead.
   - In the big script box, paste the entire contents of the `Jenkinsfile`.
   - BUT: the `bat 'npm install'` step runs wherever Jenkins' workspace is, not your folder. So we need to add a checkout-ish step. Easiest: **before the first `stage('Build')`** insert this:
     ```groovy
     stage('Checkout') {
         steps {
             bat 'xcopy /E /Y /I "C:\\jenkins-work\\tech2102-project\\*" .'
         }
     }
     ```
     (Adjust the source path to wherever you copied the folder.)

   **If you chose Option B (GitHub):**
   - Definition: **Pipeline script from SCM**
   - SCM: **Git**
   - Repository URL: your GitHub URL
   - Branch: `*/main`
   - Script Path: `Jenkinsfile` (default)

5. Click **Save**.

## 4. Run the pipeline

1. On the job page, click **Build Now** (left sidebar).
2. Watch the **Stage View** at the top of the page. You should see four (or five with Checkout) stages light up green in sequence:
   - **Build** — `npm install` (~1–2 minutes on first run)
   - **Test** — `npm test` (runs `App.test.js`, ~15–30 seconds)
   - **Docker Build** — `docker build` (~2–3 minutes on first run)
   - **Run Container** — `docker run -d -p 3000:3000 ...`
3. Click into the build number (e.g. `#1`) → **Console Output** to see full logs.

## 5. Verify the running app

After the pipeline completes successfully:

1. Open **http://localhost:3000** in your browser.
2. You should see a clean card with:
   - "TECH2102 — Enterprise Computing"
   - "**Group 2**" in large blue text
   - "Tom" in the Team Members list

If you see an older cached version, hard-refresh with `Ctrl+F5`.

If port 3000 is already in use, change `HOST_PORT` in the Jenkinsfile `environment` block to e.g. `3001` and re-run.

## 6. Take the three required screenshots

The project spec requires three screenshots. Here's exactly what to capture:

### Screenshot 1 — Jenkins pipeline (all stages)
- Go to the job page (not the build page) so the **Stage View** table is visible with all four stages green.
- Make sure the **top-right corner** of Jenkins shows **your username** (click your profile initial if you need to confirm which account is logged in — the spec requires your username to be visible).
- Capture the full browser window. Windows: **Win + Shift + S** → select rectangular region.

### Screenshot 2 — App running in browser
- Open **http://localhost:3000** in a new tab.
- Capture the page so "**Group 2**" and "**Tom**" are clearly visible.
- Also make sure the URL bar shows `localhost:3000` — that's how graders know it's the containerized app.

### Screenshot 3 — Docker build or Jenkins console output
Either works. Easiest is the Jenkins console:
- Go into the successful build → **Console Output**.
- Scroll to the `Docker Build` stage section so you see lines like `Successfully built <hash>` and `Successfully tagged tech2102-group2:latest`.
- Capture that region.

Alternative: open Command Prompt and run `docker images tech2102-group2` — screenshot the output.

## 7. Put the submission document together

1. Open Word (or Google Docs).
2. Title the document `TECH2102 Project – Group 2 – Tom`.
3. Add three clearly labeled sections:
   - **1. Jenkins Pipeline** — insert Screenshot 1, caption "All four stages successful. Logged in as [your username]."
   - **2. Application in Browser** — insert Screenshot 2, caption "App running at localhost:3000 in Docker container."
   - **3. Docker Build Output** — insert Screenshot 3, caption "Docker image built successfully by Jenkins."
4. Save as PDF or .docx and upload to D2L.

## Troubleshooting

| Problem | Fix |
|---|---|
| `bat` step fails with "npm not recognized" | Jenkins service can't see npm on PATH. Restart Jenkins after adding `C:\Program Files\nodejs` to System PATH. |
| `docker: command not found` | Same as above but for Docker Desktop's CLI path (`C:\Program Files\Docker\Docker\resources\bin`). |
| Tests hang (never exit) | Make sure Jenkinsfile uses `npm test -- --watchAll=false` and `CI=true` is set (both are already in the provided Jenkinsfile). |
| `port is already allocated` | Another container is using 3000. Run `docker rm -f tech2102-group2-container` then rerun the pipeline, or change `HOST_PORT` in the Jenkinsfile. |
| Page loads but shows "You need to enable JavaScript" | Docker image didn't copy the build. Re-run the `Docker Build` stage — the multi-stage Dockerfile requires the `COPY --from=build` line to match the build stage name. |
| Jenkins uses `sh` not `bat` (Linux agent) | Find-and-replace `bat ` with `sh ` throughout the Jenkinsfile, and swap `%VAR%` syntax for `$VAR`. |

## What's in each file (quick reference)

- **`src/App.js`** — Renders Group 2 + team members array. To change the team list, edit the `TEAM_MEMBERS` array at the top.
- **`src/App.test.js`** — Four Jest tests: course heading, group number, team member name, and list rendering. Satisfies the "create a test to verify what is displayed" requirement.
- **`Jenkinsfile`** — Four stages as required by the spec. Uses Windows `bat` syntax. Sets `CI=true` so tests exit automatically.
- **`Dockerfile`** — Two-stage build: stage 1 builds the React bundle, stage 2 serves it on port 3000 using the `serve` Node.js package. Satisfies "copy your application and run it using Node.js".
