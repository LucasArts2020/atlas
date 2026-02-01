"use client";

import { Sidebar } from "@/components/Sidebar";
import { useState, useEffect, useCallback } from "react";
import { Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react";
import Link from "next/link";

type TimerMode = "work" | "break";

interface WindowWithWebkitAudioContext extends Window {
  webkitAudioContext?: typeof AudioContext;
}

export default function TimerPage() {
  const [mode, setMode] = useState<TimerMode>("work");
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutos em segundos
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const WORK_TIME = 25 * 60; // 25 minutos
  const BREAK_TIME = 5 * 60; // 5 minutos
  const LONG_BREAK_TIME = 15 * 60; // 15 minutos

  const playSound = useCallback(() => {
    // Som simples usando Web Audio API
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as WindowWithWebkitAudioContext).webkitAudioContext;
    const audioContext = new AudioContextClass();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.5,
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  }, []);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    let timeoutId: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      // Timer acabou
      if (soundEnabled) {
        playSound();
      }

      // Agendar a mudança de estado para o próximo tick
      timeoutId = setTimeout(() => {
        setTimeLeft((prevTimeLeft) => {
          if (prevTimeLeft === 0) {
            if (mode === "work") {
              // Passou para break
              const isLongBreak = (sessionsCompleted + 1) % 4 === 0;
              setMode("break");
              return isLongBreak ? LONG_BREAK_TIME : BREAK_TIME;
            } else {
              // Passou para work
              setMode("work");
              setSessionsCompleted((prev) => prev + 1);
              return WORK_TIME;
            }
          }
          return prevTimeLeft;
        });
      }, 0);
    }

    return () => {
      clearInterval(interval);
      clearTimeout(timeoutId);
    };
  }, [
    isRunning,
    timeLeft,
    mode,
    sessionsCompleted,
    soundEnabled,
    WORK_TIME,
    BREAK_TIME,
    LONG_BREAK_TIME,
    playSound,
  ]);

  const handlePlayPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setMode("work");
    setTimeLeft(WORK_TIME);
  };

  const handleChangeMode = (newMode: TimerMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(newMode === "work" ? WORK_TIME : BREAK_TIME);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progress =
    mode === "work"
      ? (WORK_TIME - timeLeft) / WORK_TIME
      : (BREAK_TIME - timeLeft) / BREAK_TIME;

  const circumference = 2 * Math.PI * 90;

  return (
    <div className="min-h-screen bg-[#f8f5f2] text-[#1a1a1a] font-sans flex">
      <div className="fixed left-0 top-0 h-full z-30">
        <Sidebar />
      </div>

      <main className="flex-1 ml-20 p-4 sm:p-6 md:p-8 lg:p-12 min-h-screen flex flex-col items-center justify-center">
        <div className="w-full max-w-lg">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <Link
              href="/"
              className="text-sm text-gray-500 hover:text-gray-700 mb-4 inline-block transition"
            >
              ← Voltar
            </Link>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1a1a1a] mb-2">
              Pomodoro
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Foco e produtividade
            </p>
          </div>

          {/* Card Principal */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 sm:p-8 space-y-6 sm:space-y-8">
            {/* Modo Seletor */}
            <div className="flex gap-3 sm:gap-4">
              <button
                onClick={() => handleChangeMode("work")}
                className={`flex-1 py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg transition shadow-md hover:shadow-lg ${
                  mode === "work"
                    ? "bg-[#ef7e77] text-white hover:bg-[#e86961]"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Trabalho
              </button>
              <button
                onClick={() => handleChangeMode("break")}
                className={`flex-1 py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg transition shadow-md hover:shadow-lg ${
                  mode === "break"
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Pausa
              </button>
            </div>

            {/* Display do Timer */}
            <div className="relative w-full aspect-square flex items-center justify-center px-4">
              {/* Círculo de Progresso */}
              <svg
                className="w-full h-full max-w-sm"
                viewBox="0 0 200 200"
                style={{ transform: "rotate(-90deg)" }}
              >
                {/* Círculo de fundo */}
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke="#eecbc4"
                  strokeWidth="6"
                />
                {/* Círculo de progresso */}
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke={mode === "work" ? "#ef7e77" : "#4ade80"}
                  strokeWidth="6"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference * (1 - progress)}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>

              {/* Texto do Timer (Overlay) */}
              <div className="absolute text-center">
                <div className="text-5xl sm:text-7xl font-bold text-[#1a1a1a] font-mono leading-none">
                  {formatTime(timeLeft)}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 mt-2 sm:mt-3 uppercase tracking-wider font-medium">
                  {mode === "work" ? "Trabalho" : "Pausa"}
                </div>
              </div>
            </div>

            {/* Controles */}
            <div className="flex gap-4 sm:gap-6 justify-center flex-wrap">
              <button
                onClick={handlePlayPause}
                className="w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-[#ef7e77] hover:bg-[#e86961] text-white shadow-lg hover:shadow-xl transition transform hover:scale-110 flex items-center justify-center shrink-0"
                title={isRunning ? "Pausar" : "Iniciar"}
              >
                {isRunning ? (
                  <Pause size={28} className="sm:w-8 sm:h-8" />
                ) : (
                  <Play size={28} className="sm:w-8 sm:h-8" />
                )}
              </button>
              <button
                onClick={handleReset}
                className="w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-[#1a1a1a] hover:bg-gray-800 text-white shadow-lg hover:shadow-xl transition transform hover:scale-110 flex items-center justify-center shrink-0"
                title="Resetar"
              >
                <RotateCcw size={28} className="sm:w-8 sm:h-8" />
              </button>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`w-16 sm:w-20 h-16 sm:h-20 rounded-full shadow-lg hover:shadow-xl transition transform hover:scale-110 flex items-center justify-center shrink-0 ${
                  soundEnabled
                    ? "bg-blue-500 hover:bg-blue-600 text-white"
                    : "bg-gray-400 hover:bg-gray-500 text-white"
                }`}
                title={soundEnabled ? "Som ativado" : "Som desativado"}
              >
                {soundEnabled ? (
                  <Volume2 size={28} className="sm:w-8 sm:h-8" />
                ) : (
                  <VolumeX size={28} className="sm:w-8 sm:h-8" />
                )}
              </button>
            </div>

            {/* Estatísticas */}
            <div className="bg-[#f8f5f2] p-4 sm:p-6 rounded-2xl">
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-bold text-[#ef7e77]">
                  {sessionsCompleted}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 uppercase tracking-wider mt-2 font-medium">
                  Sessões
                </div>
              </div>
            </div>

            {/* Dicas */}
            <div className="bg-blue-50 border border-blue-200 p-4 sm:p-5 rounded-2xl">
              <h3 className="font-bold text-blue-900 mb-2 text-sm sm:text-base">
                💡 Como Funciona:
              </h3>
              <p className="text-xs sm:text-sm text-blue-800 leading-relaxed">
                Trabalhe por 25 minutos, pausa de 5 minutos. Após 4 ciclos,
                pausa de 15 minutos.
              </p>
            </div>
          </div>

          {/* Footer Info */}
          <div className="text-center mt-6 sm:mt-8 text-gray-600 text-xs sm:text-sm">
            <p>
              {mode === "work" ? "Tempo restante:" : "Próximo trabalho:"}{" "}
              {formatTime(mode === "work" ? timeLeft : WORK_TIME)}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
