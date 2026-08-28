"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Camera,
  Download,
  Image as ImageIcon,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";

const filters = [
  { name: "Asli", value: "none" },
  { name: "Hitam Putih", value: "grayscale(1) contrast(1.08)" },
  { name: "Hangat", value: "sepia(.22) saturate(1.18) brightness(1.03)" },
  {
    name: "Dingin",
    value: "saturate(.92) hue-rotate(168deg) brightness(1.02)",
  },
  { name: "Film", value: "sepia(.28) contrast(.94) saturate(.86)" },
  { name: "Cerah", value: "brightness(1.08) saturate(1.14)" },
  { name: "Kontras", value: "contrast(1.28) saturate(.9)" },
] as const;

type Photo = {
  id: string;
  url: string;
  filterName: string;
  createdAt: Date;
};

export default function HomePage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const photosRef = useRef<Photo[]>([]);
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>(
    filters[0],
  );
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState<Photo | null>(null);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraReady(false);
  }, []);

  const startCamera = useCallback(async () => {
    stopCamera();
    setCameraError("");
    try {
      if (!navigator.mediaDevices?.getUserMedia)
        throw new Error("Browser ini tidak mendukung akses kamera.");
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraReady(true);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Kamera tidak dapat digunakan.";
      const denied = /permission|denied|notallowed/i.test(message);
      setCameraError(
        denied
          ? "Akses kamera ditolak. Izinkan akses kamera melalui pengaturan browser, lalu coba lagi."
          : message,
      );
    }
  }, [facingMode, stopCamera]);

  useEffect(() => {
    startCamera();
    return stopCamera;
  }, [startCamera, stopCamera]);

  useEffect(
    () => () =>
      photosRef.current.forEach((photo) => URL.revokeObjectURL(photo.url)),
    [],
  );

  const takePhoto = () => {
    const video = videoRef.current;
    if (!video || !cameraReady || !video.videoWidth) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.filter = activeFilter.value;
    if (facingMode === "user") {
      context.translate(canvas.width, 0);
      context.scale(-1, 1);
    }
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    setFlash(true);
    window.setTimeout(() => setFlash(false), 110);
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const photo: Photo = {
          id: crypto.randomUUID(),
          url: URL.createObjectURL(blob),
          filterName: activeFilter.name,
          createdAt: new Date(),
        };
        setPhotos((current) => [photo, ...current]);
      },
      "image/jpeg",
      0.94,
    );
  };

  const savePhoto = (photo: Photo) => {
    const link = document.createElement("a");
    link.href = photo.url;
    link.download = `foto-${photo.createdAt.toISOString().replace(/[:.]/g, "-")}.jpg`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const deletePhoto = (photo: Photo) => {
    setPhotos((current) => current.filter((item) => item.id !== photo.id));
    if (previewPhoto?.id === photo.id) setPreviewPhoto(null);
    window.setTimeout(() => URL.revokeObjectURL(photo.url), 0);
  };

  return (
    <main className="min-h-dvh bg-neutral-950 text-white">
      <div className="mx-auto flex min-h-dvh max-w-[1440px] flex-col lg:grid lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="relative flex min-h-[68dvh] flex-1 flex-col overflow-hidden bg-black lg:min-h-dvh">
          <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between p-4 sm:p-6">
            <div>
              <h1 className="text-base font-semibold tracking-tight">Kamera</h1>
              <p className="mt-0.5 text-xs text-white/55">
                {activeFilter.name}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setGalleryOpen(true)}
              className="flex items-center gap-2 rounded-full bg-black/45 px-3 py-2 text-sm font-medium backdrop-blur-md lg:hidden"
            >
              <ImageIcon className="size-4" />
              {photos.length}
            </button>
          </header>

          <video
            ref={videoRef}
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
            style={{
              filter: activeFilter.value,
              transform: facingMode === "user" ? "scaleX(-1)" : undefined,
            }}
          />
          <div
            className={`pointer-events-none absolute inset-0 z-30 bg-white transition-opacity duration-100 ${flash ? "opacity-100" : "opacity-0"}`}
          />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/50 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black/75 to-transparent" />

          {!cameraReady && (
            <div className="absolute inset-0 z-10 grid place-items-center bg-neutral-950 px-6 text-center">
              <div className="max-w-sm">
                <Camera className="mx-auto size-8 text-white/55" />
                <h2 className="mt-5 text-lg font-semibold">
                  {cameraError ? "Kamera tidak tersedia" : "Membuka kamera"}
                </h2>
                <p className="mt-2 text-sm leading-6 text-white/55">
                  {cameraError ||
                    "Berikan izin kamera saat diminta oleh browser."}
                </p>
                {cameraError && (
                  <button
                    type="button"
                    onClick={startCamera}
                    className="mt-5 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-black"
                  >
                    Coba lagi
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="relative z-10 mt-auto px-4 pb-5 sm:px-6 sm:pb-7">
            <div className="mb-6 flex gap-5 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {filters.map((filter) => (
                <button
                  key={filter.name}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`shrink-0 border-b pb-2 text-sm transition ${activeFilter.name === filter.name ? "border-white font-semibold text-white" : "border-transparent text-white/55 hover:text-white"}`}
                >
                  {filter.name}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-3 items-center">
              <div className="flex justify-start">
                <button
                  type="button"
                  onClick={() => photos[0] && setPreviewPhoto(photos[0])}
                  disabled={!photos.length}
                  aria-label="Buka foto terakhir"
                  className="grid size-12 place-items-center overflow-hidden rounded-lg border border-white/25 bg-white/10 disabled:opacity-40"
                >
                  {photos[0] ? (
                    <img
                      src={photos[0].url}
                      alt="Foto terakhir"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="size-5 text-white/55" />
                  )}
                </button>
              </div>
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={takePhoto}
                  disabled={!cameraReady}
                  aria-label="Ambil foto"
                  className="grid size-[74px] place-items-center rounded-full border-[3px] border-white transition active:scale-95 disabled:opacity-40"
                >
                  <span className="block size-[58px] rounded-full bg-white" />
                </button>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() =>
                    setFacingMode((value) =>
                      value === "user" ? "environment" : "user",
                    )
                  }
                  aria-label="Ganti kamera"
                  className="grid size-12 place-items-center rounded-full bg-black/45 backdrop-blur-md active:scale-95"
                >
                  <RefreshCw className="size-5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <aside className="hidden min-h-dvh border-l border-white/10 bg-neutral-950 lg:flex lg:flex-col">
          <div className="border-b border-white/10 px-5 py-5">
            <h2 className="font-semibold">Galeri</h2>
            <p className="mt-0.5 text-xs text-white/45">{photos.length} foto</p>
          </div>
          <Gallery
            photos={photos}
            onPreview={setPreviewPhoto}
            onSave={savePhoto}
            onDelete={deletePhoto}
          />
        </aside>
      </div>

      {galleryOpen && (
        <div className="fixed inset-0 z-40 flex flex-col bg-neutral-950 lg:hidden">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
            <div>
              <h2 className="font-semibold">Galeri</h2>
              <p className="text-xs text-white/45">{photos.length} foto</p>
            </div>
            <IconButton
              label="Tutup galeri"
              onClick={() => setGalleryOpen(false)}
            >
              <X className="size-5" />
            </IconButton>
          </div>
          <Gallery
            photos={photos}
            onPreview={setPreviewPhoto}
            onSave={savePhoto}
            onDelete={deletePhoto}
          />
        </div>
      )}

      {previewPhoto && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/95 p-4 sm:p-8">
          <button
            type="button"
            onClick={() => setPreviewPhoto(null)}
            aria-label="Tutup pratinjau"
            className="absolute right-4 top-4 grid size-11 place-items-center rounded-full bg-white/10"
          >
            <X className="size-5" />
          </button>
          <img
            src={previewPhoto.url}
            alt={`Foto dengan filter ${previewPhoto.filterName}`}
            className="max-h-[78dvh] max-w-full object-contain"
          />
          <div className="absolute inset-x-0 bottom-5 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => savePhoto(previewPhoto)}
              className="flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-black"
            >
              <Download className="size-4" />
              Simpan
            </button>
            <button
              type="button"
              onClick={() => deletePhoto(previewPhoto)}
              className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2.5 text-sm font-semibold"
            >
              <Trash2 className="size-4" />
              Hapus
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid size-10 place-items-center rounded-full hover:bg-white/10"
    >
      {children}
    </button>
  );
}

function Gallery({
  photos,
  onPreview,
  onSave,
  onDelete,
}: {
  photos: Photo[];
  onPreview: (photo: Photo) => void;
  onSave: (photo: Photo) => void;
  onDelete: (photo: Photo) => void;
}) {
  if (!photos.length)
    return (
      <div className="grid flex-1 place-items-center px-8 text-center">
        <div>
          <ImageIcon className="mx-auto size-7 text-white/30" />
          <p className="mt-4 text-sm font-medium text-white/70">
            Belum ada foto
          </p>
          <p className="mt-1 text-xs text-white/40">
            Foto yang diambil akan muncul di sini.
          </p>
        </div>
      </div>
    );
  return (
    <div className="grid flex-1 auto-rows-min grid-cols-2 gap-1 overflow-y-auto p-1 sm:grid-cols-3 lg:grid-cols-2">
      {photos.map((photo) => (
        <article
          key={photo.id}
          className="group relative aspect-[4/5] overflow-hidden bg-neutral-900"
        >
          <button
            type="button"
            onClick={() => onPreview(photo)}
            className="h-full w-full"
          >
            <img
              src={photo.url}
              alt={`Foto ${photo.filterName}`}
              className="h-full w-full object-cover transition group-hover:scale-[1.02]"
            />
          </button>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-10 opacity-0 transition group-hover:opacity-100">
            <p className="text-xs font-medium">{photo.filterName}</p>
            <p className="text-[11px] text-white/55">
              {photo.createdAt.toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <div className="absolute right-2 top-2 flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
            <button
              type="button"
              onClick={() => onSave(photo)}
              aria-label="Simpan foto"
              className="grid size-8 place-items-center rounded-full bg-black/55"
            >
              <Download className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(photo)}
              aria-label="Hapus foto"
              className="grid size-8 place-items-center rounded-full bg-black/55 hover:bg-red-600"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
