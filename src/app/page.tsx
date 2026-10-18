"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Camera,
  Check,
  Download,
  Grid2X2,
  Image as ImageIcon,
  Languages,
  LayoutPanelTop,
  Pencil,
  Printer,
  RefreshCw,
  RotateCcw,
  Smile,
  Trash2,
  Type,
  Upload,
  X,
} from "lucide-react";

const filters = [
  { id: "original", name: "Asli", value: "none" },
  {
    id: "blackWhite",
    name: "Hitam Putih",
    value: "grayscale(1) contrast(1.08)",
  },
  {
    id: "softMono",
    name: "Mono Lembut",
    value: "grayscale(1) contrast(.9) brightness(1.08)",
  },
  {
    id: "strongMono",
    name: "Mono Tegas",
    value: "grayscale(1) contrast(1.45) brightness(.92)",
  },
  {
    id: "warm",
    name: "Hangat",
    value: "sepia(.22) saturate(1.18) brightness(1.03)",
  },
  {
    id: "cool",
    name: "Dingin",
    value: "saturate(.92) hue-rotate(168deg) brightness(1.02)",
  },
  { id: "film", name: "Film", value: "sepia(.28) contrast(.94) saturate(.86)" },
  { id: "bright", name: "Cerah", value: "brightness(1.08) saturate(1.14)" },
  { id: "contrast", name: "Kontras", value: "contrast(1.28) saturate(.9)" },
  {
    id: "natural",
    name: "Natural",
    value: "contrast(1.04) saturate(1.06) brightness(1.01)",
  },
  {
    id: "portrait",
    name: "Potret",
    value: "brightness(1.06) contrast(.96) saturate(.92)",
  },
  {
    id: "goldenHour",
    name: "Golden Hour",
    value: "sepia(.18) saturate(1.32) brightness(1.07) hue-rotate(-8deg)",
  },
  {
    id: "sunset",
    name: "Senja",
    value: "sepia(.3) saturate(1.48) contrast(1.06) hue-rotate(-12deg)",
  },
  {
    id: "coffee",
    name: "Kopi",
    value: "sepia(.42) saturate(.82) contrast(1.08) brightness(.94)",
  },
  {
    id: "vintage",
    name: "Vintage",
    value: "sepia(.48) saturate(.72) contrast(.92) brightness(.96)",
  },
  {
    id: "retro",
    name: "Retro",
    value: "sepia(.3) saturate(1.35) contrast(1.12) hue-rotate(-18deg)",
  },
  {
    id: "fade",
    name: "Pudar",
    value: "contrast(.78) saturate(.75) brightness(1.12)",
  },
  {
    id: "matte",
    name: "Matte",
    value: "contrast(.82) saturate(.88) brightness(1.06)",
  },
  {
    id: "pastel",
    name: "Pastel",
    value: "contrast(.84) saturate(.78) brightness(1.13)",
  },
  { id: "vivid", name: "Vivid", value: "saturate(1.75) contrast(1.12)" },
  {
    id: "pop",
    name: "Pop",
    value: "saturate(2.15) contrast(1.18) brightness(1.02)",
  },
  {
    id: "emerald",
    name: "Emerald",
    value: "hue-rotate(48deg) saturate(1.35) contrast(1.04)",
  },
  {
    id: "ocean",
    name: "Laut",
    value: "hue-rotate(176deg) saturate(1.42) contrast(1.06)",
  },
  {
    id: "lavender",
    name: "Lavender",
    value: "hue-rotate(232deg) saturate(1.18) brightness(1.06)",
  },
  {
    id: "rose",
    name: "Mawar",
    value: "hue-rotate(318deg) saturate(1.28) brightness(1.04)",
  },
  {
    id: "cyber",
    name: "Cyber",
    value: "hue-rotate(205deg) saturate(2) contrast(1.22)",
  },
  {
    id: "noir",
    name: "Noir",
    value: "grayscale(1) contrast(1.62) brightness(.8)",
  },
  {
    id: "dramatic",
    name: "Dramatis",
    value: "contrast(1.55) saturate(.72) brightness(.9)",
  },
  {
    id: "softGlow",
    name: "Soft Glow",
    value: "brightness(1.13) contrast(.82) saturate(1.08)",
  },
  {
    id: "lowLight",
    name: "Cahaya Rendah",
    value: "brightness(1.3) contrast(1.08) saturate(.9)",
  },
  {
    id: "cinematic",
    name: "Sinematik",
    value: "contrast(1.22) saturate(.78) brightness(.94) sepia(.08)",
  },
  {
    id: "tealOrange",
    name: "Teal & Orange",
    value: "contrast(1.18) saturate(1.32) hue-rotate(338deg) sepia(.12)",
  },
  {
    id: "midnight",
    name: "Tengah Malam",
    value: "brightness(.72) contrast(1.35) saturate(.72) hue-rotate(188deg)",
  },
  {
    id: "moonlight",
    name: "Cahaya Bulan",
    value: "brightness(.9) contrast(1.14) saturate(.55) hue-rotate(175deg)",
  },
  {
    id: "arctic",
    name: "Arktik",
    value: "brightness(1.1) contrast(.94) saturate(.72) hue-rotate(165deg)",
  },
  {
    id: "tropical",
    name: "Tropis",
    value: "saturate(1.62) contrast(1.08) brightness(1.04) hue-rotate(8deg)",
  },
  {
    id: "peach",
    name: "Persik",
    value: "sepia(.16) saturate(1.22) brightness(1.1) hue-rotate(342deg)",
  },
  {
    id: "blush",
    name: "Blush",
    value: "sepia(.1) saturate(1.16) brightness(1.08) hue-rotate(322deg)",
  },
  {
    id: "honey",
    name: "Madu",
    value: "sepia(.25) saturate(1.3) brightness(1.06) hue-rotate(350deg)",
  },
  {
    id: "autumn",
    name: "Musim Gugur",
    value: "sepia(.34) saturate(1.38) contrast(1.05) hue-rotate(338deg)",
  },
  {
    id: "forest",
    name: "Hutan",
    value: "saturate(1.2) contrast(1.12) brightness(.92) hue-rotate(38deg)",
  },
  {
    id: "desert",
    name: "Gurun",
    value: "sepia(.38) saturate(1.05) contrast(1.1) brightness(1.02)",
  },
  {
    id: "polaroid",
    name: "Polaroid",
    value: "sepia(.16) saturate(.82) contrast(.88) brightness(1.12)",
  },
  {
    id: "analog",
    name: "Analog",
    value: "sepia(.22) saturate(.94) contrast(1.16) brightness(.98)",
  },
  {
    id: "chrome",
    name: "Chrome",
    value: "saturate(1.48) contrast(1.32) brightness(.98)",
  },
  {
    id: "silver",
    name: "Perak",
    value: "grayscale(.82) contrast(1.2) brightness(1.04)",
  },
  {
    id: "graphite",
    name: "Grafit",
    value: "grayscale(1) contrast(1.28) brightness(.88)",
  },
  {
    id: "dreamyBlue",
    name: "Biru Mimpi",
    value: "brightness(1.12) contrast(.82) saturate(.92) hue-rotate(165deg)",
  },
  {
    id: "neon",
    name: "Neon",
    value: "saturate(2.45) contrast(1.35) brightness(1.02) hue-rotate(18deg)",
  },
  {
    id: "magenta",
    name: "Magenta",
    value: "saturate(1.72) contrast(1.12) hue-rotate(292deg) brightness(1.03)",
  },
  {
    id: "cobalt",
    name: "Kobalt",
    value: "hue-rotate(178deg) saturate(1.72) contrast(1.16) brightness(.98)",
  },
  {
    id: "aqua",
    name: "Aqua",
    value: "hue-rotate(142deg) saturate(1.55) contrast(1.05) brightness(1.08)",
  },
  {
    id: "mint",
    name: "Mint",
    value: "hue-rotate(92deg) saturate(.82) contrast(.92) brightness(1.12)",
  },
  {
    id: "lime",
    name: "Limau",
    value: "hue-rotate(58deg) saturate(1.65) contrast(1.1) brightness(1.04)",
  },
  {
    id: "amber",
    name: "Amber",
    value: "sepia(.3) saturate(1.62) contrast(1.08) hue-rotate(352deg)",
  },
  {
    id: "coral",
    name: "Koral",
    value: "sepia(.14) saturate(1.52) contrast(1.04) hue-rotate(325deg)",
  },
  {
    id: "ruby",
    name: "Rubi",
    value: "hue-rotate(305deg) saturate(1.82) contrast(1.2) brightness(.96)",
  },
  {
    id: "plum",
    name: "Plum",
    value: "hue-rotate(250deg) saturate(1.38) contrast(1.16) brightness(.9)",
  },
  {
    id: "violet",
    name: "Violet",
    value: "hue-rotate(224deg) saturate(1.65) contrast(1.08) brightness(1.02)",
  },
  {
    id: "ice",
    name: "Es",
    value: "brightness(1.18) contrast(.88) saturate(.62) hue-rotate(170deg)",
  },
  {
    id: "mist",
    name: "Kabut Tipis",
    value: "brightness(1.14) contrast(.72) saturate(.7)",
  },
  {
    id: "haze",
    name: "Berkabut",
    value: "sepia(.08) brightness(1.12) contrast(.76) saturate(.82)",
  },
  {
    id: "sand",
    name: "Pasir",
    value: "sepia(.32) saturate(.76) contrast(.9) brightness(1.08)",
  },
  {
    id: "bronze",
    name: "Perunggu",
    value: "sepia(.5) saturate(1.18) contrast(1.22) brightness(.9)",
  },
  {
    id: "charcoal",
    name: "Arang",
    value: "grayscale(1) contrast(1.8) brightness(.68)",
  },
  {
    id: "paper",
    name: "Kertas",
    value: "grayscale(.22) sepia(.12) contrast(.72) brightness(1.2)",
  },
  {
    id: "studio",
    name: "Studio",
    value: "contrast(1.1) saturate(.92) brightness(1.08)",
  },
  {
    id: "editorial",
    name: "Editorial",
    value: "contrast(1.32) saturate(.68) brightness(.98) sepia(.06)",
  },
  {
    id: "nightVision",
    name: "Penglihatan Malam",
    value:
      "grayscale(.35) sepia(.5) hue-rotate(62deg) saturate(2.3) contrast(1.35)",
  },
  {
    id: "ultraviolet",
    name: "Ultraviolet",
    value: "hue-rotate(245deg) saturate(2.2) contrast(1.28) brightness(.94)",
  },
] as const;
type Filter = (typeof filters)[number];
type CaptureMode = 1 | 2 | 4 | 6 | 8;
type Orientation = "horizontal" | "vertical";
type FrameId =
  | "white"
  | "black"
  | "cream"
  | "gray"
  | "pink"
  | "none"
  | "custom";
type Photo = {
  id: string;
  url: string;
  filterId: string;
  createdAt: Date;
  gridCount: CaptureMode;
};
const frames: { id: FrameId; color: string; label: string }[] = [
  { id: "white", color: "#fff", label: "Putih" },
  { id: "black", color: "#111", label: "Hitam" },
  { id: "cream", color: "#f3ead7", label: "Krem" },
  { id: "gray", color: "#737373", label: "Abu-abu" },
  { id: "pink", color: "#f4b8c4", label: "Merah Muda" },
  { id: "none", color: "transparent", label: "Tanpa Frame" },
  { id: "custom", color: "transparent", label: "PNG Kustom" },
];
const stickers = ["✨", "❤️", "⭐", "🎉", "🌸", "😎", "🔥", "📸", "🎀", "☁️"];

export default function HomePage() {
  const videoRef = useRef<HTMLVideoElement>(null),
    streamRef = useRef<MediaStream | null>(null),
    framesRef = useRef<HTMLCanvasElement[]>([]),
    customFrameRef = useRef<HTMLImageElement | null>(null),
    fileRef = useRef<HTMLInputElement>(null);
  const [activeFilter, setActiveFilter] = useState<Filter>(filters[0]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [facing, setFacing] = useState<"user" | "environment">("user");
  const [mode, setMode] = useState<CaptureMode>(1);
  const [progress, setProgress] = useState(0);
  const [orientation, setOrientation] = useState<Orientation>("horizontal");
  const [frameId, setFrameId] = useState<FrameId>("white");
  const [customFrameName, setCustomFrameName] = useState("");
  const [flash, setFlash] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [preview, setPreview] = useState<Photo | null>(null);
  const [editor, setEditor] = useState<{
    canvas: HTMLCanvasElement;
    gridCount: CaptureMode;
    filterId: string;
  } | null>(null);
  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setReady(false);
  }, []);
  const start = useCallback(async () => {
    stop();
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: { ideal: facing },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setReady(true);
    } catch {
      setError("Kamera tidak dapat digunakan. Periksa izin browser.");
    }
  }, [facing, stop]);
  useEffect(() => {
    start();
    return stop;
  }, [start, stop]);
  useEffect(() => () => photos.forEach((p) => URL.revokeObjectURL(p.url)), []);
  const capture = () => {
    const v = videoRef.current;
    if (!v?.videoWidth) return null;
    const c = document.createElement("canvas");
    c.width = v.videoWidth;
    c.height = v.videoHeight;
    const x = c.getContext("2d");
    if (!x) return null;
    x.filter = activeFilter.value;
    if (facing === "user") {
      x.translate(c.width, 0);
      x.scale(-1, 1);
    }
    x.drawImage(v, 0, 0);
    return c;
  };
  const frameColor = frames.find((f) => f.id === frameId)?.color || "#fff";
  const drawCover = (
    ctx: CanvasRenderingContext2D,
    src: HTMLCanvasElement,
    x: number,
    y: number,
    w: number,
    h: number,
  ) => {
    const sr = src.width / src.height,
      tr = w / h;
    let sx = 0,
      sy = 0,
      sw = src.width,
      sh = src.height;
    if (sr > tr) {
      sw = src.height * tr;
      sx = (src.width - sw) / 2;
    } else {
      sh = src.width / tr;
      sy = (src.height - sh) / 2;
    }
    ctx.drawImage(src, sx, sy, sw, sh, x, y, w, h);
  };
  const overlayCustom = (canvas: HTMLCanvasElement) => {
    if (frameId === "custom" && customFrameRef.current) {
      const x = canvas.getContext("2d");
      x?.drawImage(customFrameRef.current, 0, 0, canvas.width, canvas.height);
    }
    return canvas;
  };
  const compose = (items: HTMLCanvasElement[], count: CaptureMode) => {
    if (count === 1) {
      const src = items[0];
      if (frameId === "none" || frameId === "custom") return overlayCustom(src);
      const b = Math.max(
          12,
          Math.round(Math.min(src.width, src.height) * 0.025),
        ),
        c = document.createElement("canvas");
      c.width = src.width + b * 2;
      c.height = src.height + b * 2;
      const x = c.getContext("2d")!;
      x.fillStyle = frameColor;
      x.fillRect(0, 0, c.width, c.height);
      x.drawImage(src, b, b);
      return overlayCustom(c);
    }
    let columns: number, rows: number;
    if (orientation === "horizontal") {
      columns = count === 2 ? 2 : count / 2;
      rows = 2 === count ? 1 : 2;
    } else {
      columns = count === 2 ? 1 : 2;
      rows = count === 2 ? 2 : count / 2;
    }
    const base = Math.min(...items.map((i) => i.width)),
      cellW = Math.round(base / columns),
      cellH = Math.round((cellW * 3) / 4),
      gap =
        frameId === "none" || frameId === "custom"
          ? 0
          : Math.max(4, Math.round(base * 0.006)),
      outer = gap,
      c = document.createElement("canvas");
    c.width = cellW * columns + gap * (columns - 1) + outer * 2;
    c.height = cellH * rows + gap * (rows - 1) + outer * 2;
    const x = c.getContext("2d")!;
    x.fillStyle =
      frameId === "none" || frameId === "custom" ? "#000" : frameColor;
    x.fillRect(0, 0, c.width, c.height);
    items.forEach((item, i) =>
      drawCover(
        x,
        item,
        outer + (i % columns) * (cellW + gap),
        outer + Math.floor(i / columns) * (cellH + gap),
        cellW,
        cellH,
      ),
    );
    return overlayCustom(c);
  };
  const shoot = () => {
    if (!ready) return;
    const c = capture();
    if (!c) return;
    setFlash(true);
    setTimeout(() => setFlash(false), 100);
    const next = [...framesRef.current, c];
    if (next.length < mode) {
      framesRef.current = next;
      setProgress(next.length);
      return;
    }
    framesRef.current = [];
    setProgress(0);
    setEditor({
      canvas: compose(next, mode),
      gridCount: mode,
      filterId: activeFilter.id,
    });
  };
  const changeMode = (value: CaptureMode) => {
    framesRef.current = [];
    setProgress(0);
    setMode(value);
  };
  const uploadFrame = (file?: File) => {
    if (!file) return;
    if (file.type !== "image/png") {
      alert("Frame harus berupa PNG.");
      return;
    }
    const url = URL.createObjectURL(file),
      img = new Image();
    img.onload = () => {
      customFrameRef.current = img;
      setCustomFrameName(file.name);
      setFrameId("custom");
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };
  const addToGallery = (
    canvas: HTMLCanvasElement,
    gridCount: CaptureMode,
    filterId: string,
  ) =>
    canvas.toBlob((blob) => {
      if (!blob) return;
      setPhotos((v) => [
        {
          id: crypto.randomUUID(),
          url: URL.createObjectURL(blob),
          filterId,
          gridCount,
          createdAt: new Date(),
        },
        ...v,
      ]);
      setEditor(null);
    }, "image/png");
  const download = (url: string, name = "effectcam.png") => {
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
  };
  const printUrl = (url: string) => {
    const w = window.open("", "_blank", "width=900,height=700");
    if (!w) {
      alert("Izinkan pop-up untuk mencetak.");
      return;
    }
    w.document.write(
      `<html><head><title>EffectCam Print</title><style>body{margin:0;display:grid;place-items:center;min-height:100vh}img{max-width:100%;max-height:100vh}@media print{body{margin:0}}</style></head><body><img src="${url}" onload="window.print()"></body></html>`,
    );
    w.document.close();
  };
  return (
    <main className="min-h-dvh bg-neutral-950 text-white">
      <div className="mx-auto min-h-dvh max-w-[1440px] lg:grid lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="relative flex min-h-[72dvh] flex-col overflow-hidden bg-black lg:min-h-dvh">
          <header className="absolute inset-x-0 top-0 z-20 flex justify-between p-4 sm:p-6">
            <div>
              <h1 className="font-semibold">Kamera</h1>
              <p className="text-xs text-white/55">
                {activeFilter.name} · {filters.length} efek
              </p>
            </div>
            <button
              onClick={() => setGalleryOpen(true)}
              className="flex h-10 items-center gap-2 rounded-full bg-black/50 px-3 text-sm lg:hidden"
            >
              <ImageIcon className="size-4" />
              {photos.length}
            </button>
          </header>
          <video
            ref={videoRef}
            muted
            playsInline
            className="absolute inset-0 size-full object-cover"
            style={{
              filter: activeFilter.value,
              transform: facing === "user" ? "scaleX(-1)" : undefined,
            }}
          />
          <div
            className={`pointer-events-none absolute inset-0 z-30 bg-white transition-opacity ${flash ? "opacity-100" : "opacity-0"}`}
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-80 bg-gradient-to-t from-black/90 to-transparent" />
          {!ready && (
            <div className="absolute inset-0 z-10 grid place-items-center bg-neutral-950 p-6 text-center">
              <div>
                <Camera className="mx-auto size-8 text-white/50" />
                <p className="mt-4">{error || "Membuka kamera..."}</p>
                {error && (
                  <button
                    onClick={start}
                    className="mt-4 rounded-lg bg-white px-4 py-2 text-sm text-black"
                  >
                    Coba lagi
                  </button>
                )}
              </div>
            </div>
          )}
          <div className="relative z-10 mt-auto space-y-3 px-4 pb-5 sm:px-6">
            <div className="flex gap-2 overflow-x-auto [scrollbar-width:none]">
              <span className="shrink-0 py-2 text-xs text-white/50">Frame</span>
              {frames.map((f) => (
                <button
                  key={f.id}
                  onClick={() =>
                    f.id === "custom"
                      ? fileRef.current?.click()
                      : setFrameId(f.id)
                  }
                  className={`shrink-0 rounded-full border px-3 py-1.5 text-xs ${frameId === f.id ? "bg-white text-black" : "border-white/20 bg-black/40"}`}
                >
                  {f.id === "custom" && (
                    <Upload className="mr-1 inline size-3" />
                  )}
                  {f.label}
                  {f.id === "custom" && customFrameName ? " ✓" : ""}
                </button>
              ))}
              <input
                ref={fileRef}
                hidden
                type="file"
                accept="image/png"
                onChange={(e) => uploadFrame(e.target.files?.[0])}
              />
            </div>
            <div className="flex justify-center gap-2">
              <div className="flex rounded-full bg-black/50 p-1">
                {([1, 2, 4, 6, 8] as CaptureMode[]).map((n) => (
                  <button
                    key={n}
                    onClick={() => changeMode(n)}
                    className={`rounded-full px-3 py-2 text-xs ${mode === n ? "bg-white text-black" : "text-white/65"}`}
                  >
                    {n === 1 ? "1 Foto" : `${n} Grid`}
                  </button>
                ))}
              </div>
              {mode > 1 && (
                <div className="flex rounded-full bg-black/50 p-1">
                  <button
                    onClick={() => setOrientation("horizontal")}
                    className={`rounded-full px-3 py-2 text-xs ${orientation === "horizontal" ? "bg-white text-black" : "text-white/65"}`}
                  >
                    Horizontal
                  </button>
                  <button
                    onClick={() => setOrientation("vertical")}
                    className={`rounded-full px-3 py-2 text-xs ${orientation === "vertical" ? "bg-white text-black" : "text-white/65"}`}
                  >
                    Vertikal
                  </button>
                </div>
              )}
            </div>
            {progress > 0 && (
              <div className="text-center text-xs">
                Foto {progress}/{mode} ·{" "}
                <button
                  onClick={() => {
                    framesRef.current = [];
                    setProgress(0);
                  }}
                  className="underline"
                >
                  Batalkan
                </button>
              </div>
            )}
            <div className="flex gap-5 overflow-x-auto [scrollbar-width:none]">
              {filters.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f)}
                  className={`shrink-0 border-b pb-2 text-sm ${activeFilter.id === f.id ? "border-white" : "border-transparent text-white/55"}`}
                >
                  {f.name}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-3 items-center">
              <button
                onClick={() => photos[0] && setPreview(photos[0])}
                disabled={!photos.length}
                className="grid size-12 place-items-center overflow-hidden rounded-lg bg-white/10"
              >
                {photos[0] ? (
                  <img
                    src={photos[0].url}
                    alt=""
                    className="size-full object-cover"
                  />
                ) : (
                  <ImageIcon className="size-5" />
                )}
              </button>
              <button
                onClick={shoot}
                disabled={!ready}
                className="mx-auto grid size-[74px] place-items-center rounded-full border-[3px] border-white disabled:opacity-40"
              >
                <span className="size-[58px] rounded-full bg-white" />
              </button>
              <button
                onClick={() =>
                  setFacing((v) => (v === "user" ? "environment" : "user"))
                }
                className="ml-auto grid size-12 place-items-center rounded-full bg-black/50"
              >
                <RefreshCw className="size-5" />
              </button>
            </div>
          </div>
        </section>
        <Gallery
          photos={photos}
          onPreview={setPreview}
          onDownload={(p) => download(p.url)}
          onPrint={(p) => printUrl(p.url)}
          onDelete={(p) => {
            URL.revokeObjectURL(p.url);
            setPhotos((v) => v.filter((x) => x.id !== p.id));
          }}
        />
      </div>
      {galleryOpen && (
        <div className="fixed inset-0 z-40 flex flex-col bg-neutral-950 lg:hidden">
          <div className="flex justify-between border-b border-white/10 p-4">
            <b>Galeri</b>
            <button onClick={() => setGalleryOpen(false)}>
              <X />
            </button>
          </div>
          <Gallery
            photos={photos}
            onPreview={setPreview}
            onDownload={(p) => download(p.url)}
            onPrint={(p) => printUrl(p.url)}
            onDelete={(p) => setPhotos((v) => v.filter((x) => x.id !== p.id))}
          />
        </div>
      )}
      {preview && (
        <Preview
          photo={preview}
          onClose={() => setPreview(null)}
          onDownload={() => download(preview.url)}
          onPrint={() => printUrl(preview.url)}
        />
      )}{" "}
      {editor && (
        <Editor
          base={editor}
          onCancel={() => setEditor(null)}
          onConfirm={addToGallery}
          onDownload={download}
          onPrint={printUrl}
        />
      )}
    </main>
  );
}

function Gallery({
  photos,
  onPreview,
  onDownload,
  onPrint,
  onDelete,
}: {
  photos: Photo[];
  onPreview: (p: Photo) => void;
  onDownload: (p: Photo) => void;
  onPrint: (p: Photo) => void;
  onDelete: (p: Photo) => void;
}) {
  return (
    <aside className="hidden min-h-dvh flex-col border-l border-white/10 bg-neutral-950 lg:flex">
      <div className="border-b border-white/10 p-5">
        <b>Galeri</b>
        <p className="text-xs text-white/45">{photos.length} foto</p>
      </div>
      {!photos.length ? (
        <div className="grid flex-1 place-items-center text-sm text-white/45">
          Belum ada foto
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-1 overflow-y-auto p-1">
          {photos.map((p) => (
            <article
              key={p.id}
              className="group relative aspect-[4/5] overflow-hidden bg-neutral-900"
            >
              <button onClick={() => onPreview(p)} className="size-full">
                <img
                  src={p.url}
                  alt="Hasil foto"
                  className="size-full object-cover"
                />
              </button>
              <div className="absolute right-2 top-2 flex gap-1">
                <button
                  onClick={() => onDownload(p)}
                  className="grid size-8 place-items-center rounded-full bg-black/60"
                >
                  <Download className="size-3.5" />
                </button>
                <button
                  onClick={() => onPrint(p)}
                  className="grid size-8 place-items-center rounded-full bg-black/60"
                >
                  <Printer className="size-3.5" />
                </button>
                <button
                  onClick={() => onDelete(p)}
                  className="grid size-8 place-items-center rounded-full bg-black/60"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </aside>
  );
}
function Preview({
  photo,
  onClose,
  onDownload,
  onPrint,
}: {
  photo: Photo;
  onClose: () => void;
  onDownload: () => void;
  onPrint: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/95 p-4">
      <button onClick={onClose} className="absolute right-4 top-4">
        <X />
      </button>
      <img
        src={photo.url}
        alt="Preview"
        className="max-h-[78dvh] max-w-full object-contain"
      />
      <div className="absolute bottom-5 flex gap-2">
        <button
          onClick={onDownload}
          className="flex gap-2 rounded-lg bg-white px-4 py-2 text-black"
        >
          <Download className="size-4" />
          Simpan
        </button>
        <button
          onClick={onPrint}
          className="flex gap-2 rounded-lg bg-white/10 px-4 py-2"
        >
          <Printer className="size-4" />
          Print
        </button>
      </div>
    </div>
  );
}

function Editor({
  base,
  onCancel,
  onConfirm,
  onDownload,
  onPrint,
}: {
  base: { canvas: HTMLCanvasElement; gridCount: CaptureMode; filterId: string };
  onCancel: () => void;
  onConfirm: (c: HTMLCanvasElement, g: CaptureMode, f: string) => void;
  onDownload: (u: string, n?: string) => void;
  onPrint: (u: string) => void;
}) {
  const ref = useRef<HTMLCanvasElement>(null),
    drawing = useRef(false),
    history = useRef<ImageData[]>([]);
  const [text, setText] = useState("");
  const [color, setColor] = useState("#ffffff");
  const [draw, setDraw] = useState(false);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    c.width = base.canvas.width;
    c.height = base.canvas.height;
    const x = c.getContext("2d")!;
    x.drawImage(base.canvas, 0, 0);
    history.current = [x.getImageData(0, 0, c.width, c.height)];
  }, [base]);
  const snapshot = () => {
    const c = ref.current,
      x = c?.getContext("2d");
    if (c && x) history.current.push(x.getImageData(0, 0, c.width, c.height));
  };
  const addText = () => {
    const c = ref.current;
    if (!c || !text.trim()) return;
    const x = c.getContext("2d")!,
      size = Math.max(28, Math.round(c.width * 0.055));
    x.font = `700 ${size}px Arial`;
    x.textAlign = "center";
    x.textBaseline = "middle";
    x.lineWidth = Math.max(3, size * 0.08);
    x.strokeStyle = "#000";
    x.strokeText(text, c.width / 2, c.height / 2);
    x.fillStyle = color;
    x.fillText(text, c.width / 2, c.height / 2);
    snapshot();
    setText("");
  };
  const addSticker = (s: string) => {
    const c = ref.current;
    if (!c) return;
    const x = c.getContext("2d")!,
      size = Math.max(48, Math.round(c.width * 0.1));
    x.font = `${size}px sans-serif`;
    x.textAlign = "center";
    x.textBaseline = "middle";
    x.fillText(s, c.width / 2, c.height / 2);
    snapshot();
  };
  const point = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const c = ref.current!,
      r = c.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) * c.width) / r.width,
      y: ((e.clientY - r.top) * c.height) / r.height,
    };
  };
  const down = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!draw) return;
    drawing.current = true;
    const p = point(e),
      x = ref.current!.getContext("2d")!;
    x.beginPath();
    x.moveTo(p.x, p.y);
    ref.current!.setPointerCapture(e.pointerId);
  };
  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!draw || !drawing.current) return;
    const p = point(e),
      x = ref.current!.getContext("2d")!;
    x.lineTo(p.x, p.y);
    x.strokeStyle = color;
    x.lineWidth = Math.max(4, ref.current!.width * 0.006);
    x.lineCap = "round";
    x.stroke();
  };
  const up = () => {
    if (drawing.current) {
      drawing.current = false;
      snapshot();
    }
  };
  const undo = () => {
    if (history.current.length <= 1) return;
    history.current.pop();
    const c = ref.current!,
      x = c.getContext("2d")!;
    x.putImageData(history.current.at(-1)!, 0, 0);
  };
  const url = () => ref.current!.toDataURL("image/png");
  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-neutral-950 text-white">
      <header className="flex items-center justify-between border-b border-white/10 p-4">
        <div>
          <b>Edit hasil</b>
          <p className="text-xs text-white/45">
            Tambahkan teks, stiker, atau coretan sebelum menyimpan.
          </p>
        </div>
        <button onClick={onCancel}>
          <X />
        </button>
      </header>
      <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="grid min-h-0 place-items-center bg-black p-3">
          <canvas
            ref={ref}
            onPointerDown={down}
            onPointerMove={move}
            onPointerUp={up}
            onPointerCancel={up}
            className={`max-h-full max-w-full object-contain ${draw ? "cursor-crosshair" : ""}`}
          />
        </div>
        <aside className="space-y-5 overflow-y-auto border-l border-white/10 p-4">
          <section>
            <label className="text-xs text-white/50">Teks</label>
            <div className="mt-2 flex gap-2">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Tulis teks..."
                className="min-w-0 flex-1 rounded-lg bg-white/10 px-3 py-2 text-sm outline-none"
              />
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-10 w-10 rounded bg-transparent"
              />
              <button
                onClick={addText}
                className="rounded-lg bg-white px-3 text-sm text-black"
              >
                <Type className="size-4" />
              </button>
            </div>
          </section>
          <section>
            <label className="text-xs text-white/50">Stiker</label>
            <div className="mt-2 grid grid-cols-5 gap-2">
              {stickers.map((s) => (
                <button
                  key={s}
                  onClick={() => addSticker(s)}
                  className="rounded-lg bg-white/10 p-2 text-xl"
                >
                  {s}
                </button>
              ))}
            </div>
          </section>
          <section className="flex gap-2">
            <button
              onClick={() => setDraw((v) => !v)}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${draw ? "bg-white text-black" : "bg-white/10"}`}
            >
              <Pencil className="size-4" />
              Coret
            </button>
            <button
              onClick={undo}
              className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm"
            >
              <RotateCcw className="size-4" />
              Undo
            </button>
          </section>
          <div className="grid gap-2 pt-3">
            <button
              onClick={() =>
                onConfirm(ref.current!, base.gridCount, base.filterId)
              }
              className="rounded-lg bg-white px-4 py-3 font-semibold text-black"
            >
              <Check className="mr-2 inline size-4" />
              Konfirmasi ke galeri
            </button>
            <button
              onClick={() => onDownload(url(), "effectcam-edited.png")}
              className="rounded-lg bg-white/10 px-4 py-3"
            >
              <Download className="mr-2 inline size-4" />
              Download
            </button>
            <button
              onClick={() => onPrint(url())}
              className="rounded-lg bg-white/10 px-4 py-3"
            >
              <Printer className="mr-2 inline size-4" />
              Print
            </button>
          </div>
          <p className="text-xs leading-5 text-white/40">
            Print membuka dialog cetak browser. Printer yang tersedia ditentukan
            oleh perangkat dan sistem operasi.
          </p>
        </aside>
      </div>
    </div>
  );
}
