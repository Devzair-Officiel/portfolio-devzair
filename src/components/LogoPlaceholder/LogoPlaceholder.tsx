export const LogoPlaceholder = () => {
  return (
    <div
      className="w-24 h-24 rounded-2xl flex items-center justify-center relative"
      style={{
        background: 'linear-gradient(135deg, #7c6fff22, #7c6fff44)',
        border: '1px solid #7c6fff55',
        boxShadow: '0 0 32px #7c6fff33, inset 0 0 24px #7c6fff11',
      }}
    >
      <span
        className="font-extrabold text-2xl tracking-widest"
        style={{
          background: 'linear-gradient(135deg, #a78bfa, #7c6fff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        DZ
      </span>
    </div>
  )
}
