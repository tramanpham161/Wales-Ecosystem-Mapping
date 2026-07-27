# 🏴󠁧󠁢󠁷󠁬󠁳󠁿 Wales Employment Ecosystem Mapping

Welcome to the **Wales Employment Ecosystem Mapping** platform. This is an interactive, place-based digital tool designed to visualize, align, and streamline the pathways connecting young people with high-quality careers and systemic opportunities across Wales.

By mapping initiatives, highlighting regional friction points, and connecting employers, community hubs, and advisory networks, this application serves as a dynamic directory to eliminate systemic gaps in Welsh employment pipelines.

---

## 🌟 What This Platform Is About

The transition from a young learner to an active professional is rarely a straight line. Often, the barriers preventing successful career alignment are **systemic friction points**—from an early lack of career visibility to workplace cultural barriers. 

This platform maps these hurdles and tracks active solutions through two primary layers:
1. **The Young Learner's Life Journey**: A structured, 6-stage evolutionary pathway that guides users through specific phases of growth, identifying key friction points and active projects at every step.
2. **Geographical & Directory Mapping**: A place-based interface featuring an interactive Leaflet map and a searchable directory of organizations, initiatives, and regional hubs active throughout Wales.

---

## 🚀 Key Features

### 1. Interactive Learner Journey Flow
At the core of the platform is a visual, animated progress flow showing the 6 key stages of a young person's trajectory:
*   **Stage 1: Visibility** *(Represented by crawling infant)* — Early-years career awareness, community mapping, and aspirational outreach.
*   **Stage 2: Family Awareness** *(Represented by walking toddler)* — Active engagement with parents, carers, and local community influencers.
*   **Stage 3: Transitions** *(Represented by schoolchild with backpack)* — Aligning secondary education curricula with real-world job roles and vocational learning.
*   **Stage 4: Navigation** *(Represented by young adult in relaxed stance)* — Guidance through non-linear vocational, digital, and tertiary pathways.
*   **Stage 5: Translation** *(Represented by adult in neat business attire)* — Translating employer skills demands into understandable language for career seekers.
*   **Stage 6: Progression** *(Represented by professional with briefcase/clipboard)* — Ensuring workplace retention, coaching, and supportive company cultures.

### 2. Live Leaflet Map Visualizer
*   **Geospatial Plotting**: Mapped pins represent active organizations, training hubs, and employers located physically throughout Wales (Cardiff, Swansea, Wrexham, Bangor, Aberystwyth, and more).
*   **Real-time Synchronization**: Clicking on different life journey stages dynamically filters the map to only show initiatives active in that specific part of the ecosystem.
*   **Sector Legend Indicators**: Pins are organized by key economic sectors:
    *   ⚙️ **Tech** (Digital skills & software pathways)
    *   ♣️ **Green** (Net Zero, sustainability & clean energy)
    *   ✦ **Creative** (Media, design & digital arts)
    *   ▰ **Foundational** (Care, tourism, construction & local services)

### 3. Rich Ecosystem Directory
*   **Multi-parameter Filters**: Search by text keyword, filter by specific economic sectors, or filter by partner intake capacity (*"Accepting Partners"*, *"At Capacity"*, or *"Advisory Only"*).
*   **Dynamic Friction Context**: See specific details for each stage, including detailed systemic descriptions, active solutions being deployed, and core metrics showing progress.
*   **Instant Direct Outreach**: Contact mapped initiatives or the **OAHA Ecosystem Team** instantly with context-aware message presets.

### 4. Join the Ecosystem CTA
*   Allows local employers, regional advisors, and community organizers to submit information, map their own systemic initiatives, and request partnership packages with the OAHA Team.

---

## 🛠️ How to Use the Platform

### 🗺️ Navigating the Ecosystem
1.  **Select a Life Stage**: Click on any of the 6 illustrated cards in the **Learner's Life Path** header. This acts as the master filter for the page.
2.  **Read the Friction Report**: The central banner will update instantly to show the systemic problems, active solutions, and live metrics for your selected stage.
3.  **Explore Active Organizations**: 
    *   The **Leaflet map** on the left will plot pins for organizations working within that selected stage. Hover over or click a pin to see details.
    *   The **Directory list** on the right will update to list those organizations.
4.  **Connect with an Initiative**: Click **"Get in touch"** on any directory listing to open a tailored contact form, pre-filled with the exact topic you want to discuss.

### 🤝 Submitting Your Initiative / Joining OAHA
*   Click the prominent **"Connect & Join Ecosystem"** CTA button at the bottom of the map section.
*   Fill in your details to pitch your project, map your training programs, or request employer-apprentice integration in Wales.

---

## 💻 Technical Setup & Development

This platform is built using **React (TypeScript)**, **Vite**, **Tailwind CSS**, and **Leaflet.js** for high-performance interactive mapping.

### Prerequisites
*   Node.js (v18 or higher recommended)
*   npm

### Installation
1. Install project dependencies:
   ```bash
   npm install
   ```

2. Start the local development server:
   ```bash
   npm run dev
   ```
   The application will run locally at `http://localhost:3000`.

3. Compile and build for production:
   ```bash
   npm run build
   ```

---

## 🎨 Design Guidelines & Aesthetics
The application implements a premium, clean layout inspired by **modern Swiss-editorial aesthetics**:
*   **Typography**: Clean sans-serif headings paired with monospaced accents (`JetBrains Mono` and `Inter`).
*   **Color Palette**: Grounded in natural slates (`#2E536B`), off-whites, and organic greens/oranges, embodying the landscape and progressive industrial vision of Wales.
*   **Interactions**: Fluid micro-transitions, hover-scaling on vector graphics, and smooth scrolling for a modern user experience.
