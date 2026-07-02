export default function Logo() {
  return (
    <>
      <div className="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M5 15.5 12 4l7 11.5" stroke="#dff7ef" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 15.5h8" stroke="#24c38a" strokeWidth="1.9" strokeLinecap="round" />
          <path d="M10 19h4" stroke="#78a8ff" strokeWidth="1.9" strokeLinecap="round" />
        </svg>
      </div>
      <div className="brand-copy">
        <small>Construction Assurance</small>
        <span>DzeNhare</span>
      </div>
    </>
  );
}
