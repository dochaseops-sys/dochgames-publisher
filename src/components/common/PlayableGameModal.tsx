import React, { useEffect, useRef, useState } from 'react';
import { X, Play, RotateCcw, Volume2, VolumeX, Maximize2, Sparkles, Trophy, Gamepad2 } from 'lucide-react';
import { GameItem } from '../../types';

interface PlayableGameModalProps {
  game: GameItem;
  isOpen: boolean;
  onClose: () => void;
  onGameStart?: () => void;
}

export const PlayableGameModal: React.FC<PlayableGameModalProps> = ({
  game,
  isOpen,
  onClose,
  onGameStart
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(1420);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [fullScreen, setFullScreen] = useState<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Play simple synth sound with Web Audio
  const playSound = (type: 'blip' | 'coin' | 'crash' | 'powerup') => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          audioCtxRef.current = new AudioCtx();
        }
      }
      const ctx = audioCtxRef.current;
      if (!ctx || ctx.state === 'suspended') {
        ctx?.resume();
      }
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === 'blip') {
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === 'coin') {
        osc.frequency.setValueAtTime(587, now);
        osc.frequency.setValueAtTime(880, now + 0.08);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'crash') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.3);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'powerup') {
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.3);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      }
    } catch (e) {
      // Audio might be blocked
    }
  };

  useEffect(() => {
    if (isOpen && onGameStart) {
      onGameStart();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let localScore = 0;
    let isDead = false;

    // Common game state
    // Cyber Neon Racer / Space Runner mechanic
    let playerX = canvas.width / 2;
    const playerY = canvas.height - 80;
    const playerW = 44;
    const playerH = 68;
    let playerSpeed = 0;
    const maxSpeed = 7;

    // Obstacles
    interface Obstacle {
      x: number;
      y: number;
      w: number;
      h: number;
      speed: number;
      color: string;
      isCoin?: boolean;
    }

    let obstacles: Obstacle[] = [];
    let lastSpawn = 0;
    let roadLinesY = 0;

    // Key handlers
    const keys: Record<string, boolean> = {};
    const handleKeyDown = (e: KeyboardEvent) => {
      keys[e.key.toLowerCase()] = true;
      if (['arrowleft', 'arrowright', 'arrowup', 'arrowdown', ' '].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keys[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Touch / Pointer controls on canvas
    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
      playerX = Math.max(playerW / 2 + 30, Math.min(canvas.width - playerW / 2 - 30, x));
    };
    canvas.addEventListener('pointermove', handlePointerMove);

    const restartGame = () => {
      localScore = 0;
      setScore(0);
      isDead = false;
      setGameOver(false);
      obstacles = [];
      playerX = canvas.width / 2;
    };

    let tick = 0;

    const loop = (timestamp: number) => {
      tick++;

      if (!isDead) {
        // Controls
        if (keys['arrowleft'] || keys['a']) {
          playerSpeed = -maxSpeed;
        } else if (keys['arrowright'] || keys['d']) {
          playerSpeed = maxSpeed;
        } else {
          playerSpeed *= 0.8;
        }

        playerX += playerSpeed;
        playerX = Math.max(playerW / 2 + 30, Math.min(canvas.width - playerW / 2 - 30, playerX));

        // Spawning obstacles / coins
        if (timestamp - lastSpawn > 550) {
          lastSpawn = timestamp;
          const isCoin = Math.random() > 0.45;
          const laneW = (canvas.width - 120) / 4;
          const laneIndex = Math.floor(Math.random() * 4);
          const obsX = 60 + laneIndex * laneW + laneW / 2 - (isCoin ? 15 : 22);

          obstacles.push({
            x: obsX,
            y: -50,
            w: isCoin ? 28 : 42,
            h: isCoin ? 28 : 65,
            speed: isCoin ? 4.5 : 5 + Math.random() * 2.5,
            color: isCoin ? '#FFB51A' : Math.random() > 0.5 ? '#FF4051' : '#D82CF4',
            isCoin
          });
        }

        // Road animation
        roadLinesY = (roadLinesY + 6) % 40;

        // Update score
        if (tick % 6 === 0) {
          localScore += 1;
          setScore(localScore);
          if (localScore > highScore) {
            setHighScore(localScore);
          }
        }
      }

      // Drawing
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background - synth dark grid
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, '#040d24');
      grad.addColorStop(1, '#071B4B');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Road borders
      ctx.strokeStyle = '#129BFF';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(35, 0);
      ctx.lineTo(35, canvas.height);
      ctx.moveTo(canvas.width - 35, 0);
      ctx.lineTo(canvas.width - 35, canvas.height);
      ctx.stroke();

      // Road glow lines
      ctx.strokeStyle = 'rgba(17, 217, 255, 0.2)';
      ctx.lineWidth = 1;
      for (let x = 60; x < canvas.width - 60; x += (canvas.width - 120) / 4) {
        ctx.beginPath();
        ctx.setLineDash([20, 20]);
        ctx.lineDashOffset = -roadLinesY;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // Draw obstacles & coins
      for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i];
        if (!isDead) {
          obs.y += obs.speed;
        }

        if (obs.isCoin) {
          // Draw Energy Orb / Coin
          ctx.save();
          ctx.beginPath();
          ctx.arc(obs.x + obs.w / 2, obs.y + obs.h / 2, obs.w / 2, 0, Math.PI * 2);
          ctx.fillStyle = '#FFB51A';
          ctx.shadowColor = '#FFB51A';
          ctx.shadowBlur = 12;
          ctx.fill();

          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 13px Inter';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('⚡', obs.x + obs.w / 2, obs.y + obs.h / 2);
          ctx.restore();
        } else {
          // Draw Cyber Car obstacle
          ctx.save();
          ctx.fillStyle = obs.color;
          ctx.shadowColor = obs.color;
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.roundRect(obs.x, obs.y, obs.w, obs.h, 8);
          ctx.fill();

          // Headlights
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(obs.x + 4, obs.y + obs.h - 6, 8, 4);
          ctx.fillRect(obs.x + obs.w - 12, obs.y + obs.h - 6, 8, 4);
          ctx.restore();
        }

        // Collision check
        const px = playerX - playerW / 2;
        const py = playerY;
        if (
          px < obs.x + obs.w &&
          px + playerW > obs.x &&
          py < obs.y + obs.h &&
          py + playerH > obs.y
        ) {
          if (obs.isCoin) {
            localScore += 25;
            setScore(localScore);
            playSound('coin');
            obstacles.splice(i, 1);
            continue;
          } else if (!isDead) {
            isDead = true;
            setGameOver(true);
            playSound('crash');
          }
        }

        // Remove off-screen
        if (obs.y > canvas.height + 50) {
          obstacles.splice(i, 1);
        }
      }

      // Draw Player Car
      ctx.save();
      const pLeft = playerX - playerW / 2;
      ctx.shadowColor = '#11D9FF';
      ctx.shadowBlur = 16;
      ctx.fillStyle = '#129BFF';
      ctx.beginPath();
      ctx.roundRect(pLeft, playerY, playerW, playerH, 10);
      ctx.fill();

      // Cockpit windshield
      ctx.fillStyle = '#071B4B';
      ctx.beginPath();
      ctx.roundRect(pLeft + 8, playerY + 16, playerW - 16, 24, 4);
      ctx.fill();

      // Neon Thruster glow
      ctx.fillStyle = isDead ? '#FF4051' : '#11D9FF';
      ctx.fillRect(pLeft + 8, playerY + playerH - 4, 10, 4);
      ctx.fillRect(pLeft + playerW - 18, playerY + playerH - 4, 10, 4);

      // Particle trails
      if (!isDead && tick % 2 === 0) {
        ctx.fillStyle = 'rgba(17, 217, 255, 0.6)';
        ctx.fillRect(pLeft + 10, playerY + playerH + 4, 6, 12);
        ctx.fillRect(pLeft + playerW - 16, playerY + playerH + 4, 6, 12);
      }
      ctx.restore();

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      canvas.removeEventListener('pointermove', handlePointerMove);
    };
  }, [isOpen, soundEnabled, highScore]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div 
        className={`bg-white border border-slate-200/90 rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-200 ${
          fullScreen ? 'w-full h-full max-w-none rounded-none' : 'w-full max-w-4xl h-[680px]'
        }`}
      >
        {/* Header bar */}
        <div className="px-6 py-4 bg-white border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-xs">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-lg text-slate-900 leading-tight">
                  {game.title}
                </h3>
                <span className="text-xs text-slate-300">·</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-blue-50 text-blue-600 font-bold border border-blue-100">
                  v{game.version}
                </span>
                <span className="text-xs text-slate-300">·</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                  DochGames Sandbox
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate max-w-md mt-0.5">
                {game.studioName} · {game.genre} · Verified 60fps HTML5 Container
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-4 bg-slate-100/80 px-3.5 py-1.5 rounded-full border border-slate-200 mr-2 text-xs">
              <div className="flex items-center gap-1.5 text-slate-600">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Score: <strong className="text-slate-900 font-bold">{score}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-500">
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                <span>Best: <strong className="text-slate-700 font-bold">{highScore}</strong></span>
              </div>
            </div>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
              className="p-2 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-blue-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>

            <button
              onClick={() => setFullScreen(!fullScreen)}
              title={fullScreen ? 'Exit Fullscreen' : 'Fullscreen'}
              className="p-2 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              title="Close Player"
              className="p-2 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Game Canvas Container */}
        <div className="relative flex-1 bg-slate-950 flex items-center justify-center overflow-hidden">
          <canvas
            ref={canvasRef}
            width={640}
            height={520}
            className="w-full h-full max-w-[720px] max-h-[540px] object-contain cursor-crosshair shadow-inner"
          />

          {/* Game Over Screen */}
          {gameOver && (
            <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fade-in z-20">
              <div className="w-16 h-16 rounded-3xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center mb-4 text-rose-400 shadow-lg">
                <Gamepad2 className="w-8 h-8" />
              </div>
              <h4 className="font-display text-2xl font-bold text-white mb-1">Session Concluded</h4>
              <p className="text-slate-300 text-sm mb-5">
                You scored <span className="text-[#D6F938] font-bold text-xl">{score}</span> points!
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setGameOver(false);
                    setScore(0);
                    playSound('blip');
                  }}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  Play Again
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-full bg-slate-800 text-slate-200 text-sm font-semibold hover:bg-slate-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* On-screen touch hints */}
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between pointer-events-none text-xs text-slate-400/80">
            <span className="bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full border border-slate-700/80 text-[11px] text-slate-300">
              Controls: Left/Right Arrow or Touch / Mouse Drag
            </span>
            <span className="bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full border border-slate-700/80 text-[11px] text-slate-300">
              60 FPS · DochGames Web Container
            </span>
          </div>
        </div>

        {/* Footer info bar */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-3">
            <span>Package: {game.technical.packageSizeMb} MB</span>
            <span>·</span>
            <span>Orientation: {game.orientation}</span>
            <span>·</span>
            <span>Rating: ★ {game.stats.rating} ({game.stats.ratingCount.toLocaleString()})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Attribution & Revenue Analytics Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};
