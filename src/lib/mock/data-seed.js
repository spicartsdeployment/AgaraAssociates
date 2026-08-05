export const boqs = [
    {
        id: "boq-skyline-gf",
        projectId: "proj-skyline-villa",
        projectName: "Skyline Villa",
        title: "Ground Floor — Civil & Finishes",
        createdAt: "2026-01-15",
        updatedAt: "2026-06-27",
        items: [
            { id: "b1", room: "Living Room", item: "Vitrified flooring 600x600", quantity: 450, unit: "sqft", rate: 78, gst: 18, labour: 35, margin: 12 },
            { id: "b2", room: "Living Room", item: "False ceiling with cove lighting", quantity: 380, unit: "sqft", rate: 145, gst: 18, labour: 45, margin: 15 },
            { id: "b3", room: "Living Room", item: "Wall paint — Royale Emulsion", quantity: 920, unit: "sqft", rate: 28, gst: 18, labour: 18, margin: 10 },
            { id: "b4", room: "Master Bedroom", item: "Engineered wood flooring", quantity: 280, unit: "sqft", rate: 185, gst: 18, labour: 42, margin: 15 },
            { id: "b5", room: "Master Bedroom", item: "Wardrobe — premium laminate", quantity: 1, unit: "lot", rate: 185000, gst: 18, labour: 12000, margin: 18 },
            { id: "b6", room: "Kitchen", item: "Modular kitchen — acrylic finish", quantity: 1, unit: "lot", rate: 420000, gst: 18, labour: 25000, margin: 20 },
            { id: "b7", room: "Kitchen", item: "Quartz countertop", quantity: 42, unit: "sqft", rate: 3200, gst: 18, labour: 0, margin: 15 },
            { id: "b8", room: "Bathrooms", item: "Wall & floor tiles", quantity: 680, unit: "sqft", rate: 95, gst: 18, labour: 48, margin: 12 },
            { id: "b9", room: "Bathrooms", item: "Sanitary fittings — premium", quantity: 3, unit: "set", rate: 85000, gst: 18, labour: 8000, margin: 18 },
            { id: "b10", room: "General", item: "Electrical wiring & fixtures", quantity: 1, unit: "lot", rate: 320000, gst: 18, labour: 45000, margin: 15 },
        ],
    },
    {
        id: "boq-lakeside-civil",
        projectId: "proj-lakeside-residence",
        projectName: "Lakeside Residence",
        title: "Civil & Structural — 3 Floor Villa",
        createdAt: "2026-03-15",
        updatedAt: "2026-06-28",
        items: [
            { id: "lc1", room: "Foundation", item: "Raft foundation — 4500 sqft plot", quantity: 4500, unit: "sqft", rate: 450, gst: 18, labour: 35, margin: 12 },
            { id: "lc2", room: "Structure", item: "RCC frame — 7200 sqft built-up", quantity: 7200, unit: "sqft", rate: 1850, gst: 18, labour: 120, margin: 15 },
            { id: "lc3", room: "Masonry", item: "Brick/block work per floor", quantity: 3, unit: "floor", rate: 280000, gst: 18, labour: 45000, margin: 12 },
            { id: "lc4", room: "Finishes", item: "Basic internal finishes", quantity: 7200, unit: "sqft", rate: 420, gst: 18, labour: 55, margin: 15 },
        ],
    },
];
export const quotations = [
    {
        id: "quote-skyline-int",
        projectId: "proj-skyline-villa",
        projectName: "Skyline Villa",
        clientId: "client-mehta",
        clientName: "Mehta Family Trust",
        title: "Interior Finishes Package",
        status: "sent",
        amount: 3240000,
        validUntil: "2026-07-30",
        versions: [
            { version: 1, amount: 2980000, createdAt: "2026-05-01", changes: "Initial estimate" },
            { version: 2, amount: 3150000, createdAt: "2026-05-20", changes: "Added premium marble in master bath" },
            { version: 3, amount: 3240000, createdAt: "2026-06-15", changes: "Updated lighting package to smart home" },
        ],
        items: [
            { description: "Living & Dining Finishes", amount: 980000 },
            { description: "Master Bedroom Suite", amount: 720000 },
            { description: "Kitchen & Utility", amount: 650000 },
            { description: "Bathrooms (3 nos)", amount: 540000 },
            { description: "Electrical & Lighting", amount: 350000 },
        ],
    },
    {
        id: "quote-mehta-kitchen",
        projectId: "proj-mehta-kitchen",
        projectName: "Mehta Kitchen Renovation",
        clientId: "client-mehta",
        clientName: "Mehta Family Trust",
        title: "Kitchen Renovation",
        status: "sent",
        amount: 1850000,
        validUntil: "2026-07-15",
        versions: [
            { version: 1, amount: 1720000, createdAt: "2026-04-10", changes: "Initial kitchen quote" },
            { version: 2, amount: 1850000, createdAt: "2026-06-01", changes: "Upgraded to Hafele hardware" },
        ],
        items: [
            { description: "Modular Kitchen", amount: 950000 },
            { description: "Countertop & Backsplash", amount: 280000 },
            { description: "Appliances Package", amount: 420000 },
            { description: "Civil & Plumbing", amount: 200000 },
        ],
    },
];
export const drawings = [
    { id: "drw-1", projectId: "proj-skyline-villa", name: "Ground Floor Plan", type: "floor_plan", version: "v2.3", status: "approved", updatedAt: "2026-06-28", thumbnail: "/images/drawing-floor.svg" },
    { id: "drw-2", projectId: "proj-skyline-villa", name: "First Floor Plan", type: "floor_plan", version: "v2.1", status: "pending_client", updatedAt: "2026-06-25", thumbnail: "/images/drawing-floor.svg" },
    { id: "drw-3", projectId: "proj-skyline-villa", name: "Living Room 3D Render", type: "3d_render", version: "v3.0", status: "review", updatedAt: "2026-06-29", thumbnail: "/images/drawing-render.svg" },
    { id: "drw-4", projectId: "proj-skyline-villa", name: "Interior Mood Board", type: "mood_board", version: "v1.2", status: "approved", updatedAt: "2026-06-20", thumbnail: "/images/drawing-mood.svg" },
    { id: "drw-5", projectId: "proj-zen-penthouse", name: "Penthouse Layout", type: "floor_plan", version: "v1.0", status: "draft", updatedAt: "2026-06-22", thumbnail: "/images/drawing-floor.svg" },
    { id: "drw-6", projectId: "proj-aurora-office", name: "Open Plan Layout", type: "cad", version: "v1.5", status: "review", updatedAt: "2026-06-27", thumbnail: "/images/drawing-cad.svg" },
];
export const kanbanTasks = [
    { id: "kb-1", projectId: "proj-skyline-villa", title: "Marble flooring installation", description: "Master bedroom Italian marble", column: "in_progress", priority: "high", assignee: "Amit Joshi" },
    { id: "kb-2", projectId: "proj-skyline-villa", title: "Electrical rough-in", description: "First floor wiring", column: "todo", priority: "medium", assignee: "Site Team A" },
    { id: "kb-3", projectId: "proj-skyline-villa", title: "Kitchen cabinet installation", description: "Modular kitchen fitting", column: "inspection", priority: "high", assignee: "Modular Team" },
    { id: "kb-4", projectId: "proj-skyline-villa", title: "Civil work — ground floor", description: "Completed structural work", column: "done", priority: "low", assignee: "Civil Contractor" },
    { id: "kb-5", projectId: "proj-emerald-retail", title: "Display unit fabrication", description: "Custom retail displays", column: "in_progress", priority: "high", assignee: "Priya Nair" },
    { id: "kb-6", projectId: "proj-emerald-retail", title: "MEP inspection", description: "Electrical and plumbing check", column: "todo", priority: "high", assignee: "Amit Joshi" },
    { id: "kb-lake-1", projectId: "proj-lakeside-residence", title: "Obtain building plan sanction", description: "Building Plan Sanction, Fire NOC, Environmental Clearance", column: "done", priority: "high", assignee: "Amit Joshi" },
    { id: "kb-lake-2", projectId: "proj-lakeside-residence", title: "Site mobilization setup", description: "Tower Crane, Concrete Pump, Excavator deployed", column: "done", priority: "high", assignee: "Patil Constructions" },
    { id: "kb-lake-3", projectId: "proj-lakeside-residence", title: "Foundation excavation & raft casting", description: "Raft foundation — 4500 sqft", column: "in_progress", priority: "high", assignee: "Patil Constructions" },
    { id: "kb-lake-4", projectId: "proj-lakeside-residence", title: "Safety compliance audit", description: "PPE, signage, first aid station verified", column: "inspection", priority: "medium", assignee: "Site Engineer" },
];
export const purchaseOrders = [
    { id: "po-1", projectId: "proj-skyline-villa", projectName: "Skyline Villa", vendor: "Kajaria Ceramics", amount: 62400, status: "delivered", orderDate: "2026-06-10", deliveryDate: "2026-06-18", items: 1 },
    { id: "po-2", projectId: "proj-skyline-villa", projectName: "Skyline Villa", vendor: "Hafele India", amount: 185000, status: "ordered", orderDate: "2026-06-25", deliveryDate: "2026-07-10", items: 12 },
    { id: "po-3", projectId: "proj-emerald-retail", projectName: "Emerald Retail", vendor: "Asian Paints", amount: 42000, status: "pending", orderDate: "2026-06-28", deliveryDate: "2026-07-05", items: 3 },
    { id: "po-4", projectId: "proj-mehta-kitchen", projectName: "Mehta Kitchen", vendor: "Ebco", amount: 95000, status: "ordered", orderDate: "2026-06-20", deliveryDate: "2026-07-02", items: 8 },
];
export const vendorQuotes = [
    { vendor: "Kajaria Ceramics", material: "Vitrified Tiles 600x600", price: 78, deliveryDays: 5, rating: 4.8 },
    { vendor: "Somany Ceramics", material: "Vitrified Tiles 600x600", price: 72, deliveryDays: 7, rating: 4.5 },
    { vendor: "Johnson Tiles", material: "Vitrified Tiles 600x600", price: 75, deliveryDays: 4, rating: 4.6 },
    { vendor: "Hafele India", material: "Soft-Close Hinges", price: 385, deliveryDays: 10, rating: 4.9 },
    { vendor: "Ebco", material: "Soft-Close Hinges", price: 245, deliveryDays: 5, rating: 4.4 },
    { vendor: "Hettich India", material: "Soft-Close Hinges", price: 320, deliveryDays: 8, rating: 4.7 },
];
export const invoices = [
    { id: "inv-1", projectId: "proj-skyline-villa", projectName: "Skyline Villa", clientId: "client-mehta", clientName: "Mehta Family Trust", amount: 2500000, status: "paid", dueDate: "2026-05-30", issuedDate: "2026-05-01" },
    { id: "inv-2", projectId: "proj-skyline-villa", projectName: "Skyline Villa", clientId: "client-mehta", clientName: "Mehta Family Trust", amount: 1800000, status: "pending", dueDate: "2026-07-15", issuedDate: "2026-06-15" },
    { id: "inv-3", projectId: "proj-emerald-retail", projectName: "Emerald Retail", clientId: "client-patel", clientName: "Patel Retail Chain", amount: 850000, status: "pending", dueDate: "2026-07-03", issuedDate: "2026-06-03" },
    { id: "inv-4", projectId: "proj-aurora-office", projectName: "Aurora Tech Office", clientId: "client-desai", clientName: "TechCorp India", amount: 1500000, status: "paid", dueDate: "2026-06-28", issuedDate: "2026-06-01" },
    { id: "inv-5", projectId: "proj-kapoor-showroom", projectName: "Kapoor Showroom", clientId: "client-kapoor", clientName: "Kapoor Textiles", amount: 420000, status: "overdue", dueDate: "2026-06-15", issuedDate: "2026-05-15" },
];
export const communications = [
    { id: "comm-1", clientId: "client-mehta", type: "meeting", subject: "Interior finishes review", summary: "Discussed marble alternatives for master bath. Client open to Indian Makrana at 40% savings.", date: "2026-06-28" },
    { id: "comm-2", clientId: "client-mehta", type: "whatsapp", subject: "Kitchen quote feedback", summary: "Rajesh requested Hafele hardware upgrade. Revised quote v2 prepared.", date: "2026-06-25" },
    { id: "comm-3", clientId: "client-mehta", type: "email", subject: "Drawing approval — Ground floor", summary: "Ground floor plan v2.3 approved with minor notes on utility layout.", date: "2026-06-20" },
    { id: "comm-4", clientId: "client-mehta", type: "call", subject: "Budget discussion", summary: "Reviewed overall project budget. Agreed to value-engineer lighting package.", date: "2026-06-15" },
    { id: "comm-5", clientId: "client-patel", type: "email", subject: "MEP drawing submission", summary: "Consultant drawings shared for PMC review. Awaiting stamp.", date: "2026-06-27" },
    { id: "comm-6", clientId: "client-desai", type: "meeting", subject: "Open plan layout review", summary: "TechCorp facilities team reviewed v1.5. Minor workstation density changes requested.", date: "2026-06-26" },
];
