'use client'

// Variante dourada/acinzentada do ShaderBackground (compartilhado com a home,
// em azul/roxo) — isolada aqui para não afetar a home, já que a Fleet Landing
// tem paleta própria (dourado champagne + grafite).
export function FleetShaderBackground() {
  return (
    <>
      <style>{`
        .fl-aurora-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
          overflow: hidden;
          background: #0a0a0a;
        }
        .fl-aurora-blob {
          position: absolute;
          border-radius: 50%;
          will-change: transform;
          pointer-events: none;
        }
        .fl-aurora-blob-1 {
          width: 800px; height: 600px;
          top: -200px; left: -200px;
          background: radial-gradient(ellipse, rgba(201,168,118,0.35) 0%, rgba(180,148,100,0.18) 45%, transparent 70%);
          filter: blur(60px);
          animation: flBlob1 8s ease-in-out infinite alternate;
        }
        .fl-aurora-blob-2 {
          width: 700px; height: 550px;
          top: -150px; right: -150px;
          background: radial-gradient(ellipse, rgba(120,120,120,0.3) 0%, rgba(90,90,90,0.16) 45%, transparent 70%);
          filter: blur(70px);
          animation: flBlob2 10s ease-in-out infinite alternate;
        }
        .fl-aurora-blob-3 {
          width: 600px; height: 500px;
          bottom: -150px; left: 20%;
          background: radial-gradient(ellipse, rgba(228,200,150,0.25) 0%, rgba(201,168,118,0.13) 45%, transparent 70%);
          filter: blur(65px);
          animation: flBlob3 12s ease-in-out infinite alternate;
        }
        .fl-aurora-blob-4 {
          width: 450px; height: 400px;
          top: 15%; right: 5%;
          background: radial-gradient(ellipse, rgba(160,160,160,0.22) 0%, rgba(130,130,130,0.1) 45%, transparent 70%);
          filter: blur(55px);
          animation: flBlob4 7s ease-in-out infinite alternate;
        }
        .fl-aurora-blob-5 {
          width: 350px; height: 300px;
          top: 40%; left: 40%;
          background: radial-gradient(ellipse, rgba(201,168,118,0.2) 0%, rgba(180,148,100,0.08) 45%, transparent 70%);
          filter: blur(50px);
          animation: flBlob5 6s ease-in-out infinite alternate;
        }
        @keyframes flBlob1 {
          0%   { transform: translate3d(0px, 0px, 0) scale(1); }
          100% { transform: translate3d(120px, 140px, 0) scale(1.15); }
        }
        @keyframes flBlob2 {
          0%   { transform: translate3d(0px, 0px, 0) scale(1); }
          100% { transform: translate3d(-100px, 110px, 0) scale(1.1); }
        }
        @keyframes flBlob3 {
          0%   { transform: translate3d(0px, 0px, 0) scale(1); }
          100% { transform: translate3d(80px, -80px, 0) scale(1.2); }
        }
        @keyframes flBlob4 {
          0%   { transform: translate3d(0px, 0px, 0) scale(1); }
          100% { transform: translate3d(-70px, 90px, 0) scale(0.85); }
        }
        @keyframes flBlob5 {
          0%   { transform: translate3d(0px, 0px, 0) scale(1); }
          100% { transform: translate3d(-90px, -70px, 0) scale(1.3); }
        }
      `}</style>
      <div className="fl-aurora-bg">
        <div className="fl-aurora-blob fl-aurora-blob-1" />
        <div className="fl-aurora-blob fl-aurora-blob-2" />
        <div className="fl-aurora-blob fl-aurora-blob-3" />
        <div className="fl-aurora-blob fl-aurora-blob-4" />
        <div className="fl-aurora-blob fl-aurora-blob-5" />
      </div>
    </>
  )
}
