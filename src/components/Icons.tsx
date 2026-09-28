import type { ReactNode } from "react";

const Svg = ({ children, size = 20, fill = "none", strokeWidth = 1.8 }: { children: ReactNode; size?: number; fill?: string; strokeWidth?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
);

export const IconSearch = ({ size }: { size?: number }) => <Svg size={size}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></Svg>;
export const IconBell = ({ size }: { size?: number }) => <Svg size={size}><path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8" /><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0" /></Svg>;
export const IconHeart = ({ filled }: { filled?: boolean }) => <Svg fill={filled ? "currentColor" : "none"}><path d="M20.8 5.6a5.2 5.2 0 0 0-7.4 0L12 7l-1.4-1.4a5.2 5.2 0 0 0-7.4 7.4L12 21.8l8.8-8.8a5.2 5.2 0 0 0 0-7.4Z" /></Svg>;
export const IconShare = () => <Svg><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" /></Svg>;
export const IconDownload = ({ size }: { size?: number }) => <Svg size={size}><path d="M12 3v12m0 0-4-4m4 4 4-4M4 20h16" /></Svg>;
export const IconSend = () => <Svg><path d="M22 2 11 13" /><path d="M22 2 15 22l-4-9-9-4 20-7Z" /></Svg>;
export const IconClock = () => <Svg size={16}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Svg>;
export const IconHome = () => <Svg size={24}><path d="M3 11 12 3l9 8" /><path d="M5 10v10h14V10" /></Svg>;
export const IconLibrary = () => <Svg size={24}><path d="M4 4v16M9 4v16M14 6l4 14M14 6l3-1 4 15" /></Svg>;
export const IconSun = () => <Svg><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></Svg>;
export const IconMoon = () => <Svg><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" /></Svg>;
export const IconMessage = ({ size }: { size?: number }) => <Svg size={size}><path d="M4 5h16v11H8l-4 4V5Z" /></Svg>;
export const IconUser = ({ size }: { size?: number }) => <Svg size={size}><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-6 8-6s8 2 8 6" /></Svg>;
export const IconLock = ({ size }: { size?: number }) => <Svg size={size}><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></Svg>;
export const IconBookmark = ({ size }: { size?: number }) => <Svg size={size}><path d="M6 3h12v18l-6-4-6 4Z" /></Svg>;

export const IconSmartHome = ({ size = 24 }: { size?: number }) => <Svg size={size} strokeWidth={2}>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M19 8.71l-5.333 -4.148a2.666 2.666 0 0 0 -3.274 0l-5.334 4.148a2.665 2.665 0 0 0 -1.029 2.105v7.2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-7.2c0 -.823 -.38 -1.6 -1.03 -2.105" />
  <path d="M16 15c-2.21 1.333 -5.792 1.333 -8 0" />
</Svg>;

export const IconMessages = ({ size = 24 }: { size?: number }) => <Svg size={size} strokeWidth={2}>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M21 14l-3 -3h-7a1 1 0 0 1 -1 -1v-6a1 1 0 0 1 1 -1h9a1 1 0 0 1 1 1v10" />
  <path d="M14 15v2a1 1 0 0 1 -1 1h-7l-3 3v-10a1 1 0 0 1 1 -1h2" />
</Svg>;

export const IconStackPlus = ({ size = 24 }: { size?: number }) => <Svg size={size} strokeWidth={2}>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M12 4l-8 4l8 4l8 -4l-8 -4" />
  <path d="M4 12l8 4" />
  <path d="M4 16l8 4" />
  <path d="M16 19h6" />
  <path d="M19 16v6" />
</Svg>;

export const IconUserTabler = ({ size = 24 }: { size?: number }) => <Svg size={size} strokeWidth={2}>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
  <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
</Svg>;
