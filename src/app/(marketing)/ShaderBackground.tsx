'use client'

export function ShaderBackground() {
  return (
    <>
      <style>{`
        .aurora-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
          overflow: hidden;
          background: #0c0d0f;
        }
        .aurora-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          mix-blend-mode: screen;
          opacity: 0.35;
          will-change: transform;
        }
        .aurora-blob-1 {
          width: 700px; height: 500px;
          top: -100px; left: -150px;
          background: radial-gradient(ellipse, #1d4ed8 0%, #3b82f6 40%, transparent 70%);
          animation: aurora1 14s ease-in-out infinite alternate;
        }
        .aurora-blob-2 {
          width: 600px; height: 450px;
          top: -80px; right: -100px;
          background: radial-gradient(ellipse, #4f46e5 0%, #6366f1 40%, transparent 70%);
          animation: aurora2 18s ease-in-out infinite alternate;
        }
        .aurora-blob-3 {
          width: 500px; height: 400px;
          bottom: -80px; left: 30%;
          background: radial-gradient(ellipse, #0e7490 0%, #06b6d4 40%, transparent 70%);
          animation: aurora3 22s ease-in-out infinite alternate;
        }
        .aurora-blob-4 {
          width: 400px; height: 350px;
          top: 20%; right: 10%;
          background: radial-gradient(ellipse, #1e3a5f 0%, #2563eb 40%, transparent 70%);
          animation: aurora4 16s ease-in-out infinite alternate;
        }
        @keyframes aurora1 {
          0%   { transform: translate(0px,  0px) scale(1); }
          50%  { transform: translate(80px, 60px) scale(1.1); }
          100% { transform: translate(40px, 120px) scale(0.95); }
        }
        @keyframes aurora2 {
          0%   { transform: translate(0px, 0px) scale(1); }
          50%  { transform: translate(-60px, 80px) scale(1.15); }
          100% { transform: translate(-30px, 40px) scale(0.9); }
        }
        @keyframes aurora3 {
          0%   { transform: translate(0px, 0px) scale(1); }
          50%  { transform: translate(50px, -40px) scale(1.2); }
          100% { transform: translate(-60px, -20px) scale(1.05); }
        }
        @keyframes aurora4 {
          0%   { transform: translate(0px, 0px) scale(1); }
          50%  { transform: translate(-40px, 60px) scale(0.9); }
          100% { transform: translate(30px, 30px) scale(1.1); }
        }
      `}</style>
      <div className="aurora-bg">
        <div className="aurora-blob aurora-blob-1" />
        <div className="aurora-blob aurora-blob-2" />
        <div className="aurora-blob aurora-blob-3" />
        <div className="aurora-blob aurora-blob-4" />
      </div>
    </>
  )
}
