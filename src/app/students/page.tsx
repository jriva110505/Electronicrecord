"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, ChangeEvent, FormEvent, JSX } from "react";

interface FormData {
  name: string;
  studentId: string;
  course: string;
  instructor: string;
  date: string;
}

export default function Education(): JSX.Element {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    studentId: "",
    course: "",
    instructor: "",
    date: "",
  });

  // AUTO CAPITAL LETTER
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: name === "date" ? value : value.toUpperCase(),
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Show alert and navigate to /contact
    alert("Submitted Successfully!");
    router.push("/contact");
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f0f0f0" }}>
      
      {/* 🔷 TOP HEADER */}
      <div
              style={{
                padding: "20px 40px",
                background: "linear-gradient(to right, #7bc67b, #b8e6b8)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2
                style={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "1.5rem", // BIG and BOLD
                  margin: 0,
                  letterSpacing: "1px",
                }}
              >
                Electronic Central Supplies Record
              </h2>
      
              <Image
                src="/ncf.webp"
                alt="Logo"
                width={60}
                height={60}
                style={{ borderRadius: "50%" }}
              />
            </div>

      {/* 🔷 MAIN CONTENT */}
      <div style={{ padding: "40px 60px" }}>
        
        {/* TITLE + BACK */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h1 style={{ letterSpacing: "2px" }}>
            STUDENT INFORMATION
          </h1>

          <button
            onClick={() => router.push("/")}
            style={{
              background: "none",
              border: "none",
              fontSize: "22px",
              cursor: "pointer",
            }}
          >
            ←
          </button>
        </div>

        {/* TWO COLUMN LAYOUT */}
        <div
          style={{
            display: "flex",
            gap: "40px",
            marginTop: "30px",
          }}
        >
          {/* LEFT FORM CARD */}
          <div
            style={{
              flex: 1,
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "16px",
              boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
            }}
          >
            <form onSubmit={handleSubmit}>
              <InputField
                label="NAME OF STUDENT *"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="FIRSTNAME LASTNAME, M.I."
                required
              />

              <InputField
                label="STUDENT ID NUMBER *"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                placeholder="25-00000"
                required
              />

              <InputField
                label="COURSE *"
                name="course"
                value={formData.course}
                onChange={handleChange}
                placeholder="BSN, BSMT, ETC..."
                required
              />

              <InputField
                label="NAME OF THE CLINICAL INSTRUCTOR *"
                name="instructor"
                value={formData.instructor}
                onChange={handleChange}
                placeholder="MR./MS. LASTNAME, FIRSTNAME"
                required
              />

              <InputField
                label="DATE *"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                placeholder="MM/DD/YYYY"
                required
              />

              <div style={{ textAlign: "right", marginTop: "20px" }}>
                <button
                  type="submit"
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
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT EMPTY CARD */}
          <div
            style={{
              flex: 1,
              backgroundColor: "white",
              borderRadius: "20px",
              boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
              height: "400px",
            }}
          />
        </div>
      </div>
    </div>
  );
}

interface InputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
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
    <div style={{ marginBottom: "20px" }}>
      <label style={{ fontWeight: 600, fontSize: "14px" }}>{label}</label>
      <input
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
          textTransform: type !== "date" ? "uppercase" : "none",
        }}
      />
    </div>
  );
}