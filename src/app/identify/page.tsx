'use client';

import { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import apiConfig from '@/config/apiConfig';
import GradientLayout from '@/components/GradientLayout';

const IdentifyPage = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'detecting' | 'sending' | 'success' | 'error'>('idle');

  // Load face-api models once
  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      setIsModelLoaded(true);
    };
    loadModels();
  }, []);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  // Start video stream and detection
  const startDetection = async () => {
    setStatus('detecting');
    setIsDetecting(true);
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoRef.current) videoRef.current.srcObject = stream;
  };

  // Run face detection in interval
  useEffect(() => {
    if (!isDetecting || !isModelLoaded) return;

    const interval = setInterval(async () => {
      if (!videoRef.current || !canvasRef.current) return;

      const detection = await faceapi.detectSingleFace(
        videoRef.current,
        new faceapi.TinyFaceDetectorOptions()
      );

      const canvas = canvasRef.current;
      const dims = faceapi.matchDimensions(canvas, videoRef.current, true) as faceapi.Dimensions;
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);

      if (detection && ctx) {
        drawBox(ctx, detection, dims);
        setIsDetecting(false);
        setStatus('sending');
        await sendFaceToServer(detection, dims);
      }
    }, 700);

    return () => clearInterval(interval);
  }, [isDetecting, isModelLoaded]);

  const drawBox = (
    ctx: CanvasRenderingContext2D | null,
    detection: faceapi.FaceDetection,
    dims: faceapi.Dimensions
  ) => {
    if (!ctx) return;
    const resized = faceapi.resizeResults(detection, dims);
    const { x, y, width, height } = resized.box;
    ctx.strokeStyle = '#00FF00';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);
  };

  const sendFaceToServer = async (
    detection: faceapi.FaceDetection,
    dims: faceapi.Dimensions
  ) => {
    setIsLoading(true);

    const resized = faceapi.resizeResults(detection, dims);
    const canvas = document.createElement('canvas');
    canvas.width = resized.box.width;
    canvas.height = resized.box.height;

    const ctx = canvas.getContext('2d');
    if (!ctx || !videoRef.current) return;

    ctx.drawImage(
      videoRef.current,
      resized.box.x,
      resized.box.y,
      resized.box.width,
      resized.box.height,
      0,
      0,
      resized.box.width,
      resized.box.height
    );

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const formData = new FormData();
      formData.append('file', blob, 'face.jpg');

      try {
        const res = await fetch(`${apiConfig.face_ai}/identify`, {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();

        if (res.ok && data.match) {
            setStatus('success');
            alert(`Welcome back, ${data.user_id || 'user'}! Attendance recorded.`);
          
            setTimeout(() => {
              stopCamera();
              clearCanvas();
              setStatus('idle');
              setIsDetecting(false);
            }, 1000);
          }
      } catch (err) {
        console.error(err);
        setStatus('error');
        alert('An error occurred during identification.');
      } finally {
        setIsLoading(false);
      }
    }, 'image/jpeg');
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach((track) => track.stop());
    videoRef.current!.srcObject = null;
  };

  return (
    <GradientLayout>
      <h2 className="text-2xl font-semibold mb-4">Facial Identification</h2>

      <div className="relative w-[320px] h-[240px] mb-4">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="rounded shadow-md absolute w-full h-full object-cover"
        />
        <canvas
          ref={canvasRef}
          width={320}
          height={240}
          className="absolute top-0 left-0 w-full h-full"
        />
        {status === 'sending' && (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {status === 'idle' && (
        <button
          onClick={startDetection}
          disabled={!isModelLoaded}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-indigo-700 transition"
        >
          Start
        </button>
      )}
    </GradientLayout>
  );
};

export default IdentifyPage;
