        "use client";

        import { useState, useEffect, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useRef } from "react";
        import { motion } from "framer-motion";
        import { useRouter } from "next/navigation";
        import { BarChart,  Bar,XAxis, YAxis, Tooltip, ResponsiveContainer, } from "recharts";
        import { supabase } from "@/lib/supabase";
        import "./Modal.css";
        

        interface Variant {
          type: string;
          stock: number;
        }

        interface Serial {
          serial: string;
        }

     interface Item {
  id: number;
  name: string;
  level: string;
  stock?: number;
  image: File | null;
  itemType: 'consumable' | 'non_consumable';
  variants?: Variant[];
  serials?: Serial[];
}

        interface Message {
          timestamp: any;
          id: number;
          studentId?: string;
          studentName?: string;
          sender: "user" | "system";
          text: string;
          read?: boolean;
          createdAt: string;
        }

        interface Conversation {
          studentId: string;
          studentName: string;
          messages: Message[];
        }

        export default function AdminPage() {
          const router = useRouter();
          const [items, setItems] = useState<Item[]>([]);
          const [search, setSearch] = useState("");
          const [borrowHistory, setBorrowHistory] = useState<any[]>([]);
          const [page, setPage] = useState("items");
          const [selectedReturn, setSelectedReturn] = useState<any | null>(null);
          const [showReturnModal, setShowReturnModal] = useState(false);
          const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
          const [issueItems, setIssueItems] = useState<Record<string, boolean>>({});
          const [incidentNote, setIncidentNote] = useState("");
          const activeBorrows = borrowHistory.filter((b) => !b.returned);
          const returnedBorrows = borrowHistory.filter((b) => b.returned);
          const [incidents, setIncidents] = useState<any[]>([]);
          const [roomBookings, setRoomBookings] = useState<any[]>([]);
          const [processedBy, setProcessedBy] = useState("");
          const [remarks, setRemarks] = useState("complete");
          const [showDoneConfirm, setShowDoneConfirm] = useState(false);
          const [pendingDone, setPendingDone] = useState<any | null>(null);

          //messages
          const [conversations, setConversations] = useState<Conversation[]>([]);
          const [isSendingReply, setIsSendingReply] = useState(false);
          const [selectedChat, setSelectedChat] = useState<Conversation | null>(null);
          const [reply, setReply] = useState("");
          const apiUrl = "https://dbsupplyrecord-2.onrender.com";
          const chatBoxRef = useRef<HTMLDivElement>(null);

          const [currentUser, setCurrentUser] = useState("");

const [selectedFile, setSelectedFile] = useState<string | null>(null);
const [showFileModal, setShowFileModal] = useState(false);
const [showConfirmModal, setShowConfirmModal] = useState(false);
const [fileSearch, setFileSearch] = useState("");

// Example files (replace with your real list)
const files = ["SURGICAL SCRUBBING.pdf", "report1.pdf", "Dr tech.pdf",
"EINC.pdf",
"IE.pdf",
"CATHETERIZATION.pdf",
"NEWBORN CARE.pdf",
"PERINEAL FLUSHING.pdf",
"LEOPOLDS MANEUVER.pdf",
"BAG TECHNIQUE.pdf"
];


          //loaidng Modals
          const [showDeclineModal, setShowDeclineModal] = useState(false);
          const [declineReason, setDeclineReason] = useState("");
          const [isProcessing, setIsProcessing] = useState(false);
          const [isProcessingDone, setIsProcessingDone] = useState(false);
          const [showSuccessModal, setShowSuccessModal] = useState(false);
          const [successMessage, setSuccessMessage] = useState("");
          const [successType, setSuccessType] = useState<"success" | "error">("success");
          const [isProcessingDecline, setIsProcessingDecline] = useState(false);
          const [showDeclineSuccess, setShowDeclineSuccess] = useState(false);
          

/* =========================================================
   🔊 AUDIO REFS
========================================================= */

const chatSoundRef = useRef<HTMLAudioElement | null>(null);
const borrowSoundRef = useRef<HTMLAudioElement | null>(null);

/* =========================================================
   💬 CHAT TRACKING
========================================================= */

const prevMessageIdsRef = useRef<Set<string>>(new Set());
const isChatInitializedRef = useRef(false);

/* =========================================================
   📚 BORROW TRACKING
========================================================= */

const prevBorrowIdsRef = useRef<Set<string>>(new Set());
const isBorrowInitializedRef = useRef(false);

/* =========================================================
   🔊 LOAD AUDIO FILES
========================================================= */

useEffect(() => {
  // 💬 chat sound
  chatSoundRef.current = new Audio("/sound/chatNotify.mp3");
  chatSoundRef.current.preload = "auto";
  chatSoundRef.current.volume = 1;

  // 📚 borrow sound
  borrowSoundRef.current = new Audio("/sound/notifyBorrow.mp3");
  borrowSoundRef.current.preload = "auto";
  borrowSoundRef.current.volume = 1;

  console.log("🔊 Sounds loaded");
}, []);

/* =========================================================
   🔓 UNLOCK AUDIO (IMPORTANT)
   Browser blocks autoplay until first user interaction
========================================================= */

useEffect(() => {
  const unlockAudio = async () => {
    try {
      // 💬 unlock chat audio
      if (chatSoundRef.current) {
        await chatSoundRef.current.play();
        chatSoundRef.current.pause();
        chatSoundRef.current.currentTime = 0;
      }

      // 📚 unlock borrow audio
      if (borrowSoundRef.current) {
        await borrowSoundRef.current.play();
        borrowSoundRef.current.pause();
        borrowSoundRef.current.currentTime = 0;
      }

      console.log("🔓 Audio unlocked");
    } catch (err) {
      console.log("❌ Audio unlock failed:", err);
    }

    document.removeEventListener("click", unlockAudio);
  };

  document.addEventListener("click", unlockAudio);

  return () => {
    document.removeEventListener("click", unlockAudio);
  };
}, []);

/* =========================================================
   🔊 PLAY CHAT SOUND
========================================================= */

const playChatSound = async () => {
  try {
    const audio = chatSoundRef.current;

    if (!audio) {
      console.log("❌ Chat audio missing");
      return;
    }

    audio.pause();
    audio.currentTime = 0;

    const playPromise = audio.play();

    if (playPromise !== undefined) {
      await playPromise;
    }

    console.log("💬 Chat sound played");
  } catch (err) {
    console.log("❌ Chat sound failed:", err);
  }
};

/* =========================================================
   🔊 PLAY BORROW SOUND
========================================================= */

const playBorrowSound = async () => {
  try {
    const audio = borrowSoundRef.current;

    if (!audio) {
      console.log("❌ Borrow audio missing");
      return;
    }

    audio.pause();
    audio.currentTime = 0;

    const playPromise = audio.play();

    if (playPromise !== undefined) {
      await playPromise;
    }

    console.log("📚 Borrow sound played");
  } catch (err) {
    console.log("❌ Borrow sound failed:", err);
  }
};

/* =========================================================
   💬 CHAT NOTIFICATION EFFECT
========================================================= */

useEffect(() => {
  if (!conversations) return;

  const currentMessageIds = new Set(
    conversations.flatMap((c: any) =>
      (c.messages || [])
        .filter(
          (m: any) =>
            m.sender === "user" &&
            c.studentId !== selectedChat?.studentId
        )
        .map(
          (m: any) =>
            m.id || `${c.studentId}-${m.createdAt}-${m.text}`
        )
    )
  );

  // 🟡 first load = baseline only
  if (!isChatInitializedRef.current) {
    prevMessageIdsRef.current = currentMessageIds;
    isChatInitializedRef.current = true;
    return;
  }

  const prev = prevMessageIdsRef.current;

  const newMessages = [...currentMessageIds].filter(
    (id) => !prev.has(id)
  );

  if (newMessages.length > 0) {
    console.log("💬 NEW CHAT MESSAGE");
    playChatSound();
  }

  prevMessageIdsRef.current = currentMessageIds;
}, [conversations, selectedChat]);

/* =========================================================
   📚 BORROW NOTIFICATION EFFECT
========================================================= */

useEffect(() => {
  if (!borrowHistory) return;

  const currentBorrowIds = new Set(
    borrowHistory
      .filter((b: any) => !b.returned && !b.done)
      .map((b: any) => b.transactionNo)
  );

  // 🟡 first load = baseline only
  if (!isBorrowInitializedRef.current) {
    prevBorrowIdsRef.current = currentBorrowIds;
    isBorrowInitializedRef.current = true;
    return;
  }

  const prev = prevBorrowIdsRef.current;

  const newBorrows = [...currentBorrowIds].filter(
    (id) => !prev.has(id)
  );

  if (newBorrows.length > 0) {
    console.log("📚 NEW BORROW REQUEST");
    playBorrowSound();
  }

  prevBorrowIdsRef.current = currentBorrowIds;
}, [borrowHistory]);


          useEffect(() => {
  const user = localStorage.getItem("currentUser");
  if (user) {
    setCurrentUser(user);
  }
}, []);

// Pictures

const uploadImage = async (file: File) => {
  const fileName = `items/${Date.now()}-${file.name}`;

  const { error } = await supabase.storage
    .from("items") // MUST match bucket name
    .upload(fileName, file);

  if (error) throw error;

  const { data } = supabase.storage
    .from("items")
    .getPublicUrl(fileName);

  return data.publicUrl;
};

// File modal

const handlePrint = (file: string) => {
  const win = window.open(`/procedures/${file}`, "_blank");

  if (!win) {
    alert("Popup blocked. Please allow popups.");
    return;
  }

  win.onload = () => {
    win.focus();
    win.print();
  };
};

// messages load

const formatMessageTime = (timestamp: string | number | Date) => {
    const msgDate = new Date(timestamp);
    if (isNaN(msgDate.getTime())) return "";

    const now = new Date();
    const diff = now.getTime() - msgDate.getTime();
    const oneDay = 24 * 60 * 60 * 1000;

    return diff > oneDay
      ? msgDate.toLocaleDateString()
      : msgDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Group messages by student
const groupMessagesByStudent = (messages: any[]): Conversation[] => {
  const grouped: Record<string, Conversation> = {};

  messages.forEach(msg => {
    if (!msg.studentId || !msg.text || !msg.sender) return;

    if (!grouped[msg.studentId]) {
      grouped[msg.studentId] = {
        studentId: msg.studentId,
        studentName: msg.studentName,
        messages: [],
      };
    }

    const newMsg = {
      id: msg.id,
      text: msg.text,
      sender: msg.sender,
      read: msg.read ?? false,
      createdAt: msg.createdAt,
      timestamp: msg.createdAt,
    };

    // ✅ strict dedupe
    const exists = grouped[msg.studentId].messages.some(
      m => m.id === newMsg.id
    );

    if (!exists) {
      grouped[msg.studentId].messages.push(newMsg);
    }
  });

  return Object.values(grouped);
};

  // Load conversations with merge
const loadConversations = async () => {
  try {
    const res = await fetch(`${apiUrl}/chat/all`);
    if (!res.ok) return;

    const data = await res.json();
    const grouped = groupMessagesByStudent(data);

    setConversations(prev =>
      grouped.map(newC => {
        const oldC = prev.find(c => c.studentId === newC.studentId);

        if (!oldC) return newC;

        const mergedMessages = [
          ...oldC.messages,
          ...newC.messages.filter(
            m => !oldC.messages.some(old => old.id === m.id)
          ),
        ];

        return {
          ...newC,
          messages: mergedMessages,
        };
      })
    );

    setSelectedChat(prev => {
      if (!prev) return prev;

      const updated = grouped.find(c => c.studentId === prev.studentId);
      if (!updated) return prev;

      const mergedMessages = [
        ...prev.messages,
        ...updated.messages.filter(
          m => !prev.messages.some(old => old.id === m.id)
        ),
      ];

      return {
        ...updated,
        messages: mergedMessages,
      };
    });

  } catch (err) {
    console.error("Failed to load conversations:", err);
  }
};

  // Poll every 3s
  useEffect(() => {
    loadConversations();
    const interval = setInterval(loadConversations, 3000);
    return () => clearInterval(interval);
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [selectedChat?.messages]);

  // Open chat & mark messages as read
  const openChat = (chat: Conversation) => {
    setConversations(prev =>
      prev.map(c =>
        c.studentId === chat.studentId
          ? {
              ...c,
              messages: c.messages.map(m =>
                m.sender === "user" ? { ...m, read: true } : m
              ),
            }
          : c
      )
    );

    setSelectedChat({
      ...chat,
      messages: chat.messages.map(m =>
        m.sender === "user" ? { ...m, read: true } : m
      ),
    });
  };

  // Send reply
const sendReply = async () => {
  if (!reply.trim() || !selectedChat || isSendingReply) return;

  setIsSendingReply(true);

  const tempReply = reply;
  setReply("");

  try {
    const res = await fetch(`${apiUrl}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentId: selectedChat.studentId,
        studentName: selectedChat.studentName,
        sender: "system",
        text: tempReply,
      }),
    });

    const savedMsg = await res.json();

    const newMsg: Message = {
      id: savedMsg.id,
      text: savedMsg.text,
      sender: savedMsg.sender,
      read: true,
      createdAt: savedMsg.createdAt,
      timestamp: undefined
    };

    setConversations(prev =>
      prev.map(c =>
        c.studentId === selectedChat.studentId
          ? {
              ...c,
              messages: c.messages.some(m => m.id === newMsg.id)
                ? c.messages
                : [...c.messages, newMsg],
            }
          : c
      )
    );

    setSelectedChat(prev =>
      prev
        ? {
            ...prev,
            messages: prev.messages.some(m => m.id === newMsg.id)
              ? prev.messages
              : [...prev.messages, newMsg],
          }
        : null
    );

  } catch (err) {
    console.error("Failed to send message:", err);
  }

  setTimeout(() => setIsSendingReply(false), 300);
};

          //ROOMS 
  const endSession = (id: number) => {
  const updated = roomBookings.map(b =>
    b.id === id ? { ...b, done: true } : b
  );

  setRoomBookings(updated);
  localStorage.setItem("roomBookings", JSON.stringify(updated));
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


useEffect(() => {
  const interval = setInterval(() => {
    const storedBookings = JSON.parse(localStorage.getItem("roomBookings") || "[]");
    const now = new Date();

    const updated = storedBookings.map((b: any) => {
      if (!b.date || !b.end) return b;

      const endTime = new Date(`${b.date}T${b.end}`);

      // 🔥 AUTO MARK DONE WHEN TIME PASSED
      if (now >= endTime && !b.done) {
        return { ...b, done: true };
      }

      return b;
    });

    // Only update if something changed (important)
    const hasChange = JSON.stringify(updated) !== JSON.stringify(storedBookings);

    if (hasChange) {
      localStorage.setItem("roomBookings", JSON.stringify(updated));
      setRoomBookings(updated);
    }
  }, 5000); // every 5 sec

  return () => clearInterval(interval);
}, []);

//ITems

// Receipt & Mark as Done

const confirmDoneBorrow = () => {
  if (!pendingDone) return;

  markAsDone(pendingDone);

  setShowDoneConfirm(false);
  setPendingDone(null);
};

const markAsDone = async (borrow: any) => {
  const transactionNo = borrow.transactionNo;

  if (!transactionNo) {
    console.error("❌ Missing transaction number!");
    alert("Missing transaction number!");
    return;
  }

  await fetch("/reciept", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      transactionNo,
      studentName: borrow.studentName,
      instructorName: borrow.instructorName,
      section: borrow.section,
      email: borrow.email,
      items: borrow.items,
      issuedBy: currentUser,
      status: "APPROVED",
    }),
  });

  const updated = borrowHistory.map((b: any) =>
    b.id === borrow.id
      ? {
          ...b,
          done: true,
          issuedBy: currentUser,
        }
      : b
  );

  setBorrowHistory(updated);
  localStorage.setItem("borrowHistory", JSON.stringify(updated));
};

 

useEffect(() => {
  const interval = setInterval(() => {
    const stored = JSON.parse(localStorage.getItem("borrowHistory") || "[]");
    const now = new Date();

    const updated = stored.map((b: any) => {
      if (b.returned) return b;

      // use selectedDate/Time for deadline
      const borrowDate = b.selectedDate && b.selectedTime
        ? new Date(`${b.selectedDate}T${b.selectedTime}`)
        : new Date(b.date); // fallback for old data

      const deadline = new Date(borrowDate);
      deadline.setHours(21, 0, 0, 0); // 9PM

      if (now > deadline) {
        return { ...b, remarks: "overdue" };
      }

      return b;
    });

    localStorage.setItem("borrowHistory", JSON.stringify(updated));
  }, 60000);

  return () => clearInterval(interval);
}, []);

const formatTime12 = (time24: string) => {
  if (!time24) return ""; // safety check
  const [hoursStr, minutes] = time24.split(":");
  let hours = parseInt(hoursStr, 10);
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
};

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("incidents") || "[]");
        setIncidents(stored);
          }, []);


    // Reload borrow history from localStorage
const prevRawRef = useRef<string>("");

const reloadBorrowHistory = () => {
  if (typeof window === "undefined") return;

  const stored = localStorage.getItem("borrowHistory") || "[]";

  const parsed = JSON.parse(stored);

  setBorrowHistory(parsed);
};

useEffect(() => {
  reloadBorrowHistory();

  const interval = setInterval(() => {
    reloadBorrowHistory();
  }, 3000);

  return () => clearInterval(interval);
}, []);

const declineBorrow = async (reason: string) => {
  if (!pendingDone) return;

  if (!reason.trim()) {
    alert("Please enter a reason.");
    return;
  }

  const transactionNo = pendingDone.transactionNo;

  if (!transactionNo) {
    console.error("❌ Missing transaction number!");
    alert("Missing transaction number!");
    return;
  }

  setIsProcessing(true);

  try {
    await fetch("/reciept", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        transactionNo,
        studentName: pendingDone.studentName,
        instructorName: pendingDone.instructorName,
        section: pendingDone.section,
        email: pendingDone.email,
        items: pendingDone.items,
        issuedBy: currentUser || "Admin",
        remarks: reason,
        status: "DECLINED",
      }),
    });

    const stored = JSON.parse(localStorage.getItem("borrowHistory") || "[]");

    const updated = stored.filter(
      (b: any) => b && b.id !== pendingDone.id
    );

    localStorage.setItem("borrowHistory", JSON.stringify(updated));
    setBorrowHistory(updated);

    setSuccessMessage("Request declined and email sent.");
    setSuccessType("success");
    setShowSuccessModal(true);

    setTimeout(() => {
      setShowSuccessModal(false);
      setShowDeclineModal(false);
      setPendingDone(null);
      setDeclineReason("");
    }, 1500);

  } catch (err) {
    console.error(err);

    setSuccessMessage("Failed to send email.");
    setSuccessType("error");
    setShowSuccessModal(true);

  } finally {
    setIsProcessing(false);
  }
};

useEffect(() => {
  const stored = JSON.parse(localStorage.getItem("borrowHistory") || "[]");

  setBorrowHistory(stored); // ✅ JUST LOAD
}, []);

          // Modal & new item state
          const [isAdding, setIsAdding] = useState(false);
          const [newItem, setNewItem] = useState({
            name: "",
           image: null as File | null,
            level: "1st Level",
            stock: 0,
            variants: [] as Variant[],
            serials: [] as Serial[],
            hasVariants: false,
            hasSerials: false,
          });

          // Load items
const reloadItems = async () => {
  try {
    const res = await fetch("https://dbsupplyrecord-2.onrender.com/items");
    const data = await res.json();

    console.log("RAW API RESPONSE:", data);

    // ✅ FIX: force array extraction
    const itemsArray =
      Array.isArray(data) ? data :
      Array.isArray(data.data) ? data.data :
      Array.isArray(data.items) ? data.items :
      [];

    const safeData = itemsArray.map((item: any) => ({
      id: item.id,
      name: item.name || "Unnamed Item",
      image: item.image || "",
      level: item.level || "1st Level",
      stock: item.stock ?? 0,
      itemType: item.itemType || item.item_type,
      variants: Array.isArray(item.variants) ? item.variants : [],
      serials: Array.isArray(item.serials) ? item.serials : [],
    }));

    setItems(safeData);
  } catch (err) {
    console.error("Failed to load items:", err);
    setItems([]); // prevent crash
  }
};

          useEffect(() => {
          reloadItems();

          const interval = setInterval(() => {
            reloadItems(); // 🔥 auto refresh every 10 sec
          }, 10000);

          return () => clearInterval(interval); // cleanup
        }, []);

          // Filtered items
          const filteredItems = items.filter((item: any) =>
  (item.name || "")
    .toLowerCase()
    .includes(search.toLowerCase())
);

          // Stock control
          const changeStock = async (id: number, type: "add" | "remove") => {
            try {
              await fetch(
                `https://dbsupplyrecord-2.onrender.com/items/${id}/${
                  type === "add" ? "add-stock" : "remove-stock"
                }`,
                { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ amount: 1 }) }
              );
              reloadItems();
            } catch (err) {
              console.error(err);
            }
          };

          // Delete
          const deleteItem = async (id: number, name: string) => {
            if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
            try {
              const res = await fetch(`https://dbsupplyrecord-2.onrender.com/items/${id}`, { method: "DELETE" });
              if (res.ok) reloadItems();
              else alert("Failed to delete item");
            } catch (err) {
              console.error(err);
              alert("Error deleting item");
            }
          };

          // Add new item
const addItem = async () => {
  if (!newItem.name.trim() || !newItem.level.trim()) {
    alert("Please fill all fields");
    return;
  }

  if (!newItem.hasVariants && !newItem.hasSerials && newItem.stock <= 0) {
    alert("Please set stock for normal item");
    return;
  }

  if (newItem.hasVariants && newItem.variants.length === 0) {
    alert("Add at least one variant");
    return;
  }

  if (newItem.hasSerials && newItem.serials.length === 0) {
    alert("Add at least one serial number");
    return;
  }

  try {
    let imageUrl = "";

    // ✅ 1. Upload image to Supabase FIRST (if file exists)
    if (newItem.image) {
      imageUrl = await uploadImage(newItem.image); 
      // uploadImage() returns public URL from Supabase
    }

    // ✅ 2. Send only URL to backend (MySQL)
    const itemData = {
      name: newItem.name || "Unnamed Item",
      image: imageUrl, // 👈 FIXED (URL, not file)
      level: newItem.level || "1st Level",
     itemType:
  newItem.hasSerials || newItem.hasVariants
    ? "non_consumable"
    : "consumable",
      stock: newItem.hasVariants || newItem.hasSerials ? 0 : newItem.stock,
      variants: newItem.hasVariants ? newItem.variants : [],
      serials: newItem.hasSerials ? newItem.serials : [],
    };

    const res = await fetch("https://dbsupplyrecord-2.onrender.com/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(itemData),
    });

    if (res.ok) {
      alert("Item added successfully!");
      setIsAdding(false);

      setNewItem({
        name: "",
        image: null, // ✅ FIX (was "" before)
        level: "1st Level",
        stock: 0,
        variants: [],
        serials: [],
        hasVariants: false,
        hasSerials: false,
      });

      reloadItems();
    } else {
      alert("Failed to add item");
    }
  } catch (err) {
    console.error(err);
    alert("Error adding item");
  }
};
          

          // Add variant or serial
          const addVariant = () => setNewItem(prev => ({ ...prev, variants: [...prev.variants, { type: "", stock: 1 }] }));
          const addSerial = () => setNewItem(prev => ({ ...prev, serials: [...prev.serials, { serial: "" }] }));

          const thStyle = {
  padding: 14,
  textAlign: "center" as const,
  fontSize: 13,
  letterSpacing: 0.5,
};

const tdCenter = {
  padding: 14,
  textAlign: "center" as const,
  fontSize: 14,
};

const getMonthlyStats = () => {
  const stats: Record<string, any> = {};

  borrowHistory.forEach((b) => {
    const date = new Date(b.date);
    const monthKey = date.toLocaleString("default", {
      month: "short",
      year: "numeric",
    }); // e.g. "Sep 2025"

    if (!stats[monthKey]) {
      stats[monthKey] = {
        total: 0,
        returned: 0,
        issue: 0,
        missing: 0,
      };
    }

    stats[monthKey].total++;

    if (b.returned) stats[monthKey].returned++;

    if (b.remarks === "issue") stats[monthKey].issue++;
    if (b.remarks === "missing") stats[monthKey].missing++;
  });

  return stats;
};

const chartData = Object.entries(getMonthlyStats())
  .map(([month, data]) => ({
    month,
    total: data.total,
    issue: data.issue,
    missing: data.missing,
  }))
  .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

const totalStats = borrowHistory.reduce(
  (acc, b) => {
    acc.total++;
    if (b.returned) acc.returned++;
    if (b.remarks === "issue") acc.issue++;
    if (b.remarks === "missing") acc.missing++;
    return acc;
  },
  { total: 0, returned: 0, issue: 0, missing: 0 }
);

const today = new Date().toLocaleDateString(undefined, {
  year: "numeric",
  month: "long",
  day: "numeric",
});

const getMonthlyIncidents = () => {
  const incidents = JSON.parse(localStorage.getItem("incidents") || "[]");

  const grouped: Record<string, any[]> = {};

  incidents.forEach((inc: any) => {
    const d = new Date(inc.date);
    const month = d.toLocaleString("default", { month: "long", year: "numeric" });

    if (!grouped[month]) grouped[month] = [];

    grouped[month].push(inc);
  });

  return grouped;
};

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  marginBottom: 10,
  borderRadius: 8,
  border: "1px solid #ddd",
  fontSize: 14
};

const rowStyle = {
  display: "flex",
  gap: 8,
  marginBottom: 8,
  alignItems: "center"
};

const checkboxStyle = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  fontSize: 14
};

const primaryBtn = {
  background: "#16a34a",
  color: "white",
  padding: "10px 16px",
  borderRadius: 8,
  border: "none",
  fontWeight: 500,
  cursor: "pointer"
};

const primaryBtnSmall = {
  ...primaryBtn,
  padding: "6px 10px",
  fontSize: 13,
  marginTop: 5
};

const secondaryBtn = {
  background: "#e5e7eb",
  color: "#111",
  padding: "10px 16px",
  borderRadius: 8,
  border: "none",
  cursor: "pointer"
};

const deleteBtn = {
  background: "#ef4444",
  color: "white",
  border: "none",
  borderRadius: 6,
  padding: "4px 8px",
  cursor: "pointer"
};

const actionBtn = (bg: string) => ({
  background: bg,
  border: "none",
  width: 32,
  height: 32,
  borderRadius: 8,
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "0.2s"
});

const consumableItems = filteredItems.filter(
  (item) => item.itemType?.toLowerCase() === "consumable"
);

const nonConsumableItems = filteredItems.filter(
  (item) => item.itemType?.toLowerCase() === "non_consumable"
);

const totalItems = filteredItems.length;
const totalConsumables = consumableItems.length;
const totalNonConsumables = nonConsumableItems.length;

        const SectionHeader = ({ title, count, color }: { title: string; count: number; color: string }) => (
          <h3 style={{
            fontSize: 20,
            fontWeight: "bold",
            color,
            marginBottom: 10,
            marginTop: 30
          }}>
            {title}
            <span style={{
                fontSize: 12,
                background: "#16a34a",
                color: "white",
                padding: "5px 16px",
                borderRadius: 20,
                marginLeft: 10,
                fontWeight: "bold"
            }}>
              ({count} items)
            </span>
          </h3>
        );

        const renderTable = (items: any[]) => (
        <div
            style={{
              background: "#ffffff",
              borderRadius: 12, // match top
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)", // lighter like top
              overflow: "hidden",
              marginBottom: 30, // more spacing between sections
              border: "1px solid #f1f5f9"
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                tableLayout: "fixed"
              }}
            >
              {/* HEADER */}
              <thead>
                <tr
                  style={{
                    background: "#2e5d40",
                    textAlign: "left",
                    fontSize: 12,
                    color: "#f2fff4",
                    textTransform: "uppercase",
                    letterSpacing: 0.5
                  }}
                >
        <th style={{ padding: "12px 16px", width: "10%" }}>ID</th>
        <th style={{ padding: "12px 16px", width: "40%" }}>Item</th>
        <th style={{ padding: "12px 16px", width: "15%", textAlign: "center" }}>Stock</th>
        <th style={{ padding: "12px 16px", width: "15%", textAlign: "center" }}>Level</th>
        <th style={{ padding: "12px 16px", width: "20%", textAlign: "center" }}>Actions</th>
                </tr>
              </thead>

              {/* BODY */}
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: 20 }}>
                      No items found
                    </td>
                  </tr>
                ) : (
                  items.map((item, index) => {
                    const isLow = item.stock <= 5;

                    return (
                      <tr
          key={item.id}
          style={{
            borderTop: "1px solid #f1f5f9",
            background: "#ffffff",
            height: 60
          }}
          onMouseEnter={e =>
            (e.currentTarget.style.background = "#f3f4f6")
          }
          onMouseLeave={e =>
            (e.currentTarget.style.background = "#ffffff")
          }
        >
                        {/* ID */}
                        <td style={{ padding: 14, fontWeight: 500 }}>
                          #{item.id}
                        </td>

                        {/* NAME */}
                        <td style={{ padding: 14 }}>
                          <div style={{ fontWeight: 600 }}>{item.name}</div>
                        </td>

                  {/* STOCK */}
        <td style={{ padding: 14, textAlign: "center", verticalAlign: "middle" }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <span
              style={{
                padding: "6px 10px",
                borderRadius: 20,
                fontSize: 12,
                fontWeight: "bold",
                background: isLow ? "#fee2e2" : "#dcfce7",
                color: isLow ? "#b91c1c" : "#166534",
                minWidth: 60, // 👈 keeps size consistent
                textAlign: "center"
              }}
            >
              {item.variants?.length > 0
                ? item.variants.map((v: { type: any; stock: any; }) => `${v.type} x${v.stock}`).join(", ")
                : item.serials?.length > 0
                ? item.serials.map((s: { serial: any; }) => s.serial).join(", ")
                : item.stock}
            </span>
          </div>
        </td>

                {/* LEVEL */}
                <td style={{ padding: 14, textAlign: "center",verticalAlign: "middle" }}>
                  <span
                    style={{
                      fontSize: 12,
                      padding: "4px 10px",
                      borderRadius: 20,
                      background: "#e0f2fe",
                      color: "#0369a1",
                      fontWeight: 600
                    }}
                  >
                    {item.level}
                  </span>
                </td>

                {/* ACTIONS */}
                <td style={{ padding: 14 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: 8
                    }}
                  >
                    {/* REMOVE */}
                    <button
                      onClick={() => changeStock(item.id, "remove")}
                      style={actionBtn("#ef4444")}
                    >
                      −
                    </button>

                    {/* ADD */}
                    <button
                      onClick={() => changeStock(item.id, "add")}
                      style={actionBtn("#22c55e")}
                    >
                      +
                    </button>

                    {/* DELETE */}
                    <button
                      onClick={() => deleteItem(item.id, item.name)}
                      style={actionBtn("#111827")}
                    >
                      🗑
                    </button>
                  </div>
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  </div>
);

          return (
            <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Arial" }}>
              {/* Sidebar */}
              <div style={{ width: 220, background: "#2e5d40", color: "white", padding: 20, position: "fixed", top: 0, left: 0, height: "100vh" }}>
                <h1 style={{ marginBottom: 20 }}>Admin Dashboard</h1>
                <div onClick={() => setPage("items")} style={{ padding: 10, borderRadius: 8, cursor: "pointer", marginBottom: 10, background: page === "items" ? "#22c55e" : "transparent" }}>Items</div>
                <div onClick={() => setPage("history")} style={{ padding: 10, borderRadius: 8, cursor: "pointer", background: page === "history" ? "#22c55e" : "transparent" }}>Borrow History</div>
                <div onClick={() => setPage("rooms")} style={{ padding: 10, borderRadius: 8, cursor: "pointer", marginBottom: 10, background: page === "rooms" ? "#22c55e" : "transparent" }}>Rooms</div>
                <div onClick={() => setPage("messages")} style={{padding: 10, borderRadius: 8, cursor: "pointer", marginBottom: 10, background: page === "messages" ? "#22c55e" : "transparent" }} > Messages </div>
                <div onClick={() => setPage("reports")} style={{padding: 10, borderRadius: 8, cursor: "pointer", marginBottom: 10, background: page === "reports" ? "#22c55e" : "transparent" }} > Reports </div>
              </div>

              {/* Main content */}
              <div style={{ marginLeft: 220, flex: 1, padding: 30 }}>
                <h2 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>Electronic Supply Records</h2>

                {/* Top Buttons */}
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginBottom: 5 }}>
                  <motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  onClick={() => {
    localStorage.removeItem("currentUser"); // ✅ remove saved account
    router.push("/"); // redirect to home
  }}
  style={{
    padding: "8px 16px",
    borderRadius: 8,
    border: "none",
    background: "#ef4444",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  }}
>
  ← Logout
</motion.button>
                  {page === "items" &&
                   (<button onClick={() => setIsAdding(true)} style={{ background: "#2563eb", color: "white", padding: "10px 16px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: "bold" }}>Add New Item</button>
                )} </div>

                {/* Add Modal */}
                {isAdding && (
  <div style={{
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000
  }}>
    <div style={{
      background: "#fff",
      padding: 24,
      borderRadius: 16,
      width: 420,
      maxHeight: "90vh",
      overflowY: "auto",
      boxShadow: "0 20px 50px rgba(0,0,0,0.25)"
    }}>
      
      {/* Header */}
      <h2 style={{
        marginBottom: 20,
        fontWeight: 600,
        fontSize: 20
      }}>
        Add New Item
      </h2>

      {/* Name */}
      <input
        type="text"
        placeholder="Item Name"
        value={newItem.name}
        onChange={e => setNewItem(prev => ({ ...prev, name: e.target.value }))}
        style={inputStyle}
      />

      <input
  type="file"
  accept="image/*"
  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setNewItem(prev => ({
      ...prev,
      image: file,
    }));
  }}
  style={inputStyle}
/>



      {/* Level */}
      <select
        value={newItem.level}
        onChange={e => setNewItem(prev => ({ ...prev, level: e.target.value }))}
        style={inputStyle}
      >
        <option value="1st Level">1st Level</option>
        <option value="2nd Level">2nd Level</option>
        <option value="3rd Level">3rd Level</option>
        <option value="4th Level">4th Level</option>
        <option value="Others">Others</option>
      </select>

      <select
  value={newItem.hasSerials ? "non_consumable" : "consumable"}
  onChange={(e) => {
    const type = e.target.value;

    setNewItem((prev) => ({
      ...prev,
      hasSerials: type === "non_consumable",
      hasVariants: false,
      variants: [],
      serials: [],
      stock: 0,
    }));
  }}
  style={inputStyle}
>
  <option value="consumable">Consumable</option>
  <option value="non_consumable">Non-Consumable</option>
</select>

      {/* Toggles */}
      <div style={{ margin: "15px 0", display: "flex", gap: 15 }}>
        <label style={checkboxStyle}>
          <input
            type="checkbox"
            checked={newItem.hasVariants}
            disabled={newItem.hasSerials}
            onChange={e => setNewItem(prev => ({
              ...prev,
              hasVariants: e.target.checked,
              hasSerials: false,
              variants: [],
              serials: []
            }))}
          />
          Variants
        </label>

        <label style={checkboxStyle}>
          <input
            type="checkbox"
            checked={newItem.hasSerials}
            disabled={newItem.hasVariants}
            onChange={e => setNewItem(prev => ({
              ...prev,
              hasSerials: e.target.checked,
              hasVariants: false,
              variants: [],
              serials: []
            }))}
          />
          Serials
        </label>
      </div>

      {/* Stock */}
      {!newItem.hasVariants && !newItem.hasSerials && (
        <input
          type="number"
          placeholder="Stock"
          value={newItem.stock}
          min={0}
          onChange={e => setNewItem(prev => ({
            ...prev,
            stock: Number(e.target.value)
          }))}
          style={inputStyle}
        />
      )}

      {/* Variants */}
      {newItem.hasVariants && (
        <div>
          {newItem.variants.map((v, i) => (
            <div key={i} style={rowStyle}>
              <input
                placeholder="Type"
                value={v.type}
                onChange={e => {
                  const copy = [...newItem.variants];
                  copy[i].type = e.target.value;
                  setNewItem(prev => ({ ...prev, variants: copy }));
                }}
                style={{ ...inputStyle, flex: 2 }}
              />
              <input
                type="number"
                value={v.stock}
                min={1}
                onChange={e => {
                  const copy = [...newItem.variants];
                  copy[i].stock = Number(e.target.value);
                  setNewItem(prev => ({ ...prev, variants: copy }));
                }}
                style={{ ...inputStyle, flex: 1 }}
              />
              <button
                onClick={() => {
                  const copy = [...newItem.variants];
                  copy.splice(i, 1);
                  setNewItem(prev => ({ ...prev, variants: copy }));
                }}
                style={deleteBtn}
              >
                ✕
              </button>
            </div>
          ))}
          <button onClick={addVariant} style={primaryBtnSmall}>
            + Add Variant
          </button>
        </div>
      )}

      {/* Serials */}
      {newItem.hasSerials && (
        <div>
          {newItem.serials.map((s, i) => (
            <div key={i} style={rowStyle}>
              <input
                placeholder="Serial Code"
                value={s.serial}
                onChange={e => {
                  const copy = [...newItem.serials];
                  copy[i].serial = e.target.value;
                  setNewItem(prev => ({ ...prev, serials: copy }));
                }}
                style={inputStyle}
              />
              <button
                onClick={() => {
                  const copy = [...newItem.serials];
                  copy.splice(i, 1);
                  setNewItem(prev => ({ ...prev, serials: copy }));
                }}
                style={deleteBtn}
              >
                ✕
              </button>
            </div>
          ))}
          <button onClick={addSerial} style={primaryBtnSmall}>
            + Add Serial
          </button>
        </div>
      )}

      {/* Footer */}
      <div style={{
        display: "flex",
        justifyContent: "flex-end",
        gap: 10,
        marginTop: 20
      }}>
        <button
          onClick={() => setIsAdding(false)}
          style={secondaryBtn}
        >
          Cancel
        </button>

        <button
          onClick={addItem}
          style={primaryBtn}
        >
          Save Item
        </button>
      </div>
    </div>
  </div>
)}



{page === "items" && (
  <div style={{ width: "100%" }}>
    
    {/* HEADER */}
    <div style={{
      marginBottom: 20,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 10
    }}>
      <h2 style={{
  fontSize: 22,
  fontWeight: "bold",
  color: "#111827",
  marginBottom: 20
}}>

  Supplies 
  <span style={{
        fontSize: 12,
        background: "#111827",
        color: "white",
        padding: "5px 16px",
        borderRadius: 20,
        marginLeft: 10,
        fontWeight: "bold"
  }}>
    ({totalItems} total)
  </span>
</h2>
    </div>

    {/* SEARCH */}
    <input
      type="text"
      placeholder="Search item..."
      value={search}
      onChange={e => setSearch(e.target.value)}
      style={{
        padding: 14,
        borderRadius: 12,
        border: "1px solid #ddd",
        marginBottom: 25,
        width: "100%",
        fontSize: 16
      }}
    />

    {/* CONSUMABLES */}
    <SectionHeader
      title="Consumables"
      count={totalConsumables}
      color="#16a34a"
    />
    {renderTable(consumableItems)}

    {/* NON-CONSUMABLES */}
    <SectionHeader
      title="Non-Consumables"
      count={totalNonConsumables}
      color="#2563eb"
    />
    {renderTable(nonConsumableItems)}

  </div>
)}


{page === "history" && (
  <>
  <div id="print-area">
<div
  style={{
    marginTop: 5,
    borderRadius: 16,
    background: "#fffefe",
    padding: 10
  }}
>

  {/* ROW 1: BUTTONS ONLY */}
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}
  >
    <button
      onClick={() => setShowFileModal(true)}
      style={{
        padding: "8px 14px",
        background: "#10b981",
        color: "white",
        border: "none",
        borderRadius: 6,
        fontWeight: "bold",
        cursor: "pointer"
      }}
    >
      📄 Print a Procedure File
    </button>

    <button
      onClick={() => window.print()}
      style={{
        padding: "8px 14px",
        background: "#2563eb",
        color: "white",
        border: "none",
        borderRadius: 6,
        fontWeight: "bold",
        cursor: "pointer"
      }}
    >
      🖨 Print All
    </button>
  </div>

  {/* ROW 2: TITLE ONLY */}
  <div style={{ marginTop: 10 }}>
    <h3
      style={{
        margin: 0,
        fontSize: 22,
        fontWeight: 700,
        color: "#111827",
        display: "flex",
        alignItems: "center",
        gap: 8
      }}
    >
      🟡 Active Borrowed
      <span
        style={{
          fontSize: 12,
          background: "#fef3c7",
          color: "#92400e",
          padding: "3px 10px",
          borderRadius: 999
        }}
      >
        {activeBorrows.length} Active
      </span>
    </h3>
  </div>

</div>

    <table style={{
      width: "100%",
      marginTop: 10,
      borderCollapse: "collapse",
      background: "white",
      borderRadius: 12,
      overflow: "hidden",
      boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
      
    }}>
      <thead style={{
  background: "#166534",
  color: "white",
  fontSize: 12,
  textTransform: "uppercase",
  letterSpacing: 0.5
}}>
        <tr>
          <th style={{ padding: 10 }}>Transaction ID</th>
          <th style={{ padding: 10 }}>Instructor</th>
          <th style={{ padding: 10 }}>Student</th>
          <th style={{ padding: 10 }}>Section</th>
          <th style={{ padding: 10 }}>Items</th>
          <th style={{ padding: 10 }}>Date Issued</th>
          <th style={{ padding: 10 }}>Status</th>
          <th style={{ padding: 10 }}>Issued By</th>
          <th style={{ padding: 10 }}>Action</th>
        </tr>
      </thead>

      <tbody>
        {activeBorrows.length === 0 ? (
          <tr>
            <td colSpan={6} style={{ textAlign: "center", padding: 20 }}>
              No active borrows
            </td>
          </tr>
        ) : (
          activeBorrows.reverse().map((b, i) => (
            <tr key={i}>
              <td style={{ padding: 10, fontWeight: "bold", color: "#2563eb" }}>
  {b.transactionNo || "—"}
</td>
              <td style={{ padding: 10 }}>{b.instructorName}</td>
              <td style={{ padding: 10 }}>{b.studentName}</td>
              <td style={{ padding: 10 }}>{b.section}</td>

              <td style={{ padding: 10 }}>
  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
    {b.items?.map((item: any, idx: number) => (
      <span key={idx} style={{
        background: "#e0f2fe",
        color: "#0369a1",
        padding: "4px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 500
      }}>
        {item.name} ×{item.qty}
      </span>
    ))}
  </div>
</td>

              <td style={{ padding: 10 }}>
                                <div style={{ fontSize: 13 }}>
                  <div>{b.selectedDate}</div>
                  <div style={{ color: "#6b7280", fontSize: 12 }}>
                   {formatTime12(b.selectedTime)}
                  </div>
                </div>
              </td>
              <td style={{ textAlign: "center" }}>
  <span
    style={{
      padding: "4px 10px",
      borderRadius: 999,
      fontSize: 12,
      fontWeight: 600,
      background:
        !b.done
          ? "#fef3c7"      // 🟡 Pending
          : b.remarks === "overdue"
          ? "#fee2e2"      // 🔴 Overdue
          : "#dbeafe",     // 🔵 Borrowed
      color:
        !b.done
          ? "#92400e"
          : b.remarks === "overdue"
          ? "#991b1b"
          : "#1e40af",
    }}
  >
    {!b.done
      ? "Pending"
      : b.remarks === "overdue"
      ? "Overdue"
      : "Borrowed"}
  </span>
</td>
              <td style={{ textAlign: "center" }}>
                    <span style={{
                      background: "#eef2ff",
                      color: "#3730a3",
                      padding: "4px 10px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 500
                    }}>
                      {b.issuedBy || "N/A"}
                    </span>
               </td>

              <td style={{
                  padding: "6px 14px",
                  background: "white",
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  fontWeight: 600,
                  cursor: "pointer",
                  boxShadow: "0 4px 10px rgba(252, 252, 252, 0.3)",
                  transition: "0.2s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
              >
                {!b.done ? (
    // 🔵 SHOW DONE BUTTON FIRST
    <button
      onClick={() => {
            setPendingDone(b);
            setShowDoneConfirm(true);
          }}
      style={{
        padding: "6px 12px",
        background: "#22c55e",
        color: "white",
        border: "none",
        borderRadius: 6,
        cursor: "pointer",
      }}
    >
      Done
    </button>
  ) : (
    // 🟢 AFTER DONE → SHOW RETURN BUTTON
    <button
      onClick={() => {
        setSelectedReturn(b);
        setShowReturnModal(true);

        const init: Record<string, boolean> = {};
        b.items.forEach((item: any) => {
          init[item.name] = false;
        });

        setCheckedItems(init);
        setIssueItems({});
        setIncidentNote("");
      }}
      style={{
        padding: "6px 12px",
        background: "#2563eb",
        color: "white",
        border: "none",
        borderRadius: 6,
        cursor: "pointer",
      }}
    >
      Return
    </button>
  )}
</td>
            </tr>
          ))
        )}
      </tbody>
    </table>


            <h3 style={{
          marginTop: 10,
          fontSize: 22,
          fontWeight: 700,
          color: "#111827",
          display: "flex",
          alignItems: "center",
          gap: 8
        }}>
          🟢 Returned Items
          <span style={{
            fontSize: 13,
            background: "#fef3c7",
            color: "#92400e",
            padding: "3px 10px",
            borderRadius: 999
          }}>
    {returnedBorrows.length} Returned
  </span>
</h3>

   <table style={{
      width: "100%",
      marginTop: 10,
      borderCollapse: "collapse",
      background: "white",
      borderRadius: 12,
      overflow: "hidden",
      boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
      
    }}>
      <thead style={{
  background: "#166534",
  color: "white",
  fontSize: 12,
  textTransform: "uppercase",
  letterSpacing: 0.5
}}>
        <tr>
          <th style={{ padding: 10 }}>Transaction ID</th>
          <th style={{ padding: 10 }}>Instructor</th>
          <th style={{ padding: 10 }}>Student</th>
          <th style={{ padding: 10 }}>Section</th>
          <th style={{ padding: 10 }}>Items</th>
          <th style={{ padding: 10 }}>Date Issued</th>
          <th style={{ padding: 10 }}>Date Returned</th>
          <th style={{ padding: 10 }}>Issued By</th>
          <th style={{ padding: 10 }}>Returned By</th>
          <th style={{ padding: 10 }}>Remarks</th>
        </tr>
      </thead>

      <tbody>
        {returnedBorrows.length === 0 ? (
          <tr>
            <td colSpan={5} style={{ textAlign: "center", padding: 20 }}>
              No returned items yet
            </td>
          </tr>
        ) : (
          returnedBorrows.reverse().map((b, i) => (
           <tr
  key={i}
  style={{
    transition: "0.2s",
    borderBottom: "1px solid #f1f5f9"
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.background = "#f0fdf4";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.background = "white";
  }}
>
  <td style={{ padding: 10, fontWeight: "bold", color: "#16a34a" }}>
  {b.transactionNo || "—"}
</td>
              <td style={{ padding: 10 }}>{b.instructorName}</td>
              <td style={{ padding: 10 }}>{b.studentName}</td>
              <td style={{ padding: 10 }}>{b.section}</td>

              {/* 🔥 ITEMS WITH ISSUE PER ITEM */}
              <td style={{ padding: 10 }}>
                {b.items?.map((item: any, idx: number) => {
                  const incidents = JSON.parse(localStorage.getItem("incidents") || "[]");

                  const incident = incidents.find(
                    (inc: any) =>
                      inc.borrowId === b.date &&
                      inc.items.includes(item.name)
                  );

                  return (
                    <span key={idx} style={{ marginRight: 8 }}>
                      {incident ? (
                        <span
                          onClick={() => {
                            setSelectedReturn({
                              ...b,
                              incident: {
                                ...incident,
                                items: [item.name],
                              },
                            });
                            setShowReturnModal(true);
                          }}
                          style={{
                            color: "#dc2626",
                            fontWeight: "bold",
                            cursor: "pointer",
                            textDecoration: "underline",
                          }}
                        >
                          ⚠️ {item.name} x{item.qty}
                        </span>
                      ) : (
                        <span>
                          {item.name} x{item.qty}
                        </span>
                      )}
                    </span>
                  );
                })}
              </td>
              
              <td style={{ padding: 10 }}>
                                <div style={{ fontSize: 13 }}>
                  <div>{b.selectedDate}</div>
                  <div style={{ color: "#6b7280", fontSize: 12 }}>
                   {formatTime12(b.selectedTime)}
                  </div>
                </div>
              </td>

               <td style={{ textAlign: "center" }}>
                                <div style={{ fontSize: 13 }}>
                  <div>{new Date(b.date).toLocaleDateString()}</div>
                  <div style={{ color: "#6b7280", fontSize: 12 }}>
                    {new Date(b.date).toLocaleTimeString()}
                  </div>
                </div>
              </td>
                <td style={{ textAlign: "center" }}>
                    <span style={{
                      background: "#eef2ff",
                      color: "#3730a3",
                      padding: "4px 10px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 500
                    }}>
                      {b.issuedBy || "N/A"}
                    </span>
               </td>
              <td style={{ textAlign: "center" }} >
                 <span style={{
                      background: "#eef2ff",
                      color: "#3730a3",
                      padding: "4px 10px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 500
                    }}>
                      {b.returnedBy || "N/A"}
                    </span>
                
                </td>

<td style={{ padding: 10 }}>
  <span
    style={{
      padding: "4px 10px",
      borderRadius: 999,
      fontSize: 12,
      fontWeight: 600,
      background:
        b.remarks === "complete"
          ? "#dcfce7"
          : b.remarks === "issue"
          ? "#fef3c7"
          : b.remarks === "missing"
          ? "#fee2e2"
          : "#dbeafe",
      color:
        b.remarks === "complete"
          ? "#166534"
          : b.remarks === "issue"
          ? "#92400e"
          : b.remarks === "missing"
          ? "#991b1b"
          : "#1e40af",
    }}
  >
    {b.remarks === "complete"
      ? "✅ Complete"
      : b.remarks === "issue"
      ? "⚠️ Has Issue"
      : b.remarks === "missing"
      ? "❌ Missing"
      : "🟡 Borrowed"}
  </span>
</td>
            </tr>
          ))
        )}
      </tbody>
    </table>

    {/* 🔥 MODAL (RETURN + ISSUE VIEW) */}
    {showReturnModal && selectedReturn && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.6)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 999,
      backdropFilter: "blur(4px)",
    }}
  >
    <motion.div
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      style={{
        background: "#fff",
        borderRadius: 16,
        width: 500,
        maxHeight: "80vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          background: selectedReturn.incident ? "#dc2626" : "#2563eb",
          color: "white",
          padding: "16px 24px",
          fontWeight: 700,
          fontSize: 20,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>
          {selectedReturn.incident ? "⚠️ Issue Details" : "Return Items"}
        </span>
        <button
          onClick={() => {
            setShowReturnModal(false);
            setSelectedReturn(null);
          }}
          style={{
            background: "transparent",
            border: "none",
            color: "white",
            fontSize: 22,
            cursor: "pointer",
          }}
        >
          ×
        </button>
      </div>

      {/* BODY */}
      <div
        style={{
          padding: 20,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 15,
        }}
      >

        {/* ISSUE VIEW MODE */}
        {selectedReturn.incident ? (
          <>
            <p><strong>Item(s):</strong></p>
            <ul>
              {selectedReturn.incident.items.map((item: string, i: number) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
            <p><strong>Description:</strong></p>
            <p>{selectedReturn.incident.note || "No description provided"}</p>
          </>
        ) : (
 selectedReturn.items.filter((item: any) => {
  const type = String(item.itemType || item.item_type || "")
    .toLowerCase()
    .trim();

    // ❌ hide consumables
    if (type === "consumable") return false;

    // ✅ show everything else (non-consumable)
    return true;
    
  })

  
          .map((item: any) => (
            <div
                key={item.name}
                style={{
                  padding: 16,
                  borderRadius: 12,
                  background: checkedItems[item.name] ? "#ecfdf5" : "#f9fafb",
                  border: checkedItems[item.name]
                    ? "2px solid #22c55e"
                    : "1px solid #e5e7eb",
                  transition: "0.2s",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
              <div style={{ fontWeight: 600 }}>{item.name} (x{item.qty})</div>

              <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="checkbox"
                  checked={checkedItems[item.name] || false}
                  onChange={(e) =>
                    setCheckedItems(prev => ({ ...prev, [item.name]: e.target.checked }))
                  }
                />
                Returned
              </label>

              {checkedItems[item.name] && (
                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={issueItems[item.name] || false}
                    onChange={(e) =>
                      setIssueItems(prev => ({ ...prev, [item.name]: e.target.checked }))
                    }
                  />
                  ⚠️ Has Issue
                </label>
              )}
            </div>
          ))
        )}

        {/* INCIDENT NOTE */}
        {!selectedReturn.incident && Object.values(issueItems).some(Boolean) && (
          <textarea
              placeholder="Describe the issue in detail..."
              value={incidentNote}
              onChange={(e) => setIncidentNote(e.target.value)}
              style={{
                width: "100%",
                marginTop: 10,
                padding: 16,
                borderRadius: 12,
                border: "1px solid #d1d5db",
                minHeight: 110,
                resize: "vertical",
                background: "#fff",
                boxShadow: "inset 0 1px 3px rgba(0,0,0,0.05)"
              }}
            />
        )}
      </div>

      
      {/* Remarks */}
{/* 🔴 VIEW MODE (Issue Details / Returned Item) */}
{selectedReturn.incident ? (
  <div
    style={{
      padding: "0 20px 20px 20px",
      display: "flex",
      flexDirection: "column",
      gap: 12,
    }}
  >
    <div>
      <label style={{ fontWeight: 600 }}>Remarks:</label>
      <p style={{ marginTop: 4 }}>
        ⚠️ {selectedReturn.remarks || "Has Issue"}
      </p>
    </div>

    <div>
      <label style={{ fontWeight: 600 }}>Processed By:</label>
      <p style={{ marginTop: 4 }}>
        {selectedReturn.processedBy || "-"}
      </p>
    </div>
  </div>
) : (
  /* 🟢 EDIT MODE (Return Items) */
  <div
    style={{
      padding: "0 20px 20px 20px",
      display: "flex",
      flexDirection: "column",
      gap: 12,
    }}
  >
    {/* Remarks */}
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontWeight: 600 }}>Remarks:</label>
      <select
        value={remarks}
        onChange={(e) => setRemarks(e.target.value)}
        style={{
          width: "100%",
          padding: 10,
          borderRadius: 8,
          border: "1px solid #ccc",
        }}
      >
        <option value="">Select Remarks</option>
        <option value="complete">✅ Complete</option>
        <option value="issue">⚠️ Has Issue</option>
        <option value="missing">❌ Missing</option>
      </select>
    </div>

    {/* Processed By */}
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontWeight: 600 }}>Processed By:</label>
      <input
  type="text"
  value={currentUser}
  disabled
  style={{
    width: "100%",
    padding: 10,
    borderRadius: 8,
    border: "1px solid #ccc",
    background: "#f3f4f6",
  }}
/>
    </div>
  </div>
)}

      {/* FOOTER */}
      {!selectedReturn.incident && (
        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid #e5e7eb",
            display: "flex",
            justifyContent: "flex-end",
            gap: 12,
            background: "#f9fafb",
          }}
        >
          <button
            onClick={() => {
              setShowReturnModal(false);
              setSelectedReturn(null);
            }}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: "none",
              background: "#9ca3af",
              color: "white",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>

          <button
            onClick={() => {
              // Save incident if any
              if (Object.values(issueItems).some(Boolean)) {
                const incidents = JSON.parse(localStorage.getItem("incidents") || "[]");
                incidents.push({
                  borrowId: selectedReturn.date,
                  student: selectedReturn.studentName,
                  items: Object.keys(issueItems).filter(i => issueItems[i]),
                  note: incidentNote,
                  date: new Date().toISOString(),
                   issuedBy: currentUser,
                });
                localStorage.setItem("incidents", JSON.stringify(incidents));
              }

              // Mark as returned
              const updatedHistory = borrowHistory.map(h =>
              h.transactionNo === selectedReturn.transactionNo
                ? {
                    ...h,
                    returned: true,
                    returnedBy: currentUser,
                    processedBy: currentUser,
                    remarks,
                    returnedDate: new Date().toISOString(),
                  }
                : h
            );

              setBorrowHistory(updatedHistory);
              localStorage.setItem("borrowHistory", JSON.stringify(updatedHistory));

              setShowReturnModal(false);
              setSelectedReturn(null);
            }}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: "none",
              background: "#16a34a",
              color: "white",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Confirm Return
          </button>
        </div>
      )}
    </motion.div>
  </div>
)}
</div>
  </>
)}
{showDoneConfirm && pendingDone && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.6)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
      backdropFilter: "blur(4px)",
    }}
  >
    <motion.div
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      style={{
        background: "#fff",
        borderRadius: 16,
        width: 380,
        padding: 24,
        textAlign: "center",
        boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
      }}
    >
      <div style={{ fontSize: 40 }}>⚠️</div>

      <h3 style={{ fontSize: 18, fontWeight: "bold", marginTop: 10 }}>
        VERIFY BORROW
      </h3>

      <p style={{ fontSize: 14, color: "#6b7280", marginTop: 8 }}>
        Are you sure you want to Confirm the Request?
      </p>

      <div
        style={{
          marginTop: 12,
          background: "#f9fafb",
          padding: 10,
          borderRadius: 8,
          fontSize: 13,
        }}
      >
        <div><b>Student:</b> {pendingDone.studentName}</div>
        <div><b>Items:</b> {pendingDone.items?.length}</div>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
  {/* Cancel button */}
  <button
    onClick={() => {
      setShowDoneConfirm(false);
      setPendingDone(null);
    }}
    style={{
      flex: 1,
      padding: "8px",
      background: "#9ca3af",
      color: "white",
      border: "none",
      borderRadius: 6,
      cursor: "pointer",
      fontWeight: "bold",
    }}
  >
    Cancel
  </button>

    {/* Decline button */}
<button
  onClick={() => {
    setShowDeclineModal(true);
  }}
  style={{
    flex: 1,
    padding: "8px",
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: "bold",
  }}
>
  ❌ Decline
</button>

  {/* Done button */}
  <button
 onClick={async () => {
  setShowDoneConfirm(false);
  setIsProcessingDone(true);

  try {
    // ✅ mark as done
    await confirmDoneBorrow();

    
    await markAsDone(pendingDone);

    setIsProcessingDone(false);
    setShowSuccessModal(true);
    setPendingDone(null);

  } catch (err) {
    setIsProcessingDone(false);
    alert("Something went wrong.");
  }
}}
    style={{
      flex: 1,
      padding: "8px",
      background: "#22c55e",
      color: "white",
      border: "none",
      borderRadius: 6,
      cursor: "pointer",
      fontWeight: "bold",
    }}
  >
    ✅ Confirm
  </button>


</div>
    </motion.div>
  </div>
)}

{/* DECLINE MODAL */}
{showDeclineModal && pendingDone && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.6)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    }}
  >
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        width: 380,
        padding: 24,
        textAlign: "center",
      }}
    >
      <h3>❌ Decline Request</h3>

      <p style={{ fontSize: 14, color: "#6b7280" }}>
        Please provide a reason
      </p>

      <textarea
        placeholder="Enter reason..."
        value={declineReason}
        onChange={(e) => setDeclineReason(e.target.value)}
        style={{
          width: "100%",
          minHeight: 80,
          marginTop: 10,
          padding: 10,
          borderRadius: 8,
          border: "1px solid #ccc",
        }}
      />

      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
        <button
          onClick={() => {
            setShowDeclineModal(false);
            setDeclineReason("");
          }}
          style={{
            flex: 1,
            padding: 8,
            background: "#9ca3af",
            color: "white",
            border: "none",
            borderRadius: 6,
          }}
        >
          Cancel
        </button>

        <button
          disabled={!declineReason.trim() || isProcessing}
         onClick={async () => {
  if (!declineReason.trim()) return;

  setIsProcessingDecline(true);

  try {
    await declineBorrow(declineReason);

    setShowDeclineModal(false);
    setDeclineReason("");

    setShowDeclineSuccess(true);

  } catch (err) {
    console.error(err);
    alert("Failed to decline request");
  } finally {
    setIsProcessingDecline(false);
  }
}}
          style={{
            flex: 1,
            padding: 8,
            background: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: 6,
          }}
        >
          Submit
        </button>
      </div>
    </div>
  </div>
)}

{isProcessingDone && (
  <div style={{
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2000,
    backdropFilter: "blur(4px)"
  }}>
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      style={{
        background: "#fff",
        padding: 30,
        borderRadius: 16,
        textAlign: "center",
        width: 300,
        boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
      }}
    >
      
      {/* 🔄 Spinner */}
      <div style={{
        width: 50,
        height: 50,
        border: "5px solid #e5e7eb",
        borderTop: "5px solid #22c55e",
        borderRadius: "50%",
        margin: "0 auto",
        animation: "spin 1s linear infinite"
      }} />

      <h3 style={{ marginTop: 16 }}>Processing...</h3>

      <p style={{ fontSize: 13, color: "#6b7280" }}>
        Saving transaction and sending receipt
      </p>
    </motion.div>
  </div>
)}

{showSuccessModal && (
  <div style={{
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2000,
    backdropFilter: "blur(4px)"
  }}>
    <motion.div
      initial={{ scale: 0.7, opacity: 0, y: 40 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 250, damping: 18 }}
      style={{
        background: "#fff",
        padding: 30,
        borderRadius: 16,
        textAlign: "center",
        width: 320,
        boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
      }}
    >
      {/* ✅ Animated check */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
        style={{ fontSize: 50 }}
      >
        ✅
      </motion.div>

      <h3 style={{ marginTop: 10 }}>Success!</h3>

      <p style={{ fontSize: 14, color: "#6b7280", marginTop: 8 }}>
        Transaction completed and receipt sent to email.
      </p>

      <button
        onClick={() => setShowSuccessModal(false)}
        style={{
          marginTop: 20,
          padding: "8px 16px",
          background: "#22c55e",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          fontWeight: "bold",
          cursor: "pointer"
        }}
      >
        OK
      </button>
    </motion.div>
  </div>
)}

{isProcessingDecline && (
  <div style={{
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 3000,
    backdropFilter: "blur(4px)"
  }}>
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      style={{
        background: "#fff",
        padding: 30,
        borderRadius: 16,
        textAlign: "center",
        width: 300
      }}
    >
      <div style={{
        width: 50,
        height: 50,
        border: "5px solid #e5e7eb",
        borderTop: "5px solid #ef4444",
        borderRadius: "50%",
        margin: "0 auto",
        animation: "spin 1s linear infinite"
      }} />

      <h3 style={{ marginTop: 16 }}>Processing Decline...</h3>

      <p style={{ fontSize: 13, color: "#6b7280" }}>
        Sending decline notice to email
      </p>
    </motion.div>
  </div>
)}

{showDeclineSuccess && (
  <div style={{
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 3000,
    backdropFilter: "blur(4px)"
  }}>
    <motion.div
      initial={{ scale: 0.7, opacity: 0, y: 40 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      style={{
        background: "#fff",
        padding: 30,
        borderRadius: 16,
        textAlign: "center",
        width: 320
      }}
    >
      <div style={{ fontSize: 50 }}>❌</div>

      <h3 style={{ marginTop: 10 }}>Request Declined</h3>

      <p style={{ fontSize: 14, color: "#6b7280", marginTop: 8 }}>
        The request was declined and notification was sent to email.
      </p>

      <button
        onClick={() => setShowDeclineSuccess(false)}
        style={{
          marginTop: 20,
          padding: "8px 16px",
          background: "#ef4444",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          fontWeight: "bold",
          cursor: "pointer"
        }}
      >
        OK
      </button>
    </motion.div>
  </div>
)}

{showFileModal && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(17, 24, 39, 0.6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999
    }}
  >
    <div
      style={{
        width: 420,
        height: 500,
        background: "#fff",
        borderRadius: 14,
        padding: 20,
        boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
        display: "flex",
        flexDirection: "column"
      }}
    >
      {/* HEADER */}
      <h3 style={{ marginBottom: 12, fontSize: 18, fontWeight: 700 }}>
        📄 Select Procedure to Print
      </h3>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search procedure..."
        value={fileSearch}
        onChange={(e) => setFileSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: 10,
          border: "1px solid #d1d5db",
          outline: "none",
          fontSize: 14,
          marginBottom: 12
        }}
      />

      {/* FILE LIST (scrollable) */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          paddingRight: 4
        }}
      >
        {files
          .filter((file) =>
            file.toLowerCase().includes(fileSearch.toLowerCase())
          )
          .map((file, i) => (
            <div
              key={i}
              onClick={() => {
                setSelectedFile(file);
                setShowFileModal(false);
                setShowConfirmModal(true);
              }}
              style={{
                padding: 12,
                marginBottom: 8,
                border: "1px solid #e5e7eb",
                borderRadius: 10,
                cursor: "pointer",
                background: "#f9fafb",
                fontSize: 14,
                transition: "0.2s"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#eef2ff";
                e.currentTarget.style.borderColor = "#c7d2fe";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#f9fafb";
                e.currentTarget.style.borderColor = "#e5e7eb";
                e.currentTarget.style.transform = "translateY(0px)";
              }}
            >
              📄 {file}
            </div>
          ))}

        {/* EMPTY STATE */}
        {files.filter((file) =>
          file.toLowerCase().includes(fileSearch.toLowerCase())
        ).length === 0 && (
          <div
            style={{
              textAlign: "center",
              color: "#6b7280",
              fontSize: 13,
              marginTop: 20
            }}
          >
            No files found
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div
        style={{
          marginTop: 10,
          display: "flex",
          justifyContent: "flex-end"
        }}
      >
        <button
          onClick={() => setShowFileModal(false)}
          style={{
            padding: "8px 14px",
            background: "#6b7280",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: 600
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "#4b5563")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "#6b7280")
          }
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

{showConfirmModal && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(17, 24, 39, 0.6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999
    }}
  >
    <div
      style={{
        background: "#fff",
        width: 380,
        maxWidth: "92%",
        borderRadius: 14,
        padding: 20,
        boxShadow: "0 20px 50px rgba(0,0,0,0.25)"
      }}
    >
      <h3 style={{ marginBottom: 10 }}>Confirm Print</h3>

      <p style={{ fontSize: 14, color: "#374151" }}>
        Are you sure you want to print:
        <br />
        <b>{selectedFile}</b>?
      </p>

      <div style={{ display: "flex", gap: 10, marginTop: 18, justifyContent: "flex-end" }}>
        <button
onClick={() => {
   if (selectedFile) {
    handlePrint(selectedFile);
  }
  setShowConfirmModal(false);
}}
          style={{
            padding: "8px 14px",
            background: "#2bcf1f",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: "pointer"
          }}
        >
          Yes, Print
        </button>

        <button
          onClick={() => {
            setShowConfirmModal(false);
            setSelectedFile(null);
          }}
          style={{
            padding: "8px 14px",
            background: "#e5e7eb",
            color: "#111827",
            border: "none",
            borderRadius: 8,
            cursor: "pointer"
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
 
{page === "rooms" && (
  <>
  <div id="print-area">
    <div style={{ marginTop: 20 }}>
<div style={{
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 15
}}>
  
  <h2 style={{
  fontSize: 22,
  fontWeight: "bold",
  color: "#111827",
  marginBottom: 20}}>
    Room Bookings
  </h2>

  <button
    onClick={() => window.print()}
    style={{
      padding: "8px 14px",
      background: "#2563eb",
      color: "white",
      border: "none",
      borderRadius: 8,
      fontWeight: "bold",
      cursor: "pointer"
    }}
  >
    🖨 Print
  </button>

</div>

  <div
    style={{
      overflowX: "auto",
      borderRadius: 14,
      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
      background: "#ffffff",
    }}
  >
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        minWidth: 700,
      }}
    >
      {/* HEADER */}
      <thead
        style={{
          background: "#166534",
          color: "white",
          position: "sticky",
          top: 0,
          zIndex: 1,
        }}
      >
        <tr>
          <th style={thStyle}>Status</th>
          <th style={thStyle}>Room</th>
          <th style={thStyle}>Date</th>
          <th style={thStyle}>Time</th>
          <th style={thStyle}>Student</th>
          <th style={thStyle}>Instructor</th>
          <th style={thStyle}>Course/Block</th>
          <th style={thStyle}>Actions</th>
        </tr>
      </thead>

      {/* BODY */}
      <tbody>
        {roomBookings.length === 0 ? (
          <tr>
            <td colSpan={6} style={{ textAlign: "center", padding: 30 }}>
              No room bookings
            </td>
          </tr>
        ) : (
          roomBookings.sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.start}`);
    const dateB = new Date(`${b.date} ${b.start}`);
    return dateB.getTime() - dateA.getTime(); // latest first
  })
  .map((b, i) => (
            <tr
              key={i}
              style={{
                background: i % 2 === 0 ? "#f9fafb" : "#ffffff",
                transition: "0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#ecfdf5")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background =
                  i % 2 === 0 ? "#f9fafb" : "#ffffff")
              }
            >
              {/* STATUS */}
              <td style={tdCenter}>
                <span
                  style={{
                    padding: "4px 10px",
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 600,
                    background: b.done ? "#dcfce7" : "#dbeafe",
                    color: b.done ? "#166534" : "#1e40af",
                  }}
                >
                  {b.done ? "DONE" : "ONGOING"}
                </span>
              </td>

              <td style={tdCenter}>{b.room}</td>
              <td style={tdCenter}>{b.date}</td>

              <td style={tdCenter}>
                {formatTime12(b.start)} - {formatTime12(b.end)}
              </td>

              <td style={tdCenter}>{b.studentName}</td>
              <td style={tdCenter}>{b.instructorName}</td>
              <td style={tdCenter}>{b.course}</td>

              {/* ACTION */}
              <td style={tdCenter}>
                {!b.done ? (
                  <button
                    onClick={() => endSession(b.id)}
                    style={{
                      padding: "6px 14px",
                      background: "#22c55e",
                      color: "white",
                      border: "none",
                      borderRadius: 8,
                      cursor: "pointer",
                      fontWeight: 600,
                      transition: "0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#16a34a")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "#22c55e")
                    }
                  >
                    Mark Done
                  </button>
                ) : (
                  <span style={{ color: "#9ca3af", fontSize: 12 }}>
                    Completed
                  </span>
                )}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
</div>
</div>
  </>
)}  



{page === "messages" && (
  <>
    <h6 style={{
  fontSize: 22,
  fontWeight: "bold",
  color: "#111827",
  marginBottom: 20}}>Chats History</h6>
    <div style={{ display: "flex", height: "75vh", gap: 12 }}>

      {/* 🔵 LEFT: CHAT LIST */}
      <div
        style={{
          width: "30%",
          background: "white",
          borderRadius: 16,
          padding: 12,
          overflowY: "auto",
          boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
        }}
      >
        <h4 style={{ marginBottom: 10 }}>💬 Chats</h4>

        {conversations.length > 0 ? (
          conversations.map((c) => {
            const msgs = c.messages || [];
            const lastMsg = msgs[msgs.length - 1];
            const unread = msgs.some((m) => m.sender === "user" && !m.read);

            console.log(
    "Checking unread for studentId", c.studentId,
    c.messages.map(m => ({ text: m.text, read: m.read }))
  );

            return (
              <div
                key={c.studentId}
                style={{
                  padding: 10,
                  borderRadius: 10,
                  marginBottom: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  background:
                    selectedChat?.studentId === c.studentId
                      ? "#dcfce7"
                      : "#f3f4f6",
                }}
                onClick={() => openChat(c)}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{c.studentName}</div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "#6b7280",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: 140,
                    }}
                  >
                    {lastMsg?.text || "No messages"}
                  </div>
                </div>

                {unread && (
                  <span
                    style={{
                      background: "#4de13d",
                      color: "white",
                      fontSize: 10,
                      borderRadius: "50%",
                      width: 18,
                      height: 18,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 6,
                    }}
                  >
                    •
                  </span>
                )}
              </div>
            );
          })
        ) : (
          <div style={{ padding: 10, color: "#6b7280" }}>No chats yet</div>
        )}
      </div>

      {/* 🟢 RIGHT: CHAT BOX */}
      <div
        style={{
          flex: 1,
          background: "white",
          borderRadius: 16,
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
        }}
      >
        {!selectedChat ? (
          <div style={{ padding: 20, color: "#6b7280" }}>Select a chat</div>
        ) : (
          <>
            {/* HEADER */}
            <div
              style={{
                padding: 12,
                borderBottom: "1px solid #eee",
                fontWeight: 600,
                background: "#f9fafb",
              }}
            >
              {selectedChat.studentName}
            </div>

            {/* CHAT BODY */}
            <div
              id="chat-box"
              ref={chatBoxRef}
              style={{
                flex: 1,
                padding: 12,
                overflowY: "auto",
                background: "#f3f4f6",
              }}
            >
              {selectedChat.messages.length > 0 ? (
                selectedChat.messages.map((msg, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent:
                        msg.sender === "user" ? "flex-start" : "flex-end",
                      marginBottom: 8,
                    }}
                  >
                    <div
                      style={{
                        padding: "8px 12px",
                        borderRadius: 14,
                        background:
                          msg.sender === "user" ? "#e5e7eb" : "#22c55e",
                        color: msg.sender === "user" ? "#111827" : "white",
                        maxWidth: "70%",
                        fontSize: 14,
                      }}
                    >
                      {msg.text}
                      <div
                        style={{
                          fontSize: 10,
                          color: msg.sender === "user" ? "#6b7280" : "#d1fae5",
                          marginTop: 4,
                          textAlign: "right",
                        }}
                      >
                        {msg.createdAt ? formatMessageTime(msg.createdAt) : ""}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ color: "#6b7280" }}>No messages yet</div>
              )}
            </div>

            {/* INPUT */}
           <div
  style={{
    display: "flex",
    padding: 10,
    gap: 8,
    borderTop: "1px solid #eee",
    background: "#fff",
  }}
>
  <input
    value={reply}
    onChange={(e) => setReply(e.target.value)}
    placeholder="Type a reply..."
    style={{
      flex: 1,
      padding: 10,
      borderRadius: 10,
      border: "1px solid #ccc",
      outline: "none",
      color: "#111827",
      background: "#fff",
    }}
    onKeyDown={(e) => {
      if (e.key === "Enter" && !isSendingReply) {
        e.preventDefault(); // 🚫 stop double trigger
        sendReply();
      }
    }}
  />

  <button
    onClick={sendReply}
    disabled={isSendingReply}
    style={{
      background: isSendingReply ? "#9ca3af" : "#22c55e",
      color: "white",
      border: "none",
      borderRadius: 10,
      padding: "0 16px",
      cursor: isSendingReply ? "not-allowed" : "pointer",
      fontWeight: 600,
      transition: "0.2s",
      opacity: isSendingReply ? 0.7 : 1,
    }}
  >
    {isSendingReply ? "..." : "Send"}
  </button>
</div>
          </>
        )}
      </div>
    </div>
  </>
)}

{page === "reports" && (
  <div id="print-area">

    {/* HEADER */}
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20
    }}>
      <h2 style={{ fontSize: 26, fontWeight: "bold" }}>
  📊 Monthly Borrow Monitoring
  <span style={{
    display: "block",
    fontSize: 14,
    fontWeight: 400,
    color: "#6b7280",
    marginTop: 4
  }}>
    As of {today}
  </span>
</h2>

      <button
        onClick={() => window.print()}
        style={{
          padding: "8px 14px",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: 8,
          fontWeight: "bold",
          cursor: "pointer"
        }}
      >
        🖨 Print Report
      </button>
    </div>

    {/* KPI SUMMARY */}
    {(() => {
      const totalStats = borrowHistory.reduce(
        (acc, b) => {
          acc.total++;
          if (b.returned) acc.returned++;
          if (b.remarks === "issue") acc.issue++;
          if (b.remarks === "missing") acc.missing++;
          return acc;
        },
        { total: 0, returned: 0, issue: 0, missing: 0 }
      );

      return (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 12,
          marginBottom: 20
        }}>
          {[
            { label: "Total Borrows", value: totalStats.total, color: "#ffffff" },
            { label: "Returned", value: totalStats.returned, color: "#22c55e" },
            { label: "Issues", value: totalStats.issue, color: "#f59e0b" },
            { label: "Missing", value: totalStats.missing, color: "#ef4444" },
          ].map((card, i) => (
            <div key={i} style={{
              padding: 16,
              borderRadius: 12,
              background: "white",
              boxShadow: "0 8px 16px rgba(0,0,0,0.08)",
              borderTop: `5px solid ${card.color}`
            }}>
              <div style={{ fontSize: 13, color: "#6b7280" }}>{card.label}</div>
              <div style={{ fontSize: 22, fontWeight: "bold" }}>{card.value}</div>
            </div>
          ))}
        </div>
      );
    })()}

    {/* CHART */}
    {(() => {
      const chartData = Object.entries(getMonthlyStats())
        .map(([month, data]) => ({
          month,
          total: data.total,
          issue: data.issue,
          missing: data.missing,
        }))
        .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

      return (
        <div style={{
          width: "100%",
          height: 300,
          background: "white",
          borderRadius: 12,
          padding: 12,
          marginBottom: 20,
          boxShadow: "0 8px 16px rgba(0,0,0,0.08)"
        }}>
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#22c55e" />
              <Bar dataKey="issue" fill="#f59e0b" />
              <Bar dataKey="missing" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      );
    })()}

    {/* MONTHLY GRID */}
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
      gap: 16
    }}>
      {Object.entries(getMonthlyStats())
        .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
        .map(([month, data]) => {

          const issueRate = data.total
            ? (data.issue / data.total * 100).toFixed(1)
            : 0;

          const missingRate = data.total
            ? (data.missing / data.total * 100).toFixed(1)
            : 0;

          return (
            <div key={month} style={{
              padding: 18,
              borderRadius: 14,
              background: "white",
              boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
              borderLeft: "6px solid #22c55e"
            }}>
              <h3 style={{
                fontSize: 18,
                fontWeight: 700,
                marginBottom: 10
              }}>
                {month}
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span>📦 Total: <b>{data.total}</b></span>
                <span>✅ Returned: <b>{data.returned}</b></span>

                <span style={{ color: "#f59e0b" }}>
                  ⚠️ Issues: <b>{data.issue}</b> ({issueRate}%)
                </span>

                <span style={{ color: "#ef4444" }}>
                  ❌ Missing: <b>{data.missing}</b> ({missingRate}%)
                </span>
              </div>
            </div>
          );
        })}
    </div>

  </div>
)}

<style>
{`
@media print {

  /* Hide everything */
  body * {
    visibility: hidden;
  }

  /* Show only print area */
  #print-area, #print-area * {
    visibility: visible;
  }

  #print-area {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }

  /* Remove colors & shadows */
  * {
    background: white !important;
    color: black !important;
    box-shadow: none !important;
  }

  /* Table styling */
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
    font-size: 12px;
  }

  th, td {
    border: 1px solid black;
    padding: 6px;
    text-align: left;
  }

  th {
    font-weight: bold;
  }

  /* Hide buttons */
  button {
    display: none !important;
  }

}
`}
</style>
              </div>
            </div>
          );
        }
            