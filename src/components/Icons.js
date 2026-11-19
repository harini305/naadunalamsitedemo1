const base = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };

export const BagIcon = () => (
  <svg {...base}><path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8Z" /><path d="M9 8V6.5a3 3 0 0 1 6 0V8" /></svg>
);
export const HeartIcon = ({ filled }) => (
  <svg {...base} fill={filled ? "currentColor" : "none"}><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" /></svg>
);
export const PlusIcon = () => (
  <svg {...base} strokeWidth={2}><path d="M12 5v14M5 12h14" /></svg>
);
export const MinusIcon = () => (
  <svg {...base} strokeWidth={2}><path d="M5 12h14" /></svg>
);
export const ArrowIcon = () => (
  <svg {...base}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
export const BackIcon = () => (
  <svg {...base}><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
);
export const SearchIcon = () => (
  <svg {...base}><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2" /></svg>
);
export const PhoneIcon = () => (
  <svg {...base}><path d="M5 4h3.5l1.5 4-2 1.3a10 10 0 0 0 6.7 6.7L16 14l4 1.5V19a1.5 1.5 0 0 1-1.6 1.5A15.5 15.5 0 0 1 3.5 5.6 1.5 1.5 0 0 1 5 4Z" /></svg>
);
export const MailIcon = () => (
  <svg {...base}><rect x="3.5" y="5.5" width="17" height="13" rx="2" /><path d="m4 7 8 6 8-6" /></svg>
);
export const ClockIcon = () => (
  <svg {...base}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></svg>
);
export const PinIcon = () => (
  <svg {...base}><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" /><circle cx="12" cy="10" r="2.4" /></svg>
);
export const TruckIcon = () => (
  <svg {...base}><path d="M3 6.5h11v9H3zM14 9.5h4l3 3.2v2.8h-7" /><circle cx="7" cy="17.5" r="1.8" /><circle cx="17.5" cy="17.5" r="1.8" /></svg>
);
export const CashIcon = () => (
  <svg {...base}><rect x="2.5" y="6.5" width="19" height="11" rx="1.8" /><circle cx="12" cy="12" r="2.6" /><path d="M6 9.5v5M18 9.5v5" /></svg>
);
export const CloseIcon = () => (
  <svg {...base} strokeWidth={2}><path d="M6 6l12 12M18 6 6 18" /></svg>
);
