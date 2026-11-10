"use client";
import { useEffect } from "react";

const RESUME_URL = "/javeed-ishaq-resume.pdf";

export default function ResumePage() {
  useEffect(() => {
    window.location.replace(RESUME_URL);
  }, []);
  return (
    <div className="container py-20 text-center">
      Redirecting to the resume…{" "}
      <a href={RESUME_URL} className="underline">
        Open it here
      </a>
      .
    </div>
  );
}
