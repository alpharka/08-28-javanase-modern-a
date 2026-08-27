import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, CalendarDays, Check, ChevronLeft, ChevronRight, Copy, ExternalLink, Heart, MapPin, Music2, Pause, Play, Send, Sparkles, X } from "lucide-react";

/**
 * DESIGN SYSTEM — Modern Javanese Editorial
 * Cendana Burnt #B65F43, ivory paper, sawo brown ink, architectural rules, and an editorial horizontal spread.
 * This page intentionally treats swipe as the primary interaction and the bottom rail as a persistent index.
 */
const CONFIG = {
  couple: "Ayu & Raka",
  shortNames: "Ayu · Raka",
  parents: "Putri pertama dari Bapak & Ibu Santoso · Putra kedua dari Bapak & Ibu Wibowo",
  dateLabel: "Sabtu, 24 Oktober 2026",
  eventDate: "2026-10-24T16:00:00+07:00",
  akadTime: "15.30 WIB",
  receptionTime: "18.30 WIB",
  venue: "Pendopo Djogja",
  address: "Jl. Parangtritis Km. 5, Yogyakarta",
  mapsUrl: "https://maps.google.com/?q=Pendopo+Djogja+Yogyakarta",
  calendarUrl: "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Ayu+%26+Raka+Wedding&dates=20261024T083000Z/20261024T133000Z&details=Undangan+pernikahan+Ayu+dan+Raka&location=Pendopo+Djogja%2C+Yogyakarta&ctz=Asia%2FJakarta",
  walletProvider: "GoPay",
  walletNumber: "0812 3456 7890",
  accountBank: "BCA",
  accountNumber: "1234567890",
  accountName: "Ayu Lestari",
  paymentLink: "https://contoh.link/pembayaran",
  ambientTrack: "",
};

const NAV = [
  { id: "cerita", label: "Cerita", short: "Kisah" },
  { id: "acara", label: "Acara", short: "Acara" },
  { id: "galeri", label: "Galeri", short: "Foto" },
  { id: "rsvp", label: "RSVP", short: "RSVP" },
  { id: "kasih", label: "Tanda kasih", short: "Kasih" },
];

const GALLERY = [
  { src: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85", alt: "Pasangan berjalan berdampingan di bawah cahaya sore", caption: "01 / langkah pertama" },
  { src: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=85", alt: "Detail tangan pasangan dengan bunga putih", caption: "02 / janji kecil" },
  { src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85", alt: "Pasangan tersenyum di ruang dengan cahaya hangat", caption: "03 / ruang yang sama" },
  { src: "https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=1200&q=85", alt: "Siluet pasangan di lanskap terbuka", caption: "04 / menuju pulang" },
  { src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=85", alt: "Dekorasi meja dengan bunga dan kain bernuansa tanah", caption: "05 / hal-hal yang dirayakan" },
  { src: "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=1200&q=85", alt: "Pasangan berdiri di depan arsitektur klasik", caption: "06 / halaman berikutnya" },
];

type GuestbookEntry = { name: string; attendance: string; message: string; createdAt: string };

function getGuestName() {
  const raw = new URLSearchParams(window.location.search).get("to")?.trim().replace(/\s+/g, " ");
  return raw ? raw.slice(0, 60) : "Tamu undangan";
}

function useCountdown() {
  const [remaining, setRemaining] = useState(() => Math.max(0, new Date(CONFIG.eventDate).getTime() - Date.now()));
  useEffect(() => {
    const timer = window.setInterval(() => setRemaining(Math.max(0, new Date(CONFIG.eventDate).getTime() - Date.now())), 1000);
    return () => window.clearInterval(timer);
  }, []);
  const total = Math.floor(remaining / 1000);
  return { days: Math.floor(total / 86400), hours: Math.floor((total % 86400) / 3600), minutes: Math.floor((total % 3600) / 60), seconds: total % 60 };
}

function SectionEyebrow({ children, number }: { children: string; number: string }) {
  return <div className="eyebrow"><span>{number}</span><span>{children}</span><i /></div>;
}

export default function Home() {
  const guest = useMemo(getGuestName, []);
  const [opened, setOpened] = useState(false);
  const [active, setActive] = useState("cerita");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [musicOn, setMusicOn] = useState(false);
  const [copied, setCopied] = useState("");
  const [form, setForm] = useState({ name: "", attendance: "Saya akan hadir", message: "" });
  const [sent, setSent] = useState(false);
  const [entries, setEntries] = useState<GuestbookEntry[]>(() => {
    try { return JSON.parse(localStorage.getItem("ayu-raka-guestbook") || "[]"); } catch { return []; }
  });
  const audioRef = useRef<HTMLAudioElement>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const spreadRef = useRef<HTMLElement>(null);
  const countdown = useCountdown();

  useEffect(() => {
    const observer = new IntersectionObserver((observations) => {
      const visible = observations.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target.id && NAV.some((item) => item.id === visible.target.id)) setActive(visible.target.id);
    }, { root: spreadRef.current, threshold: [0.25, 0.5, 0.75] });
    NAV.forEach(({ id }) => sectionRefs.current[id] && observer.observe(sectionRefs.current[id]!));
    return () => observer.disconnect();
  }, [opened]);

  useEffect(() => {
    document.body.style.overflow = lightbox !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightbox]);

  useEffect(() => {
    const onHorizontalKey = (event: KeyboardEvent) => {
      if (!opened || lightbox !== null) return;
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      event.preventDefault();
      const currentIndex = NAV.findIndex((item) => item.id === active);
      const nextIndex = Math.min(NAV.length - 1, Math.max(0, currentIndex + (event.key === "ArrowRight" ? 1 : -1)));
      if (nextIndex !== currentIndex) goTo(NAV[nextIndex].id);
    };
    window.addEventListener("keydown", onHorizontalKey);
    return () => window.removeEventListener("keydown", onHorizontalKey);
  }, [opened, lightbox, active]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (lightbox === null) return;
      if (event.key === "Escape") setLightbox(null);
      if (event.key === "ArrowRight") setLightbox((i) => i === null ? 0 : (i + 1) % GALLERY.length);
      if (event.key === "ArrowLeft") setLightbox((i) => i === null ? 0 : (i - 1 + GALLERY.length) % GALLERY.length);
    };
    window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  const openInvitation = () => {
    setOpened(true);
    window.setTimeout(() => { audioRef.current?.play().then(() => setMusicOn(true)).catch(() => undefined); }, 650);
  };
  const goTo = (id: string) => sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  const copyValue = async (key: string, value: string) => {
    try { await navigator.clipboard.writeText(value); } catch { const area = document.createElement("textarea"); area.value = value; document.body.appendChild(area); area.select(); document.execCommand("copy"); area.remove(); }
    setCopied(key); window.setTimeout(() => setCopied(""), 2000);
  };
  const submitRsvp = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name.trim() || !form.message.trim()) return;
    const next = [{ ...form, createdAt: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) }, ...entries];
    setEntries(next); setSent(true); setForm({ name: "", attendance: "Saya akan hadir", message: "" });
    try { localStorage.setItem("ayu-raka-guestbook", JSON.stringify(next)); } catch { /* local-only graceful fallback */ }
  };

  return (
    <div className={`invite-shell ${opened ? "is-open" : "is-locked"}`}>
      <audio ref={audioRef} loop preload="auto" src={CONFIG.ambientTrack || undefined} />
      <div className="cover" aria-hidden={opened}>
        <div className="cover-image" />
        <div className="cover-shade" />
        <div className="cover-content">
          <div className="emblem" aria-label="Emblem Ayu dan Raka"><span /><span /></div>
          <p className="cover-kicker">THE WEDDING OF</p>
          <h1>Ayu <em>&</em> Raka</h1>
          <div className="cover-meta"><span>{CONFIG.dateLabel}</span><i /><span>{CONFIG.venue}</span></div>
          <p className="guest-line">Kepada Yth.<br /><strong>{guest}</strong></p>
          <button className="open-button" onClick={openInvitation}><span>Buka Undangan</span><ArrowRight size={16} /></button>
          <p className="swipe-note">Geser untuk menjelajah cerita kami</p>
        </div>
        <div className="cover-index">01 — 05 <span>UNDANGAN DIGITAL</span></div>
      </div>

      <header className="topbar">
        <button className="mini-brand" onClick={() => goTo("cerita")} aria-label="Kembali ke awal"><span className="mini-emblem" /> <span>{CONFIG.shortNames}</span></button>
        <div className="topbar-date">24 · 10 · 26 <span>YOGYAKARTA</span></div>
        <button className="sound-button" onClick={() => { if (musicOn) { audioRef.current?.pause(); setMusicOn(false); } else { audioRef.current?.play().then(() => setMusicOn(true)).catch(() => undefined); } }} aria-label={musicOn ? "Jeda musik" : "Putar musik"}>{musicOn ? <Pause size={15} /> : <Music2 size={15} />} <span>{musicOn ? "Musik on" : "Musik off"}</span></button>
      </header>

      <main ref={spreadRef} className="spread" aria-label="Isi undangan" tabIndex={-1}>
        <div className="swipe-hint" aria-hidden="true"><ArrowLeft size={13} /> Geser kanan · kiri <ArrowRight size={13} /></div>
        <section className="intro-panel" aria-label="Pembuka">
          <div className="intro-copy"><SectionEyebrow number="00" >Sebuah awal yang baru</SectionEyebrow><h2>Dua langkah,<br /><i>satu rumah.</i></h2><p>Dengan segala kerendahan hati, kami mengundang Anda untuk hadir di hari ketika dua perjalanan memilih untuk berjalan dalam satu arah.</p><button className="text-link" onClick={() => goTo("cerita")}>Baca cerita kami <ArrowDown size={16} /></button></div>
          <div className="intro-stamp">24<br /><small>OCT</small><br />26</div>
          <div className="intro-number">A / R</div>
        </section>

        <section id="cerita" ref={(el) => { sectionRefs.current.cerita = el; }} className="story-panel panel-light">
          <div className="rail-label">CERITA — 01</div><div className="story-grid"><div className="story-photo photo-one" /><div className="story-copy"><SectionEyebrow number="01">Cerita kami</SectionEyebrow><h2>Dari satu<br /><i>percakapan.</i></h2><p>Berawal dari pertemuan sederhana yang tidak kami duga, Ayu dan Raka menemukan kenyamanan di antara obrolan panjang dan jeda yang terasa singkat.</p><p>Tahun-tahun setelahnya mengajarkan kami bahwa rumah tidak selalu berupa tempat. Kadang ia hadir sebagai seseorang—yang membuat kita ingin pulang, lagi dan lagi.</p><div className="signature">Ayu <span>&</span> Raka</div></div></div>
        </section>

        <section id="acara" ref={(el) => { sectionRefs.current.acara = el; }} className="event-panel panel-clay">
          <div className="rail-label light-rail">ACARA — 02</div><div className="event-layout"><div className="event-heading"><SectionEyebrow number="02">Catat harinya</SectionEyebrow><h2>Catat hari<br /><i>bahagianya.</i></h2><div className="countdown"><div><strong>{String(countdown.days).padStart(2, "0")}</strong><span>hari</span></div><b>:</b><div><strong>{String(countdown.hours).padStart(2, "0")}</strong><span>jam</span></div><b>:</b><div><strong>{String(countdown.minutes).padStart(2, "0")}</strong><span>menit</span></div><b>:</b><div><strong>{String(countdown.seconds).padStart(2, "0")}</strong><span>detik</span></div></div></div><div className="event-details"><div className="event-row"><span className="event-tag">AKAD NIKAH</span><div><h3>Sabtu, 24 Oktober 2026</h3><p>{CONFIG.akadTime} · {CONFIG.venue}</p></div></div><div className="event-row"><span className="event-tag">RESEPSI</span><div><h3>Sabtu, 24 Oktober 2026</h3><p>{CONFIG.receptionTime} · {CONFIG.venue}</p></div></div><p className="address"><MapPin size={15} /> {CONFIG.address}</p><div className="event-actions"><a href={CONFIG.mapsUrl} target="_blank" rel="noreferrer"><MapPin size={15} /> Lihat lokasi <ExternalLink size={12} /></a><a href={CONFIG.calendarUrl} target="_blank" rel="noreferrer"><CalendarDays size={15} /> Simpan ke Calendar <ExternalLink size={12} /></a></div></div></div>
        </section>

        <section id="galeri" ref={(el) => { sectionRefs.current.galeri = el; }} className="gallery-panel panel-paper"><div className="rail-label">GALERI — 03</div><div className="gallery-head"><div><SectionEyebrow number="03">Beberapa halaman</SectionEyebrow><h2>Di antara<br /><i>momen.</i></h2></div><p>Geser ke samping untuk membuka foto. Setiap bingkai menyimpan satu suasana kecil dari perjalanan kami.</p></div><div className="gallery-grid">{GALLERY.map((item, index) => <button className={`gallery-tile tile-${index + 1}`} key={item.src} onClick={() => setLightbox(index)} aria-label={`Lihat foto ${item.caption}`}><img src={item.src} alt={item.alt} loading="lazy" /><span>{item.caption}</span><Sparkles size={16} /></button>)}</div></section>

        <section id="rsvp" ref={(el) => { sectionRefs.current.rsvp = el; }} className="rsvp-panel panel-ink"><div className="rail-label light-rail">RSVP — 04</div><div className="rsvp-layout"><div><SectionEyebrow number="04">Kehadiranmu</SectionEyebrow><h2>Kabari kami<br /><i>kehadiranmu.</i></h2><p className="rsvp-note">Satu pesan kecil dari Anda akan menjadi bagian dari halaman yang kami simpan baik-baik.</p></div><form onSubmit={submitRsvp} className="rsvp-form"><label>Nama lengkap<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Tulis namamu" required /></label><label>Konfirmasi kehadiran<select value={form.attendance} onChange={(e) => setForm({ ...form, attendance: e.target.value })}><option>Saya akan hadir</option><option>Belum bisa memastikan</option><option>Tidak dapat hadir</option></select></label><label>Pesan ucapan<textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tulis doa dan ucapanmu" required /></label><button className="submit-button" type="submit"><Send size={15} /> Kirim konfirmasi</button>{sent && <p className="success"><Check size={15} /> Terima kasih, pesanmu sudah tersimpan di perangkat ini.</p>}</form></div><div className="guestbook"><div className="guestbook-head"><span>BUKU TAMU</span><span>{entries.length} pesan</span></div>{entries.length === 0 ? <p className="empty-book">Pesan ucapanmu akan muncul di sini setelah dikirim.</p> : entries.slice(0, 3).map((entry) => <article key={`${entry.createdAt}-${entry.name}`}><div><strong>{entry.name}</strong><span>{entry.attendance} · {entry.createdAt}</span></div><p>“{entry.message}”</p></article>)}</div></section>

        <section id="kasih" ref={(el) => { sectionRefs.current.kasih = el; }} className="gift-panel panel-light"><div className="rail-label">TANDA KASIH — 05</div><div className="gift-layout"><div className="gift-art"><div className="emblem large"><span /><span /></div><Heart size={20} /></div><div className="gift-copy"><SectionEyebrow number="05">Tanda kasih</SectionEyebrow><h2>Untuk doa<br /><i>yang menyertai.</i></h2><p>Doa dan kehadiran Anda adalah hadiah yang paling berarti. Bila berkenan, tanda kasih dapat disampaikan melalui detail berikut.</p><div className="payment-list"><div><span>{CONFIG.walletProvider}</span><strong>{CONFIG.walletNumber}</strong><small>a.n. {CONFIG.accountName}</small><button onClick={() => copyValue("wallet", CONFIG.walletNumber)}><Copy size={13} /> {copied === "wallet" ? "Tersalin" : "Salin nomor"}</button></div><div><span>{CONFIG.accountBank}</span><strong>{CONFIG.accountNumber}</strong><small>a.n. {CONFIG.accountName}</small><button onClick={() => copyValue("bank", CONFIG.accountNumber)}><Copy size={13} /> {copied === "bank" ? "Tersalin" : "Salin nomor"}</button></div></div><div className="qr-wrap"><img src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(CONFIG.paymentLink)}`} alt="QR code tanda kasih" /><span>Scan untuk berbagi tanda kasih</span></div></div></div></section>
      </main>

      <nav className="bottom-nav" aria-label="Navigasi section"><div className="nav-progress"><span style={{ width: `${((NAV.findIndex((item) => item.id === active) + 1) / NAV.length) * 100}%` }} /></div>{NAV.map((item, index) => <button key={item.id} className={active === item.id ? "active" : ""} onClick={() => goTo(item.id)}><span className="nav-index">0{index + 1}</span><span>{item.short}</span></button>)}</nav>

      {lightbox !== null && <div className="lightbox" role="dialog" aria-modal="true" aria-label="Galeri foto" onClick={() => setLightbox(null)}><button className="lightbox-close" onClick={() => setLightbox(null)} aria-label="Tutup galeri"><X /></button><button className="lightbox-prev" onClick={(e) => { e.stopPropagation(); setLightbox((i) => i === null ? 0 : (i - 1 + GALLERY.length) % GALLERY.length); }} aria-label="Foto sebelumnya"><ChevronLeft /></button><figure onClick={(e) => e.stopPropagation()}><img src={GALLERY[lightbox].src} alt={GALLERY[lightbox].alt} /><figcaption>{GALLERY[lightbox].caption}</figcaption></figure><button className="lightbox-next" onClick={(e) => { e.stopPropagation(); setLightbox((i) => i === null ? 0 : (i + 1) % GALLERY.length); }} aria-label="Foto berikutnya"><ChevronRight /></button></div>}
    </div>
  );
}
