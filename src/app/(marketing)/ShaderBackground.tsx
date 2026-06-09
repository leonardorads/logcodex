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
          will-change: transform;
          pointer-events: none;
        }
        .aurora-blob-1 {
          width: 800px; height: 600px;
          top: -200px; left: -200px;
          background: radial-gradient(ellipse, rgba(29,78,216,0.7) 0%, rgba(59,130,246,0.4) 45%, transparent 70%);
          filter: blur(60px);
          animation: aBlob1 8s ease-in-out infinite alternate;
        }
        .aurora-blob-2 {
          width: 700px; height: 550px;
          top: -150px; right: -150px;
          background: radial-gradient(ellipse, rgba(79,70,229,0.65) 0%, rgba(99,102,241,0.35) 45%, transparent 70%);
          filter: blur(70px);
          animation: aBlob2 10s ease-in-out infinite alternate;
        }
        .aurora-blob-3 {
          width: 600px; height: 500px;
          bottom: -150px; left: 20%;
          background: radial-gradient(ellipse, rgba(14,116,144,0.6) 0%, rgba(6,182,212,0.3) 45%, transparent 70%);
          filter: blur(65px);
          animation: aBlob3 12s ease-in-out infinite alternate;
        }
        .aurora-blob-4 {
          width: 450px; height: 400px;
          top: 15%; right: 5%;
          background: radial-gradient(ellipse, rgba(37,99,235,0.55) 0%, rgba(96,165,250,0.25) 45%, transparent 70%);
          filter: blur(55px);
          animation: aBlob4 7s ease-in-out infinite alternate;
        }
        .aurora-blob-5 {
          width: 350px; height: 300px;
          top: 40%; left: 40%;
          background: radial-gradient(ellipse, rgba(109,40,217,0.45) 0%, rgba(139,92,246,0.2) 45%, transparent 70%);
          filter: blur(50px);
          animation: aBlob5 6s ease-in-out infinite alternate;
        }
        @keyframes aBlob1 {
          0%   { transform: translate3d(0px, 0px, 0) scale(1); }
          100% { transform: translate3d(120px, 140px, 0) scale(1.15); }
        }
        @keyframes aBlob2 {
          0%   { transform: translate3d(0px, 0px, 0) scale(1); }
          100% { transform: translate3d(-100px, 110px, 0) scale(1.1); }
        }
        @keyframes aBlob3 {
          0%   { transform: translate3d(0px, 0px, 0) scale(1); }
          100% { transform: translate3d(80px, -80px, 0) scale(1.2); }
        }
        @keyframes aBlob4 {
          0%   { transform: translate3d(0px, 0px, 0) scale(1); }
          100% { transform: translate3d(-70px, 90px, 0) scale(0.85); }
        }
        @keyframes aBlob5 {
          0%   { transform: translate3d(0px, 0px, 0) scale(1); }
          100% { transform: translate3d(-90px, -70px, 0) scale(1.3); }
        }
      `}</style>
      <div className="aurora-bg">
        <div className="aurora-blob aurora-blob-1" />
        <div className="aurora-blob aurora-blob-2" />
        <div className="aurora-blob aurora-blob-3" />
        <div className="aurora-blob aurora-blob-4" />
        <div className="aurora-blob aurora-blob-5" />
      </div>
    </>
  )
}
