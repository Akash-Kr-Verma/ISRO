# HeatShield AI 🛡️🌡️
> **Geospatial Decision Support System (DSS) for Urban Heat Mitigation & Cooling Strategies**
> *Developed for the ISRO BAH 2026 Platform to address Urban Heat Stress using Physics-Informed AIML & Satellite Telemetry.*

---

## 📌 Project Overview & Problem Statement

**HeatShield AI** is an advanced geospatial AI/ML-driven decision support system designed to identify urban heat stress hotspots, quantify the key drivers of urban thermal anomalies, and simulate optimized, scenario-based cooling interventions. 

Rapid urbanization and vegetation degradation lead to the **Urban Heat Island (UHI)** effect, threatening public health, increasing energy demands, and deteriorating urban microclimates. This platform bridges satellite Earth observation data with physics-informed machine learning modeling to deliver actionable spatial planning recommendations for city administrators.

### 🎯 Key Objectives
1. **Identify Urban Heat Hotspots:** Generate surface temperature anomaly maps and heat stress layers using satellite telemetry.
2. **Analyze Drivers of Urban Heating:** Quantify the influence of factors such as Land Use/Land Cover (LULC), built-up density (NDBI), vegetation index (NDVI), and atmospheric conditions.
3. **Model Heat Dynamics:** Establish relationships between Land Surface Temperature (LST) and contributing factors using ML approaches.
4. **Generate and Optimize Cooling Scenarios:** Simulate spatial interventions (e.g., green corridors, cool roofs, water body rejuvenation) and evaluate their real-time effectiveness in reducing heat stress.

---

## 🛠️ Technology Stack & Libraries

The system is built on a high-performance, responsive client-side architecture styled with a futuristic dark-mode telemetry aesthetic:

*   **Core Structure & UI:** HTML5 & [Tailwind CSS](https://tailwindcss.com/) (configured with a custom cyber-dark palette: `#0B0F19` slate, `#121826` panels, and `#00E5FF` cyber-cyan accents).
*   **Interactive GIS Mapping:** [Leaflet.js](https://leafletjs.com/) integrated with CARTO Dark Matter vector tile layers for real-time spatial overlays.
*   **Data Visualization & Charts:** [Chart.js](https://www.chartjs.org/) for rendering multi-year climate trend lines, driver contribution weightings, and covariance bubble matrices.
*   **Icons & Graphics:** [FontAwesome v6](https://fontawesome.com/) for telemetry-grade icon support.
*   **State Management:** LocalStorage-backed state engine tracking user selection parameters and simulation bounds across sessions.

---

## 📂 Repository Structure

The project has a lightweight, highly optimized web workspace structure:

*   [index1.html](file:///c:/Users/akash/OneDrive/Desktop/ISRO/index1.html) - Core interface containing the layout for the 6 primary modules, control inputs, and map viewports.
*   [script.js](file:///c:/Users/akash/OneDrive/Desktop/ISRO/script.js) - Application orchestrator managing state serialization, Leaflet maps, Chart.js telemetry, simulation math equations, and GEE query integration hooks.
*   [style.css](file:///c:/Users/akash/OneDrive/Desktop/ISRO/style.css) - Custom style rules for CSS-based glassmorphism, responsive scrollbars, hover glows, and `@media print` overrides for exporting PDF reports.

---

## 🖥️ Platform Modules & Walkthrough

The platform is structured into **6 integrated screens**, selectable from the sidebar navigation:

### 1. Executive Dashboard
*   **High-Level KPI Telemetry:** Real-time metrics for Average Land Temperature (`34.5°C`), NDVI Canopy Index (`0.14`), NDBI Built-Up Index (`0.72`), and Critical Hotspot Risk (`82%`).
*   **Multi-Year LST Climate Trendline:** Dual-axis chart showcasing the historical inverse correlation between declining green cover (NDVI) and rising surface temperature (LST) from 2016 to 2026.
*   **AI Mitigation Priority Summary:** Automated regional warnings flagging critical sectors (e.g., *Sector 4 Commercial Core* at `43.8°C`) requiring immediate intervention.

### 2. Interactive Heat Mapping
*   **Study Area Selection:** Dropdown filters configured for major Indian metros: **Bengaluru Core Region**, **Delhi National Capital**, and **Mumbai Metro Area**.
*   **Telemetry Controls:** Adjust Satellite Platforms (Landsat 9 OLI-2 / Sentinel-2 MSI), Cloud Cover thresholding masks, and dynamic Hotspot Temperature Thresholds.
*   **Thermal Hotspot Overlays:** Dynamic Leaflet rendering highlighting severe surface temperature anomalies.

### 3. Driver Analysis
*   **Relative Contribution Weights:** Bar charts revealing that built-up area density (NDBI) represents `42%` of the temperature increase, followed by vegetation loss (NDVI) at `28%`.
*   **Covariance Cross-Matrix:** A bubble plot mapping variables to visually verify positive LST-NDBI and inverse LST-NDVI correlations.
*   **AI Causality Chain Blueprint:** Visual block mapping the flow from *High Impervious Build* to *Canopy Depletion* to *UHI Anomaly Maxima*.

### 4. Green Corridor Planner
*   **Linear Vector Overlay:** Visualizes continuous ecological corridor pathways (e.g., a proposed `12.4 km` buffer with an estimated cooling yield of `-1.8°C`).
*   **Estimated Financial Telemetry:** Calculates approximate municipal budget requirements (e.g., `₹64.2 Cr` for Bengaluru Core) and target planting quantities (e.g., `145K` canopy units).

### 5. What-If Simulator
*   **Parameter Tuning Sliders:** Allows urban planners to dynamically adjust:
    *   *Canopy Plantation Intensity* (0% - 100%)
    *   *High-Albedo Coating (Cool Roofs) Adoption* (0% - 100%)
    *   *Hydrological Basin Optimization* (0% - 100%)
*   **Simulated Outcome Matrix:** Live recalculation of **Predicted Mean Land Surface Temperature** and **UHI Risk Score** using linear regression algorithms based on physical bounds.

### 6. AI Recommendations & Decision Support Framework
*   **Actionable Policies:** Segmented into Priority Levels:
    *   **Alpha:** Target Hotspot Plantations (Target: `-1.8°C` yield).
    *   **Beta:** Continuous Thermal Insulation Corridors (Target: `-1.2°C` yield).
    *   **Gamma:** Hydrological Cooling Basins (Target: `-0.5°C` yield).
*   **Consolidated Executive Handover:** Summary stats containing structural feasibility ratings, duration horizons, and export channels.

---

## 💾 Data Export & Printing Capabilities

The dashboard supports full data pipeline handovers:
1.  **GeoJSON Feature Collection:** Click *Export GeoJSON* to extract planning parameters and state arrays as a serialized JSON stream.
2.  **Consolidated CSV:** Download tabular reports of the simulated parameters.
3.  **GeoPDF Sheet Generation:** Click *Export GeoPDF Sheet* or *Print Executive Layout*. The stylesheet overrides default styling during print commands, stripping navigation sidebars and input controls to produce a clean, professional, high-contrast black-and-white physical report layout.

---

## 🔌 Google Earth Engine (GEE) Integration Guide

The frontend features predefined connection points for deploying to production Google Earth Engine clusters. In [script.js](file:///c:/Users/akash/OneDrive/Desktop/ISRO/script.js#L313-L343), the function `DataPipeline.runGEEQuery()` can be integrated with the GEE REST API:

```javascript
// Example Production Integration Snippet
runGEEQuery() {
    const region = appState.selectedRegion;
    const threshold = document.getElementById('mapping-threshold').value;
    
    // Show system loading spinner
    document.getElementById('async-loader').classList.remove('hidden');

    fetch('https://earthengine.googleapis.com/v1alpha/projects/your-isro-project/imageCollections', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + OAUTH_TOKEN,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            region: region,
            threshold: threshold,
            sensors: ["LANDSAT/LC09/C02/T1_L2", "COPERNICUS/S2_SR"],
            metrics: ["LST", "NDVI", "NDBI"]
        })
    })
    .then(res => res.json())
    .then(data => {
        // MapOrchestrator.renderGEETiles(data.tile_url);
        document.getElementById('async-loader').classList.add('hidden');
        NotificationSystem.triggerToast('success', 'GEE Landsat/Sentinel Layers Synced Successfully.');
    })
    .catch(err => {
        console.error("GEE Connection Error: ", err);
        document.getElementById('async-loader').classList.add('hidden');
    });
}
```

---

## 🚀 How to Run the Project Locally

Because the project is written in vanilla HTML/CSS/JS, it runs directly in any modern web browser without requiring a compilation step:

1.  Clone this repository to your local machine:
    ```bash
    git clone https://github.com/<your-username>/<your-repo-name>.git
    ```
2.  Navigate to the repository folder:
    ```bash
    cd <your-repo-name>
    ```
3.  Open the dashboard:
    *   **Method A (Direct):** Double-click the [index1.html](file:///c:/Users/akash/OneDrive/Desktop/ISRO/index1.html) file to launch it directly in your web browser.
    *   **Method B (Local Server - Recommended):** To avoid potential local CORS restrictions when loading external libraries, run a lightweight local HTTP server:
        ```bash
        # Using Python 3
        python -m http.server 8000
        
        # Using Node.js (npx)
        npx http-server -p 8000
        ```
        Then, open `http://localhost:8000/index1.html` in your browser.

---

*Developed for the ISRO BAH 2026 Hackathon presentation. Space applications helping secure sustainable urban microclimates.*
