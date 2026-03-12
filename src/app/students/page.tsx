"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, ChangeEvent, FormEvent, JSX } from "react";
import { motion } from "framer-motion";

interface FormData {
  name: string;
  studentId: string;
  course: string;
  instructor: string;
  date: string;
  time: string;
}

export default function Education(): JSX.Element {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    studentId: "",
    course: "BACHELOR OF SCIENCE IN NURSING",
    instructor: "",
    date: "",
    time: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "studentId") {
      // Only allow numbers and auto-insert dash
      let cleaned = value.replace(/\D/g, ""); // remove non-digits
      if (cleaned.length > 2) cleaned = cleaned.slice(0, 2) + "-" + cleaned.slice(2, 7);
      setFormData({ ...formData, [name]: cleaned });
    } else {
      setFormData({
        ...formData,
        [name]: name === "date" || name === "time" ? value : value.toUpperCase(),
      });
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    localStorage.setItem("borrowerInfo", JSON.stringify(formData));
    alert("Submitted Successfully!");
    router.push("/supplies");
  };

  const handleClear = () => {
    setFormData({
      name: "",
      studentId: "",
      course: "BACHELOR OF SCIENCE IN NURSING",
      instructor: "",
      date: "",
      time: "",
    });
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{ minHeight: "100vh", backgroundColor: "#f0f0f0", position: "relative" }}
    >
      {/* FLOATING BACK BUTTON */}
      <motion.button
        onClick={handleBack}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{
          position: "absolute",
          top: "130px",
          right: "40px",
          backgroundColor: "#ffffff",
          color: "#2e7d32",
          border: "none",
          borderRadius: "20px",
          padding: "8px 18px",
          fontWeight: "bold",
          cursor: "pointer",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          zIndex: 1000,
        }}
      >
        ← Back
      </motion.button>

      {/* HEADER */}
      <div
        style={{
          padding: "clamp(15px,3vw,20px) clamp(20px,5vw,40px)",
          background: "linear-gradient(to right, #7bc67b, #b8e6b8)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 style={{ color: "white", fontWeight: "bold", fontSize: "20px", margin: 0, letterSpacing: "1px" }}>
          Electronic Central Supplies Record
        </h2>

        <Image src="/ncf.webp" alt="Logo" width={60} height={60} style={{ borderRadius: "50%" }} />
      </div>

      {/* MAIN */}
      <div style={{ padding: "clamp(20px,5vw,40px)", maxWidth: "1200px", margin: "auto" }}>
        <h1 style={{ letterSpacing: "2px", fontSize: "clamp(22px,4vw,30px)" }}>STUDENT INFORMATION</h1>

        {/* FORM */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "30px", marginTop: "30px" }}>
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            style={{
              flex: "1 1 400px",
              backgroundColor: "white",
              padding: "clamp(20px,4vw,30px)",
              borderRadius: "16px",
              boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
              position: "relative",
            }}
          >
            {/* CLEAR BUTTON */}
            <motion.button
              onClick={handleClear}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              style={{
                position: "absolute",
                top: "15px",
                right: "20px",
                backgroundColor: "#ff5252",
                color: "white",
                border: "none",
                borderRadius: "20px",
                padding: "6px 14px",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: "bold",
              }}
            >
              CLEAR
            </motion.button>

            <form onSubmit={handleSubmit}>
              <InputField
                label="NAME OF STUDENT *"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="LASTNAME, FIRSTNAME, M.I."
                required
              />

              {/* STUDENT ID */}
              <InputField
                label="STUDENT ID NUMBER *"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                placeholder="12-34567"
                required
              />

              {/* COURSE SELECT */}
              <div style={{ marginBottom: "20px", flex: "1 1 200px" }}>
                <label style={{ fontWeight: 600, fontSize: "14px" }}>COURSE *</label>
                <motion.select
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  required
                  whileHover={{ scale: 1.01 }}
                  whileFocus={{ scale: 1.02 }}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    marginTop: "6px",
                    borderRadius: "20px",
                    border: "1px solid #ccc",
                    outline: "none",
                    transition: "all 0.2s ease",
                    textTransform: "uppercase",
                    backgroundColor: "white",
                    cursor: "pointer",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                    fontWeight: 500,
                    fontSize: "14px",
                    appearance: "none",
                    backgroundImage:
                      "url('data:image/svg+xml;charset=US-ASCII,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 4 5%22><path fill=%22%23333%22 d=%22M2 0L0 2h4z%22/></svg>')",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 10px center",
                    backgroundSize: "10px",
                  }}
                >
                  <option value="BACHELOR OF SCIENCE IN NURSING">BACHELOR OF SCIENCE IN NURSING</option>
                </motion.select>
              </div>

              <InputField
                label="NAME OF THE CLINICAL INSTRUCTOR *"
                name="instructor"
                value={formData.instructor}
                onChange={handleChange}
                placeholder="MR./MS. LASTNAME, FIRSTNAME"
                required
              />

              <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
                <InputField
                  label="DATE *"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />

                <InputField
                  label="TIME *"
                  name="time"
                  type="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                />
              </div>

              <div style={{ textAlign: "right", marginTop: "20px" }}>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    backgroundColor: "#00c853",
                    color: "white",
                    padding: "12px 30px",
                    border: "none",
                    borderRadius: "30px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  Submit
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

interface InputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}

function InputField({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
}: InputProps): JSX.Element {
  return (
    <div style={{ marginBottom: "20px", flex: "1 1 200px" }}>
      <label style={{ fontWeight: 600, fontSize: "14px" }}>{label}</label>
      <motion.input
        whileFocus={{ scale: 1.02 }}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        style={{
          width: "100%",
          padding: "10px",
          marginTop: "6px",
          borderRadius: "20px",
          border: "1px solid #ccc",
          outline: "none",
          transition: "all 0.2s ease",
          textTransform: type !== "date" && type !== "time" ? "uppercase" : "none",
        }}
      />
    </div>
  );
}