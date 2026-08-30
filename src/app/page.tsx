"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Camera,
  Check,
  Download,
  Image as ImageIcon,
  Languages,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";

const filters = [
  { id: "original", value: "none" },
  { id: "blackWhite", value: "grayscale(1) contrast(1.08)" },
  {
    id: "softMono",
    value: "grayscale(1) contrast(.9) brightness(1.08)",
  },
  {
    id: "strongMono",
    value: "grayscale(1) contrast(1.45) brightness(.92)",
  },
  {
    id: "warm",
    value: "sepia(.22) saturate(1.18) brightness(1.03)",
  },
  {
    id: "cool",
    value: "saturate(.92) hue-rotate(168deg) brightness(1.02)",
  },
  {
    id: "film",
    value: "sepia(.28) contrast(.94) saturate(.86)",
  },
  {
    id: "bright",
    value: "brightness(1.08) saturate(1.14)",
  },
  {
    id: "contrast",
    value: "contrast(1.28) saturate(.9)",
  },
  {
    id: "natural",
    value: "contrast(1.04) saturate(1.06) brightness(1.01)",
  },
  {
    id: "portrait",
    value: "brightness(1.06) contrast(.96) saturate(.92)",
  },
  {
    id: "goldenHour",
    value: "sepia(.18) saturate(1.32) brightness(1.07) hue-rotate(-8deg)",
  },
  {
    id: "sunset",
    value: "sepia(.3) saturate(1.48) contrast(1.06) hue-rotate(-12deg)",
  },
  {
    id: "coffee",
    value: "sepia(.42) saturate(.82) contrast(1.08) brightness(.94)",
  },
  {
    id: "vintage",
    value: "sepia(.48) saturate(.72) contrast(.92) brightness(.96)",
  },
  {
    id: "retro",
    value: "sepia(.3) saturate(1.35) contrast(1.12) hue-rotate(-18deg)",
  },
  {
    id: "fade",
    value: "contrast(.78) saturate(.75) brightness(1.12)",
  },
  {
    id: "matte",
    value: "contrast(.82) saturate(.88) brightness(1.06)",
  },
  {
    id: "pastel",
    value: "contrast(.84) saturate(.78) brightness(1.13)",
  },
  {
    id: "vivid",
    value: "saturate(1.75) contrast(1.12)",
  },
  {
    id: "pop",
    value: "saturate(2.15) contrast(1.18) brightness(1.02)",
  },
  {
    id: "emerald",
    value: "hue-rotate(48deg) saturate(1.35) contrast(1.04)",
  },
  {
    id: "ocean",
    value: "hue-rotate(176deg) saturate(1.42) contrast(1.06)",
  },
  {
    id: "lavender",
    value: "hue-rotate(232deg) saturate(1.18) brightness(1.06)",
  },
  {
    id: "rose",
    value: "hue-rotate(318deg) saturate(1.28) brightness(1.04)",
  },
  {
    id: "cyber",
    value: "hue-rotate(205deg) saturate(2) contrast(1.22)",
  },
  {
    id: "noir",
    value: "grayscale(1) contrast(1.62) brightness(.8)",
  },
  {
    id: "dramatic",
    value: "contrast(1.55) saturate(.72) brightness(.9)",
  },
  {
    id: "softGlow",
    value: "brightness(1.13) contrast(.82) saturate(1.08)",
  },
  {
    id: "lowLight",
    value: "brightness(1.3) contrast(1.08) saturate(.9)",
  },
] as const;

type FilterId = (typeof filters)[number]["id"];
type Filter = (typeof filters)[number];
type Language = "id" | "en" | "zh-CN";

type Translation = {
  languageName: string;
  camera: string;
  effects: string;
  gallery: string;
  photoSingular: string;
  photoPlural: string;
  cameraUnavailable: string;
  openingCamera: string;
  cameraPermission: string;
  cameraUnsupported: string;
  cameraFailed: string;
  cameraDenied: string;
  tryAgain: string;
  openLastPhoto: string;
  lastPhoto: string;
  takePhoto: string;
  switchCamera: string;
  closeGallery: string;
  closePreview: string;
  save: string;
  delete: string;
  savePhoto: string;
  deletePhoto: string;
  emptyGallery: string;
  emptyGalleryDescription: string;
  photoWithFilter: string;
  language: string;
  filters: Record<FilterId, string>;
};

const translations = {
  id: {
    languageName: "Indonesia",
    camera: "Kamera",
    effects: "efek",
    gallery: "Galeri",
    photoSingular: "foto",
    photoPlural: "foto",
    cameraUnavailable: "Kamera tidak tersedia",
    openingCamera: "Membuka kamera",
    cameraPermission: "Berikan izin kamera saat diminta oleh browser.",
    cameraUnsupported: "Browser ini tidak mendukung akses kamera.",
    cameraFailed: "Kamera tidak dapat digunakan.",
    cameraDenied:
      "Akses kamera ditolak. Izinkan akses kamera melalui pengaturan browser, lalu coba lagi.",
    tryAgain: "Coba lagi",
    openLastPhoto: "Buka foto terakhir",
    lastPhoto: "Foto terakhir",
    takePhoto: "Ambil foto",
    switchCamera: "Ganti kamera",
    closeGallery: "Tutup galeri",
    closePreview: "Tutup pratinjau",
    save: "Simpan",
    delete: "Hapus",
    savePhoto: "Simpan foto",
    deletePhoto: "Hapus foto",
    emptyGallery: "Belum ada foto",
    emptyGalleryDescription: "Foto yang diambil akan muncul di sini.",
    photoWithFilter: "Foto dengan filter",
    language: "Bahasa",
    filters: {
      original: "Asli",
      blackWhite: "Hitam Putih",
      softMono: "Mono Lembut",
      strongMono: "Mono Tegas",
      warm: "Hangat",
      cool: "Dingin",
      film: "Film",
      bright: "Cerah",
      contrast: "Kontras",
      natural: "Natural",
      portrait: "Potret",
      goldenHour: "Golden Hour",
      sunset: "Senja",
      coffee: "Kopi",
      vintage: "Vintage",
      retro: "Retro",
      fade: "Pudar",
      matte: "Matte",
      pastel: "Pastel",
      vivid: "Vivid",
      pop: "Pop",
      emerald: "Emerald",
      ocean: "Laut",
      lavender: "Lavender",
      rose: "Mawar",
      cyber: "Cyber",
      noir: "Noir",
      dramatic: "Dramatis",
      softGlow: "Soft Glow",
      lowLight: "Cahaya Rendah",
    },
  },
  en: {
    languageName: "English",
    camera: "Camera",
    effects: "effects",
    gallery: "Gallery",
    photoSingular: "photo",
    photoPlural: "photos",
    cameraUnavailable: "Camera unavailable",
    openingCamera: "Opening camera",
    cameraPermission: "Allow camera access when prompted by your browser.",
    cameraUnsupported: "This browser does not support camera access.",
    cameraFailed: "The camera could not be used.",
    cameraDenied:
      "Camera access was denied. Allow camera access in your browser settings, then try again.",
    tryAgain: "Try again",
    openLastPhoto: "Open last photo",
    lastPhoto: "Last photo",
    takePhoto: "Take photo",
    switchCamera: "Switch camera",
    closeGallery: "Close gallery",
    closePreview: "Close preview",
    save: "Save",
    delete: "Delete",
    savePhoto: "Save photo",
    deletePhoto: "Delete photo",
    emptyGallery: "No photos yet",
    emptyGalleryDescription: "Photos you take will appear here.",
    photoWithFilter: "Photo with filter",
    language: "Language",
    filters: {
      original: "Original",
      blackWhite: "Black & White",
      softMono: "Soft Mono",
      strongMono: "Strong Mono",
      warm: "Warm",
      cool: "Cool",
      film: "Film",
      bright: "Bright",
      contrast: "Contrast",
      natural: "Natural",
      portrait: "Portrait",
      goldenHour: "Golden Hour",
      sunset: "Sunset",
      coffee: "Coffee",
      vintage: "Vintage",
      retro: "Retro",
      fade: "Fade",
      matte: "Matte",
      pastel: "Pastel",
      vivid: "Vivid",
      pop: "Pop",
      emerald: "Emerald",
      ocean: "Ocean",
      lavender: "Lavender",
      rose: "Rose",
      cyber: "Cyber",
      noir: "Noir",
      dramatic: "Dramatic",
      softGlow: "Soft Glow",
      lowLight: "Low Light",
    },
  },
  "zh-CN": {
    languageName: "简体中文",
    camera: "相机",
    effects: "种效果",
    gallery: "图库",
    photoSingular: "张照片",
    photoPlural: "张照片",
    cameraUnavailable: "相机不可用",
    openingCamera: "正在打开相机",
    cameraPermission: "请在浏览器提示时允许访问相机。",
    cameraUnsupported: "此浏览器不支持相机访问。",
    cameraFailed: "无法使用相机。",
    cameraDenied: "相机访问被拒绝。请在浏览器设置中允许访问，然后重试。",
    tryAgain: "重试",
    openLastPhoto: "打开最新照片",
    lastPhoto: "最新照片",
    takePhoto: "拍照",
    switchCamera: "切换相机",
    closeGallery: "关闭图库",
    closePreview: "关闭预览",
    save: "保存",
    delete: "删除",
    savePhoto: "保存照片",
    deletePhoto: "删除照片",
    emptyGallery: "暂无照片",
    emptyGalleryDescription: "拍摄的照片将显示在这里。",
    photoWithFilter: "使用滤镜拍摄的照片",
    language: "语言",
    filters: {
      original: "原图",
      blackWhite: "黑白",
      softMono: "柔和单色",
      strongMono: "强烈单色",
      warm: "暖色",
      cool: "冷色",
      film: "胶片",
      bright: "明亮",
      contrast: "高对比度",
      natural: "自然",
      portrait: "人像",
      goldenHour: "黄金时刻",
      sunset: "日落",
      coffee: "咖啡",
      vintage: "复古",
      retro: "怀旧",
      fade: "淡化",
      matte: "哑光",
      pastel: "柔彩",
      vivid: "鲜艳",
      pop: "流行",
      emerald: "翡翠",
      ocean: "海洋",
      lavender: "薰衣草",
      rose: "玫瑰",
      cyber: "赛博",
      noir: "黑色电影",
      dramatic: "戏剧",
      softGlow: "柔光",
      lowLight: "弱光",
    },
  },
} satisfies Record<Language, Translation>;

const languageOptions: Array<{
  value: Language;
  label: string;
  shortLabel: string;
}> = [
  {
    value: "id",
    label: "Indonesia",
    shortLabel: "ID",
  },
  {
    value: "en",
    label: "English",
    shortLabel: "EN",
  },
  {
    value: "zh-CN",
    label: "简体中文",
    shortLabel: "中文",
  },
];

const dateLocales: Record<Language, string> = {
  id: "id-ID",
  en: "en-US",
  "zh-CN": "zh-CN",
};

const languageStorageKey = "effectcam-language";

type Photo = {
  id: string;
  url: string;
  filterId: FilterId;
  createdAt: Date;
};

function isSupportedLanguage(value: string): value is Language {
  return value === "id" || value === "en" || value === "zh-CN";
}

function detectBrowserLanguage(): Language {
  if (typeof navigator === "undefined") {
    return "id";
  }

  const browserLanguage = navigator.language.toLowerCase();

  if (browserLanguage.startsWith("zh")) {
    return "zh-CN";
  }

  if (browserLanguage.startsWith("en")) {
    return "en";
  }

  return "id";
}

export default function HomePage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const photosRef = useRef<Photo[]>([]);
  const languageMenuRef = useRef<HTMLDivElement>(null);

  const [language, setLanguage] = useState<Language>("id");
  const [languageLoaded, setLanguageLoaded] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<Filter>(filters[0]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState<Photo | null>(null);
  const [flash, setFlash] = useState(false);

  const t = translations[language];

  const getPhotoCountLabel = useCallback(
    (count: number) => {
      const noun = count === 1 ? t.photoSingular : t.photoPlural;

      return `${count} ${noun}`;
    },
    [t.photoPlural, t.photoSingular],
  );

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem(languageStorageKey);

    if (savedLanguage && isSupportedLanguage(savedLanguage)) {
      setLanguage(savedLanguage);
    } else {
      setLanguage(detectBrowserLanguage());
    }

    setLanguageLoaded(true);
  }, []);

  useEffect(() => {
    if (!languageLoaded) {
      return;
    }

    document.documentElement.lang = language;
    window.localStorage.setItem(languageStorageKey, language);
  }, [language, languageLoaded]);

  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  useEffect(() => {
    if (!languageOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;

      if (
        target instanceof Node &&
        !languageMenuRef.current?.contains(target)
      ) {
        setLanguageOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLanguageOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [languageOpen]);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());

    streamRef.current = null;
    setCameraReady(false);
  }, []);

  const startCamera = useCallback(async () => {
    stopCamera();
    setCameraError("");

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("CAMERA_UNSUPPORTED");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: {
            ideal: facingMode,
          },
          width: {
            ideal: 1920,
          },
          height: {
            ideal: 1080,
          },
        },
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setCameraReady(true);
    } catch (error) {
      if (error instanceof Error && error.message === "CAMERA_UNSUPPORTED") {
        setCameraError(t.cameraUnsupported);
        return;
      }

      const errorName = error instanceof DOMException ? error.name : "";

      const errorMessage = error instanceof Error ? error.message : "";

      const permissionDenied = /notallowed|permission|denied/i.test(
        `${errorName} ${errorMessage}`,
      );

      setCameraError(permissionDenied ? t.cameraDenied : t.cameraFailed);
    }
  }, [
    facingMode,
    stopCamera,
    t.cameraDenied,
    t.cameraFailed,
    t.cameraUnsupported,
  ]);

  useEffect(() => {
    startCamera();

    return stopCamera;
  }, [startCamera, stopCamera]);

  useEffect(() => {
    return () => {
      photosRef.current.forEach((photo) => {
        URL.revokeObjectURL(photo.url);
      });
    };
  }, []);

  const changeLanguage = (nextLanguage: Language) => {
    setLanguage(nextLanguage);
    setLanguageOpen(false);
  };

  const takePhoto = () => {
    const video = videoRef.current;

    if (!video || !cameraReady || !video.videoWidth) {
      return;
    }

    const canvas = document.createElement("canvas");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    context.filter = activeFilter.value;

    if (facingMode === "user") {
      context.translate(canvas.width, 0);
      context.scale(-1, 1);
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    setFlash(true);

    window.setTimeout(() => {
      setFlash(false);
    }, 110);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          return;
        }

        const photo: Photo = {
          id: crypto.randomUUID(),
          url: URL.createObjectURL(blob),
          filterId: activeFilter.id,
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
    link.download = `effectcam-${photo.createdAt
      .toISOString()
      .replace(/[:.]/g, "-")}.jpg`;

    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const deletePhoto = (photo: Photo) => {
    setPhotos((current) => current.filter((item) => item.id !== photo.id));

    if (previewPhoto?.id === photo.id) {
      setPreviewPhoto(null);
    }

    window.setTimeout(() => {
      URL.revokeObjectURL(photo.url);
    }, 0);
  };

  return (
    <main className="min-h-dvh bg-neutral-950 text-white">
      <div className="mx-auto flex min-h-dvh max-w-[1440px] flex-col lg:grid lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="relative flex min-h-[68dvh] flex-1 flex-col overflow-hidden bg-black lg:min-h-dvh">
          <header className="absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-3 p-4 sm:p-6">
            <div className="min-w-0">
              <h1 className="text-base font-semibold tracking-tight">
                {t.camera}
              </h1>

              <p className="mt-0.5 truncate text-xs text-white/55">
                {t.filters[activeFilter.id]} · {filters.length} {t.effects}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <div ref={languageMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setLanguageOpen((current) => !current)}
                  aria-label={t.language}
                  aria-haspopup="menu"
                  aria-expanded={languageOpen}
                  className="flex h-10 items-center gap-2 rounded-full bg-black/45 px-3 text-sm font-medium backdrop-blur-md transition hover:bg-black/60"
                >
                  <Languages className="size-4" />

                  <span>
                    {
                      languageOptions.find(
                        (option) => option.value === language,
                      )?.shortLabel
                    }
                  </span>
                </button>

                {languageOpen && (
                  <div
                    role="menu"
                    aria-label={t.language}
                    className="absolute right-0 top-12 z-50 min-w-44 overflow-hidden rounded-xl border border-white/10 bg-neutral-900/95 p-1 shadow-2xl backdrop-blur-xl"
                  >
                    {languageOptions.map((option) => {
                      const isActive = language === option.value;

                      return (
                        <button
                          key={option.value}
                          type="button"
                          role="menuitemradio"
                          aria-checked={isActive}
                          onClick={() => changeLanguage(option.value)}
                          className={`flex w-full items-center justify-between gap-4 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                            isActive
                              ? "bg-white text-black"
                              : "text-white/75 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          <span>{option.label}</span>

                          {isActive && <Check className="size-4" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setGalleryOpen(true)}
                aria-label={t.gallery}
                className="flex h-10 items-center gap-2 rounded-full bg-black/45 px-3 text-sm font-medium backdrop-blur-md transition hover:bg-black/60 lg:hidden"
              >
                <ImageIcon className="size-4" />
                {photos.length}
              </button>
            </div>
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
            className={`pointer-events-none absolute inset-0 z-30 bg-white transition-opacity duration-100 ${
              flash ? "opacity-100" : "opacity-0"
            }`}
          />

          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/50 to-transparent" />

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black/75 to-transparent" />

          {!cameraReady && (
            <div className="absolute inset-0 z-10 grid place-items-center bg-neutral-950 px-6 text-center">
              <div className="max-w-sm">
                <Camera className="mx-auto size-8 text-white/55" />

                <h2 className="mt-5 text-lg font-semibold">
                  {cameraError ? t.cameraUnavailable : t.openingCamera}
                </h2>

                <p className="mt-2 text-sm leading-6 text-white/55">
                  {cameraError || t.cameraPermission}
                </p>

                {cameraError && (
                  <button
                    type="button"
                    onClick={startCamera}
                    className="mt-5 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90"
                  >
                    {t.tryAgain}
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="relative z-10 mt-auto px-4 pb-5 sm:px-6 sm:pb-7">
            <div className="mb-6 flex gap-5 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`shrink-0 border-b pb-2 text-sm transition ${
                    activeFilter.id === filter.id
                      ? "border-white font-semibold text-white"
                      : "border-transparent text-white/55 hover:text-white"
                  }`}
                >
                  {t.filters[filter.id]}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 items-center">
              <div className="flex justify-start">
                <button
                  type="button"
                  onClick={() => photos[0] && setPreviewPhoto(photos[0])}
                  disabled={!photos.length}
                  aria-label={t.openLastPhoto}
                  className="grid size-12 place-items-center overflow-hidden rounded-lg border border-white/25 bg-white/10 disabled:opacity-40"
                >
                  {photos[0] ? (
                    <img
                      src={photos[0].url}
                      alt="Last photo"
                      className="size-full object-cover"
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
                  aria-label={t.takePhoto}
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
                  aria-label={t.switchCamera}
                  className="grid size-12 place-items-center rounded-full bg-black/45 backdrop-blur-md transition hover:bg-black/60 active:scale-95"
                >
                  <RefreshCw className="size-5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <aside className="hidden min-h-dvh border-l border-white/10 bg-neutral-950 lg:flex lg:flex-col">
          <div className="border-b border-white/10 px-5 py-5">
            <h2 className="font-semibold">{t.gallery}</h2>

            <p className="mt-0.5 text-xs text-white/45">
              {getPhotoCountLabel(photos.length)}
            </p>
          </div>

          <Gallery
            photos={photos}
            language={language}
            translations={t}
            onPreview={setPreviewPhoto}
            onSave={savePhoto}
            onDelete={deletePhoto}
          />
        </aside>
      </div>

      {galleryOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t.gallery}
          className="fixed inset-0 z-40 flex flex-col bg-neutral-950 lg:hidden"
        >
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
            <div>
              <h2 className="font-semibold">{t.gallery}</h2>

              <p className="text-xs text-white/45">
                {getPhotoCountLabel(photos.length)}
              </p>
            </div>

            <IconButton
              label={t.closeGallery}
              onClick={() => setGalleryOpen(false)}
            >
              <X className="size-5" />
            </IconButton>
          </div>

          <Gallery
            photos={photos}
            language={language}
            translations={t}
            onPreview={setPreviewPhoto}
            onSave={savePhoto}
            onDelete={deletePhoto}
          />
        </div>
      )}

      {previewPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${t.photoWithFilter} ${
            t.filters[previewPhoto.filterId]
          }`}
          className="fixed inset-0 z-50 grid place-items-center bg-black/95 p-4 sm:p-8"
        >
          <button
            type="button"
            onClick={() => setPreviewPhoto(null)}
            aria-label={t.closePreview}
            className="absolute right-4 top-4 grid size-11 place-items-center rounded-full bg-white/10 transition hover:bg-white/20"
          >
            <X className="size-5" />
          </button>

          {previewPhoto.url}

          <div className="absolute inset-x-0 bottom-5 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => savePhoto(previewPhoto)}
              className="flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              <Download className="size-4" />
              {t.save}
            </button>

            <button
              type="button"
              onClick={() => deletePhoto(previewPhoto)}
              className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2.5 text-sm font-semibold transition hover:bg-red-600"
            >
              <Trash2 className="size-4" />
              {t.delete}
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
      className="grid size-10 place-items-center rounded-full transition hover:bg-white/10"
    >
      {children}
    </button>
  );
}

function Gallery({
  photos,
  language,
  translations: t,
  onPreview,
  onSave,
  onDelete,
}: {
  photos: Photo[];
  language: Language;
  translations: Translation;
  onPreview: (photo: Photo) => void;
  onSave: (photo: Photo) => void;
  onDelete: (photo: Photo) => void;
}) {
  if (!photos.length) {
    return (
      <div className="grid flex-1 place-items-center px-8 text-center">
        <div>
          <ImageIcon className="mx-auto size-7 text-white/30" />

          <p className="mt-4 text-sm font-medium text-white/70">
            {t.emptyGallery}
          </p>

          <p className="mt-1 text-xs text-white/40">
            {t.emptyGalleryDescription}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid flex-1 auto-rows-min grid-cols-2 gap-1 overflow-y-auto p-1 sm:grid-cols-3 lg:grid-cols-2">
      {photos.map((photo) => {
        const filterName = t.filters[photo.filterId];

        return (
          <article
            key={photo.id}
            className="group relative aspect-[4/5] overflow-hidden bg-neutral-900"
          >
            <button
              type="button"
              onClick={() => onPreview(photo)}
              aria-label={`${t.photoWithFilter} ${filterName}`}
              className="h-full w-full"
            >
              {photo.url}
            </button>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-10 opacity-0 transition group-hover:opacity-100">
              <p className="text-xs font-medium">{filterName}</p>

              <p className="text-[11px] text-white/55">
                {photo.createdAt.toLocaleTimeString(dateLocales[language], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            <div className="absolute right-2 top-2 flex gap-1 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
              <button
                type="button"
                onClick={() => onSave(photo)}
                aria-label={t.savePhoto}
                className="grid size-8 place-items-center rounded-full bg-black/55 transition hover:bg-black/80"
              >
                <Download className="size-3.5" />
              </button>

              <button
                type="button"
                onClick={() => onDelete(photo)}
                aria-label={t.deletePhoto}
                className="grid size-8 place-items-center rounded-full bg-black/55 transition hover:bg-red-600"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
