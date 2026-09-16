import { useEffect, useRef, useState } from "react";
import { ChevronDownIcon } from "./icons";

function FilterDropdown({ icon, label, summary, isActive, children }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="filter-dropdown" ref={ref}>
      <button
        type="button"
        className={`filter-dropdown-trigger ${isActive ? "filter-dropdown-trigger-active" : ""}`}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="filter-dropdown-icon">{icon}</span>
        <span className="filter-dropdown-text">
          <small>{label}</small>
          <strong>{summary}</strong>
        </span>
        <ChevronDownIcon className="filter-dropdown-chevron" />
      </button>

      {open && (
        <div className="filter-dropdown-panel">{children({ close: () => setOpen(false) })}</div>
      )}
    </div>
  );
}

export default FilterDropdown;
