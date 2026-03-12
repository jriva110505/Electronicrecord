"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface Supply {
  name: string;
  img: string;
  stock: number;
  variants?: string[];
}

const supplies: Supply[] = [
  { name: "Kidney Basin", img: "/kidney.png", stock: 20 },

  {
    name: "Syringe",
    img: "/syringes.png",
    stock: 50,
    variants: ["3cc", "5cc", "10cc"],
  },

  { name: "Sterile Gloves", img: "/sterile.png", stock: 20 },
];

export default function Supplies() {
  const [variantModal, setVariantModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Supply | null>(null);
  const [selectedLevelForSemester, setSelectedLevelForSemester] = useState<string | null>(null);
  const [showProcedureModal, setShowProcedureModal] = useState(false);
  const [selectedProcedures, setSelectedProcedures] = useState<string[]>([]);
  const [pendingLevel, setPendingLevel] = useState<string | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<string | null>(null);
  const [showSemesterModal, setShowSemesterModal] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [cart, setCart] = useState<{ name: string; qty: number }[]>([]);
  const [search, setSearch] = useState("");
  const [showReceipt, setShowReceipt] = useState(false);
  const [email, setEmail] = useState("");

  // Borrower info
  const [studentName, setStudentName] = useState("");
  const [instructorName, setInstructorName] = useState("");
  const [section, setSection] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("borrowerInfo");
    if (stored) {
      const data = JSON.parse(stored);
      setStudentName(data.name || "");
      setInstructorName(data.instructor || "");
      setSection(data.course || "");
    }
  }, []);

  const suppliesByLevel: Record<string, Supply[]> = {
    "1st level": [
      { name: "Kidney Basin", img: "/kidney.png", stock: 20 },
      { name: "Forceps", img: "/forcep.png", stock: 20 },
      { name: "Clean Gloves", img: "/gloves.png", stock: 20 },
      { name: "Catheter", img: "/chateter.png", stock: 20 },
      {
  name: "Syringe",
  img: "/syringes.png",
  stock: 20,
  variants: ["3cc", "5cc", "10cc"],
},
      { name: "Sterile Gloves", img: "/sterile.png", stock: 20 },
    ],
      "2nd level": [
  { name: "BP Apparatus", img: "/bp.png", stock: 15 },
  { name: "Stethoscope", img: "/stetos.png", stock: 15 },
  { name: "Thermometer", img: "/termo.png", stock: 15 },
  { name: "Nebulizer Machine", img: "/nebu.png", stock: 10 },
  { name: "Suction Machine", img: "/suction.png", stock: 5 },
  { name: "Suction Catheter", img: "/chateter.png", stock: 15 },
  { name: "Sterile Gloves", img: "/sterile.png", stock: 30 },
  { name: "Clean Gloves", img: "/gloves.png", stock: 30 },
  { name: "Kidney Basin", img: "/kidney.png", stock: 20 },
  { name: "Cotton Balls", img: "/cottons.png", stock: 40 },
  { name: "Gauze", img: "/gauzer.png", stock: 40 },
  { name: "Pulse Oximeter", img: "/pulser.png", stock: 10 },
  { name: "Nasogastric Tube", img: "/ngtt.png", stock: 10 },
  {
    name: "Syringe",
    img: "/syringes.png",
    stock: 40,
    variants: ["1cc", "3cc", "5cc", "10cc"],
  },
  { name: "Nebulizer Mask", img: "/mask.png", stock: 15 },
  { name: "Oxygen Mask", img: "/oxygenmask.png", stock: 15 },
  { name: "Nasal Cannula", img: "/nasal.png", stock: 15 },
  { name: "Oxygen Tank", img: "/oxytank.png", stock: 5 },
  { name: "IV Fluid", img: "/ivfluid.png", stock: 20 },
  { name: "IV Administration Set", img: "/ivset.png", stock: 20 },
  {
  name: "IV Cannula",
  img: "/ivcannula.png",
  stock: 30,
  variants: ["18G", "20G", "22G"]
  },
  { name: "IV Stand", img: "/ivstand.png", stock: 5 },
  { name: "Micropore Tape", img: "/microtape.png", stock: 20 },
  { name: "Bandage Scissors", img: "/bandagescisor.png", stock: 10 },
  { name: "Ovum Forceps", img: "/forcep.png", stock: 10 },
  { name: "Pocket Mask", img: "/pocketmask.png", stock: 10 },
  { name: "CPR Table", img: "/cpr-table.png", stock: 5 },
  { name: "Infant Resuscitation Table", img: "/infanttable.png", stock: 5 },
  { name: "PPE Kit", img: "/ppekit.png", stock: 20 },
  { name: "Delivery Table/Labor Table", img: "/deliverytable.png", stock: 5 },
  { name: "Blankets", img: "/blanket.png", stock: 20 },
  { name: "Hair Cap", img: "/nursecap.png", stock: 30 },
  { name: "Sterile Drapes and Gown", img: "/drapesgown.png", stock: 20 },
  { name: "Umbilical Cord Clamp", img: "/cordclamp.png", stock: 20 },
  { name: "Surgical Scissors", img: "/surgicalscisor.png", stock: 15 },
  { name: "Needle Holder Forceps", img: "/needleholderr.png", stock: 10 },
  { name: "Curve Artery Forceps", img: "/curve-forceps.png", stock: 10 },
  { name: "Straight Artery Forceps", img: "/straight-forceps.png", stock: 10 },
  { name: "Sponge Forceps", img: "/sponge-forceps.png", stock: 10 },
  { name: "Surgical Needle", img: "/surgical-needle.png", stock: 20 },
  { name: "Linen", img: "/linen.png", stock: 20 },
  { name: "Kelly Pad", img: "/kelly-pad.png", stock: 20 },
  { name: "Mitten Hands", img: "/mitten-hands.png", stock: 20 },
{ name: "Mitten Feets", img: "/mitten-feets.png", stock: 20 },
{ name: "Hooded Towels", img: "/hooded-towel.png", stock: 20 },
{ name: "Dry Linen", img: "/dry-linen.png", stock: 20 },
{ name: "Bonnet", img: "/bonnet.png", stock: 20 },
{ name: "Oxytocin", img: "/oxytocin.png", stock: 20 },
{ name: "Plastic Cord Clamp", img: "/plastic-cord-clamp.png", stock: 20 },
{ name: "Surgical Scissors", img: "/surgical-scissors.png", stock: 15 },
{ name: "Vaginal Speculum", img: "/vaginal-speculum.png", stock: 10 },
{ name: "Sterile Lubricating Jelly", img: "/lubricating-jelly.png", stock: 20 },
{ name: "Pen Light", img: "/pen-light.png", stock: 15 }, 
{ name: "Sterile Foley Catheter", img: "/foley-catheter.png", stock: 15 },
{ name: "Antiseptic Solution (Betadine)", img: "/betadine.png", stock: 20 },
{ name: "Cleansing Cherries", img: "/cleansing-cherries.png", stock: 20 },
{ name: "Specimen Container", img: "/specimen-container.png", stock: 15 },
{ name: "Urinary Bag", img: "/urinary-bag.png", stock: 15 },
{ name: "Blanket for Draping", img: "/draping-blanket.png", stock: 15 },
{ name: "Sterile Water", img: "/sterile-water.png", stock: 20 },
{ name: "Sterile Antiseptic Solution", img: "/sterile-antiseptic.png", stock: 20 },
{ name: "Sterile Water Bottle", img: "/sterile-water-bottle.png", stock: 20 },
{ name: "Pick Up Forceps", img: "/pickup-forceps.png", stock: 15 },
{ name: "Sterile Sanitary Pad", img: "/sanitary-pad.png", stock: 20 },
{ name: "Hypo Tray", img: "/hypo-tray.png", stock: 10 },
{ name: "Draping Sheet", img: "/draping-sheet.png", stock: 15 },
{ name: "Rubber Sheet", img: "/rubber-sheet.png", stock: 15 },
{ name: "Sterile Towel", img: "/sterile-towel.png", stock: 20 },
{ name: "Water Bucket", img: "/water-bucket.png", stock: 10 },
{ name: "Mannequin", img: "/mannequin.png", stock: 5 },
{ name: "Examination Bed", img: "/examination-bed.png", stock: 5 },
{ name: "Clean Sheet", img: "/clean-sheet.png", stock: 20 },
{ name: "Pillow", img: "/pillow.png", stock: 10 },
{ name: "Measuring Tape", img: "/measuring-tape.png", stock: 10 },
{ name: "Ultrasound Gel", img: "/ultrasound-gel.png", stock: 15 },
{ name: "Alcohol or Hand Sanitizer", img: "/alcohol-sanitizer.png", stock: 20 },
{ name: "PHN Bag", img: "/phn-bag.png", stock: 10 },
{ name: "Soap", img: "/soap.png", stock: 20 },
{ name: "Sanitizer", img: "/sanitizer.png", stock: 20 },
{ name: "Glucometer", img: "/glucometer.png", stock: 10 },
{ name: "Test Tube", img: "/test-tube.png", stock: 20 },
{ name: "Medicine Dropper", img: "/medicine-dropper.png", stock: 15 },
{ name: "Alcohol Lamp", img: "/alcohol-lamp.png", stock: 10 },
{ name: "Test Tube Holder", img: "/test-tube-holder.png", stock: 10 },
{ name: "Plastic Linen", img: "/plastic-linen.png", stock: 20 },
{ name: "Paper Linen", img: "/paper-linen.png", stock: 20 },
{ name: "Mask", img: "/mask.png", stock: 20 },
{ name: "Apron", img: "/apron.png", stock: 15 },

// 2nd SEMESTER
// last edit
{ name: "Normal Saline", img: "/normal-saline.png", stock: 20 },
{ name: "Connecting Tubing", img: "/connecting-tubing.png", stock: 15 },
{ name: "Suction Canister", img: "/suction-canister.png", stock: 10 },
{ name: "Collection Bottle", img: "/collection-bottle.png", stock: 10 },
{ name: "Tissue", img: "/tissue.png", stock: 20 },
{ name: "Feeding Syringe", img: "/feeding-syringe.png", stock: 15 },
{ name: "Enteral Feeding Formula", img: "/enteral-feeding.png", stock: 10 },
{ name: "Medical Tape", img: "/medical-tape.png", stock: 20 },
{ name: "Disposable Pad", img: "/disposable-pad.png", stock: 15 },
{ name: "Pressure Regulator", img: "/pressure-regulator.png", stock: 10 },
{ name: "Humidifier Bottle", img: "/humidifier-bottle.png", stock: 10 },
{ name: "Oxygen Tubing", img: "/oxygen-tubing.png", stock: 20 },
{ name: "Partial Rebreather Mask", img: "/partial-rebreather.png", stock: 10 },
{ name: "Non-Rebreather Mask", img: "/non-rebreather.png", stock: 10 },
{ name: "Venturi Mask", img: "/venturi-mask.png", stock: 10 },
{ name: "Oxygen Wrench", img: "/oxygen-wrench.png", stock: 10 },
{ name: "Cotton Balls", img: "/alcohol-cotton.png", stock: 20 },
{ name: "Canister", img: "/canister.png", stock: 10 }


],
    "3rd level": [
  { name: "PPE", img: "/ppe.png", stock: 20 },
  { name: "Sterile Gown", img: "/sterile-gown.png", stock: 20 },
  { name: "Sterile Cap", img: "/sterile-cap.png", stock: 20 },
  { name: "Sterile Mask", img: "/mask.png", stock: 20 },
  { name: "Sterile Gloves", img: "/sterile.png", stock: 30 },
  { name: "Cherry Balls with Cleanser", img: "/cleansing-cherries.png", stock: 20 },
  { name: "Laparotomy Gauze Pack", img: "/gauze-pack.png", stock: 20 },
  { name: "Cherry Balls with 10% Betadine Antiseptic", img: "/betadine.png", stock: 20 },
  { name: "Sterile Drapes", img: "/drapes-gown.png", stock: 20 },
  { name: "Sterile Basin", img: "/hypo-tray.png", stock: 15 },
  { name: "Surgical Scissors", img: "/scissors.png", stock: 15 },
  { name: "Forceps", img: "/forcep.png", stock: 15 },
  { name: "Needle Holder", img: "/needle-holder.png", stock: 10 },
  { name: "Scalpel Handle", img: "/scalpel.png", stock: 10 },
  { name: "Antimicrobial Soap", img: "/soap.png", stock: 20 },
  { name: "Sterile Scrub Brush with Nail Cleaner", img: "/scrub-brush.png", stock: 20 },
  { name: "Sterile Towel", img: "/sterile-towel.png", stock: 20 }
],
    "4th level": [
  {
  name: "IV Cannula",
  img: "/iv-cannula.png",
  stock: 30,
  variants: ["18G", "20G", "22G"]
  },
  { name: "Cotton Balls", img: "/cotton.png", stock: 50 },
  { name: "IV Fluid", img: "/ivfluid.png", stock: 20 },
  { name: "Mannequin", img: "/mannequin.png", stock: 5 },
  { name: "CPR Mask", img: "/pocket-mask.png", stock: 10 },
  { name: "Triangular Bandage", img: "/bandage.png", stock: 20 },

  { name: "Endotracheal Tubes", img: "/et-tube.png", stock: 10 },
  { name: "Bag-Valve Mask", img: "/bag-valve-mask.png", stock: 10 },
  { name: "Capnography Adapter", img: "/capnography.png", stock: 10 },
  { name: "Laryngoscope Set", img: "/laryngoscope.png", stock: 5 },
  { name: "Medication Demonstration Kit", img: "/med-kit.png", stock: 5 },
  { name: "IV Start Pack", img: "/iv-set.png", stock: 10 },
  { name: "Fluid Bag", img: "/iv-fluid.png", stock: 10 },
  { name: "Syringe", img: "/syringes.png", stock: 20 },
  { name: "IV Tubing", img: "/iv-set.png", stock: 20 },
{ name: "Tourniquet", img: "/tourniquet.png", stock: 15 },
{ name: "Alcohol Swabs", img: "/alcohol-cotton.png", stock: 30 },
{ name: "Sterile Gauze", img: "/gauzer.png", stock: 30 },
{ name: "Adhesive Tape", img: "/medical-tape.png", stock: 20 },
{ name: "Transparent Dressing", img: "/dressing.png", stock: 20 },
{ name: "Disposable Gloves", img: "/gloves.png", stock: 30 },
{ name: "Face Mask", img: "/mask.png", stock: 30 },
{ name: "Sharps Container", img: "/sharps.png", stock: 10 },
{ name: "Hand Sanitizer", img: "/sanitizer.png", stock: 20 },
{ name: "Plaster or Bandage", img: "/bandage.png", stock: 20 },
{ name: "Tape Measure", img: "/measuring-tape.png", stock: 15 },
{ name: "Mannequin Arm", img: "/mannequin.png", stock: 5 },
],
    Others: [
      
      { name: "Alcohol Bottle", img: "/alcohol.png", stock: 30 },
      { name: "Bandage", img: "/bandage.png", stock: 40 },
    ],
  };

  const procedures: Record<string, Record<string, string[]>> = {
  "1st level": {
    "1st Semester": [
      "to add",
      "to add",
      "to add",
      
    ],
    "2nd Semester": [
      "to add",
      "to add",
      "to add",

    ], 
  },
  "2nd level": {
    "1st Semester": [
      "Dr tech",
      "EINC",
      "IE",
      "CATHETERIZATION",
      "NEWBORN CARE",
      "PERINEAL FLUSHING",
      "LEOPOLDS MANEUVER",
      "BAG TECHNIQUE",
    ],
    "2nd Semester": [
      "CPR",
      "Fbao (conscious)",
      "Fbao (unconscious)",
      "AR",
      "Discontinuing",
      "Setting up",
      "Oxygen",
      "Nebulization",
      "Suctioning",
      "NGT Feeding",
    ],
  },
  "3rd level": {
    "1st Semester": [
      "Skin Prep",
      "Sterile Field Prep",
      "Surgical Scrubbing",
    ],
    "2nd Semester": [
      "none",
    ],
  },
  "4th level": {
  "1st Semester": [
    "IV Therapy",
    "BLS",
    "Bandaging",
  ],
  "2nd Semester": [
    "ACLS",
  ],
},
};

const procedureSupplies: Record<string, string[]> = {
  
  // 1st Semester
  "Dr tech": [
  "Delivery Table/Labor Table",
  "Blankets",
  "Sterile Gloves",
  "Hair Cap",
  "Sterile Drapes and Gown",
  "Umbilical Cord Clamp",
  "Surgical Scissors",
  "Needle Holder Forceps",
  "Curve Artery Forceps",
  "Straight Artery Forceps",
  "Sponge Forceps",
  "Gauze",
  "Syringe",
  "Surgical Needle",
  "Kidney Basin",
  "Linen",
  "Kelly Pad"

  ],

  "EINC": [
    "Mitten Hands", "Mitten Feets", "Hooded Towels", "Dry Linen", "Bonnet",
    "Cotton Balls", "Sponge Forceps", "Syringe", "Oxytocin",
    "Plastic Cord Clamp", "Surgical Scissors", "Kidney Basin",
    "Straight Artery Forceps"
  ],

  "IE": [
    "Sterile Gloves", "Vaginal Speculum", "Sterile Lubricating Jelly",
    "Cotton Balls", "Sponge Forceps", "Kidney Basin", "Pen Light"
  ],

  "CATHETERIZATION": [
    "Sterile Foley Catheter", "Sterile Gloves", "Antiseptic Solution",
    "Cleansing Cherries", "Forceps", "KY Jelly", "Kidney Basin",
    "Specimen Container", "Syringe", "Urinary Bag", "Blanket for Draping",
    "Sterile Water"
  ],

  "NEWBORN CARE": [
    "Droplight", "Diaper", "Weighing Scale", "Measuring Tape",
    "Stethoscope", "Thermometer", "Bonnet", "Baby Clothing",
    "Eye Ointment", "Syringe", "Linen"
  ],

"PERINEAL FLUSHING": [
  "Sterile Antiseptic Solution",
  "Sterile Water",
  "Ovum Forceps",
  "Pick Up Forceps",
  "Sterile Sanitary Pad",
  "Kidney Basin",
  "Hypo Tray",
  "Clean Gloves",
  "Draping Sheet",
  "Rubber Sheet",
  "Cleansing Cherries",
  "Sterile Towel",
  "Kelly Pad",
  "Water Bucket",
  "Mannequin"
],

  "LEOPOLDS MANEUVER": [
  "Examination Bed",
  "Clean Sheet",
  "Pillow",
  "Measuring Tape",
  "Stethoscope",
  "Clean Gloves",
  "Ultrasound Gel",
  "Alcohol or Hand Sanitizer"
],

  "BAG TECHNIQUE": [
    "PHN Bag", "Soap", "Sanitizer", "Measuring Tape", "Thermometer",
    "BP Apparatus", "Glucometer", "Test Tube", "Medicine Dropper",
    "Alcohol Lamp", "Test Tube Holder", "Linen", "Plastic Linen",
    "Paper Linen", "Cotton Balls", "Kidney Basin", "Straight Forceps",
    "Curve Forceps", "Antiseptic Solutions", "Bandage Scissors",
    "Micropore Tape", "Gauze", "Cord Clamp", "Syringe", "Sterile Gloves",
    "Mask", "Apron"
  ],

  // 2nd Semester
  "Suctioning": [
     "Suction Machine",
  "Suction Catheter",
  "Sterile Gloves",
  "Sterile Water",
  "Normal Saline",
  "Connecting Tubing",
  "Suction Canister",
  "Collection Bottle",
  "PPE Kit",
  "Tissue",
  "Gauze",
  "Pulse Oximeter",
  "Kidney Basin"
  ],

  "NGT Feeding": [
    "Nasogastric Tube", "Feeding Syringe", "Enteral Feeding Formula",
    "Sterile Water", "Kidney Basin", "Stethoscope", "Tape", "Gloves",
    "Towel"
  ],

  "Nebulization": [
    "Nebulizer Machine", "Nebulizer Mask", "Nebulizer Cup",
    "Prescribed Medication", "Normal Saline", "Sterile Water",
    "Tubing", "Clean Gloves", "Cotton Balls", "Sterile Syringe",
    "Tissue or Towel", "Kidney Basin"
  ],

  "Administering Oxygen": [
    "Oxygen Tank", "Pressure Regulator", "Humidifier Bottle",
    "Oxygen Tubing", "Nasal Cannula", "Simple Face Mask", "Partial Rebreather Mask",
    "Non-Rebreather Mask", "Venturi Mask", "Pulse Oximeter", "Oxygen Wrench"
  ],

  "Setting up IV": [
    "IV Fluid", "IV Stand", "IV Administration Set", "Clean Gloves", "Arm Dummy"
  ],

  "IV Discontinuing": [
  "IV Fluid",
  "Syringe",
  "Cotton Balls",
  "Cotton Balls with Alcohol",
  "Micropore Tape",
  "Ovum Forceps",
  "IV Cannula",
  "Bandage Scissors",
  "Canister",
  "Mannequin"
],

  "FBAO (Conscious)": ["Clean Gloves"],

  "FBAO (Unconscious)": ["Clean Gloves"],

  "CPR": ["Infant Resuscitation Table", "CPR Table", "Pocket Mask", "Clean Gloves"],

// 3rd Level Procedures

"Skin Prep": [
  "PPE",
  "Sterile Gown",
  "Sterile Cap",
  "Sterile Mask",
  "Sterile Gloves",
  "Cherry Balls with Cleanser",
  "Laparotomy Gauze Pack",
  "Cherry Balls with 10% Betadine Antiseptic"
],

"Sterile Field Prep": [
  "Sterile Drapes",
  "Sterile Gloves",
  "Sterile Gown",
  "Sterile Basin",
  "Sterile Cap",
  "Scissors",
  "Forceps",
  "Needle Holder",
  "Scalpel Handle"
],

"Surgical Scrubbing": [
  "Scrub Sink with Running Water",
  "Antimicrobial Soap",
  "Sterile Scrub Brush with Nail Cleaner",
  "Sterile Towel",
  "Surgical Cap",
  "Surgical Mask",
  "Sterile Gown",
  "Sterile Gloves"
],

// 4th Level Procedures

"IV Therapy": [
  "IV Cannula",
  "IV Fluid",
  "IV Tubing",
  "Tourniquet",
  "Alcohol Swabs",
  "Cotton Balls",
  "Sterile Gauze",
  "Adhesive Tape",
  "Transparent Dressing",
  "Kidney Basin",
  "Disposable Gloves",
  "Face Mask",
  "Sharps Container",
  "IV Stand",
  "Hand Sanitizer",
  "Plaster or Bandage",
  "Tape Measure",
  "Mannequin Arm"
],

"BLS": [
  "Adult Mannequin",
  "CPR Mask"
],

"Bandaging": [
  "Triangular Bandage"
],

"ACLS": [
  "Mannequin",
  "Endotracheal Tubes",
  "Bag-Valve Mask",
  "Capnography Adapter",
  "Laryngoscope Set",
  "Medication Demonstration Kit",
  "IV Start Pack",
  "Fluid Bag",
  "Syringe"
],

};


  // CART FUNCTIONS
  const addToCart = (item: Supply) => {
  if (item.variants) {
    setSelectedItem(item);
    setVariantModal(true);
    return;
  }

  addItemToCart(item.name);
};

  const addItemToCart = (name: string) => {
  setCart((prev) => {
    const exists = prev.find((i) => i.name === name);

    if (exists) {
      return prev.map((i) =>
        i.name === name ? { ...i, qty: i.qty + 1 } : i
      );
    }

    return [...prev, { name, qty: 1 }];
  });
};

  const increase = (name: string) => {
    const supply = Object.values(suppliesByLevel).flat().find((i) => i.name === name);
    if (!supply || supply.stock <= 0) return;
    supply.stock--;
    setCart((prev) => prev.map((i) => (i.name === name ? { ...i, qty: i.qty + 1 } : i)));
  };

  const decrease = (name: string) => {
    const supply = Object.values(suppliesByLevel).flat().find((i) => i.name === name);
    if (supply) supply.stock++;
    setCart((prev) =>
      prev.map((i) => (i.name === name ? { ...i, qty: i.qty - 1 } : i)).filter((i) => i.qty > 0)
    );
  };

  const checkout = () => {
    setShowReceipt(true);
  };

  const sendEmail = async () => {
    try {
      await fetch("/reciept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentName, instructorName, section, items: cart, email }),
      });
      alert("Receipt sent to " + email);
      setCart([]);
      setShowReceipt(false);
      setEmail("");
    } catch (err) {
      console.error(err);
      alert("Failed to send email");
    }
  };

  // Filter supplies by search
  const filteredSupplies =
  selectedLevel && search
    ? suppliesByLevel[selectedLevel].filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      )
    : selectedLevel
    ? suppliesByLevel[selectedLevel].filter((item) =>
        selectedProcedures.length
          ? selectedProcedures.some((proc) => procedureSupplies[proc]?.includes(item.name))
          : true
      )
    : [];

  function handleLevelClick(level: string) {
  setPendingLevel(level);
  setSelectedLevelForSemester(level);
  setSelectedSemester(null);
  setSelectedProcedures([]);
  setShowSemesterModal(true);
}

  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      {/* Background */}
      <Image src="/green.jpg" alt="Background" fill style={{ objectFit: "cover" }} />
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)" }} />

      <div
  style={{
    position: "relative",
    zIndex: 2,
    display: "flex",
    width: "100%",
    minHeight: "100vh",
  }}
>
        {/* LEVEL SELECTION */}
        <AnimatePresence mode="wait">
          {!selectedLevel ? (
            <motion.div
              key="levels"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                minHeight: "100vh",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
                padding: "clamp(1rem,4vw,3rem)",
              }}
            >
              <h1
                style={{
                  marginBottom: 40,
                  fontSize: "clamp(1.6rem,5vw,3rem)",
                  textAlign: "center",
                }}
              >
                WHAT'S YOUR YEAR LEVEL?
              </h1>
              <div
                style={{
                  display: "flex",
                  gap: 20,
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                {Object.keys(suppliesByLevel).map((level) => (
                  <motion.div
                    key={level}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleLevelClick(level)}
                    style={{
                      background: "white",
                      width: "clamp(120px,40vw,220px)",
                      height: "clamp(120px,40vw,220px)",
                      borderRadius: 20,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      cursor: "pointer",
                      color: "#111",
                      fontWeight: "bold",
                      fontSize: "clamp(1rem,3vw,1.3rem)",
                      textAlign: "center",
                      padding: 10,
                    }}
                  >
                    {level}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="supplies"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                display: "flex",
                flex: 1,
                minHeight: "100vh",
                gap: 20,
              }}
            >
              {/* LEFT SIDEBAR */}
              <div
  style={{
    position: "fixed",
    top: 0,
    left: 0,
    width: "clamp(120px,20vw,200px)",
    height: "100vh",
    background: "#166534",
    padding: "1rem",
    display: window.innerWidth < 768 ? "none" : "flex",
    flexDirection: "column",
    gap: 10,
    color: "white",
    borderRadius: 0,
    zIndex: 10,
  }}
>
                {Object.keys(suppliesByLevel).map((lvl) => (
                  <div
                    key={lvl}
                    onClick={() => setSelectedLevel(lvl)}
                    style={{
                      padding: 12,
                      textAlign: "center",
                      borderRadius: 10,
                      background: selectedLevel === lvl ? "#22c55e" : "rgba(255,255,255,0.2)",
                      cursor: "pointer",
                    }}
                  >
                    {lvl}
                  </div>
                ))}
                <button
                  onClick={() => setSelectedLevel(null)}
                  style={{
                    marginTop: "auto",
                    padding: 10,
                    background: "white",
                    color: "#166534",
                    border: "none",
                    borderRadius: 8,
                    cursor: "pointer",
                  }}
                >
                  ← Back
                </button>
              </div>

              {/* MAIN CONTENT */}
              <div
                style={{
                  flex: 1,
                  marginLeft: "clamp(120px,20vw,200px)",
                  padding: "clamp(1rem,4vw,3rem)",
                  background: "#f3f4f6",
                  borderRadius: 12,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Search */}
                <input
                  placeholder="Search supplies..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    position: "absolute",
                    top: 20,
                    right: 20,
                    padding: 8,
                    borderRadius: 6,
                    border: "1px solid #ccc",
                    width: "220px",
                  }}
                />

                <div style={{ marginBottom: 30 }}>
  <h2>Electronic Central Supplies Record</h2>

  {selectedProcedures.length > 0 && (
    <div
      style={{
        marginTop: 8,
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
      }}
    >
      {selectedProcedures.map((proc) => (
        <span
          key={proc}
          style={{
            background: "#16a34a",
            color: "white",
            padding: "4px 10px",
            borderRadius: 20,
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          {proc}
        </span>
      ))}
    </div>
  )}
</div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
                    gap: 24,
                  }}
                >
                  {filteredSupplies.map((item) => (
                    <motion.div
                      key={item.name}
                      whileHover={{ scale: 1.05 }}
                      style={{
                        background: "white",
                        borderRadius: 20,
                        padding: 20,
                        textAlign: "center",
                        position: "relative",
                        minHeight: "220px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      <h3>{item.name}</h3>
                      {item.variants && (
  <p style={{ color: "#16a34a", fontSize: 12 }}>
    Choose Size
  </p>
)}
                      <Image
                        src={item.img}
                        alt={item.name}
                        width={100}
                        height={100}
                        style={{ width: "clamp(70px,20vw,120px)", height: "auto", objectFit: "contain",display: "block", margin: "0 auto 40px auto", }}
                      />
                      <p
                        style={{
                        position: "absolute",
                        bottom: 12,
                        left: 16,
                        fontWeight: 600,
                        fontSize: 14,
                        }}
                        >
                        Stock: {item.stock}
                      </p>
                      <button
                        onClick={() => addToCart(item)}
                        style={{
                        position: "absolute",
                        bottom: 10,
                        right: 14,
                        width: 42,
                        height: 42,
                        borderRadius: "50%",
                        border: "none",
                        background: "#16a34a",
                        color: "white",
                        fontSize: 24,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      >
                       +
                  </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      {/* BOTTOM CART */}
<AnimatePresence>
  {cart.length > 0 && (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", stiffness: 260, damping: 25 }}
      style={{
        position: "fixed",
        bottom: 0,
        left: "clamp(120px,25vw,220px)",
        width: "calc(100% - clamp(120px,25vw,220px))",
        minHeight: "120px",
        background: "rgba(15,15,15,0.95)",
        backdropFilter: "blur(12px)",
        color: "white",
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        gap: 16,
        overflowX: "auto",
        zIndex: 50,
      }}
    >
      {/* Back Button */}
      <button
        onClick={() => setCart([])}
        style={{
          padding: "6px 12px",
          background: "#ef4444",
          border: "none",
          borderRadius: 8,
          color: "white",
          cursor: "pointer",
          fontWeight: 600,
          flexShrink: 0,
        }}
      >
        Clear
      </button>

      <h3
        style={{
          fontSize: "1.1rem",
          fontWeight: 600,
          marginRight: 10,
          flexShrink: 0,
        }}
      >
        🛒 Cart
      </h3>

      {cart.map((item) => (
        <motion.div
          key={item.name}
          whileHover={{ scale: 1.03 }}
          style={{
            background: "#1f1f1f",
            padding: 10,
            borderRadius: 12,
            minWidth: 140,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
          }}
        >
          <strong style={{ fontSize: 14 }}>{item.name}</strong>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <button
              onClick={() => decrease(item.name)}
              style={{
                width: 26,
                height: 26,
                borderRadius: 6,
                border: "none",
                background: "#ef4444",
                color: "white",
                cursor: "pointer",
              }}
            >
              −
            </button>

            <span style={{ fontWeight: 600 }}>{item.qty}</span>

            <button
              onClick={() => increase(item.name)}
              style={{
                width: 26,
                height: 26,
                borderRadius: 6,
                border: "none",
                background: "#22c55e",
                color: "white",
                cursor: "pointer",
              }}
            >
              +
            </button>
          </div>
        </motion.div>
      ))}

      {/* Borrow Button */}
      <button
        onClick={checkout}
        style={{
          marginLeft: "auto",
          padding: "10px 18px",
          background: "linear-gradient(135deg,#22c55e,#16a34a)",
          border: "none",
          borderRadius: 10,
          cursor: "pointer",
          fontWeight: 600,
          boxShadow: "0 6px 18px rgba(34,197,94,0.4)",
          flexShrink: 0,
        }}
      >
        Borrow Supplies
      </button>
    </motion.div>
  )}
</AnimatePresence>

        {/* RECEIPT MODAL */}
        <AnimatePresence>
          {showReceipt && (
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
                zIndex: 100,
                padding: 20,
              }}
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                style={{
                  background: "#fff",
                  padding: 30,
                  borderRadius: 20,
                  width: "100%",
                  maxWidth: 400,
                  textAlign: "left",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <h2 style={{ textAlign: "center" }}>Borrow Receipt</h2>
                <p><strong>Student:</strong> {studentName}</p>
                <p><strong>Instructor:</strong> {instructorName}</p>
                <p><strong>Section:</strong> {section}</p>
                <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                <p><strong>Time:</strong> {new Date().toLocaleTimeString()}</p>
                <hr />
                <h3>Borrowed Items:</h3>
                <ul>
                  {cart.map((item) => (
                    <li key={item.name}>
                      {item.name} x {item.qty}
                    </li>
                  ))}
                </ul>
                <input
                  placeholder="Enter your email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc", marginTop: 10 }}
                />
                <button
                  onClick={sendEmail}
                  style={{
                    marginTop: 10,
                    padding: "10px 20px",
                    background: "#16a34a",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    cursor: "pointer",
                  }}
                >
                  Send to Email
                </button>
                <button
                  onClick={() => setShowReceipt(false)}
                  style={{
                    marginTop: 10,
                    padding: "10px 20px",
                    background: "#f87171",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    cursor: "pointer",
                  }}
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
  {variantModal && selectedItem && (
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
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        style={{
          background: "white",
          padding: 30,
          borderRadius: 20,
          width: 300,
          textAlign: "center",
        }}
      >
        <h3>Select {selectedItem.name} Size</h3>

        {selectedItem.variants?.map((v) => (
          <button
            key={v}
            onClick={() => {
              addItemToCart(`${selectedItem.name} (${v})`);
              setVariantModal(false);
            }}
            style={{
              display: "block",
              width: "100%",
              marginTop: 10,
              padding: 10,
              background: "#16a34a",
              color: "white",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            {v}
          </button>
        ))}

        <button
          onClick={() => setVariantModal(false)}
          style={{
            marginTop: 15,
            padding: 8,
            background: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: 8,
            width: "100%",
          }}
        >
          Cancel
        </button>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

        {/* SEMESTER MODAL */}
<AnimatePresence>
  {showSemesterModal && (
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
        zIndex: 100,
        padding: 20,
      }}
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        style={{
          background: "#fff",
          padding: 30,
          borderRadius: 20,
          width: "100%",
          maxWidth: 400,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <h2 style={{ textAlign: "center" }}>Select Semester</h2>

        {/* Semester Selection */}
        <div style={{ display: "flex", justifyContent: "space-around", marginBottom: 20 }}>
          {["1st Semester", "2nd Semester"].map((sem) => (
            <button
              key={sem}
              onClick={() => setSelectedSemester(sem)}
              style={{
                padding: "10px 20px",
                background: selectedSemester === sem ? "#16a34a" : "#ccc",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              {sem}
            </button>
          ))}
        </div>

        {/* Procedure Checklist */}
        {selectedSemester && procedures[selectedLevelForSemester!][selectedSemester].length > 0 && (
          <div>
            <h3>Procedures:</h3>
            {procedures[selectedLevelForSemester!][selectedSemester].map((proc) => (
              <label key={proc} style={{ display: "block", marginBottom: 5 }}>
                <input
                  type="checkbox"
                  value={proc}
                  checked={selectedProcedures.includes(proc)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedProcedures((prev) => [...prev, proc]);
                    } else {
                      setSelectedProcedures((prev) =>
                        prev.filter((p) => p !== proc)
                      );
                    }
                  }}
                  style={{ marginRight: 8 }}
                />
                {proc}
              </label>
            ))}
          </div>
        )}

        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
  {/* Back Button */}
  <button
    onClick={() => {
      setShowSemesterModal(false);
      setSelectedSemester(null);
      setSelectedProcedures([]);
      setSelectedLevelForSemester(null);
    }}
    style={{
      flex: 1,
      padding: "10px",
      background: "#ef4444",
      color: "#fff",
      border: "none",
      borderRadius: 8,
      cursor: "pointer",
    }}
  >
    Back
  </button>

  {/* Confirm Button */}
  <button
    onClick={() => {
      setSelectedLevel(pendingLevel);
      setShowSemesterModal(false);
    }}
    style={{
      flex: 1,
      padding: "10px",
      background: "#16a34a",
      color: "#fff",
      border: "none",
      borderRadius: 8,
      cursor: "pointer",
    }}
  >
    Confirm
  </button>
</div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
      </div>
    </div>
  );
}