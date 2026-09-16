// Lightweight inline line-icons (no external icon package installed in this project)
const base = {
  width: "1em",
  height: "1em",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function MailIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

export function LockIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export function UserIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M4.5 20.2c1.4-3.6 4-5.4 7.5-5.4s6.1 1.8 7.5 5.4" />
    </svg>
  );
}

export function SearchIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

export function MapPinIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 21s7-6.5 7-11.6A7 7 0 0 0 5 9.4C5 14.5 12 21 12 21Z" />
      <circle cx="12" cy="9.4" r="2.4" />
    </svg>
  );
}

export function CheckCircleIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12.4 2.6 2.6L16 9.6" />
    </svg>
  );
}

export function PhoneIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M6.5 3.5h3l1.4 4.2-2 1.6a12.5 12.5 0 0 0 5.8 5.8l1.6-2 4.2 1.4v3a1.7 1.7 0 0 1-1.8 1.7A16 16 0 0 1 4.8 5.3a1.7 1.7 0 0 1 1.7-1.8Z" />
    </svg>
  );
}

export function StarIcon(props) {
  return (
    <svg {...base} fill="currentColor" stroke="none" {...props}>
      <path d="M12 2.8 14.7 9l6.7.6-5 4.5 1.5 6.5L12 17.3 6.1 20.6l1.5-6.5-5-4.5L9.3 9Z" />
    </svg>
  );
}

export function ArrowRightIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4.5 12h15" />
      <path d="m13 5.5 7 6.5-7 6.5" />
    </svg>
  );
}

export function SparkleIcon(props) {
  return (
    <svg {...base} fill="currentColor" stroke="none" {...props}>
      <path d="M12 2c.6 3.7 2 5.9 6 6.5-4 .6-5.4 2.8-6 6.5-.6-3.7-2-5.9-6-6.5 4-.6 5.4-2.8 6-6.5Z" />
      <path d="M19 15c.3 1.7.9 2.6 2.6 2.9-1.7.3-2.3 1.2-2.6 2.9-.3-1.7-.9-2.6-2.6-2.9 1.7-.3 2.3-1.2 2.6-2.9Z" />
    </svg>
  );
}

export function ShieldIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3.5 5 6v5.5c0 4.6 3 7.6 7 9 4-1.4 7-4.4 7-9V6Z" />
      <path d="m9 12 2 2 4-4.2" />
    </svg>
  );
}

export function CompassIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m14.6 9.4-1.7 4.9-4.9 1.7 1.7-4.9Z" />
    </svg>
  );
}

export function BedIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M3 18v-6.5A2.5 2.5 0 0 1 5.5 9H15a3 3 0 0 1 3 3v6" />
      <path d="M3 15h18" />
      <path d="M3 18v2M21 18v2" />
      <circle cx="7.2" cy="11.3" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FilterIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 5h16M7 12h10M10.5 19h3" />
    </svg>
  );
}

export function CloseIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="m5 5 14 14M19 5 5 19" />
    </svg>
  );
}

export function LogoutIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3" />
      <path d="M14 15.5 18.5 11 14 6.5" />
      <path d="M18.5 11h-10" />
    </svg>
  );
}

export function HeartIcon({ filled = false, ...props }) {
  return (
    <svg {...base} fill={filled ? "currentColor" : "none"} {...props}>
      <path d="M12 20.2s-7.2-4.6-9.7-9.1C.7 8 2 4.5 5.4 3.7c2-.5 4 .3 5.2 2 .5.7 1 .7 1.5 0 1.2-1.7 3.2-2.5 5.2-2 3.4.8 4.7 4.3 3.1 7.4-2.5 4.5-9.4 9.1-9.4 9.1Z" />
    </svg>
  );
}

export function EyeIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12Z" />
      <circle cx="12" cy="12" r="2.8" />
    </svg>
  );
}

export function EyeOffIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M3 3l18 18" />
      <path d="M10.6 5.7A10.6 10.6 0 0 1 12 5.5c6.4 0 10 6.5 10 6.5a15.3 15.3 0 0 1-4 4.6M6.5 6.9C3.8 8.7 2 12 2 12s3.6 6.5 10 6.5c1.4 0 2.7-.3 3.8-.8" />
      <path d="M9.9 10a2.8 2.8 0 0 0 4 4" />
    </svg>
  );
}

export function GoogleIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <path
        fill="currentColor"
        d="M21.3 12.2c0-.7-.06-1.4-.18-2H12v3.8h5.2a4.5 4.5 0 0 1-1.9 2.9v2.4h3.1c1.8-1.7 2.9-4.1 2.9-7.1Z"
      />
      <path
        fill="currentColor"
        opacity=".7"
        d="M12 21.5c2.6 0 4.8-.9 6.4-2.3l-3.1-2.4c-.9.6-2 .9-3.3.9-2.5 0-4.7-1.7-5.4-4h-3.2v2.5A9.5 9.5 0 0 0 12 21.5Z"
      />
      <path
        fill="currentColor"
        opacity=".5"
        d="M6.6 13.7a5.7 5.7 0 0 1 0-3.6V7.6H3.4a9.5 9.5 0 0 0 0 8.6l3.2-2.5Z"
      />
      <path
        fill="currentColor"
        opacity=".85"
        d="M12 6.1c1.4 0 2.7.5 3.7 1.4l2.7-2.7A9.4 9.4 0 0 0 12 2.5a9.5 9.5 0 0 0-8.6 5.1l3.2 2.5c.7-2.3 2.9-4 5.4-4Z"
      />
    </svg>
  );
}

export function ChevronDownIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function UtensilsIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M6 3v8M4 3v5a2 2 0 0 0 4 0V3M6 11v10" />
      <path d="M17 3c-1.4 0-2.5 1.8-2.5 5s1.1 4.5 2 4.9V21" />
    </svg>
  );
}

export function GraduationCapIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="m2 8 10-4.5L22 8l-10 4.5Z" />
      <path d="M6 10.5V16c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5v-5.5" />
    </svg>
  );
}

export function BriefcaseIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="7.5" width="18" height="12" rx="2" />
      <path d="M8 7.5V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1.5" />
      <path d="M3 12.5h18" />
    </svg>
  );
}

export function InstagramIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function BuildingIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="4" y="3" width="12" height="18" rx="1.5" />
      <path d="M16 21v-6h4v6M7.5 7h1M11.5 7h1M7.5 11h1M11.5 11h1M7.5 15h1M11.5 15h1" />
    </svg>
  );
}

export function UsersIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="9" cy="8.2" r="3.2" />
      <path d="M2.8 19c1.1-3.1 3.4-4.7 6.2-4.7s5.1 1.6 6.2 4.7" />
      <path d="M15.5 5.2a3.2 3.2 0 0 1 0 6" />
      <path d="M16.5 14.6c2.2.4 3.8 1.9 4.7 4.4" />
    </svg>
  );
}

export function WifiIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M3.5 9.5a13 13 0 0 1 17 0" />
      <path d="M6.7 13a8.5 8.5 0 0 1 10.6 0" />
      <path d="M10 16.5a3.8 3.8 0 0 1 4 0" />
      <circle cx="12" cy="19.3" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function WalletIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="6.5" width="18" height="13" rx="2.5" />
      <path d="M3 10h18" />
      <circle cx="16.5" cy="14.5" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function WhatsAppIcon(props) {
  return (
    <svg {...base} fill="currentColor" stroke="none" {...props}>
      <path d="M12 2.2c-5.4 0-9.8 4.4-9.8 9.8 0 1.7.4 3.4 1.3 4.8L2.2 21.8l5-1.3a9.8 9.8 0 0 0 4.8 1.2c5.4 0 9.8-4.4 9.8-9.8s-4.4-9.7-9.8-9.7Zm5.7 13.9c-.2.7-1.4 1.3-2 1.4-.5.1-1.1.1-1.8-.1-.4-.1-.9-.3-1.6-.6-2.8-1.2-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8 0-1.3.7-2 .9-2.2.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5.2.5.7 1.8.8 1.9.1.2.1.3 0 .5-.1.2-.1.3-.3.5l-.4.5c-.1.2-.3.3-.1.6.2.3.9 1.5 2 2.4 1.3 1.2 2.4 1.5 2.7 1.7.3.2.5.1.6-.1l1-1.1c.2-.3.4-.2.6-.1l1.7.8c.2.1.4.2.4.3.1.2.1.7-.1 1.4Z" />
    </svg>
  );
}
