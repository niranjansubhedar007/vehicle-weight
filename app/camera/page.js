"use client"
import { useEffect, useRef } from 'react';
import jsPDF from 'jspdf';

const Camera = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const wsRef = useRef(null);

  useEffect(() => {
    // Connect to WebSocket server
    wsRef.current = new WebSocket('ws://localhost:3000');

    wsRef.current.onmessage = (event) => {
      const blob = new Blob([event.data], { type: 'image/jpeg' });
      const url = URL.createObjectURL(blob);
      const img = new Image();

      img.onload = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        videoRef.current.src = canvas.toDataURL('image/jpeg');
        URL.revokeObjectURL(url);
      };

      img.src = url;
    };

    return () => {
      wsRef.current.close();
    };
  }, []);

  const handlePrint = () => {
    const canvas = canvasRef.current;
    const imgData = canvas.toDataURL('image/jpeg');
    const pdf = new jsPDF();
    pdf.addImage(imgData, 'JPEG', 10, 10);
    pdf.save('cctv-capture.pdf');
  };

  return (
    <div>
      <h1>Live CCTV Stream</h1>
      <video ref={videoRef} autoPlay width="640" height="480"></video>
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
      <button onClick={handlePrint}>Print</button>
    </div>
  );
};

export default Camera;
