// ===== CLOCK =====
function updateClock() {
    var now = new Date();
    document.getElementById('clock').textContent = now.toLocaleTimeString('en-IN', { hour12: false, timeZone: 'Asia/Kolkata' });
}
setInterval(updateClock, 1000);
updateClock();

lucide.createIcons();

var API_URL = "http://127.0.0.1:8000";
var token = "";

// ===== TABS =====
function switchTab(tab) {
    document.querySelectorAll('.view').forEach(function(el) { el.classList.remove('active'); });
    document.getElementById(tab + '-view').classList.add('active');
    document.querySelectorAll('.nav-btn').forEach(function(el) { el.classList.remove('active'); });
    var btns = document.querySelectorAll('.nav-btn');
    var map = ['dashboard','surveillance','threats','routes','social','agency'];
    var idx = map.indexOf(tab);
    if (idx >= 0 && btns[idx]) btns[idx].classList.add('active');
    setTimeout(function() { lucide.createIcons(); }, 100);
}

// ===== LOAD INCIDENTS =====
function loadIncidents() {
    token = prompt("Enter your backend token:");
    if (!token) {
        document.getElementById('anomaly-feed').innerHTML = '<div class="text-red-400 text-sm text-center py-4">Token required</div>';
        return;
    }

    fetch(API_URL + "/api/incidents", {
        headers: { "Authorization": "Bearer " + token }
    })
    .then(function(res) {
        if (!res.ok) throw new Error("Invalid token");
        return res.json();
    })
    .then(function(data) {
        var container = document.getElementById('anomaly-feed');
        if (!container) return;
        if (data.length === 0) {
            container.innerHTML = '<div class="text-slate-400 text-sm text-center py-4">No anomalies</div>';
            return;
        }
        var html = "";
        for (var i = 0; i < data.length; i++) {
            var a = data[i];
            html += '<div class="glass p-2 border-l-4 border-red-500" style="padding:6px 10px;margin-bottom:6px;">';
            html += '<div class="flex justify-between">';
            html += '<span class="text-sm font-bold text-red-400">' + a.title.toUpperCase() + '</span>';
            html += '<span class="text-xs text-slate-500">' + new Date(a.created_at).toLocaleTimeString() + '</span>';
            html += '</div>';
            html += '<div class="text-xs text-slate-300">' + a.location + '</div>';
            html += '<div class="mt-1 text-xs text-slate-400">Status: ' + a.status + '</div>';
            html += '<div class="mt-1 flex gap-1">';
            html += '<button onclick="editAnomaly(' + a.id + ')" class="edit-btn">Edit</button>';
            html += '<button onclick="deleteAnomaly(' + a.id + ')" class="delete-btn">Delete</button>';
            html += '</div>';
            html += '</div>';
        }
        container.innerHTML = html;
        lucide.createIcons();
    })
    .catch(function(err) {
        document.getElementById('anomaly-feed').innerHTML = '<div class="text-red-400 text-sm text-center py-4">' + err.message + '</div>';
    });
}

// ===== DELETE ANOMALY =====
function deleteAnomaly(id) {
    if (!confirm("Delete this anomaly?")) return;

    fetch(API_URL + "/api/incidents/" + id, {
        method: 'DELETE',
        headers: { "Authorization": "Bearer " + token }
    })
    .then(function() {
        alert("Deleted!");
        window.location.reload();
    })
    .catch(function(error) {
        alert("Error: " + error.message);
    });
}

// ===== EDIT ANOMALY =====
function editAnomaly(id) {
    var newTitle = prompt("Enter new title:");
    if (!newTitle) return;
    var newLocation = prompt("Enter new location:");
    if (!newLocation) return;

    var data = {
        title: newTitle,
        description: "",
        location: newLocation,
        incident_type: newTitle,
        severity: "medium"
    };

    fetch(API_URL + "/api/incidents/" + id, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(data)
    })
    .then(function() {
        alert("Updated!");
        window.location.reload();
    })
    .catch(function(error) {
        alert("Error: " + error.message);
    });
}

// ===== ADD ANOMALY =====
function addAnomaly() {
    var type = document.getElementById('anomalyType').value.trim();
    var severity = document.getElementById('anomalySeverity').value;
    var location = document.getElementById('anomalyLocation').value.trim();
    if (!type || !location) { alert('Fill all fields'); return; }

    var data = {
        title: type,
        description: "",
        location: location,
        incident_type: type,
        severity: severity
    };

    fetch(API_URL + "/api/incidents", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(data)
    })
    .then(function() {
        closeModal('anomalyModal');
        alert("Anomaly added!");
        window.location.reload();
    })
    .catch(function(error) {
        alert("Error: " + error.message);
    });
}

function openAddAnomalyModal() { document.getElementById('anomalyModal').style.display = 'flex'; }
function closeModal(id) { document.getElementById(id).style.display = 'none'; }

// ===== ADD POST =====
function addPost() {
    var user = document.getElementById('postUser').value.trim();
    var content = document.getElementById('postContent').value.trim();
    var sentiment = document.getElementById('postSentiment').value;
    if (!user || !content) { alert('Fill all fields'); return; }
    var feed = document.getElementById('social-feed');
    var div = document.createElement('div');
    div.className = 'bg-slate-800/50 p-2 rounded border border-slate-700';
    div.innerHTML = '<div class="flex items-center gap-2"><div class="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center"><i data-lucide="twitter" class="w-3 h-3 text-blue-400"></i></div><div><div class="flex items-center gap-1"><span class="text-xs font-medium text-white">' + user + '</span><span class="text-[8px] text-slate-500">Just now</span></div><p class="text-[9px] text-slate-300">' + content + '</p><span class="text-[8px] px-1 py-0.5 rounded-full ' + (sentiment === 'negative' ? 'bg-red-500/20 text-red-400' : sentiment === 'positive' ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-400') + '">' + sentiment + '</span></div></div>';
    feed.insertBefore(div, feed.firstChild);
    closeModal('postModal');
    lucide.createIcons();
}

function openAddPostModal() { document.getElementById('postModal').style.display = 'flex'; }

// ===== CALCULATE ROUTES =====
function calculateRoutes() {
    var difficulty = document.querySelector('#routes-view input[type="range"]').value;
    var weather = document.querySelector('#routes-view select').value;
    var message = "✅ Route Calculated!\n\n";
    message += "📊 Terrain Difficulty: " + difficulty + "/10\n";
    message += "🌤️ Weather Priority: " + weather + "\n\n";
    message += "🚀 AI suggests Route B for Patrol Unit 4.\n";
    message += "⛽ Estimated fuel savings: 23%";
    alert(message);
}

// ===== THREAT FILTER =====
function filterThreats(level) {
    var items = document.querySelectorAll('#threats-view .threat-item');
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (level === 'all') { item.style.display = ''; }
        else {
            if (level === 'critical' && item.dataset.level === 'critical') { item.style.display = ''; }
            else { item.style.display = 'none'; }
        }
    }
}

// ===== APPROVE / DENY =====
function approveReq(id) {
    if (confirm("Approve this request?")) {
        var status = document.getElementById('status-' + id);
        var btns = document.getElementById('btns-' + id);
        if (status) { status.textContent = '✅ Approved'; status.className = 'status-approved ml-2'; }
        if (btns) { btns.style.display = 'none'; }
        alert("✅ Approved!");
    }
}

function denyReq(id) {
    if (confirm("Deny this request?")) {
        var status = document.getElementById('status-' + id);
        var btns = document.getElementById('btns-' + id);
        if (status) { status.textContent = '❌ Denied'; status.className = 'status-denied ml-2'; }
        if (btns) { btns.style.display = 'none'; }
        alert("❌ Denied!");
    }
}

// ===== NEW OPERATION FUNCTIONS =====
var operations = [];

function openNewOperationModal() {
    document.getElementById('newOpModal').style.display = 'flex';
}

function startNewOperation() {
    var name = document.getElementById('opName').value.trim();
    var location = document.getElementById('opLocation').value.trim();
    var agencies = document.getElementById('opAgencies').value;

    if (!name || !location) {
        alert("Please enter Operation Name and Location!");
        return;
    }

    var op = {
        name: name,
        location: location,
        agencies: agencies,
        time: new Date().toLocaleTimeString('en-IN', { hour12: false }),
        status: "Active"
    };

    operations.push(op);
    displayOperations();

    document.getElementById('opName').value = '';
    document.getElementById('opLocation').value = '';
    closeModal('newOpModal');

    alert("🆕 Operation '" + name + "' started successfully!");
}

function displayOperations() {
    var container = document.getElementById('operation-list');
    var list = document.getElementById('activeOperations');
    if (!container || !list) return;

    if (operations.length === 0) {
        container.style.display = 'none';
        return;
    }

    container.style.display = 'block';
    list.innerHTML = '';
    for (var i = 0; i < operations.length; i++) {
        var op = operations[i];
        list.innerHTML += `
            <div class="bg-slate-800/50 p-2 rounded border border-slate-700 flex items-center justify-between">
                <div>
                    <span class="text-sm font-medium text-white">${op.name}</span>
                    <span class="text-xs text-slate-400 ml-2">${op.location}</span>
                    <span class="text-xs text-slate-500 ml-2">${op.agencies}</span>
                </div>
                <div>
                    <span class="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded">${op.status}</span>
                    <span class="text-xs text-slate-500 ml-2">${op.time}</span>
                </div>
            </div>
        `;
    }
}

// ===== LOGOUT =====
function logout() {
    if (confirm("Logout?")) {
        token = "";
        window.location.reload();
    }
}

// ===== MAP =====
var mapInitialized = false;
function initMap() {
    var container = document.getElementById('map');
    if (!container || mapInitialized) return;
    try {
        var map = L.map('map', { zoomControl: false, attributionControl: false }).setView([34.1526, 77.5771], 10);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap',
            maxZoom: 19
        }).addTo(map);
        mapInitialized = true;
    } catch(e) {}
}

// ===== OPERATION ALERT =====
function showAlertDetails() {
    alert("🔴 OPERATION ALERT DETAILS\n\n" +
          "Location: Sector 4 & 7\n" +
          "Activity: Increased movement detected\n" +
          "Time: 14:30 hrs\n" +
          "Status: Active\n" +
          "\nRecommendation: Maintain heightened surveillance.");
}

// ===== SURVEILLANCE LIVE FEED =====
function viewLiveFeed() {
    var feed = document.getElementById('surveillance-feed');
    if (!feed) return;

    feed.innerHTML = `
        <div class="relative w-full h-full flex items-center justify-center" style="background:#0a0a1a;">
            <div class="absolute inset-0 opacity-30">
                <div style="position:absolute;top:10%;left:5%;width:90%;height:80%;border:1px solid rgba(59,130,246,0.2);border-radius:50%;"></div>
                <div style="position:absolute;top:20%;left:15%;width:70%;height:60%;border:1px dashed rgba(59,130,246,0.15);border-radius:50%;"></div>
                <div style="position:absolute;top:35%;left:30%;width:40%;height:30%;border:1px dotted rgba(59,130,246,0.1);border-radius:50%;"></div>
            </div>
            <div class="relative z-10 text-center">
                <i data-lucide="eye" class="w-12 h-12 text-green-400 mx-auto mb-2 animate-pulse"></i>
                <p class="text-green-400 text-sm font-semibold">🟢 LIVE FEED ACTIVE</p>
                <div class="flex items-center justify-center gap-4 mt-3 text-xs text-slate-400">
                    <span>📍 Sector 4</span>
                    <span>📡 Drone 3</span>
                    <span>🎥 Thermal</span>
                </div>
                <div class="mt-3 flex items-center justify-center gap-2">
                    <div style="width:6px;height:6px;background:#4ade80;border-radius:50%;animation:pulse 1s infinite;"></div>
                    <span class="text-[10px] text-green-400 font-mono">Recording</span>
                </div>
                <button onclick="closeLiveFeed()" class="mt-3 px-3 py-1 bg-red-600/20 text-red-400 rounded text-xs border border-red-500/30 hover:bg-red-600/30">Close Feed</button>
            </div>
            <div style="position:absolute;top:10px;left:10px;color:#4ade80;font-size:9px;font-family:monospace;background:rgba(0,0,0,0.7);padding:2px 8px;border-radius:4px;">
                LIVE • <span id="liveTime"></span>
            </div>
        </div>
    `;
    lucide.createIcons();

    function updateLiveTime() {
        var now = new Date();
        var el = document.getElementById('liveTime');
        if (el) el.textContent = now.toLocaleTimeString('en-IN', { hour12: false });
    }
    updateLiveTime();
    var interval = setInterval(updateLiveTime, 1000);
    window._liveFeedInterval = interval;

    alert("📹 Live Surveillance Feed Activated!\n\nViewing thermal feed from Drone 3 at Sector 4.");
}

function closeLiveFeed() {
    var feed = document.getElementById('surveillance-feed');
    if (!feed) return;

    if (window._liveFeedInterval) {
        clearInterval(window._liveFeedInterval);
        window._liveFeedInterval = null;
    }

    feed.innerHTML = `
        <div class="text-center z-10">
            <i data-lucide="video" class="w-12 h-12 text-slate-600 mx-auto mb-2"></i>
            <p class="text-slate-500 text-sm">📡 Live Surveillance Feed</p>
            <p class="text-slate-600 text-xs">Click "View Live Feed" to start</p>
            <div class="absolute inset-0 opacity-10 pointer-events-none">
                <div style="position:absolute;top:0;left:0;width:100%;height:100%;background:linear-gradient(transparent 95%, #3b82f6 95%);background-size:100% 20px;"></div>
                <div style="position:absolute;top:0;left:0;width:100%;height:100%;background:linear-gradient(90deg, transparent 95%, #3b82f6 95%);background-size:20px 100%;"></div>
            </div>
            <div style="position:absolute;top:10px;left:10px;width:20px;height:20px;border-top:2px solid #3b82f6;border-left:2px solid #3b82f6;"></div>
            <div style="position:absolute;top:10px;right:10px;width:20px;height:20px;border-top:2px solid #3b82f6;border-right:2px solid #3b82f6;"></div>
            <div style="position:absolute;bottom:10px;left:10px;width:20px;height:20px;border-bottom:2px solid #3b82f6;border-left:2px solid #3b82f6;"></div>
            <div style="position:absolute;bottom:10px;right:10px;width:20px;height:20px;border-bottom:2px solid #3b82f6;border-right:2px solid #3b82f6;"></div>
            <div style="position:absolute;top:10px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:6px;">
                <div style="width:8px;height:8px;background:#ef4444;border-radius:50%;animation:pulse 1s infinite;"></div>
                <span style="color:#ef4444;font-size:10px;font-weight:bold;">REC</span>
            </div>
            <div style="position:absolute;bottom:10px;right:50%;transform:translateX(50%);color:#4ade80;font-size:9px;font-family:monospace;background:rgba(0,0,0,0.5);padding:2px 8px;border-radius:4px;">
                <span id="feedTimestamp">LIVE • 00:00:00</span>
            </div>
        </div>
    `;
    lucide.createIcons();
}

// ===== START =====
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(loadIncidents, 500);
    setTimeout(initMap, 800);
    setTimeout(function() { lucide.createIcons(); }, 300);
    setTimeout(displayOperations, 400);
});