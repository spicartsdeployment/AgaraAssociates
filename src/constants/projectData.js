import backGroundVideo from "@/assets/videos/background/agarabackground.mp4";
import kadthalVideo from "@/assets/videos/projects/kadthal.mp4";
import whiteridge from "@/assets/videos/projects/whiteridge.mp4";

import teamImg from "@/assets/images/team/team-img.png";
import img1 from "@/assets/images/journal/img-1.jpg";
import img2 from "@/assets/images/journal/img-2.jpg";
import img3 from "@/assets/images/journal/img-3.png";
import logo from "@/assets/images/logos/logo.png";
import map from "@/assets/images/maps/map.png";
import agaraAssociatesLogo from "@/assets/images/logos/Aagara Associates logo.png";

import project1Img from "../assets/images/projects/flat-no-102-narsingi-01/hero.jpg";
import project2Img from "../assets/images/projects/penthouse-hi-tech-city/hero.jpg";
import project3Img from "../assets/images/projects/farm-house-maheshwaram/hero.jpg";
import project4Img from "../assets/images/projects/villa-bowenpally/hero.png";
import project5Img from "../assets/images/projects/white-ridge-hotel-hi-tech-city/hero.jpg";
import project6Img from "../assets/images/projects/apartment-machilipatnam/hero.jpg";
import project7Img from "../assets/images/projects/apartment-kondapur/hero.png";
import project8Img from "../assets/images/projects/vasavika-brindavanam-layout-bengaluru/hero.jpg";
import project9Img from "../assets/images/projects/villa-layout-kadthal/hero.jpg";
import project10Img from "../assets/images/projects/chinthala-residence-bollaram/hero.jpg";
import project11Img from "../assets/images/projects/club-taberna-jubilee-hills/hero.jpg";
import project12Img from "../assets/images/projects/farmland-layout-kotra/floorplan.jpg";
import project13Img from "../assets/images/projects/landscape-layout-nagarkurnool/hero.jpg";
import project14Img from "../assets/images/projects/white-ridge-farm-house-yadadri/hero.jpg";

function buildMaterialTransactionHistory(requiredQuantity, purchasedQuantity, consumedQuantity, index) {
  const targetPurchased = Math.min(Math.max(purchasedQuantity, 1), Math.max(requiredQuantity, 1));
  const targetConsumed = Math.min(Math.max(consumedQuantity, 0), targetPurchased);
  const initialPurchase = Math.max(1, Math.min(targetPurchased, Math.round(targetPurchased * (0.55 + (index % 3) * 0.05))));
  const secondPurchase = targetPurchased - initialPurchase;
  const firstConsumption = targetConsumed > 0 ? Math.max(1, Math.min(targetConsumed, Math.round(targetConsumed * (0.6 + (index % 2) * 0.1)))) : 0;
  const secondConsumption = targetConsumed > 0 ? targetConsumed - firstConsumption : 0;

  const history = [];
  let purchasedTotal = 0;
  let consumedTotal = 0;

  history.push({
    id: `TXN-${index + 1}-01`,
    date: `2026-07-${String(10 + (index % 12)).padStart(2, "0")}T08:30:00.000Z`,
    transactionType: "Purchase",
    quantityAdded: initialPurchase,
    quantityConsumed: 0,
    purchasedTotal: purchasedTotal + initialPurchase,
    consumedTotal,
    remainingQuantity: purchasedTotal + initialPurchase - consumedTotal,
    updatedBy: "Adarsh P",
    remarks: "Initial procurement and delivery confirmation.",
  });

  if (firstConsumption > 0) {
    consumedTotal += firstConsumption;
    history.push({
      id: `TXN-${index + 1}-02`,
      date: `2026-07-${String(16 + (index % 8)).padStart(2, "0")}T11:20:00.000Z`,
      transactionType: "Consumption",
      quantityAdded: 0,
      quantityConsumed: firstConsumption,
      purchasedTotal: targetPurchased,
      consumedTotal,
      remainingQuantity: targetPurchased - consumedTotal,
      updatedBy: "Adarsh P",
      remarks: "Issued for the active execution stage.",
    });
  }

  if (secondPurchase > 0) {
    purchasedTotal += secondPurchase;
    history.push({
      id: `TXN-${index + 1}-03`,
      date: `2026-08-${String(2 + (index % 5)).padStart(2, "0")}T09:15:00.000Z`,
      transactionType: "Purchase",
      quantityAdded: secondPurchase,
      quantityConsumed: 0,
      purchasedTotal: purchasedTotal + initialPurchase,
      consumedTotal,
      remainingQuantity: purchasedTotal + initialPurchase - consumedTotal,
      updatedBy: "Adarsh P",
      remarks: "Top-up delivery for pending scope.",
    });
  }

  if (secondConsumption > 0) {
    consumedTotal += secondConsumption;
    history.push({
      id: `TXN-${index + 1}-04`,
      date: `2026-08-${String(6 + (index % 7)).padStart(2, "0")}T15:40:00.000Z`,
      transactionType: "Consumption",
      quantityAdded: 0,
      quantityConsumed: secondConsumption,
      purchasedTotal: targetPurchased,
      consumedTotal,
      remainingQuantity: targetPurchased - consumedTotal,
      updatedBy: "Adarsh P",
      remarks: "Continued site usage and installation work.",
    });
  }

  return {
    history,
    purchasedQuantity: targetPurchased,
    consumedQuantity: targetConsumed,
    remainingQuantity: Math.max(0, targetPurchased - targetConsumed),
  };
}

function createProjectMaterials(projectId, seedItems) {
  const prefix = String(projectId).padStart(3, "0");

  return seedItems.map((item, index) => {
    const requiredQuantity = Number(item.requiredQuantity ?? 120 + index * 25);
    const unitRate = Number(item.unitRate ?? 350 + index * 60);
    const defaultPurchased = Number(item.purchasedQuantity ?? Math.min(requiredQuantity, Math.max(0, Math.round(requiredQuantity * 0.72)))) || 0;
    const defaultConsumed = Number(item.consumedQuantity ?? Math.min(defaultPurchased, Math.max(0, Math.round(defaultPurchased * 0.72)))) || 0;
    const transactionState = buildMaterialTransactionHistory(requiredQuantity, defaultPurchased, defaultConsumed, index);
    const purchasedQuantity = transactionState.purchasedQuantity;
    const consumedQuantity = transactionState.consumedQuantity;
    const remainingQuantity = transactionState.remainingQuantity;
    const estimatedCost = Number(item.estimatedCost ?? requiredQuantity * unitRate);
    const purchasedCost = Number(item.purchasedCost ?? purchasedQuantity * unitRate);
    const procurementStatus = item.procurementStatus ?? ["Delivered", "Ordered", "Approved", "Pending", "Partially Delivered"][index % 5];
    const expectedDeliveryDate = item.expectedDeliveryDate ?? `2026-${String(8 + (index % 3)).padStart(2, "0")}-${String(10 + (index % 20)).padStart(2, "0")}`;
    const history = item.history ?? transactionState.history;

    return {
      id: `MAT-${prefix}-${String(index + 1).padStart(2, "0")}`,
      materialName: item.materialName,
      category: item.category,
      brand: item.brand,
      vendor: item.vendor,
      requiredQuantity,
      requiredQty: requiredQuantity,
      purchasedQuantity,
      consumedQuantity,
      remainingQuantity,
      purchasedQty: purchasedQuantity,
      consumedQty: consumedQuantity,
      remainingQty: remainingQuantity,
      purchasedCost,
      purchaseDate: item.purchaseDate ?? history[0]?.date?.split("T")[0] ?? expectedDeliveryDate,
      invoiceNumber: item.invoiceNumber ?? `INV-${prefix}-${String(index + 1).padStart(2, "0")}`,
      history,
      unit: item.unit ?? "Nos",
      unitRate,
      estimatedCost,
      procurementStatus,
      expectedDeliveryDate,
      remarks: item.remarks ?? "Aligned with the current execution phase.",
      name: item.materialName,
      sku: `SKU-${prefix}-${String(index + 1).padStart(2, "0")}`,
      categoryId: item.categoryId ?? "general",
      supplier: item.vendor,
      specification: `${item.category} selected for the active scope and delivery window.`,
      currentPrice: unitRate,
      previousPrice: Math.round(unitRate * 0.95),
      availability: procurementStatus === "Pending" ? "low_stock" : "in_stock",
      stockQuantity: Math.max(1, Math.round(requiredQuantity * 0.35)),
    };
  });
}

const constructionMaterials = [
  { materialName: "OPC Cement", category: "Cement", brand: "UltraTech", vendor: "ABC Building Materials", requiredQuantity: 180, unit: "Bags", unitRate: 420, procurementStatus: "Delivered", expectedDeliveryDate: "2026-08-10", remarks: "Foundation work completed" },
  { materialName: "TMT Steel", category: "Steel", brand: "TATA Steel", vendor: "Sri Lakshmi Steels", requiredQuantity: 24, unit: "MT", unitRate: 72000, procurementStatus: "Ordered", expectedDeliveryDate: "2026-08-18", remarks: "Structural frame procurement in progress" },
  { materialName: "River Sand", category: "Sand", brand: "City Sand Co.", vendor: "Metro Construction Supplies", requiredQuantity: 95, unit: "Cubic Meter", unitRate: 2800, procurementStatus: "Approved", expectedDeliveryDate: "2026-08-12", remarks: "Plastering and masonry scope" },
  { materialName: "20mm Aggregate", category: "Aggregate", brand: "RMC Aggregates", vendor: "Prime Aggregates", requiredQuantity: 70, unit: "Cubic Meter", unitRate: 2200, procurementStatus: "Delivered", expectedDeliveryDate: "2026-08-07", remarks: "Base layer and slab fill complete" },
  { materialName: "Fly Ash Bricks", category: "Bricks", brand: "Bharat Bricks", vendor: "City Hardware", requiredQuantity: 6400, unit: "Nos", unitRate: 9, procurementStatus: "Partially Delivered", expectedDeliveryDate: "2026-08-22", remarks: "Wall work pending for second wing" },
  { materialName: "Concrete Blocks", category: "Concrete Blocks", brand: "HCL Blocks", vendor: "Buildwell Materials", requiredQuantity: 320, unit: "Nos", unitRate: 54, procurementStatus: "Ordered", expectedDeliveryDate: "2026-08-20", remarks: "Retaining and boundary wall package" },
  { materialName: "Waterproofing Membrane", category: "Waterproofing", brand: "Dr. Fixit", vendor: "TechProtect Supplies", requiredQuantity: 140, unit: "Sqm", unitRate: 320, procurementStatus: "Approved", expectedDeliveryDate: "2026-08-14", remarks: "Terrace and wet area protection" },
  { materialName: "Ready Mix Concrete", category: "Ready Mix Concrete", brand: "ACC", vendor: "Hyderabad RMC", requiredQuantity: 56, unit: "Cum", unitRate: 7800, procurementStatus: "Delivered", expectedDeliveryDate: "2026-08-09", remarks: "Raft and slab pours completed" },
  { materialName: "MS Angles", category: "Steel", brand: "JSW Steel", vendor: "Sri Lakshmi Steels", requiredQuantity: 12, unit: "MT", unitRate: 65000, procurementStatus: "Pending", expectedDeliveryDate: "2026-08-28", remarks: "Lintel and canopy framing" },
  { materialName: "Cement Plaster", category: "Cement", brand: "UltraTech", vendor: "ABC Building Materials", requiredQuantity: 90, unit: "Bags", unitRate: 410, procurementStatus: "Approved", expectedDeliveryDate: "2026-08-16", remarks: "Internal plastering package" },
  { materialName: "PCC Tiles", category: "Floor Tiles", brand: "Kajaria", vendor: "Modern Tiles House", requiredQuantity: 320, unit: "Sqm", unitRate: 980, procurementStatus: "Ordered", expectedDeliveryDate: "2026-08-24", remarks: "Ground floor tile procurement" },
  { materialName: "Exterior Paint", category: "Paint", brand: "Asian Paints", vendor: "ColorTech Supplies", requiredQuantity: 60, unit: "Litre", unitRate: 620, procurementStatus: "Pending", expectedDeliveryDate: "2026-08-29", remarks: "Facade finish and primer coat" },
];

const interiorMaterials = [
  { materialName: "Plywood", category: "Plywood", brand: "Century Ply", vendor: "Classic Interiors", requiredQuantity: 180, unit: "Sheets", unitRate: 4200, procurementStatus: "Delivered", expectedDeliveryDate: "2026-08-13", remarks: "Joinery and wardrobes" },
  { materialName: "Laminates", category: "Laminates", brand: "Greenply", vendor: "Classic Interiors", requiredQuantity: 96, unit: "Sheets", unitRate: 1800, procurementStatus: "Ordered", expectedDeliveryDate: "2026-08-17", remarks: "Kitchen and vanity shutters" },
  { materialName: "Veneer", category: "Veneer", brand: "Greenply", vendor: "Royal Woodworks", requiredQuantity: 48, unit: "Sheets", unitRate: 2200, procurementStatus: "Approved", expectedDeliveryDate: "2026-08-15", remarks: "Feature wall and paneling" },
  { materialName: "MDF Board", category: "MDF", brand: "Action Tesa", vendor: "Classic Interiors", requiredQuantity: 120, unit: "Sheets", unitRate: 2600, procurementStatus: "Delivered", expectedDeliveryDate: "2026-08-11", remarks: "Cabinet carcass and storage" },
  { materialName: "Edge Band", category: "Edge Band", brand: "Hettich", vendor: "Classic Interiors", requiredQuantity: 360, unit: "Meters", unitRate: 95, procurementStatus: "Partially Delivered", expectedDeliveryDate: "2026-08-23", remarks: "Furniture finishing and edge detailing" },
  { materialName: "Toughened Glass", category: "Toughened Glass", brand: "Saint-Gobain", vendor: "Royal Glass House", requiredQuantity: 24, unit: "Sqm", unitRate: 2600, procurementStatus: "Ordered", expectedDeliveryDate: "2026-08-19", remarks: "Partition and display panel" },
  { materialName: "LED Lights", category: "LED Lights", brand: "Philips", vendor: "Prime Electricals", requiredQuantity: 72, unit: "Nos", unitRate: 980, procurementStatus: "Delivered", expectedDeliveryDate: "2026-08-08", remarks: "Ambient lighting package" },
  { materialName: "Switches", category: "Switches", brand: "Legrand", vendor: "Prime Electricals", requiredQuantity: 120, unit: "Nos", unitRate: 250, procurementStatus: "Approved", expectedDeliveryDate: "2026-08-16", remarks: "Power and lighting point accessories" },
  { materialName: "Wash Basin", category: "Wash Basin", brand: "Jaquar", vendor: "City Hardware", requiredQuantity: 8, unit: "Nos", unitRate: 12400, procurementStatus: "Pending", expectedDeliveryDate: "2026-08-30", remarks: "Bathroom vanity package" },
  { materialName: "Faucets", category: "Faucets", brand: "Hindware", vendor: "City Hardware", requiredQuantity: 14, unit: "Nos", unitRate: 3200, procurementStatus: "Ordered", expectedDeliveryDate: "2026-08-21", remarks: "Kitchen and washroom fixtures" },
  { materialName: "Modular Kitchen", category: "Furniture", brand: "Hettich", vendor: "Classic Interiors", requiredQuantity: 3, unit: "Set", unitRate: 280000, procurementStatus: "Approved", expectedDeliveryDate: "2026-08-25", remarks: "Custom kitchen installation" },
  { materialName: "Wardrobe", category: "Furniture", brand: "Hafele", vendor: "Classic Interiors", requiredQuantity: 4, unit: "Nos", unitRate: 165000, procurementStatus: "Delivered", expectedDeliveryDate: "2026-08-12", remarks: "Master bedroom storage units" },
];

const turnkeyMaterials = [
  { materialName: "OPC Cement", category: "Cement", brand: "UltraTech", vendor: "ABC Building Materials", requiredQuantity: 260, unit: "Bags", unitRate: 420, procurementStatus: "Delivered", expectedDeliveryDate: "2026-08-10", remarks: "Structural foundation and retaining wall" },
  { materialName: "TMT Steel", category: "Steel", brand: "TATA Steel", vendor: "Sri Lakshmi Steels", requiredQuantity: 32, unit: "MT", unitRate: 72000, procurementStatus: "Ordered", expectedDeliveryDate: "2026-08-18", remarks: "Superstructure procurement" },
  { materialName: "Plywood", category: "Plywood", brand: "Century Ply", vendor: "Classic Interiors", requiredQuantity: 210, unit: "Sheets", unitRate: 4200, procurementStatus: "Approved", expectedDeliveryDate: "2026-08-16", remarks: "Joinery package across all zones" },
  { materialName: "Laminates", category: "Laminates", brand: "Greenply", vendor: "Classic Interiors", requiredQuantity: 112, unit: "Sheets", unitRate: 1800, procurementStatus: "Ordered", expectedDeliveryDate: "2026-08-20", remarks: "Cabinet and vanity finish" },
  { materialName: "Toughened Glass", category: "Toughened Glass", brand: "Saint-Gobain", vendor: "Royal Glass House", requiredQuantity: 30, unit: "Sqm", unitRate: 2600, procurementStatus: "Delivered", expectedDeliveryDate: "2026-08-11", remarks: "Main facade and internal partitions" },
  { materialName: "LED Lights", category: "LED Lights", brand: "Philips", vendor: "Prime Electricals", requiredQuantity: 96, unit: "Nos", unitRate: 980, procurementStatus: "Partially Delivered", expectedDeliveryDate: "2026-08-24", remarks: "Decorative and task lighting" },
  { materialName: "Switches", category: "Switches", brand: "Legrand", vendor: "Prime Electricals", requiredQuantity: 140, unit: "Nos", unitRate: 250, procurementStatus: "Approved", expectedDeliveryDate: "2026-08-17", remarks: "All power points and control units" },
  { materialName: "Waterproofing Membrane", category: "Waterproofing", brand: "Dr. Fixit", vendor: "TechProtect Supplies", requiredQuantity: 180, unit: "Sqm", unitRate: 320, procurementStatus: "Delivered", expectedDeliveryDate: "2026-08-09", remarks: "Sump and terrace protection" },
  { materialName: "Floor Tiles", category: "Floor Tiles", brand: "Kajaria", vendor: "Modern Tiles House", requiredQuantity: 420, unit: "Sqm", unitRate: 980, procurementStatus: "Ordered", expectedDeliveryDate: "2026-08-22", remarks: "Common areas and living spaces" },
  { materialName: "Paint", category: "Paint", brand: "Asian Paints", vendor: "ColorTech Supplies", requiredQuantity: 90, unit: "Litre", unitRate: 620, procurementStatus: "Pending", expectedDeliveryDate: "2026-08-29", remarks: "Interior and exterior finish" },
  { materialName: "Modular Kitchen", category: "Furniture", brand: "Hettich", vendor: "Classic Interiors", requiredQuantity: 2, unit: "Set", unitRate: 320000, procurementStatus: "Approved", expectedDeliveryDate: "2026-08-26", remarks: "Kitchen island and pantry layout" },
  { materialName: "Wardrobe", category: "Furniture", brand: "Hafele", vendor: "Classic Interiors", requiredQuantity: 3, unit: "Nos", unitRate: 165000, procurementStatus: "Ordered", expectedDeliveryDate: "2026-08-27", remarks: "Bedroom storage upgrade" },
  { materialName: "Wash Basin", category: "Wash Basin", brand: "Jaquar", vendor: "City Hardware", requiredQuantity: 6, unit: "Nos", unitRate: 12400, procurementStatus: "Pending", expectedDeliveryDate: "2026-08-31", remarks: "Guest and family washrooms" },
  { materialName: "Faucets", category: "Faucets", brand: "Hindware", vendor: "City Hardware", requiredQuantity: 12, unit: "Nos", unitRate: 3200, procurementStatus: "Delivered", expectedDeliveryDate: "2026-08-14", remarks: "Kitchen and vanity installation" },
];

export const projectMaterialsById = {
  1: createProjectMaterials(1, constructionMaterials),
  2: createProjectMaterials(2, interiorMaterials),
  3: createProjectMaterials(3, constructionMaterials),
  4: createProjectMaterials(4, constructionMaterials),
  5: createProjectMaterials(5, interiorMaterials),
  6: createProjectMaterials(6, constructionMaterials),
  8: createProjectMaterials(8, interiorMaterials),
  9: createProjectMaterials(9, constructionMaterials),
  10: createProjectMaterials(10, constructionMaterials),
  11: createProjectMaterials(11, interiorMaterials),
  12: createProjectMaterials(12, constructionMaterials),
  13: createProjectMaterials(13, constructionMaterials),
  14: createProjectMaterials(14, turnkeyMaterials),
};

const project1_Images = Object.values(
  import.meta.glob("../assets/images/projects/flat-no-102-narsingi-01/*.{png,jpg,jpeg,svg}", {
    eager: true,
  })
).map((module) => ({
  type: "image",
  src: module?.default || module,
}));

const project2_Images = Object.values(
  import.meta.glob("../assets/images/projects/penthouse-hi-tech-city/*.{png,jpg,jpeg,svg}", {
    eager: true,
  })
).map((module) => ({
  type: "image",
  src: module?.default || module,
}));

const project3_Images = Object.values(
  import.meta.glob("../assets/images/projects/farm-house-maheshwaram/*.{png,jpg,jpeg,svg}", {
    eager: true,
  })
).map((module) => ({
  type: "image",
  src: module?.default || module,
}));

const project4_Images = Object.values(
  import.meta.glob("../assets/images/projects/villa-bowenpally/*.{png,jpg,jpeg,svg}", {
    eager: true,
  })
).map((module) => ({
  type: "image",
  src: module?.default || module,
}));

const project5_Images = Object.values(
  import.meta.glob(
    "../assets/images/projects/white-ridge-hotel-hi-tech-city/*.{png,jpg,jpeg,svg}",
    { eager: true }
  )
).map((module) => ({
  type: "image",
  src: module?.default || module,
}));

project5_Images.unshift({
  type: "video",
  src: whiteridge,
});

const project6_Images = Object.values(
  import.meta.glob("../assets/images/projects/apartment-machilipatnam/*.{png,jpg,jpeg,svg}", {
    eager: true,
  })
).map((module) => ({
  type: "image",
  src: module?.default || module,
}));

const project7_Images = Object.values(
  import.meta.glob("../assets/images/projects/apartment-kondapur/*.{png,jpg,jpeg,svg}", {
    eager: true,
  })
).map((module) => ({
  type: "image",
  src: module?.default || module,
}));

const project8_Images = Object.values(
  import.meta.glob(
    "../assets/images/projects/vasavika-brindavanam-layout-bengaluru/*.{png,jpg,jpeg,svg}",
    { eager: true }
  )
).map((module) => ({
  type: "image",
  src: module?.default || module,
}));

const project9_Images = Object.values(
  import.meta.glob("../assets/images/projects/villa-layout-kadthal/*.{png,jpg,jpeg,svg}", {
    eager: true,
  })
).map((module) => ({
  type: "image",
  src: module?.default || module,
}));

const project10_Images = Object.values(
  import.meta.glob(
    "../assets/images/projects/chinthala-residence-bollaram/*.{png,jpg,jpeg,svg}",
    { eager: true }
  )
).map((module) => ({
  type: "image",
  src: module?.default || module,
}));

const project11_Images = Object.values(
  import.meta.glob(
    "../assets/images/projects/club-taberna-jubilee-hills/*.{png,jpg,jpeg,svg}",
    { eager: true }
  )
).map((module) => ({
  type: "image",
  src: module?.default || module,
}));

const project13_Images = Object.values(
  import.meta.glob(
    "../assets/images/projects/landscape-layout-nagarkurnool/*.{png,jpg,jpeg,svg}",
    { eager: true }
  )
).map((module) => ({
  type: "image",
  src: module?.default || module,
}));

const project14_Images = Object.values(
  import.meta.glob(
    "../assets/images/projects/white-ridge-farm-house-yadadri/*.{png,jpg,jpeg,svg}",
    { eager: true }
  )
).map((module) => ({
  type: "image",
  src: module?.default || module,
}));

project9_Images.unshift({
  type: "video",
  src: kadthalVideo,
});

export const IMAGE_SOURCES = {
  teamImg,
  img1,
  img2,
  img3,
  logo,
  agaraAssociatesLogo,
  map,
};

export const VIDEO_SOURCES = {
  backGroundVideo,
};

const projectCatalog = [
  {
    id: 1,
    title: "Flat No 102, Narsingi",
    subTittle: "Residential",
    plotArea: "420 SQ.YD",
    location: "Narsingi, Hyderabad",
    img: project1Img,
    images: project1_Images,
    materials: createProjectMaterials(1, constructionMaterials),
    description: `A refined residential interior that blends timeless elegance with modern functionality. 
    Classic detailing and rich materials create a space that is both sophisticated and inviting. Every corner is thoughtfully designed to enhance comfort while maintaining a sense of luxury.
    Warm tones and layered textures bring depth and character to the home. This project is a celebration of enduring style, craftsmanship, and graceful living.`,
  },

  {
    id: 2,
    title: "Penthouse, Hi-tech city",
    subTittle: "Mixed Use",
    plotArea: "1800 SQ.FT",
    location: "Hi-Tech City, Hyderabad",
    img: project2Img,
    images: project2_Images,
    materials: createProjectMaterials(2, interiorMaterials),
    description: `This mixed-use penthouse embraces a rustic design language that blends natural charm with contemporary living.
     Exposed textures, earthy tones, and raw finishes create an atmosphere that feels grounded yet luxurious. The spatial planning seamlessly integrates functionality with aesthetic warmth. 
     Thoughtful material choices and handcrafted details add character and depth to every corner. The result is a timeless retreat that celebrates organic beauty and modern sophistication.`,
  },

  {
    id: 3,
    title: "Farm House, Maheswaram",
    subTittle: "Residential",
    plotArea: "6500 SQ.YD",
    location: "Maheshwaram, Hyderabad",
    img: project3Img,
    images: project3_Images,
    materials: createProjectMaterials(3, constructionMaterials),
    description: `This modern villa is designed as a serene retreat, seamlessly merging architecture with expansive landscape. 
        Open spaces and large green vistas create a harmonious connection between indoor comfort and outdoor living. The design emphasizes simplicity and elegance, with clean lines and contemporary forms. 
        Natural light and flowing spatial layouts enhance the sense of openness and tranquility. It’s a sophisticated escape that celebrates modern living amidst nature’s vast beauty.`,
  },
  {
    id: 13,
    title: "Landscape layout, Nagarkurnool",
    subTittle: "Residential",
    plotArea: "3200 SQ.YD",
    location: "Nagarkurnool",
    img: project13Img,
    images: project13_Images,
    materials: createProjectMaterials(13, constructionMaterials),
    description: `This modern landscape project transforms public space into a vibrant and welcoming environment. Thoughtfully designed parks, recreational areas, and open spaces encourage community engagement and outdoor activity.
     The layout balances aesthetics with functionality, creating a harmonious blend of greenery and amenities. Pathways, seating areas, and landscaping elements are curated to enhance user experience and visual appeal.
      This Park stands as a testament to contemporary landscape design that promotes both leisure and connectivity.
      `,
  },

  {
    id: 5,
    title: "White Ridge Hotel, Hi-tech City",
    subTittle: "Hospitality",
    plotArea: "5400 SQ.FT",
    location: "Hi-Tech City, Hyderabad",
    img: project5Img,
    images: project5_Images,
    materials: createProjectMaterials(5, interiorMaterials),
    description: `A landmark in luxury hospitality, this project embodies refined design and impeccable construction.
         Every space is crafted to deliver an elevated guest experience, combining sophistication with comfort. Premium materials, elegant detailing, and thoughtful spatial planning define the hotel’s timeless character.
        The architecture seamlessly integrates functionality with grandeur, creating an inviting yet distinguished ambiance. White Ridge stands as a testament to premium design excellence and world-class craftsmanship.`,
  },

  {
    id: 14,
    title: "White ridge farmhouse, Yadagiri",
    subTittle: "Residential",
    plotArea: "7200 SQ.YD",
    location: "Yadadri",
    img: project14Img,
    images: project14_Images,
    materials: createProjectMaterials(14, turnkeyMaterials),
    description: `This elegant residential project offers a serene countryside retreat that blends rustic charm with modern comforts. Thoughtfully designed living spaces, open landscapes, and natural surroundings create an atmosphere of tranquility and privacy.
     The layout balances aesthetics with functionality, providing a seamless connection between indoor and outdoor areas. Architecture, materials, and sustainable elements are curated to enhance comfort, beauty, and long-term value.
      This farmhouse stands as a testament to timeless design that promotes relaxation, luxury, and a closer connection to nature.`,
  },

  {
    id: 4,
    title: "Villa–Bowenpally, Hyderabad",
    subTittle: "Residential",
    plotArea: "380 SQ.YD",
    location: "Bowenpally, Hyderabad",
    img: project4Img,
    images: project4_Images,
    materials: createProjectMaterials(4, constructionMaterials),
    description: `This residence showcases a refined transformation through thoughtfully renovated interiors with a modern touch.
     Sleek finishes and contemporary design elements breathe new life into the villa while preserving its original charm. Open layouts and curated material palettes create a seamless flow between spaces.
      Every detail is crafted to enhance comfort, functionality, and aesthetic appeal. The result is a timeless home that blends classic character with modern sophistication.`,
  },

  {
    id: 6,
    title: "Aparatment, Machilipatnam",
    subTittle: "Residential",
    plotArea: "2600 SQ.YD",
    location: "Machilipatnam",
    img: project6Img,
    images: project6_Images,
    materials: createProjectMaterials(6, constructionMaterials),
    description: `This residential project stands out with a striking modern elevation that blends innovation with visual appeal.
        The use of MS box sections, jaali brickwork, and textured finishes creates a dynamic architectural language. Each façade is thoughtfully detailed, offering depth, rhythm, and character from every angle.
         The design balances contemporary aesthetics with structural integrity and durability. It’s a bold statement in modern residential architecture, combining creativity with lasting functionality.`,
  },

  // {
  //   id: 7,
  //   title: "Apartment, Kondapur",
  //   subTittle: "Residential",
  //   img: project7Img,
  //   images: project7_Images,
  //   description: `This modern residential project showcases innovative space planning within a compact urban footprint. Designed with G+4 floors, it features efficiently planned 1BHK units on the lower levels and an exclusive private duplex on the top floor.
  //    The architecture optimizes vertical space while maintaining comfort, functionality, and aesthetic balance. Clean lines, modern finishes, and smart layouts enhance both usability and visual appeal.
  //    It’s a testament to thoughtful design that transforms a narrow site into a sophisticated urban living experience.`
  // },

  {
    id: 8,
    title: "Vasavika Brindavanam Layout, Bengaluru",
    subTittle: "Hospitality",
    plotArea: "1800 SQ.FT",
    location: "Bengaluru",
    img: project8Img,
    images: project8_Images,
    materials: createProjectMaterials(8, interiorMaterials),
    description: `This hospitality project embodies modern design principles that blend elegance with functionality. 
         Clean lines, contemporary finishes, and thoughtfully planned spaces create an inviting and sophisticated environment. Every detail, from interiors to exteriors, is curated to enhance guest comfort and experience. 
         The architecture balances style with practicality, resulting in a visually striking yet welcoming atmosphere. Vasavika Brindavanam stands as a testament to modern hospitality excellence.`,
  },
  {
    id: 9,

    title: "Villa Layout, Kadthal",
    subTittle: "Residential",
    plotArea: "4500 SQ.YD",
    location: "Kadthal",
    img: project9Img,
    images: project9_Images,
    materials: createProjectMaterials(9, constructionMaterials),
    description: `This residential plotted layout is thoughtfully designed to offer a harmonious living environment with all modern amenities.
          Each plot is strategically positioned to optimize space, light, and connectivity within the community. The design emphasizes seamless integration of landscapes, roads, and utility infrastructure for a comfortable lifestyle.
           Attention to detail ensures both functionality and aesthetic appeal throughout the layout. It’s a comprehensive residential plan that combines convenience, elegance, and modern living standards.`,
  },
  {
    id: 10,
    title: "Chinthala Residence, Bollaram",
    subTittle: "Residential",
    plotArea: "500 SQ.YD",
    location: "Bollaram",
    img: project10Img,
    images: project10_Images,
    materials: createProjectMaterials(10, constructionMaterials),
    description: `This modern residential project combines striking elevation with luxurious, spacious interiors. Thoughtful layouts and contemporary design elements create a sense of openness and sophistication.
        Every space is meticulously planned to balance comfort, functionality, and elegance. 
        Premium finishes and attention to detail enhance the overall aesthetic appeal. Chinthala Residence exemplifies refined living through modern architecture and timeless design`,
  },

  {
    id: 11,
    title: "Club Taberna, Jublee Hills",
    subTittle: "F&B Interior",
    plotArea: "1200 SQ.FT",
    location: "Jubilee Hills, Hyderabad",
    img: project11Img,
    images: project11_Images,
    materials: createProjectMaterials(11, interiorMaterials),
    description: `This F&B interior project revitalizes the space with a striking elevation design complemented by carefully executed interior renovations.
         Subtle updates and refined detailing enhance the overall ambiance while maintaining the venue’s character. The design balances aesthetic appeal with functionality, creating an inviting atmosphere for patrons.
          Thoughtful material choices and finishes elevate the experience without overwhelming the existing charm. Club Taberna stands as a blend of contemporary style and refined hospitality design.`,
  },

  {
    id: 12,
    title: "Farmland Layout, Kotra",
    subTittle: "Residential",
    plotArea: "2800 SQ.YD",
    location: "Kotra",
    img: project12Img,
    images: project2_Images,
    materials: createProjectMaterials(12, constructionMaterials),
    description: `This residential farmland layout is thoughtfully designed to optimize land use while maintaining a natural, open environment.
     Each plot is strategically positioned to ensure accessibility, light, and connectivity across the site. The design integrates practical infrastructure with the serene beauty of the landscape.
      Careful planning enhances both functionality and aesthetic appeal for future owners. It’s a well-conceived layout that balances modern living requirements with the tranquility of rural surroundings.
  `,
  },
];

export const project_info = projectCatalog.map((project) => ({
  ...project,
  materials: project.materials ?? projectMaterialsById[project.id] ?? [],
}));
