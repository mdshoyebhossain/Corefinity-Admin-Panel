      // Mock Data
      const deploymentsList = [
        {
          id: "DEP-001",
          env: "production",
          commit: "a1b2c3d",
          status: "success",
          date: "2025-04-10",
          time: "14:32",
          author: "Alex Rivera",
        },
        {
          id: "DEP-002",
          env: "staging",
          commit: "e4f5g6h",
          status: "running",
          date: "2025-04-14",
          time: "09:15",
          author: "Sarah Chen",
        },
        {
          id: "DEP-003",
          env: "production",
          commit: "i7j8k9l",
          status: "failed",
          date: "2025-04-12",
          time: "22:00",
          author: "Mike Johnson",
        },
        {
          id: "DEP-004",
          env: "development",
          commit: "m0n1o2p",
          status: "success",
          date: "2025-04-13",
          time: "11:20",
          author: "Emma Wilson",
        },
      ];

      const ticketsList = [
        {
          id: "TKT-101",
          title: "SSL renewal failed for main domain",
          status: "open",
          priority: "high",
          updated: "2025-04-14",
          customer: "Acme Corp",
          time: "2 hours ago",
        },
        {
          id: "TKT-102",
          title: "Deployment timeout on staging environment",
          status: "in progress",
          priority: "medium",
          updated: "2025-04-13",
          customer: "TechStart Inc",
          time: "1 day ago",
        },
        {
          id: "TKT-103",
          title: "Firewall whitelist request for new office IP",
          status: "closed",
          priority: "low",
          updated: "2025-04-10",
          customer: "Global Solutions",
          time: "4 days ago",
        },
        {
          id: "TKT-104",
          title: "Database connection pool exhaustion",
          status: "open",
          priority: "high",
          updated: "2025-04-14",
          customer: "Ecom Store",
          time: "5 hours ago",
        },
      ];

      const pipelineRecords = [
        {
          name: "main-pipeline",
          repo: "corefinity/app",
          branch: "main",
          lastRun: "2025-04-14",
          status: "success",
          duration: "2m 34s",
        },
        {
          name: "staging-pipeline",
          repo: "corefinity/app-staging",
          branch: "develop",
          lastRun: "2025-04-13",
          status: "running",
          duration: "1m 12s",
        },
      ];

      const sshKeys = [
        {
          name: "MacBook Pro - Alex",
          fingerprint: "SHA256:abc123def456...",
          added: "2025-02-01",
          lastUsed: "2025-04-14",
        },
        {
          name: "CI/CD Runner",
          fingerprint: "SHA256:xyz789uvw012...",
          added: "2025-03-10",
          lastUsed: "2025-04-14",
        },
        {
          name: "Admin Workstation",
          fingerprint: "SHA256:lmn345opq678...",
          added: "2025-04-01",
          lastUsed: "2025-04-12",
        },
      ];

      let charts = {};
      let sidebarCollapsed = false;

      // Theme Management
      function initTheme() {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark") {
          document.body.classList.add("dark");
          document.getElementById("themeToggle").innerHTML =
            '<i class="fas fa-sun"></i>';
        } else {
          document.body.classList.remove("dark");
          document.getElementById("themeToggle").innerHTML =
            '<i class="fas fa-moon"></i>';
        }
      }

      function toggleTheme() {
        document.body.classList.toggle("dark");
        const isDark = document.body.classList.contains("dark");
        localStorage.setItem("theme", isDark ? "dark" : "light");
        const themeIcon = document.getElementById("themeToggle");
        if (isDark) {
          themeIcon.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
          themeIcon.innerHTML = '<i class="fas fa-moon"></i>';
        }
        // Refresh charts to adapt to new theme
        if (charts.deploy) charts.deploy.update();
        if (charts.env) charts.env.update();
      }

      function closeMobileMenu() {
        document.getElementById("sidebar")?.classList.remove("mobile-open");
        document.getElementById("mobileOverlay")?.classList.remove("active");
      }

      function openMobileMenu() {
        document.getElementById("sidebar")?.classList.add("mobile-open");
        document.getElementById("mobileOverlay")?.classList.add("active");
      }

      function renderPage(pageId) {
        const container = document.getElementById("mainContent");
        if (pageId === "dashboard") renderDashboard(container);
        else if (pageId === "deployments") renderDeployments(container);
        else if (pageId === "environments") renderEnvironments(container);
        else if (pageId === "profile") renderUserProfile(container);
        else if (pageId === "tickets") renderTicketListing(container);
        else if (pageId === "ticketview") renderTicketView(container);
        else if (pageId === "settings") renderSettings(container);
        else if (pageId === "logout") {
          alert("You have been logged out successfully");
          return;
        }

        document
          .querySelectorAll(".nav-item")
          .forEach((el) => el.classList.remove("active"));
        const activeNav = document.querySelector(
          `.nav-item[data-page="${pageId}"]`
        );
        if (activeNav) activeNav.classList.add("active");
        closeMobileMenu();
      }

      function renderDashboard(container) {
        container.innerHTML = `
      <div class="stats-grid">
        <div class="stat-card"><div class="stat-info"><h4>Total Deployments</h4><div class="stat-number">147</div><small>↑ +12% this month</small></div><div class="stat-icon"><i class="fas fa-rocket"></i></div></div>
        <div class="stat-card"><div class="stat-info"><h4>Active Environments</h4><div class="stat-number">8</div><small>4 production ready</small></div><div class="stat-icon"><i class="fas fa-cloud"></i></div></div>
        <div class="stat-card"><div class="stat-info"><h4>Open Tickets</h4><div class="stat-number">12</div><small>3 high priority</small></div><div class="stat-icon"><i class="fas fa-ticket-alt"></i></div></div>
        <div class="stat-card"><div class="stat-info"><h4>System Uptime</h4><div class="stat-number">99.99%</div><small>Last 30 days</small></div><div class="stat-icon"><i class="fas fa-chart-line"></i></div></div>
      </div>
      <div class="charts-row">
        <div class="chart-card"><h3><i class="fas fa-chart-line"></i> Deployment Trends (Last 7 Days)</h3><canvas id="deployChart"></canvas></div>
        <div class="chart-card"><h3><i class="fas fa-chart-pie"></i> Environment Distribution</h3><canvas id="envChart"></canvas></div>
      </div>
      <div class="card"><div class="card-header"><h3><i class="fas fa-clock"></i> Recent Deployments</h3><button class="btn btn-primary btn-sm" onclick="renderPage('deployments')">View All <i class="fas fa-arrow-right"></i></button></div><div class="table-wrapper"><table class="data-table"><thead><tr><th>ID</th><th>Environment</th><th>Commit</th><th>Author</th><th>Status</th><th>Date</th><th>Time</th></tr></thead><tbody>${deploymentsList
        .slice(0, 3)
        .map(
          (d) =>
            `<tr><td><strong>${d.id}</strong></td><td>${d.env}</td><td><code>${
              d.commit
            }</code></td><td>${d.author}</td><td><span class="badge ${
              d.status === "success"
                ? "badge-success"
                : d.status === "running"
                ? "badge-warning"
                : "badge-danger"
            }">${d.status}</span></td><td>${d.date}</td><td>${d.time}</td></tr>`
        )
        .join("")}</tbody></table></div></div>
      <div class="card"><div class="card-header"><h3><i class="fas fa-exclamation-triangle"></i> Active Tickets</h3><button class="btn btn-primary btn-sm" onclick="renderPage('tickets')">View All <i class="fas fa-arrow-right"></i></button></div><div class="table-wrapper"><table class="data-table"><thead><tr><th>ID</th><th>Title</th><th>Customer</th><th>Priority</th><th>Status</th><th>Updated</th></tr></thead><tbody>${ticketsList
        .filter((t) => t.status !== "closed")
        .slice(0, 3)
        .map(
          (t) =>
            `<tr><td>${t.id}</td><td>${t.title}</td><td>${
              t.customer
            }</td><td><span class="badge ${
              t.priority === "high" ? "badge-danger" : "badge-warning"
            }">${t.priority}</span></td><td><span class="badge badge-info">${
              t.status
            }</span></td><td>${t.time}</td></tr>`
        )
        .join("")}</tbody></td></div></div>
    `;

        const ctx1 = document.getElementById("deployChart")?.getContext("2d");
        const ctx2 = document.getElementById("envChart")?.getContext("2d");
        const isDark = document.body.classList.contains("dark");
        const textColor = isDark ? "#cbd5e1" : "#475569";
        const gridColor = isDark ? "#334155" : "#e2e8f0";

        if (ctx1) {
          if (charts.deploy) charts.deploy.destroy();
          charts.deploy = new Chart(ctx1, {
            type: "line",
            data: {
              labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
              datasets: [
                {
                  label: "Deployments",
                  data: [12, 19, 15, 17, 14, 10, 8],
                  borderColor: "#3b82f6",
                  backgroundColor: "rgba(59, 130, 246, 0.1)",
                  tension: 0.4,
                  fill: true,
                  pointBackgroundColor: "#3b82f6",
                  pointBorderColor: "#ffffff",
                  pointRadius: 4,
                  pointHoverRadius: 6,
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: true,
              plugins: { legend: { labels: { color: textColor } } },
              scales: {
                y: { grid: { color: gridColor }, ticks: { color: textColor } },
                x: { ticks: { color: textColor }, grid: { color: gridColor } },
              },
            },
          });
        }
        if (ctx2) {
          if (charts.env) charts.env.destroy();
          charts.env = new Chart(ctx2, {
            type: "doughnut",
            data: {
              labels: ["Production", "Staging", "Development", "Testing"],
              datasets: [
                {
                  data: [4, 2, 1, 1],
                  backgroundColor: ["#3b82f6", "#f59e0b", "#10b981", "#8b5cf6"],
                  borderWidth: 0,
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: true,
              plugins: {
                legend: {
                  position: "bottom",
                  labels: { color: textColor, padding: 15 },
                },
              },
            },
          });
        }
      }

      function renderDeployments(container) {
        container.innerHTML = `<div class="card"><div class="card-header"><h3><i class="fas fa-history"></i> All Deployments</h3><button class="btn btn-primary" id="newDeployBtn"><i class="fas fa-plus"></i> New Deployment</button></div><div class="table-wrapper"><table class="data-table"><thead><tr><th>ID</th><th>Environment</th><th>Commit</th><th>Author</th><th>Status</th><th>Date</th><th>Time</th><th>Actions</th></tr></thead><tbody>${deploymentsList
          .map(
            (d) =>
              `<tr><td><strong>${d.id}</strong></td><td>${
                d.env
              }</td><td><code>${d.commit}</code></td><td>${
                d.author
              }</td><td><span class="badge ${
                d.status === "success"
                  ? "badge-success"
                  : d.status === "running"
                  ? "badge-warning"
                  : "badge-danger"
              }">${d.status}</span></td><td>${d.date}</td><td>${
                d.time
              }</td><td><button class="btn-outline btn-sm btn" onclick="alert('Rollback ${
                d.id
              }')"><i class="fas fa-undo"></i> Rollback</button> <button class="btn-outline btn-sm btn" onclick="alert('Logs for ${
                d.id
              }')"><i class="fas fa-file-alt"></i> Logs</button></td></tr>`
          )
          .join(
            ""
          )}</tbody></table></div></div><div class="card"><div class="card-header"><h3><i class="fas fa-code-branch"></i> Pipeline Configuration</h3></div><div class="table-wrapper"><table class="data-table"><thead><tr><th>Pipeline</th><th>Repository</th><th>Branch</th><th>Last Run</th><th>Duration</th><th>Status</th></tr></thead><tbody>${pipelineRecords
          .map(
            (p) =>
              `<tr><td><i class="fas fa-cog"></i> ${p.name}</td><td>${
                p.repo
              }</td><td>${p.branch}</td><td>${p.lastRun}</td><td>${
                p.duration
              }</td><td><span class="badge ${
                p.status === "success" ? "badge-success" : "badge-warning"
              }">${p.status}</span></td></tr>`
          )
          .join("")}</tbody></table></div></div>`;
        document
          .getElementById("newDeployBtn")
          ?.addEventListener("click", () =>
            alert("✨ New deployment wizard started")
          );
      }

      function renderEnvironments(container) {
        container.innerHTML = `<div class="card"><div class="card-header"><h3><i class="fas fa-cloud"></i> Environments / Production Cluster</h3></div><div class="tabs" id="envTabs"><div class="tab active" data-tab="general">General</div><div class="tab" data-tab="pods">Pods</div><div class="tab" data-tab="nodes">Nodes</div><div class="tab" data-tab="deployments">Deployments</div><div class="tab" data-tab="pipelines">Pipelines</div><div class="tab" data-tab="firewall">Firewall</div><div class="tab" data-tab="monitors">Monitors</div></div><div id="envTabContent" class="tab-content active"></div></div>`;
        const tabsMap = {
          general: `<div style="display: grid; gap: 16px;"><p><strong>Cluster Name:</strong> <code>k8s-prod-us-east1</code></p><p><strong>Namespace:</strong> <code>corefinity-app</code></p><p><strong>Status:</strong> <span class="badge badge-success">Healthy</span></p><p><strong>Nodes:</strong> 4 active</p><p><strong>CPU Usage:</strong> 42% | <strong>Memory:</strong> 59%</p><p><strong>Created:</strong> October 1, 2024</p><p><strong>Region:</strong> us-east1</p></div>`,
          pods: `<div class="table-wrapper"><table class="data-table"><thead><tr><th>Name</th><th>Ready</th><th>Status</th><th>Restarts</th><th>Age</th></tr></thead><tbody><tr><td>web-7d8f9-abc12</td><td>1/1</td><td><span class="badge badge-success">Running</span></td><td>0</td><td>14 days</td></tr><tr><td>worker-2g4h-def34</td><td>1/1</td><td><span class="badge badge-success">Running</span></td><td>2</td><td>14 days</td></tr><tr><td>cache-9j3k-ghi56</td><td>0/1</td><td><span class="badge badge-warning">Pending</span></td><td>0</td><td>2 hours</td></tr><tr><td>db-master-jkl78</td><td>1/1</td><td><span class="badge badge-success">Running</span></td><td>0</td><td>30 days</td></tr></tbody></table></div>`,
          nodes: `<div class="table-wrapper"><table class="data-table"><thead><tr><th>Node</th><th>CPU</th><th>Memory</th><th>Pods</th><th>Status</th></tr></thead><tbody><tr><td>gke-pool-1-node-1</td><td>42%</td><td>59%</td><td>12</td><td><span class="badge badge-success">Ready</span></td></tr><tr><td>gke-pool-1-node-2</td><td>64%</td><td>98%</td><td>18</td><td><span class="badge badge-warning">Warning</span></td></tr><tr><td>gke-pool-2-node-1</td><td>23%</td><td>35%</td><td>8</td><td><span class="badge badge-success">Ready</span></td></tr><tr><td>gke-pool-2-node-2</td><td>51%</td><td>72%</td><td>14</td><td><span class="badge badge-success">Ready</span></td></tr></tbody></table></div>`,
          deployments: `<div class="card" style="margin-bottom: 0;"><h4 style="margin-bottom: 16px;">➕ Deploy from Repository</h4><div class="repo-row"><div class="repo-select"><label>Repository Account</label><select id="repoSelect"><option>GitHub - Corefinity Org</option><option>GitLab - Self Hosted</option></select></div><div class="repo-select"><label>Branch</label><select id="branchSelect"><option>main</option><option>develop</option><option>staging</option></select></div><div class="repo-select"><label>Pipeline</label><select id="pipelineSelect"><option>ci/cd-pipeline</option><option>legacy-pipeline</option></select></div></div><button class="btn btn-primary" onclick="alert('Deployment triggered successfully')"><i class="fas fa-play"></i> Deploy Now</button></div><hr/><h4 style="margin: 20px 0 12px;">📋 Recent Deployments</h4><div class="table-wrapper"><table class="data-table">${deploymentsList
            .slice(0, 2)
            .map(
              (d) =>
                `<tr><td><code>${d.commit}</code></td><td><span class="badge ${
                  d.status === "success" ? "badge-success" : "badge-warning"
                }">${d.status}</span></td><td>${d.date} ${
                  d.time
                }</td><td><button class="btn-outline btn-sm btn">View Logs</button></td></tr>`
            )
            .join("")}</tbody></table></div>`,
          pipelines: `<div class="table-wrapper"><table class="data-table">${pipelineRecords
            .map(
              (p) =>
                `<tr><td><i class="fas fa-code-branch"></i> ${p.name}</td><td>${
                  p.repo
                }</td><td><span class="badge ${
                  p.status === "success" ? "badge-success" : "badge-warning"
                }">${
                  p.status
                }</span></td><td><button class="btn-outline btn-sm btn"><i class="fas fa-eye"></i> View</button></td></tr>`
            )
            .join("")}</tbody></table></div>`,
          firewall: `<div class="table-wrapper"><table class="data-table"><thead><tr><th>IP Address</th><th>Added By</th><th>Added Date</th><th>Actions</th></tr></thead><tbody><tr><td>192.168.1.100/32</td><td>Admin</td><td>2025-03-01</td><td><button class="btn-outline btn-sm btn"><i class="fas fa-trash"></i> Remove</button></td></tr><tr><td>203.0.113.55/32</td><td>Security Team</td><td>2025-03-15</td><td><button class="btn-outline btn-sm btn"><i class="fas fa-trash"></i> Remove</button></td></tr><tr><td>10.0.0.0/8</td><td>Network Admin</td><td>2025-04-01</td><td><button class="btn-outline btn-sm btn"><i class="fas fa-trash"></i> Remove</button></td></tr></tbody></table></div><div class="repo-row" style="margin-top: 20px;"><input placeholder="Enter IP address (e.g., 192.168.1.100/32)" id="newIp"/><button class="btn btn-primary" onclick="alert('IP address added to whitelist')"><i class="fas fa-plus"></i> Add IP</button></div>`,
          monitors: `<div class="custom-list"><li><i class="fas fa-check-circle" style="color: #10b981;"></i> <strong>API Response Time:</strong> 156ms (Normal)</li><li><i class="fas fa-chart-line"></i> <strong>Error Rate:</strong> 0.23% (Normal)</li><li><i class="fas fa-database"></i> <strong>Database Connections:</strong> 45/100</li><li><i class="fas fa-memory"></i> <strong>Redis Cache Hit Rate:</strong> 94.2%</li><li><i class="fas fa-globe"></i> <strong>CDN Bandwidth:</strong> 2.4 Gbps</li></div><hr/><h4>Alert Rules</h4><div class="custom-list"><li><i class="fas fa-bell"></i> CPU > 80% for 5 minutes</li><li><i class="fas fa-bell"></i> Memory > 90% for 2 minutes</li><li><i class="fas fa-bell"></i> Error Rate > 1%</li></div>`,
        };
        function switchTab(tabId) {
          document.getElementById("envTabContent").innerHTML =
            tabsMap[tabId] || "<p>Content</p>";
        }
        document.querySelectorAll("#envTabs .tab").forEach((tab) => {
          tab.addEventListener("click", () => {
            document
              .querySelectorAll("#envTabs .tab")
              .forEach((t) => t.classList.remove("active"));
            tab.classList.add("active");
            switchTab(tab.dataset.tab);
          });
        });
        switchTab("general");
      }

      function renderUserProfile(container) {
        container.innerHTML = `<div class="card"><div class="card-header"><h3><i class="fas fa-user-circle"></i> Profile Information</h3><button class="btn-outline btn"><i class="fas fa-edit"></i> Edit Profile</button></div><div style="display: grid; gap: 16px;"><p><strong>Full Name:</strong> Alex Rivera</p><p><strong>Email Address:</strong> alex.rivera@corefinity.com</p><p><strong>Role:</strong> <span class="badge badge-info">Administrator</span></p><p><strong>Department:</strong> Platform Engineering</p><p><strong>Location:</strong> San Francisco, CA</p><p><strong>Member Since:</strong> January 15, 2023</p><p><strong>SSO Integration:</strong> <span class="badge badge-success">✓ Google Workspace</span></p></div></div>
    <div class="card"><div class="card-header"><h3><i class="fas fa-key"></i> SSH Keys</h3><button class="btn-primary btn" id="addSshBtn"><i class="fas fa-plus"></i> Add SSH Key</button></div><div class="table-wrapper"><table class="data-table"><thead><tr><th>Key Name</th><th>Fingerprint</th><th>Added</th><th>Last Used</th><th></th></tr></thead><tbody>${sshKeys
      .map(
        (k) =>
          `<tr><td><strong>${k.name}</strong></td><td><code>${k.fingerprint}</code></td><td>${k.added}</td><td>${k.lastUsed}</td><td><button class="btn-outline btn-sm btn"><i class="fas fa-trash"></i> Delete</button></td></tr>`
      )
      .join("")}</tbody></table></div></div>
    <div class="card"><div class="card-header"><h3><i class="fas fa-shield-alt"></i> Security Settings</h3></div><div style="display: grid; gap: 16px;"><p><strong>Two-Factor Authentication:</strong> <span class="badge badge-success">✓ Enabled</span> <button class="btn-outline btn-sm btn" style="margin-left: 12px;"><i class="fas fa-sync-alt"></i> Reset 2FA</button></p><p><strong>IP Whitelist:</strong> 192.168.10.5, 203.0.113.89, 10.0.0.45</p><p><strong>Session Timeout:</strong> 30 minutes</p><p><strong>Last Password Change:</strong> 2025-03-15</p><button class="btn-outline btn"><i class="fas fa-shield-alt"></i> Manage IP Whitelist</button></div></div>
    <div class="card"><div class="card-header"><h3><i class="fas fa-code"></i> API Tokens</h3><button class="btn-primary btn"><i class="fas fa-plus"></i> Generate Token</button></div><div class="table-wrapper"><table class="data-table"><thead><tr><th>Token Name</th><th>Last Used</th><th>Expires</th><th>Created</th><th></th></tr></thead><tbody><tr><td><strong>cli-token-prod</strong></td><td>2025-04-14 10:32</td><td>2025-12-01</td><td>2025-01-15</td><td><button class="btn-outline btn-sm btn"><i class="fas fa-trash"></i> Revoke</button></td></tr><tr><td><strong>cicd-agent</strong></td><td>2025-04-14 08:15</td><td>2026-01-01</td><td>2025-03-10</td><td><button class="btn-outline btn-sm btn"><i class="fas fa-trash"></i> Revoke</button></td></tr><tr><td><strong>monitoring-bot</strong></td><td>2025-04-14 12:00</td><td>2025-11-15</td><td>2025-02-20</td><td><button class="btn-outline btn-sm btn"><i class="fas fa-trash"></i> Revoke</button></td></tr></tbody></table></div></div>`;
        document
          .getElementById("addSshBtn")
          ?.addEventListener("click", () =>
            alert("Upload SSH public key file")
          );
      }

      function renderTicketListing(container) {
        container.innerHTML = `<div class="card"><div class="card-header"><h3><i class="fas fa-ticket-alt"></i> Support Tickets</h3><button class="btn btn-primary" id="newTicketBtn"><i class="fas fa-plus"></i> New Ticket</button></div><div class="table-wrapper"><table class="data-table"><thead><tr><th>ID</th><th>Title</th><th>Customer</th><th>Priority</th><th>Status</th><th>Updated</th><th></th></tr></thead><tbody>${ticketsList
          .map(
            (t) =>
              `<tr><td><strong>${t.id}</strong></td><td>${t.title}</td><td>${
                t.customer
              }</td><td><span class="badge ${
                t.priority === "high"
                  ? "badge-danger"
                  : t.priority === "medium"
                  ? "badge-warning"
                  : "badge-info"
              }">${t.priority}</span></td><td><span class="badge ${
                t.status === "open"
                  ? "badge-danger"
                  : t.status === "in progress"
                  ? "badge-warning"
                  : "badge-success"
              }">${t.status}</span></td><td>${
                t.time
              }</td><td><button class="btn-outline btn-sm btn" onclick="renderPage('ticketview')"><i class="fas fa-eye"></i> View</button></td></tr>`
          )
          .join("")}</tbody></table></div></div>`;
        document
          .getElementById("newTicketBtn")
          ?.addEventListener("click", () => alert("Create new support ticket"));
      }

      function renderTicketView(container) {
        container.innerHTML = `<div class="card"><div class="card-header"><h3><i class="fas fa-comment-dots"></i> Ticket #TKT-101</h3><span class="badge badge-danger">High Priority</span></div><p><strong>Customer:</strong> Acme Corporation</p><p><strong>Created:</strong> April 12, 2025 at 2:30 PM</p><p><strong>Last Updated:</strong> April 14, 2025 at 9:23 AM</p><hr/><div class="comment-box"><strong><i class="fas fa-user"></i> Customer - John Smith</strong><br/><small>2 days ago</small><p style="margin-top: 8px;">The SSL certificate for our main domain (acme.com) failed to renew automatically. We're getting browser warnings about certificate expiration in 3 days. Please investigate urgently.</p></div><div class="comment-box" style="background: var(--primary-bg);"><strong><i class="fas fa-user-tie"></i> Staff (Internal) - Support Team</strong><br/><small>1 day ago</small><p style="margin-top: 8px;">[Internal Note] Checking Let's Encrypt rate limits and DNS propagation for acme.com. Will update customer once resolved.</p><span class="badge badge-warning">Staff only</span></div><div class="comment-box"><strong><i class="fas fa-headset"></i> Support Agent - Sarah Chen</strong><br/><small>4 hours ago</small><p style="margin-top: 8px;">We've identified the issue and triggered manual renewal. Please allow 30-60 minutes for propagation. The certificate should be valid by end of day.</p><span class="badge badge-success">Visible to customer</span></div><textarea id="newComment" rows="3" placeholder="Write your reply or internal note here..." style="width: 100%; margin: 16px 0;"></textarea><div class="repo-row"><button id="sendReplyBtn" class="btn btn-primary"><i class="fas fa-paper-plane"></i> Send Reply (Visible to Customer)</button><button id="internalNoteBtn" class="btn-outline btn"><i class="fas fa-lock"></i> Add Internal Note</button></div></div>
    <div class="card"><div class="card-header"><h3><i class="fas fa-history"></i> Ticket History</h3></div><div class="custom-list"><li><i class="fas fa-tag"></i> <strong>2025-04-14 09:23</strong> - Status changed from Open → In Progress</li><li><i class="fas fa-chart-line"></i> <strong>2025-04-13 16:45</strong> - Priority raised from Medium → High</li><li><i class="fas fa-user-plus"></i> <strong>2025-04-13 10:15</strong> - Assigned to Sarah Chen (Support Engineer)</li><li><i class="fas fa-plus-circle"></i> <strong>2025-04-12 14:30</strong> - Ticket created by customer</li></div></div>`;
        document
          .getElementById("sendReplyBtn")
          ?.addEventListener("click", () => {
            const msg = document.getElementById("newComment")?.value;
            if (msg) alert(`✅ Reply sent to customer: "${msg}"`);
            else alert("Please enter a reply message");
          });
        document
          .getElementById("internalNoteBtn")
          ?.addEventListener("click", () => {
            const msg = document.getElementById("newComment")?.value;
            if (msg) alert(`🔒 Internal note saved: "${msg}"`);
            else alert("Please enter an internal note");
          });
      }

      function renderSettings(container) {
        container.innerHTML = `<div class="card"><div class="card-header"><h3><i class="fas fa-globe"></i> General Settings</h3></div><div class="repo-row"><div class="repo-select"><label>Default Environment</label><select><option>Production</option><option>Staging</option><option>Development</option></select></div><div class="repo-select"><label>Timezone</label><select><option>UTC (Universal Time)</option><option>America/New_York (EST)</option><option>Europe/London (GMT)</option><option>Asia/Tokyo (JST)</option></select></div></div><div class="repo-row"><div class="repo-select"><label>Date Format</label><select><option>YYYY-MM-DD</option><option>MM/DD/YYYY</option><option>DD/MM/YYYY</option></select></div><div class="repo-select"><label>Language</label><select><option>English (US)</option><option>English (UK)</option><option>Spanish</option><option>French</option></select></div></div></div>
    <div class="card"><div class="card-header"><h3><i class="fas fa-bell"></i> Notification Preferences</h3></div><div class="custom-list"><li><i class="fas fa-envelope"></i> <strong>Email Notifications</strong> - <label><input type="checkbox" checked/> Deployments</label> <label><input type="checkbox" checked/> Tickets</label> <label><input type="checkbox"/> System Alerts</label></li><li><i class="fab fa-slack"></i> <strong>Slack Integration</strong> - <label><input type="checkbox" checked/> Critical Alerts</label> <label><input type="checkbox"/> Daily Summary</label></li><li><i class="fas fa-mobile-alt"></i> <strong>SMS Alerts</strong> - <label><input type="checkbox"/> Emergency Only</label></li></div></div>
    <div class="card"><div class="card-header"><h3><i class="fas fa-database"></i> System Configuration</h3></div><div class="custom-list"><li><i class="fas fa-backward"></i> <strong>Backup Schedule:</strong> Daily at 02:00 UTC</li><li><i class="fas fa-calendar-alt"></i> <strong>Retention Policy:</strong> 30 days for backups</li><li><i class="fas fa-chart-bar"></i> <strong>Log Retention:</strong> 90 days</li><li><i class="fas fa-shield-alt"></i> <strong>Security Audit Log:</strong> Enabled</li></div><hr/><div class="repo-row"><button class="btn-outline btn"><i class="fas fa-database"></i> Configure Backup</button><button class="btn-outline btn"><i class="fas fa-file-alt"></i> View Audit Logs</button><button class="btn-outline btn"><i class="fas fa-download"></i> Export Settings</button></div></div>`;
      }

      // Event Listeners
      document.getElementById("menuToggle")?.addEventListener("click", () => {
        if (window.innerWidth <= 1024) openMobileMenu();
        else {
          sidebarCollapsed = !sidebarCollapsed;
          document
            .getElementById("sidebar")
            ?.classList.toggle("collapsed", sidebarCollapsed);
        }
      });
      document
        .getElementById("mobileOverlay")
        ?.addEventListener("click", closeMobileMenu);
      document
        .getElementById("themeToggle")
        ?.addEventListener("click", toggleTheme);
      window.addEventListener("resize", () => {
        if (window.innerWidth > 1024) closeMobileMenu();
      });
      document.querySelectorAll(".nav-item").forEach((el) => {
        el.addEventListener("click", () => renderPage(el.dataset.page));
      });
      document
        .querySelector(".sidebar-footer")
        ?.addEventListener("click", () => {
          alert("You have been logged out");
        });

      initTheme();
      renderPage("dashboard");
