/**
 * HeatShield AI - Core Platform Frontend Engine Orchestration Script
 * Framework Engine Module Configured for ISRO BAH 2026 Presentation Realtime Processing
 */

// Global App Configuration Registry State Tracker Definitions
const APP_CONFIG = {
    storageKey: 'heatshield_state_2026',
    regions: {
        blr: { center: [12.9716, 77.5946], name: "Bengaluru Core Region" },
        del: { center: [28.6139, 77.2090], name: "Delhi National Capital" },
        mum: { center: [19.0760, 72.8777], name: "Mumbai Metro Area" }
    },
    defaultState: {
        activeScreen: 'dashboard',
        selectedRegion: 'blr',
        sliders: { tree: 20, roof: 15, water: 5 }
    }
};

let appState = { ...APP_CONFIG.defaultState };
let mapInstances = { mapping: null, planner: null };
let chartInstances = {};

// ==========================================
// 1. APPLICATION STATE & PERSISTENCE STORAGE ENGINE
// ==========================================
const StateEngine = {
    init() {
        try {
            const stored = localStorage.getItem(APP_CONFIG.storageKey);
            if (stored) {
                appState = JSON.parse(stored);
            }
        } catch (e) {
            console.warn("Storage runtime bounds restricted, tracking state in memory layer:", e);
        }
    },
    save() {
        try {
            localStorage.setItem(APP_CONFIG.storageKey, JSON.stringify(appState));
        } catch (e) {
            console.error("Failed to commit state matrix data arrays to device layer:", e);
        }
    }
};

// ==========================================
// 2. RUNTIME NAVIGATION ROUTER CONTROLLER ENGINE
// ==========================================
const NavigationEngine = {
    navItems: [
        { id: 'dashboard', label: '01. Executive Dashboard', icon: 'fa-chart-pie' },
        { id: 'mapping', label: '02. Heat Mapping', icon: 'fa-map-location-dot' },
        { id: 'driver', label: '03. Driver Analysis', icon: 'fa-circle-nodes' },
        { id: 'planner', label: '04. Green Corridor Planner', icon: 'fa-seedling' },
        { id: 'simulator', label: '05. What-If Simulator', icon: 'fa-sliders' },
        { id: 'recommendations', label: '06. AI Recommendations', icon: 'fa-brain' }
    ],

    renderNav() {
        const container = document.getElementById('nav-container');
        if (!container) return;
        
        container.innerHTML = `<p class="text-[10px] font-bold text-slate-500 tracking-widest px-3 mb-3 uppercase">Navigation Module</p>`;
        
        this.navItems.forEach(item => {
            const btn = document.createElement('button');
            btn.id = `nav-${item.id}`;
            btn.className = `w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150 border-l-4 border-transparent text-slate-400 hover:text-white hover:bg-slate-800/40`;
            btn.onclick = () => this.navigate(item.id);
            btn.innerHTML = `<i class="fa-solid ${item.icon} w-5 text-center"></i><span>${item.label}</span>`;
            container.appendChild(btn);
        });
    },

    navigate(screenId) {
        if (!this.navItems.some(i => i.id === screenId)) return;
        
        appState.activeScreen = screenId;
        StateEngine.save();

        document.querySelectorAll('.screen-content').forEach(el => el.classList.add('hidden'));
        const targetScreen = document.getElementById(`screen-${screenId}`);
        if (targetScreen) targetScreen.classList.remove('hidden');

        this.navItems.forEach(item => {
            const btn = document.getElementById(`nav-${item.id}`);
            if (btn) {
                if (item.id === screenId) {
                    btn.className = "w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150 bg-gradient-to-r from-accentblue/20 to-transparent text-accentcyan border-l-4 border-accentcyan";
                } else {
                    btn.className = "w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150 border-l-4 border-transparent text-slate-400 hover:text-white hover:bg-slate-800/40";
                }
            }
        });

        // Lifecycle hook handlers to correctly mount external dependencies asynchronously
        if (screenId === 'mapping') MapOrchestrator.initMap('mapping', 'gis-map-canvas');
        if (screenId === 'planner') MapOrchestrator.initMap('planner', 'planner-map-canvas');
        if (screenId === 'driver') ChartOrchestrator.initDriverCharts();
    }
};

// ==========================================
// 3. SPATIAL GEOGRAPHIC INFORMATION SYSTEMS LAYER ENGINE
// ==========================================
const MapOrchestrator = {
    initMap(type, containerId) {
        if (mapInstances[type]) {
            mapInstances[type].invalidateSize();
            return;
        }

        const region = APP_CONFIG.regions[appState.selectedRegion] || APP_CONFIG.regions.blr;
        
        // Initialize dynamic Leaflet tile layer maps
        const map = L.map(containerId, { zoomControl: false }).setView(region.center, 12);
        
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap &copy; CARTO'
        }).addTo(map);

        L.control.zoom({ position: 'topright' }).addTo(map);

        // Add dummy mockup spatial data geometry rings representing thermal zones safely
        if (type === 'mapping') {
            L.circle(region.center, { radius: 1800, color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.35 }).addTo(map)
                .bindPopup('<b>Critical Thermal Zone</b><br>LST: 43.8°C<br>NDBI Anomaly Detected');
            L.circle([region.center[0] + 0.02, region.center[1] - 0.02], { radius: 1200, color: '#f97316', fillColor: '#f97316', fillOpacity: 0.3 }).addTo(map);
        } else if (type === 'planner') {
            // Corridor drawing geometry vector arrays mockup lines representations
            const corridorCoords = [
                region.center,
                [region.center[0] + 0.015, region.center[1] + 0.015],
                [region.center[0] + 0.03, region.center[1] + 0.01]
            ];
            L.polyline(corridorCoords, { color: '#10b981', weight: 6, opacity: 0.7, dashArray: '8, 8' }).addTo(map)
                .bindPopup('<b>Proposed Continuous Green Corridor</b><br>Length: 12.4km<br>Est Cooling Yield: -1.8°C');
        }

        mapInstances[type] = map;
    },

    recenterAll(regionKey) {
        const region = APP_CONFIG.regions[regionKey];
        if (!region) return;
        
        Object.keys(mapInstances).forEach(key => {
            if (mapInstances[key]) {
                mapInstances[key].setView(region.center, 12);
            }
        });
    }
};

// ==========================================
// 4. CHART UTILITIES & TELEMETRY RENDERING PIPELINE
// ==========================================
const ChartOrchestrator = {
    initDashboardChart() {
        const ctx = document.getElementById('dashboard-trend-chart');
        if (!ctx) return;

        if (chartInstances.dashboard) chartInstances.dashboard.destroy();

        chartInstances.dashboard = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['2016', '2018', '2020', '2022', '2024', '2026'],
                datasets: [
                    { label: 'Mean LST (°C)', data: [31.2, 31.9, 32.5, 33.1, 33.8, 34.5], borderColor: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.05)', tension: 0.3, fill: true },
                    { label: 'NDVI Canopy Value (x10)', data: [2.8, 2.5, 2.2, 1.9, 1.6, 1.4], borderColor: '#10b981', tension: 0.3 }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { grid: { color: '#1e293b' }, ticks: { color: '#94a3b8' } },
                    x: { grid: { color: '#1e293b' }, ticks: { color: '#94a3b8' } }
                },
                plugins: { legend: { labels: { color: '#f8fafc' } } }
            }
        });
    },

    initDriverCharts() {
        const weightCtx = document.getElementById('driver-weight-chart');
        const matrixCtx = document.getElementById('driver-matrix-chart');

        if (weightCtx && !chartInstances.driverWeight) {
            chartInstances.driverWeight = new Chart(weightCtx, {
                type: 'bar',
                data: {
                    labels: ['NDBI (Built Area)', 'NDVI (Veg Loss)', 'Pop Density', 'Low Humidity'],
                    datasets: [{ label: 'Relative Weight Contribution %', data: [42, 28, 15, 9], backgroundColor: ['#f59e0b', '#10b981', '#3b82f6', '#6366f1'] }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { grid: { color: '#1e293b' }, ticks: { color: '#94a3b8' } },
                        x: { grid: { color: '#1e293b' }, ticks: { color: '#94a3b8' } }
                    }
                }
            });
        }

        if (matrixCtx && !chartInstances.driverMatrix) {
            chartInstances.driverMatrix = new Chart(matrixCtx, {
                type: 'bubble',
                data: {
                    datasets: [
                        { label: 'LST ↔ NDBI (Positive Connection)', data: [{ x: 0.8, y: 43.8, r: 12 }], backgroundColor: '#ef4444' },
                        { label: 'LST ↔ NDVI (Inverse Connection)', data: [{ x: 0.14, y: 34.5, r: 15 }], backgroundColor: '#3b82f6' }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: { title: { display: true, text: 'LST Temperature', color: '#94a3b8' }, grid: { color: '#1e293b' }, ticks: { color: '#94a3b8' } },
                        x: { title: { display: true, text: 'Variable Factor Index', color: '#94a3b8' }, grid: { color: '#1e293b' }, ticks: { color: '#94a3b8' } }
                    },
                    plugins: { legend: { labels: { color: '#f8fafc' } } }
                }
            });
        }
    }
};

// ==========================================
// 5. DATA SIMULATOR MATH SCENARIOS SANDBOX MATRIX ENGINE
// ==========================================
const SimulationEngine = {
    initSliders() {
        const sliders = ['tree', 'roof', 'water'];
        sliders.forEach(key => {
            const el = document.getElementById(`sim-slide-${key}`);
            if (el) {
                el.value = appState.sliders[key] || 0;
                document.getElementById(`slide-${key}-val`).innerText = el.value + '%';
                
                el.oninput = (e) => {
                    appState.sliders[key] = parseInt(e.target.value) || 0;
                    document.getElementById(`slide-${key}-val`).innerText = e.target.value + '%';
                    this.computeMatrix();
                    StateEngine.save();
                };
            }
        });
        this.computeMatrix();
    },

    computeMatrix() {
        const t = appState.sliders.tree || 0;
        const r = appState.sliders.roof || 0;
        const w = appState.sliders.water || 0;

        // Dynamic linear equation computing climate mitigation bounds outputs safely
        let calculatedTemp = 34.5 - ((t * 0.04) + (r * 0.02) + (w * 0.05));
        let calculatedRisk = Math.max(0, 82 - Math.round((t * 0.8) + (r * 0.4) + (w * 1.2)));

        const tempDisplay = document.getElementById('sim-temp-display');
        const riskDisplay = document.getElementById('sim-risk-display');

        if (tempDisplay) tempDisplay.innerText = calculatedTemp.toFixed(1) + '°C';
        if (riskDisplay) riskDisplay.innerText = calculatedRisk + ' / 100';
    },

    resetToBaseline() {
        appState.sliders = { ...APP_CONFIG.defaultState.sliders };
        StateEngine.save();
        this.initSliders();
        NotificationSystem.triggerToast('info', 'Simulation values reset to 2026 baseline.');
    }
};

// ==========================================
// 6. PROCESSING TELEMETRY & SYSTEM NOTIFICATIONS UTILITIES
// ==========================================
const NotificationSystem = {
    triggerToast(type, msg) {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `p-3 rounded-lg border shadow-xl text-xs font-mono transition-all duration-300 transform translate-y-2 opacity-0 flex items-center space-x-2 pointer-events-auto w-72 bg-carddark`;
        
        const colors = {
            success: 'border-emerald-500/40 text-emerald-400',
            info: 'border-accentcyan/40 text-accentcyan',
            warning: 'border-amber-500/40 text-amber-400'
        };
        toast.className += ` ${colors[type] || colors.info}`;
        toast.innerHTML = `<i class="fa-solid ${type==='success'?'fa-circle-check':type==='warning'?'fa-triangle-exclamation':'fa-circle-info'}"></i> <span>${msg}</span>`;
        
        container.appendChild(toast);
        setTimeout(() => { toast.classList.remove('translate-y-2', 'opacity-0'); }, 10);
        
        setTimeout(() => {
            toast.classList.add('opacity-0', 'translate-y-2');
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }
};

// ==========================================
// 7. INTEGRATION PORTS FOR DATA PIPELINES (GEE REST API HOOKS)
// ==========================================
const DataPipeline = {
    runGEEQuery() {
        const threshold = document.getElementById('mapping-threshold')?.value || 35;
        const loader = document.getElementById('async-loader');
        const loaderText = document.getElementById('async-loader-text');
        
        if (loader) {
            loaderText.innerText = `Querying Google Earth Engine REST API endpoints (Threshold: ${threshold}°C)...`;
            loader.classList.remove('hidden');
        }

        /**
         * -------------------------------------------------------------
         * INTEGRATION POINT FOR ISRO / GEE PRODUCTION BACKEND DEPLOYMENT
         * -------------------------------------------------------------
         * To connect to live Earth Engine backend clusters, replace this timeout block with an actual fetch request:
         * * fetch('https://earthengine.googleapis.com/v1alpha/projects/your-project/imageCollections', {
         * method: 'POST',
         * headers: { 'Authorization': 'Bearer ' + OAUTH_TOKEN, 'Content-Type': 'application/json' },
         * body: JSON.stringify({ ...your_gee_spatial_parameters })
         * })
         * .then(res => res.json())
         * .then(data => { MapOrchestrator.renderGEETiles(data.tile_url); })
         * .catch(err => console.error(err));
         */

        setTimeout(() => {
            if (loader) loader.classList.add('hidden');
            NotificationSystem.triggerToast('success', 'GEE Image Collection layer processed successfully.');
        }, 1500);
    },

    triggerSimulatedCompute(message) {
        const loader = document.getElementById('async-loader');
        if (loader) {
            document.getElementById('async-loader-text').innerText = message;
            loader.classList.remove('hidden');
            setTimeout(() => {
                loader.classList.add('hidden');
                NotificationSystem.triggerToast('success', 'AI Model weights synchronized successfully.');
            }, 1200);
        }
    },

    exportUtility(type) {
        NotificationSystem.triggerToast('info', `Compiling data channels into target export stream: ${type.toUpperCase()}...`);
        setTimeout(() => {
            if (type === 'pdf') {
                window.print();
            } else {
                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appState));
                const dlAnchor = document.createElement('a');
                dlAnchor.setAttribute("href", dataStr);
                dlAnchor.setAttribute("download", `heatshield_export_${Date.now()}.${type}`);
                document.body.appendChild(dlAnchor);
                dlAnchor.click();
                dlAnchor.remove();
                NotificationSystem.triggerToast('success', `Export completed successfully.`);
            }
        }, 1000);
    }
};

// ==========================================
// 8. INITIALIZATION LIFECYCLE HOOK
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    StateEngine.init();
    NavigationEngine.renderNav();
    ChartOrchestrator.initDashboardChart();
    SimulationEngine.initSliders();

    // Attach active listener on the regional selection map select input dropdown channel
    const regionSelect = document.getElementById('map-region-select');
    if (regionSelect) {
        regionSelect.value = appState.selectedRegion;
        regionSelect.onchange = (e) => {
            appState.selectedRegion = e.target.value;
            StateEngine.save();
            MapOrchestrator.recenterAll(e.target.value);
            NotificationSystem.triggerToast('info', `Spatial bounding box focused on: ${APP_CONFIG.regions[e.target.value].name}`);
        };
    }

    // Recover previous active view session smoothly
    NavigationEngine.navigate(appState.activeScreen);
});