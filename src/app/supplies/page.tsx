"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

interface Item {
  id: number;
  name: string;
  level: string;
  image?: string;
  stock?: number;
}

interface CartItem extends Item {
  qty: number;
}

export default function SuppliesPage() {
  // Level selection
    const [selectedLevel, setSelectedLevel] = useState<string>("");
    const [search, setSearch] = useState("");
    const [items, setItems] = useState<Item[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [toast, setToast] = useState("");
    const [selectedRoom, setSelectedRoom] = useState<string | null>(null);  
    const [roomBookings, setRoomBookings] = useState<any[]>([]);
    const [showRoomModal, setShowRoomModal] = useState(false);
    const [availabilityMsg, setAvailabilityMsg] = useState<string | null>(null);
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    const [showSemesterModal, setShowSemesterModal] = useState(false);
    const [selectedSemester, setSelectedSemester] = useState("");
    const [pendingLevel, setPendingLevel] = useState<string | null>(null);
    const [checkedProcedures, setCheckedProcedures] = useState<string[]>([]);
    const [selectedProcedure, setSelectedProcedure] = useState("");
    const [checkedItems, setCheckedItems] = useState<string[]>([]);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [showVariantModal, setShowVariantModal] = useState(false);
    const [selectedItemForVariant, setSelectedItemForVariant] = useState<Item | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    

  // Receipt modal
  const [showReceipt, setShowReceipt] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [instructorName, setInstructorName] = useState("");
  const [section, setSection] = useState("");
  const [studentEmail, setStudentEmail] = useState("");

  const levels = ["All Levels", "1st Level", "2nd Level", "3rd Level", "4th Level", "Others", "Rooms"];

  const itemVariants: Record<string, string[]> = {
  syringe: ["1cc", "3cc", "5cc", "10cc"],
  "iv-cannula": ["18G", "20G", "22G"],
};

  const roomsData = [
    { name: "STA 201" },
    { name: "STA 202" },
    { name: "STA 302" },
    { name: "STA 304" },
    { name: "STA 305" },
    { name: "STA 401" },
    { name: "ST 409A" },
    { name: "ST 409B" },
    { name: "ST 412" },
    { name: "STA 501" },
    { name: "STA 502" },
    { name: "STA 503" },
    { name: "MTV 305" },
    { name: "MTV 401" },
    { name: "MTV 402" },
    { name: "MTV 404" },
    { name: "MTV 405" },
    { name: "NP1 Room"},
    { name: "NP2 Room" },
    { name: "OR/DR Room" },
    { name: "MINI HOSPITAL" },
    
  ];

 const proceduresByLevel: any = {
  "1st Level": {
  "HEALTH ASSESSMENT": [
    {
      name: "Skin Hair and Nails",
      items: ["clean gloves", "penlight", "ruler", "alcohol", "magnifying glass"],
    },
    {
      name: "Head and Neck",
      items: ["gloves", "penlight", "alcohol", "stethoscope"],
    },
    {
      name: "Ears Nose and Throat",
      items: ["otoscope", "tuning fork", "ruler", "gloves", "alcohol", "penlight", "secondary watch"],
    },
    {
      name: "Eyes",
      items: ["ophthalmoscope", "snellen chart", "jaeger chart", "opaque card", "alcohol", "gloves", "cotton", "penlight"],
    },
    {
      name: "Obtaining Health History",
      items: ["face mask"],
    },
    {
      name: "Vital Signs",
      items: ["patient gown", "thermometer", "stethoscope", "blood pressure apparatus", "oximeter", "alcohol", "cotton"],
    },
    {
      name: "Respiratory Assessment",
      items: ["alcohol", "clean gloves", "stethoscope", "oximeter"],
    },
    {
      name: "Cardiovascular Assessment",
      items: ["alcohol", "cotton balls", "mask", "patient gown", "blood pressure apparatus"],
    },
    {
      name: "Abdominal Assessment",
      items: ["stethoscope"],
    },
  ],

  "FUNDAMENTALS RD": [
    {
      name: "Nurse Patient Interaction",
      items: ["thermometer", "cotton", "alcohol"],
    },
    {
      name: "Vital Signs",
      items: ["stethoscope", "blood pressure apparatus", "oximeter", "digital thermometer", "clean gloves", "alcohol"],
    },
    {
      name: "Medical Asepsis",
      items: ["alcohol", "orange stick", "soap", "towel"],
    },
    {
      name: "Sterile Technique",
      items: ["sterile gown", "sterile gloves", "medical cap", "mask"],
    },
    {
      name: "Safe Patient Handling",
      items: ["sterile gauze", "cotton", "alcohol", "kidney basin", "forceps", "micropore", "bed"],
    },
    {
      name: "Fall Prevention",
      items: ["restraints", "linen", "bed", "pillow", "clean gloves", "patient gown", "bouffant cap", "mask"],
    },
    {
      name: "Handwashing",
      items: ["alcohol", "tissue", "liquid soap", "orange wood stick", "lotion", "towel"],
    },
    {
      name: "Gloving",
      items: ["sterile gloves"],
    },
    {
      name: "Wound Care",
      items: ["betadine", "alcohol", "cotton", "bandage", "scissors", "micropore tape", "tape measure", "clean gloves", "sterile gloves"],
    },
    {
      name: "Oral Care",
      items: ["toothbrush", "toothpaste", "towel", "mouthwash", "tongue depressor", "cup", "penlight"],
    },
  ],
},

  "2nd Level": {
    "1st Semester": [
      {
        name: "DR TECH",
        items: [
          "Delivery table",
          "Labor table",
          "Blankets",
          "Sterile gloves",
          "Medical cap",
          "Sterile drapes and gown",
          "Umbilical cord clamp",
          "Needle holder forceps",
          "Curve artery forceps",
          "Straight artery forceps",
          "Sponge forceps",
          "Gauze",
          "Syringe 5cc",
          "Surgical needle",
          "Kidney basin",
          "Linen",
          "Kelly pad",
        ],
      },
      {
        name: "EINC",
        items: [
          "Mitten hands and feet",
          "Hooded towels",
          "Dry linen",
          "Bonnet",
          "Cotton balls",
          "Sponge forceps",
          "Syringe 5cc",
          "Oxytocin",
          "Plastic cord clamp",
          "Surgical scissors",
          "Kidney basin",
          "Straight artery forceps",
        ],
      },
      {
        name: "IE",
        items: [
          "Sterile gloves",
          "Vaginal speculum",
          "Sterile lubricating jelly",
          "Cotton balls",
          "Sponge forceps",
          "Kidney bowl",
          "Penlight",
        ],
      },
      {
        name: "CATHETERIZATION",
        items: [
          "Sterile Foley catheter",
          "Sterile gloves",
          "Betadine",
          "Straight artery forceps",
          "Lubricant",
          "Kidney basin",
          "Syringe 1cc",
          "Urinary bag",
          "Blankets",
        ],
      },
      {
        name: "NEWBORN CARE",
        items: [
          "Droplight",
          "Diaper",
          "Weighing scale for baby",
          "Measuring tape",
          "Stethoscope",
          "Thermometer",
          "Bonnet",
          "Eye ointment (erythromycin)",
          "Vitamin K syringe",
          "Linen for wrapping",
        ],
      },
      {
        name: "PERINEAL FLUSHING",
        items: [
          "Sterile antiseptic solution",
          "Sterile water",
          "Ovum forceps",
          "Betadine",
          "Sterile sanitary pad",
          "Adult diaper",
          "Kidney basin",
          "Hypo tray",
          "Draping sheet",
          "Straight artery forceps",
          "Sterile towel",
          "Kelly pad",
          "Water bucket",
          "Mannequin",
        ],
      },
      {
        name: "LEOPOLDS MANEUVER",
        items: [
          "Examination bed",
          "Clean sheet or drape",
          "Pillow",
          "Measuring tape",
          "Stethoscope or fetal Doppler",
          "Ultrasound gel",
          "Setrile gloves",
          "Alcohol",
        ],
      },
      {
        name: "BAG TECHNIQUE",
        items: [
          "PHN bag",
          "Soap",
          "Hand sanitizer",
          "Measuring tape",
          "Thermometer",
          "BP apparatus",
          "Glucometer",
          "Test tube",
          "Medicine dropper",
          "Alcohol lamp",
          "Test tube holder",
          "Linen",
          "Plastic linen",
          "Paper linen",
          "Cotton balls",
          "Kidney basin",
          "Straight artery forceps",
          "Antiseptic solutions",
          "Bandage scissors",
          "Micropore tape",
          "Gauze pad",
          "Cord clamp",
          "Syringe 3cc",
          "Mask",
          "Apron",
        ],
      },
    ],

    "2nd Semester": [
      {
        name: "CPR",
        items: ["Table (baby)", "Pocket mask", "Setrile gloves"],
      },
      {
        name: "FBAO (CONSCIOUS)",
        items: ["Mannequin", "Setrile gloves"],
      },
      {
        name: "FBAO (UNCONSCIOUS)",
        items: ["Setrile gloves"],
      },
      {
        name: "AR",
        items: ["Infant mannequin"],
      },
      {
        name: "IV DISCONTINUING",
        items: [
          "IV fluid",
          "Syringe 3cc",
          "Cotton balls",
          "Alcohol",
          "Micropore tape",
          "Ovum forceps",
          "IV cannula",
          "Bandage scissors",
          "Arm dummy",
        ],
      },
      {
        name: "SETTING UP",
        items: [
          "IV fluid",
          "IV stand",
          "IV administration set",
          "Setrile gloves",
          "Arm dummy",
        ],
      },
      {
        name: "ADMINISTERING OXYGEN",
        items: [
          "Oxygen tank",
          "Flowmeter",
          "Pressure regulator",
          "Humidifier bottle with sterile water",
          "Nasal cannula",
          "Simple face mask",
          "Pulse oximeter",
        ],
      },
      {
        name: "NEBULIZATION",
        items: [
          "Nebulizer machine",
          "Nebulizer mask or mouthpiece",
          "Prescribed respiratory medication",
          "Normal saline solution",
          "Syringe 3cc",
          "Setrile gloves",
          "Kidney basin",
        ],
      },
      {
        name: "SUCTIONING",
        items: [
          "Suction machine",
          "Suction catheter",
          "Sterile water",
          "Normal saline solution",
          "Connecting tubing",
          "Suction canister",
          "Personal protective equipment (PPE)",
        ],
      },
      {
        name: "NGT FEEDING",
        items: [
          "Nasogastric tube",
          "Feeding syringe",
          "Enteral feeding formula",
          "Glass of clean or sterile water",
          "Stethoscope",
          "Setrile gloves",
        ],
      },
    ],
  },

  "3rd Level": {
    "1st Semester": [
      {
        name: "Skin prep",
        items: [
          "Personal protective equipment (PPE)",
          "Sterile gown",
          "Sterile cap",
          "Sterile mask",
          "Sterile gloves",
          "Laparotomy gauze pack",
          "Betadine",
        ],
      },
      {
        name: "Sterile field prep",
        items: [
          "Sterile drapes",
          "Sterile gloves",
          "Sterile gown",
          "Sterile basin",
          "Scissors",
          "Straight artery forceps",
          "Needle holder",
          "Scalpel handle",
        ],
      },
      {
        name: "Surgical scrubbing",
        items: [
          "Scrub sink with running water",
          "Antimicrobial soap",
          "Sterile scrub brush with nail cleaner",
          "Sterile towel",
          "Surgical cap",
          "Surgical mask",
          "Sterile gown",
          "Sterile gloves",
        ],
      },
    ],
    "2nd Semester": [],
  },

  "4th Level": {
    "1st Semester": [
      {
        name: "IV therapy",
        items: [
          "IV cannula",
          "IV fluid",
          "IV tubing",
          "Tourniquet",
          "Alcohol swabs",
          "Cotton balls",
          "Sterile gauze",
          "Adhesive tape",
          "Transparent dressing",
          "Kidney basin",
          "Disposable gloves",
          "Face mask",
          "Sharps container",
          "IV stand",
          "Hand sanitizer",
          "Plaster or bandage",
          "Mannequin arm",
        ],
      },
      {
        name: "BLS",
        items: ["Adult mannequin", "CPR mask"],
      },
      {
        name: "Bandaging",
        items: ["Triangular bandage"],
      },
    ],

    "2nd Semester": [
      {
        name: "ACLS",
        items: [
          "Mannequin",
          "Endotracheal tubes",
          "Bag-valve masks",
          "Capnography adapters",
          "Laryngoscope set",
          "Medication demonstration kits",
          "IV start packs",
          "Fluid bags",
          "Syringe 3cc",
        ],
      },
    ],
  },
};

const toggleProcedure = (proc: string) => {
  setCheckedProcedures((prev) =>
    prev.includes(proc)
      ? prev.filter((p) => p !== proc)
      : [...prev, proc]
  );

  setSelectedProcedure(proc); // 👈 show materials when clicked
};

const getSelectedProcedures = () => {
  if (!selectedLevel || !selectedSemester || checkedProcedures.length === 0) {
    return null;
  }

  const levelData = proceduresByLevel[selectedLevel];
  if (!levelData) return null;

  let procedures = [];

  // 1st LEVEL uses categories (HEALTH ASSESSMENT / FUNDAMENTALS RD)
  if (selectedLevel === "1st Level") {
    procedures = levelData[selectedSemester] ?? [];
  } 
  else {
    // Other levels use semesters
    procedures = levelData[selectedSemester] ?? [];
  }

  return procedures.filter((p: any) => checkedProcedures.includes(p.name));
};

  useEffect(() => {
  const load = () => {
    const stored = JSON.parse(localStorage.getItem("roomBookings") || "[]");
    setRoomBookings(stored);
  };

  load();

  const interval = setInterval(load, 3000);

  return () => clearInterval(interval);
}, []);

const addVariantToCart = (variant: string) => {
  if (!selectedItemForVariant) return;

  const itemWithVariant = {
    ...selectedItemForVariant,
    name: `${selectedItemForVariant.name} (${variant})`,
  };

  addToCart(itemWithVariant);

  setShowVariantModal(false);
  setSelectedItemForVariant(null);
};
  
  // Fetch items
  useEffect(() => {
    async function fetchItems() {
      try {
        const res = await fetch("https://dbsupplyrecord-2.onrender.com/items");
        const data = await res.json();
        setItems(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchItems();
  }, []);

  const selectedProcs = getSelectedProcedures();
  
  const requiredItems = selectedProcs
  ? selectedProcs.flatMap((p: any) => p.items)
  : [];
  
const filteredItems = items
  .filter((item) => {
    // ✅ LEVEL FILTER
    if (
      selectedLevel !== "All Levels" &&
      selectedLevel !== "Rooms" &&
      item.level?.toLowerCase() !== selectedLevel.toLowerCase()
    ) {
      return false;
    }

    // ✅ If no procedure selected → show all
    if (!requiredItems.length) return true;

    // ✅ MATCH ITEMS (safe + flexible)
    return requiredItems.some((needed: string) => {
      const itemName = item.name?.toLowerCase().trim();
      const neededName = needed.toLowerCase().trim();

      return (
        itemName.includes(neededName) ||
        neededName.includes(itemName)
      );
    });
  })
  .filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  )
  .sort((a, b) => a.name.localeCompare(b.name));
  
  // Cart actions
const openReceipt = () => {
  const stored = localStorage.getItem("borrowerInfo");

  if (stored) {
    const data = JSON.parse(stored);

    setStudentName(data.name || "");
    setInstructorName(data.instructor || "");
    setSection(data.course || "");
  }

  setShowReceipt(true);
};

useEffect(() => {
  const stored = localStorage.getItem("borrowerInfo");

  if (stored) {
    const data = JSON.parse(stored);

    setStudentName(data.name || "");
    setInstructorName(data.instructor || "");
    setSection(data.course || "");

    // ✅ NEW
    setSelectedDate(data.date || "");
    setSelectedTime(data.time || "");
  }
}, []);

  const addToCart = (item: Item) => {
    if (!item.stock || item.stock <= 0) {
      showToast("Out of stock!");
      return;
    }
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) {
        if (existing.qty >= item.stock!) {
          showToast("Max stock reached");
          return prev;
        }
        return prev.map((c) => (c.id === item.id ? { ...c, qty: c.qty + 1 } : c));
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const updateQty = (id: number, change: number) => {
    setCart((prev) =>
      prev
        .map((c) => {
          if (c.id !== id) return c;
          const newQty = c.qty + change;
          if (newQty <= 0) return null;
          if (newQty > (c.stock ?? 0)) return c;
          return { ...c, qty: newQty };
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => setCart([]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

const handleCheckout = async () => {
  // Trim and validate email first
  const email = studentEmail.trim();

  if (!email) {
    alert("❌ Please enter your email!");
    return; // stop submission
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("❌ Please enter a valid email address!");
    return; // stop submission
  }

  try {
    // 🔻 Deduct stock
    for (const item of cart) {
      await fetch(`https://dbsupplyrecord-2.onrender.com/items/${item.id}/remove-stock`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: item.qty }),
      });
    }

    // 🔥 ALWAYS SAVE (THIS IS THE FIX)
    const existing = JSON.parse(localStorage.getItem("borrowHistory") || "[]");

    const newBorrow = {
      id: Date.now(),
      studentName,
      instructorName,
      section,
      email, // ✅ already validated
      items: cart,
      date: new Date().toISOString(),
      returned: false,
      approved: false, // ✅ NEW FLAG
    };

    localStorage.setItem(
      "borrowHistory",
      JSON.stringify([...existing, newBorrow])
    );

    setCart([]);
    setShowReceipt(false);
    setShowSuccessModal(true);

    // auto close after 3 seconds
    setTimeout(() => {
      setShowSuccessModal(false);
    }, 3000);

    const refresh = await fetch("https://dbsupplyrecord-2.onrender.com/items");
    setItems(await refresh.json());

  } catch (err) {
    console.error(err);

    // 🔥 EVEN IF ERROR → STILL SAVE
    const existing = JSON.parse(localStorage.getItem("borrowHistory") || "[]");

    const newBorrow = {
      id: Date.now(),
      studentName,
      instructorName,
      section,
      email, // ✅ validated
      items: cart,
      date: new Date().toISOString(),
      returned: false,
      approved: false,
    };

    localStorage.setItem(
      "borrowHistory",
      JSON.stringify([...existing, newBorrow])
    );

    showToast("Saved locally, but checkout failed ❌");
  }
};


     const isRoomAvailable = (room: string, date: string, start: string, end: string) => {
    return !roomBookings.some((b) => {
        if (b.done === true) return false; //
      if (b.room !== room || b.date !== date) return false;

      const newStart = new Date(`${date}T${start}`);
      const newEnd = new Date(`${date}T${end}`);
      const existingStart = new Date(`${b.date}T${b.start}`);
      const existingEnd = new Date(`${b.date}T${b.end}`);

      return (
        (newStart >= existingStart && newStart < existingEnd) ||
        (newEnd > existingStart && newEnd <= existingEnd) ||
        (newStart <= existingStart && newEnd >= existingEnd)
      );
    });
  };
  // Date: 2024-06-01
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const today = formatDate(new Date());

  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5); // "HH:MM"

  const isSlotBooked = (room: string, date: string, slot: string) => {
    if (!date) return false;

    const [start, end] = slot.split("-");

    return roomBookings.some((b) => {
      if (b.room !== room || b.date !== date) return false;
      if (b.done) return false;

      const newStart = new Date(`${date}T${start}`);
      const newEnd = new Date(`${date}T${end}`);
      const existingStart = new Date(`${b.date}T${b.start}`);
      const existingEnd = new Date(`${b.date}T${b.end}`);

      return (
        (newStart >= existingStart && newStart < existingEnd) ||
        (newEnd > existingStart && newEnd <= existingEnd) ||
        (newStart <= existingStart && newEnd >= existingEnd)
      );
    });
  };

const isRoomAvailableNow = (room: string) => {
  const now = new Date();

  return !roomBookings.some((b) => {
    if (b.room !== room || b.done) return false; // ✅ skip done bookings

    const start = new Date(`${b.date}T${b.start}`);
    const end = new Date(`${b.date}T${b.end}`);

    return now >= start && now <= end;
  });
};



useEffect(() => {
  if (selectedLevel) {
    setShowSemesterModal(false);
  }
}, [selectedLevel]);

  // Level selection page
if (!selectedLevel) {
  return (
    <div
     style={{
    minHeight: "100vh",
    backgroundImage: "url('/green.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  }}
    >
      {/* Optional overlay for better readability */}
      <div
        style={{
      position: "absolute",
      inset: 0,
      background:
        "rgba(0,0,0,0.45)",
      backdropFilter: "blur(6px)",
    }}
      />

      <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    onClick={() => {
      window.history.back();
      setSelectedLevel("");
      setPendingLevel("");
      setCheckedProcedures([]);
      setSelectedSemester("");
    }}
    style={{
      position: "absolute",
      top: 20,
      right: 20,
      zIndex: 2,
      padding: "10px 16px",
      borderRadius: 12,
      border: "none",
      background: "rgba(255, 255, 255, 0.9)",
      color: "#099c09",
      fontWeight: 600,
      cursor: "pointer",
      backdropFilter: "blur(10px)",
      boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
    }}
  >
    ← Back
  </motion.button>

      <div
        style={{
          position: "relative",
          textAlign: "center",
          zIndex: 1,
        }}
      >
        <motion.h1
  initial={{ opacity: 0, y: -40 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: 0.2 }}
  style={{
    marginBottom: 30,
    fontSize: 35,
    fontWeight: 600,
    letterSpacing: 1,
    color: "#ffffff",
  }}
>
  WHAT’S YOUR YEAR LEVEL?
</motion.h1>

        <motion.p
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: 0.3 }}
  style={{ color: "#00f974", marginBottom: 20 }}
>
  Choose your year level to continue
</motion.p>

     <motion.div
  initial="hidden"
  animate="show"
  variants={{
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.1, // 👈 delay each button
      },
    },
  }}
  style={{
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 30,
    maxWidth: 900,
    margin: "0 auto",
  }}
>
          {["1st Level", "2nd Level", "3rd Level", "4th Level", "All Levels", "Others", "Rooms"].map(
            (lvl) => {
              const isSelected = selectedLevel === lvl;

              return (
                <motion.button
              key={lvl}
              variants={{
                hidden: { opacity: 0, y: 40, scale: 0.9 },
                show: { opacity: 1, y: 0, scale: 1 },
              }}
              transition={{ duration: 0.4 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                        if (lvl === "Rooms" || lvl === "All Levels" || lvl === "Others") {
                          setSelectedLevel(lvl);
                          setCheckedProcedures([]); 
                          setSelectedSemester("");    
                          return;
                        }

                        setPendingLevel(lvl);
                        setShowSemesterModal(true);
                      }}
                    style={{
                    width: 200,
                    height: 180,
                    borderRadius: 18,
                    border: isSelected
                      ? "3px solid #7c3aed"
                      : "3px solid transparent",
                    background: "#ffffff",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                    fontSize: 18,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    whiteSpace: "pre-line", // 👈 allows line break
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.05)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  {lvl.replace(" ", "\n")}
                </motion.button>
              );
            }
          )}
        </motion.div>
      </div>
            <AnimatePresence>
  {showSemesterModal && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
      }}
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        style={{
          background: "#fff",
          padding: 30,
          borderRadius: 16,
          width: 400,
          textAlign: "center",
        }}
      >
<h2>
  {pendingLevel === "1st Level"
    ? "Select Category"
    : "Select Semester"}
</h2>

<div style={{ display: "flex", gap: 10, marginTop: 20 }}>
  {pendingLevel === "1st Level" ? (
    <>
      <button
        onClick={() => {
          setSelectedSemester(prev =>
            prev === "HEALTH ASSESSMENT" ? "" : "HEALTH ASSESSMENT"
          );
        }}
        style={{
          flex: 1,
          padding: 12,
          background: "#2563eb",
          color: "white",
          borderRadius: 10,
          border: "none",
        }}
      >
        Health Assessment
      </button>

      <button
        onClick={() => {
          setSelectedSemester(prev =>
            prev === "FUNDAMENTALS RD" ? "" : "FUNDAMENTALS RD"
          );
        }}
        style={{
          flex: 1,
          padding: 12,
          background: "#16a34a",
          color: "white",
          borderRadius: 10,
          border: "none",
        }}
      >
        Fundamentals RD
      </button>
    </>
  ) : (
    <>
      <button
        onClick={() => {
          setSelectedSemester(prev =>
            prev === "1st Semester" ? "" : "1st Semester"
          );
        }}
        style={{
          flex: 1,
          padding: 12,
          background: "#2563eb",
          color: "white",
          borderRadius: 10,
          border: "none",
        }}
      >
        1st Semester
      </button>

      <button
        onClick={() => {
          setSelectedSemester(prev =>
            prev === "2nd Semester" ? "" : "2nd Semester"
          );
        }}
        style={{
          flex: 1,
          padding: 12,
          background: "#16a34a",
          color: "white",
          borderRadius: 10,
          border: "none",
        }}
      >
        2nd Semester
      </button>
    </>
  )}
</div>
      

        {/* PROCEDURES */}
        {selectedSemester && pendingLevel && (
  <div style={{ marginTop: 20, textAlign: "left" }}>
    <h4>Procedures:</h4>

    {(proceduresByLevel[pendingLevel]?.[selectedSemester] || []).length === 0 ? (
      <p style={{ color: "#666" }}>No procedures for this semester</p>
    ) : (
      proceduresByLevel[pendingLevel][selectedSemester].map((proc: any) => (
        <label
          key={proc.name}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            cursor: "pointer",
            marginBottom: 6,
          }}
        >
          <input
              type="checkbox"
              checked={checkedProcedures.includes(proc.name)}
              onChange={(e) => {
                e.stopPropagation(); // 🔥 prevent weird React bugs
                toggleProcedure(proc.name);
              }}
            />
          {proc.name}
        </label>
      ))
    )}
  </div>
)}

        {/* ACTION BUTTON */}
        
  <div
    style={{
      display: "flex",
      gap: 10,
      marginTop: 20,
    }}
  >
    {/* ✅ LEFT: CONTINUE */}
    <button
      onClick={() => {
        setSelectedLevel(pendingLevel!);
        setShowSemesterModal(false);
      }}
      style={{
        flex: 1,
        padding: 12,
        background: "#22c55e",
        color: "white",
        border: "none",
        borderRadius: 10,
        fontWeight: "bold",
      }}
    >
      Continue
    </button>

    {/* ✅ RIGHT: CANCEL */}
    <button
      onClick={() => {
        setShowSemesterModal(false);
        setPendingLevel(null);
        setSelectedSemester("");
       setCheckedProcedures([]);
        setSelectedProcedure("");
      }}
      style={{
        flex: 1,
        padding: 12,
        background: "#ef4444",
        color: "white",
        border: "none",
        borderRadius: 10,
        fontWeight: "bold",
      }}
    >
      Cancel
    </button>
  </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
    </div>
  );
}

// If ROOMS is selected → Show rooms instead of supply items
if (selectedLevel === "Rooms") {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <div style={{
        width: 220,
        background: "#2e5d40",
        padding: 20,
        position: "fixed",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"   // <-- THIS FIXES THE BUTTON POSITION
      }}>
        <div>
          <h3 style={{ color: "#fff", marginBottom: 20 }}>Levels</h3>
          {levels.map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              style={{
                width: "100%",
                padding: 15,
                marginBottom: 10,
                background: selectedLevel === lvl ? "#22c55e" : "#15803d",
                borderRadius: 12,
                color: "#fff",
                textAlign: "left",
              }}
            >
              {lvl}
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            setSelectedLevel("");
            setSelectedSemester("");
            setCheckedProcedures([]);
            setSelectedProcedure("");
            setCart([]);
          }}
          style={{
            marginTop: 20,
            width: "100%",
            padding: 12,
            borderRadius: 12,
            background: "#ed0909",
            color: "#ffffff",
            border: "none",
          }}
        >
          ← Back
        </button>
      </div>

                 <AnimatePresence>
    {showRoomModal && selectedRoom && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.7)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 200,
        }}
      >
        <motion.div
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0.8, opacity: 0 }}
    style={{
      background: "white",
      padding: 30,
      borderRadius: 20,
      width: 380,
      display: "flex",
      flexDirection: "column",
      gap: 12,
      boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
    }}
  >
    <h2 style={{ textAlign: "center", marginBottom: 10 }}>
      📅 Book {selectedRoom}
    </h2>
  <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
    <span style={{ color: "#16a34a" }}> Choose your Prefrered Time</span>
  </div>


  {/* TIME INPUT */}
  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
    <label style={{ fontWeight: 600 }}>Time In</label>
    <input
      type="time"
      value={startTime}
      min={currentTime} // ⛔ block past time
      onChange={(e) => setStartTime(e.target.value)}
      style={{ padding: 8, borderRadius: 8, border: "1px solid #ccc" }}
    />

    <label style={{ fontWeight: 600 }}>Time Out</label>
    <input
      type="time"
      value={endTime}
      min={startTime || currentTime} // ⛔ must be after startTime
      onChange={(e) => setEndTime(e.target.value)}
      style={{ padding: 8, borderRadius: 8, border: "1px solid #ccc" }}
    />
  </div>

  <button
    onClick={() => {
      if (!startTime || !endTime) {
        setAvailabilityMsg("⚠️ Please select time in and time out");
        return;
      }

      if (startTime >= endTime) {
  setAvailabilityMsg("❌ Invalid time range");

  setTimeout(() => {
    setAvailabilityMsg("");
  }, 3000);

  return;
}

          const now = new Date();
          const selectedStart = new Date(`${today}T${startTime}`);

          if (selectedStart < now) {
            setAvailabilityMsg("⛔ Cannot select past time");

            setTimeout(() => {
              setAvailabilityMsg("");
            }, 3000);

            return;
          }

      const available = isRoomAvailable(selectedRoom!, today, startTime, endTime);

      if (available) {
        setAvailabilityMsg("✅ Room is AVAILABLE");

        setTimeout(() => {
          setAvailabilityMsg("");
        }, 3000);
      } else {
        setAvailabilityMsg("❌ Room is NOT AVAILABLE");

        setTimeout(() => {
          setAvailabilityMsg("");
        }, 3000);
      }
    }}
    
    style={{
      marginTop: 10,
      padding: 10,
      background: "#2563eb",
      color: "white",
      border: "none",
      borderRadius: 8,
      cursor: "pointer",
      fontWeight: 600,
    }}
  >
    Check Availability
  </button>

  {availabilityMsg && (
    <div
      style={{
        marginTop: 10,
        padding: 10,
        borderRadius: 10,
        background: availabilityMsg.includes("AVAILABLE")
          ? "#dcfce7"
          : "#fee2e2",
        color: availabilityMsg.includes("AVAILABLE")
          ? "#166534"
          : "#991b1b",
        fontWeight: 600,
        textAlign: "center",
      }}
    >
      {availabilityMsg}
    </div>
  )}

    {/* INFO PREVIEW */}
    {startTime && endTime && (
    <div>
      ⏱ Booking: Today | {startTime} - {endTime}
    </div>
  )}

    {/* ACTION BUTTONS */}
    <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
      <button
        onClick={() => {
          // 🔴 VALIDATIONS
          if (!startTime || !endTime) {
            alert("Please fill all fields");
            return;
          }

          if (startTime >= endTime) {
            alert("End time must be after start time");
            return;
          }

          if (availabilityMsg !== "✅ Room is AVAILABLE") {
            alert("Please check availability first!");
            return;
          }

          const newBooking = {
            id: Date.now(),
            room: selectedRoom,
            course: section || "N/A",
            date: today,
            start: startTime,
            end: endTime,
            studentName: studentName,
            instructorName: instructorName,
            section: section,
            done: false,
          };

          const selectedStart = new Date(`${today}T${startTime}`);

            if (selectedStart < new Date()) {
              alert("⛔ Cannot book past time");
              return;
            }

          const updated = [...roomBookings, newBooking];
          setRoomBookings(updated);
          localStorage.setItem("roomBookings", JSON.stringify(updated));

          alert("✅ Room booked successfully!");

          // reset fields
    
          setStartTime("");
          setEndTime("");
          setShowRoomModal(false);
        }}
        style={{
          flex: 1,
          padding: 10,
          background: "#16a34a",
          color: "white",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
          fontWeight: 600,
        }}
      >
        Confirm
      </button>

      <button
        onClick={() => {
          setShowRoomModal(false);
        }}
        style={{
          flex: 1,
          padding: 10,
          background: "#ef4444",
          color: "white",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
          fontWeight: 600,
        }}
      >
        Cancel
      </button>
    </div>
  </motion.div>
      </motion.div>
    )}
  </AnimatePresence>

      {/* Rooms Page */}
      <div style={{ flex: 1, marginLeft: 220, padding: 30 }}>
        <h1>Rooms</h1>

        <div
          style={{
            marginTop: 20,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: 20,
          }}
        >
          {roomsData.map((room) => (
            <div
              key={room.name}
              style={{
                background: "#fff",
                padding: 20,
                borderRadius: 16,
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                cursor: "pointer",
                textAlign: "center",
              }}
              onClick={() => {
                setSelectedRoom(room.name);
                setShowRoomModal(true);
              }}
            >
              <h4>{room.name}</h4>
              <span style={{ color: "#16a34a" }}> Choose your Preferred Time</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


  // Supplies page
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
        <div
          style={{
            width: 220,
            background: "#2e5d40",
            padding: 20,
            position: "fixed",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between", // space between levels and back button
          }}
        >
  <div>
    <h3 style={{ color: "#fff", marginBottom: 20 }}>Levels</h3>
    {levels.map((lvl) => (
      <button
        key={lvl}
        onClick={() => {
                if (lvl === "Rooms") {
                  setSelectedLevel("Rooms");
                } else {
                  setSelectedLevel(lvl);
                }
              }}
        style={{
          width: "100%",
          padding: 15,
          marginBottom: 10,
          borderRadius: 12,
          border: "none",
          background: selectedLevel === lvl ? "#22c55e" : "#15803d",
          color: "white",
          textAlign: "left",
        }}
      >
        {lvl}
      </button>
    ))}
  </div>
  
  
  {/* BACK BUTTON at bottom */}
  <button
    onClick={() => {
      setSelectedSemester("");
      setCheckedProcedures([]);
      setSelectedProcedure("");
      setSelectedLevel("");
      setCart([]);
    }}
    style={{
      background: "#ed0909",
      color: "#ffffff",
      padding: "12px 20px",
      borderRadius: 12,
      border: "none",
      cursor: "pointer",
      fontWeight: 600,
      width: "100%",
      marginTop: 20,
    }}
  >
    ← Back 
  </button>
</div>

      {/* Main */}
      <div style={{ flex: 1, marginLeft: 220, padding: 30, background: "#f3f4f6" }}>
  {/* Title and Search */}
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <h1>Electronic Supply Records</h1>
    <input
      placeholder="Search..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      style={{
        padding: "10px 20px",
        borderRadius: 20,
        border: "1px solid #ccc",
      }}
    />
  </div>

  {/* Procedure Boxes below title */}
  {checkedProcedures.length > 0 && (
    <div
      style={{
        marginTop: 10,
        display: "flex",
        flexWrap: "wrap",
        gap: 6,
      }}
    >
      {checkedProcedures.map((proc) => (
        <div
          key={proc}
          style={{
            padding: "4px 10px",
            background: "#22c55e", // green
            color: "#ffffff",       // white text
            borderRadius: 12,       // pill shape
            fontSize: 12,
            fontWeight: 500,
          }}
        >
          {proc}
        </div>
      ))}
    </div>
  )}

  {/* Items grid */}
  <div
    style={{
      marginTop: 30,
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
      gap: 25,
    }}
  >
    {filteredItems.length === 0 ? (
      <p style={{ gridColumn: "1 / -1", textAlign: "center" }}>No items found.</p>
    ) : (
      filteredItems.map((item) => (
        <motion.div
          key={item.id}
          whileHover={{ scale: 1.03 }}
          style={{
            background: "#fff",
            borderRadius: 20,
            padding: 20,
            height: 280,
            textAlign: "center",
            position: "relative",
            boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            cursor: "pointer",
          }}
        >
          <h3 style={{ fontSize: 16, fontWeight: 600 }}>{item.name}</h3>

          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 140 }}>
            <Image
              src={item.image || "/images/placeholder.png"}
              alt={item.name}
              width={100}
              height={100}
              style={{ objectFit: "contain", borderRadius: 16 }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
            <span style={{ color: "#6b7280", fontSize: 14 }}>Stock: {item.stock ?? 0}</span>
            <motion.button
              whileHover={{ scale: 1.1 }}
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "#22c55e",
                color: "white",
                border: "none",
                fontSize: 24,
                lineHeight: "36px",
              }}
              onClick={() => {
                const key = item.name.toLowerCase();
                if (itemVariants[key]) {
                  setSelectedItemForVariant(item);
                  setShowVariantModal(true);
                } else {
                  addToCart(item);
                }
              }}
            >
              +
            </motion.button>
          </div>
        </motion.div>
      ))
    )}
  </div>
</div>

      {/* Cart */}
        {cart.length > 0 && (
            <div
              style={{
                position: "fixed",
                bottom: 20,
                right: 20,
                width: "300px",
                background: "#fff",
                borderRadius: "14px",
                boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                padding: "12px",
                zIndex: 1000,
              }}
            >
              {/* HEADER */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <strong style={{ fontSize: "14px" }}>Cart</strong>

                {/* 🔴 CLEAR BUTTON */}
                <button
                  onClick={clearCart}
                  style={{
                    fontSize: "11px",
                    background: "#ef4444",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    padding: "3px 8px",
                    cursor: "pointer",
                  }}
                >
                  Clear
                </button>
              </div>

              {/* ITEMS */}
              <div
                style={{
                  maxHeight: "120px",
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}
              >
                {cart.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "13px",
                      background: "#f9fafb",
                      padding: "6px 8px",
                      borderRadius: "8px",
                    }}
                  >
                    <span>{item.name}</span>

                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <button onClick={() => updateQty(item.id, -1)}>−</button>
                      <span>{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)}>+</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* FOOTER */}
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
                <span style={{ fontSize: "12px", color: "#666" }}>
                  {cart.length} item(s)
                </span>

                <button
                  onClick={openReceipt}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "8px",
                    border: "none",
                    background: "#16a34a",
                    color: "white",
                    fontSize: "12px",
                    cursor: "pointer",
                  }}
                >
                  Checkout
                </button>
              </div>
            </div>
          )}

          <AnimatePresence>
  {showVariantModal && selectedItemForVariant && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 3000,
      }}
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        style={{
          background: "#fff",
          padding: 25,
          borderRadius: 16,
          width: 320,
          textAlign: "center",
        }}
      >
        <h3>Select Variant</h3>
        <p style={{ color: "#666", marginBottom: 15 }}>
          {selectedItemForVariant.name}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {itemVariants[selectedItemForVariant.name.toLowerCase()]?.map((v) => (
            <button
              key={v}
              onClick={() => addVariantToCart(v)}
              style={{
                padding: 10,
                borderRadius: 10,
                border: "none",
                background: "#22c55e",
                color: "#fff",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {v}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowVariantModal(false)}
          style={{
            marginTop: 15,
            background: "#ef4444",
            color: "#fff",
            border: "none",
            padding: 10,
            borderRadius: 10,
            width: "100%",
          }}
        >
          Cancel
        </button>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

      {/* Receipt Modal */}
 {showReceipt && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.6)",
      backdropFilter: "blur(6px)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 2000,
    }}
  >
    <motion.div
      initial={{ scale: 0.8, opacity: 0, y: 40 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        background: "#ffffff",
        borderRadius: 20,
        width: "95%",
        maxWidth: 520,
        padding: 24,
        boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
      }}
    >
      {/* HEADER */}
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>🧾 Borrowing Receipt</h2>
        <p style={{ fontSize: 13, color: "#666" }}>
          Review your details before submitting
        </p>
      </div>

      {/* STUDENT INFO */}
      <div
        style={{
          background: "#f9fafb",
          padding: 14,
          borderRadius: 12,
          marginBottom: 15,
        }}
      >
        <p><b>Name:</b> {studentName}</p>
        <p><b>Instructor:</b> {instructorName}</p>
        <p><b>Course:</b> {section}</p>
        <p><b>Date:</b> {selectedDate}</p>
        <p><b>Time:</b> {selectedTime}</p>
      </div>

      {/* ITEMS */}
      <div style={{ marginBottom: 15 }}>
        <h4 style={{ marginBottom: 8 }}>Items</h4>

        <div
          style={{
            maxHeight: 150,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {cart.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                background: "#f3f4f6",
                padding: "8px 12px",
                borderRadius: 10,
                fontSize: 14,
              }}
            >
              <span>{item.name}</span>
              <b>x{item.qty}</b>
            </div>
          ))}
        </div>
      </div>

      {/* EMAIL INPUT */}
      <input
        placeholder="Enter Email (for receipt)"
        value={studentEmail}
        onChange={(e) => setStudentEmail(e.target.value)}
        type="email"
        style={{
          width: "100%",
          padding: 10,
          borderRadius: 10,
          border: "1px solid #ccc",
          marginBottom: 5,
        }}
      />
      {/* EMAIL ERROR MESSAGE */}
      {!studentEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) && studentEmail.length > 0 && (
        <p style={{ color: "red", fontSize: 12 }}>❌ Invalid email format</p>
      )}

      {/* ACTION BUTTONS */}
      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={() => setShowReceipt(false)}
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 10,
            border: "none",
            background: "#e5e7eb",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>

        <button
          onClick={handleCheckout}
          disabled={!studentEmail || !studentEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)}
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 10,
            border: "none",
            background: !studentEmail || !studentEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) ? "#9ca3af" : "#22c55e",
            color: "#fff",
            fontWeight: "bold",
            cursor: !studentEmail || !studentEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) ? "not-allowed" : "pointer",
          }}
        >
          Confirm & Send
        </button>
      </div>
    </motion.div>
  </div>
)}
{showSuccessModal && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 3000,
    }}
  >
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        background: "#ffffff",
        borderRadius: 20,
        width: "90%",
        maxWidth: 400,
        padding: "32px 24px",
        textAlign: "center",
        boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
      }}
    >
      <div style={{ fontSize: 60, color: "#22c55e", marginBottom: 16 }}>✔️</div>
      <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#111827" }}>
        Thank You for Borrowing!
      </h2>
      <p style={{ marginTop: 12, fontSize: 15, color: "#4b5563", lineHeight: 1.5 }}>
        Admin will process your request shortly. <br />
        You have borrowed {cart.length} item(s). Please check your email for details.
      </p>
    </motion.div>
  </div>
)}

      {/* Toast */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 80,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#22c55e",
            color: "#fff",
            padding: "8px 20px",
            borderRadius: 20,
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
} 





function matchItem(name: string, needed: string) {
  throw new Error("Function not implemented.");
}