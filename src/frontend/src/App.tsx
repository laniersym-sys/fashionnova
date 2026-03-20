import { useCallback, useEffect, useRef, useState } from "react";

const SESSION_KEY = "fashionnova_unlocked";
const CORRECT_CODE = "203030";
const DIGIT_COUNT = 6;

function LockScreen({ onUnlock }: { onUnlock: () => void }) {
  const [digits, setDigits] = useState<string[]>(Array(DIGIT_COUNT).fill(""));
  const [shaking, setShaking] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const attemptUnlock = useCallback(
    (code: string) => {
      if (code === CORRECT_CODE) {
        sessionStorage.setItem(SESSION_KEY, "true");
        onUnlock();
      } else {
        setShaking(true);
        setTimeout(() => {
          setShaking(false);
          setDigits(Array(DIGIT_COUNT).fill(""));
          inputRefs.current[0]?.focus();
        }, 500);
      }
    },
    [onUnlock],
  );

  const handleInput = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value.slice(-1);
    setDigits(newDigits);
    if (value && index < DIGIT_COUNT - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    const code = newDigits.join("");
    if (code.length === DIGIT_COUNT && !newDigits.includes("")) {
      setTimeout(() => attemptUnlock(code), 80);
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const digitBox = (pos: number) => (
    <input
      ref={(el) => {
        inputRefs.current[pos] = el;
      }}
      type="password"
      inputMode="numeric"
      maxLength={1}
      value={digits[pos]}
      onChange={(e) => handleInput(pos, e.target.value)}
      onKeyDown={(e) => handleKeyDown(pos, e)}
      className="digit-box"
      autoComplete="off"
    />
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background"
      style={{
        backgroundImage:
          "radial-gradient(circle at 60% 40%, oklch(0.92 0.01 80) 0%, oklch(0.968 0.006 80) 60%)",
      }}
    >
      <div className="flex flex-col items-center gap-10 px-8 py-12 bg-card border border-border shadow-editorial max-w-sm w-full">
        <div className="text-center">
          <div className="font-serif text-3xl font-bold tracking-[0.18em] text-foreground uppercase">
            FashionNova
          </div>
          <div className="mt-1 text-xs tracking-[0.25em] uppercase text-muted-foreground">
            Private Access
          </div>
        </div>

        <div className="w-10 h-px bg-crimson" />

        <p className="text-sm tracking-widest uppercase text-muted-foreground">
          Enter Passcode
        </p>

        <div
          className={`flex gap-3 ${shaking ? "shake" : ""}`}
          data-ocid="lock.panel"
        >
          {digitBox(0)}
          {digitBox(1)}
          {digitBox(2)}
          {digitBox(3)}
          {digitBox(4)}
          {digitBox(5)}
        </div>

        <p className="text-xs text-muted-foreground tracking-wider text-center">
          This site is protected. Authorized access only.
        </p>
      </div>
    </div>
  );
}

function Header() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
        <div className="font-serif text-xl font-bold tracking-[0.15em] uppercase">
          FashionNova
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <button
            type="button"
            onClick={() => scrollTo("profile")}
            className="text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-crimson transition-colors"
            data-ocid="nav.link"
          >
            Profile
          </button>
          <button
            type="button"
            onClick={() => scrollTo("gallery")}
            className="text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-crimson transition-colors"
            data-ocid="nav.link"
          >
            Gallery
          </button>
          <button
            type="button"
            onClick={() => scrollTo("agreement")}
            className="text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-crimson transition-colors"
            data-ocid="nav.link"
          >
            Agreement
          </button>
        </nav>
        <div className="w-32" />
      </div>
    </header>
  );
}

function HeroSection() {
  return (
    <section
      id="profile"
      className="relative min-h-screen flex items-end overflow-hidden bg-foreground"
    >
      <img
        src="/assets/uploads/IMG-20260320-WA0007-4.jpg"
        alt="Corrie Yee Ha — Professional Model"
        className="absolute inset-0 w-full h-full object-cover object-top"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 pb-16 md:pb-24">
        <div className="max-w-3xl">
          <div className="text-xs tracking-[0.3em] uppercase text-white/60 mb-4">
            Professional Model
          </div>
          <h1
            className="font-serif text-5xl sm:text-6xl md:text-8xl font-bold uppercase leading-none text-crimson"
            style={{ textShadow: "0 2px 20px rgba(0,0,0,0.6)" }}
          >
            Corrie
            <br />
            Yee Ha
          </h1>
          <div className="mt-6 flex flex-wrap gap-6 text-sm text-white/70 tracking-wider">
            <span>DOB: January 1, 1992</span>
            <span className="text-white/30">|</span>
            <span>Gender: Female</span>
            <span className="text-white/30">|</span>
            <span>Profession: Model</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function BiographySection() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="editorial-divider" />
        <div className="grid md:grid-cols-3 gap-12 md:gap-16">
          <div className="md:col-span-2">
            <div className="text-xs tracking-[0.25em] uppercase text-crimson mb-4">
              Biography
            </div>
            <h2 className="section-heading mb-8">The Story</h2>
            <div className="space-y-5 text-base leading-relaxed text-foreground/80 font-serif">
              <p>
                Corrie Yee Ha is a force of nature in the contemporary fashion
                world — a model whose commanding presence and effortless
                versatility have made her one of the most sought-after talents
                of her generation. Born on January 1, 1992, Corrie entered the
                industry with an innate sense of artistry that transcended
                conventional modeling.
              </p>
              <p>
                Her career has taken her from the runways of Paris and Milan to
                editorial spreads for the world&apos;s most prestigious
                publications. With a keen instinct for storytelling through
                movement and gaze, Corrie brings depth and narrative to every
                frame — transforming garments into emotion, and light into
                legacy.
              </p>
              <p>
                Over the course of her career, she has collaborated with
                visionary photographers, legendary designers, and celebrated
                creative directors, cementing her status as a true icon of
                modern fashion. Her distinctive look — a rare fusion of
                classical beauty and contemporary edge — has become synonymous
                with elegance, power, and grace.
              </p>
              <p>
                Currently represented under an exclusive global agreement,
                Corrie Yee Ha continues to define what it means to be a model in
                the twenty-first century: bold, intentional, and utterly
                unforgettable.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="text-xs tracking-[0.25em] uppercase text-crimson mb-2">
              Quick Facts
            </div>
            {(
              [
                ["Full Name", "Corrie Yee Ha"],
                ["Date of Birth", "January 1, 1992"],
                ["Nationality", "American"],
                ["Profession", "Professional Model"],
                ["Based in", "United States"],
                ["Status", "Active"],
              ] as [string, string][]
            ).map(([label, value]) => (
              <div key={label} className="border-b border-border pb-4">
                <div className="text-xs tracking-[0.15em] uppercase text-muted-foreground mb-1">
                  {label}
                </div>
                <div className="font-serif text-base font-medium text-foreground">
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20">
          <div className="editorial-divider" />
          <div className="max-w-2xl">
            <div className="text-xs tracking-[0.25em] uppercase text-crimson mb-4">
              Official Record
            </div>
            <h2 className="section-heading mb-8">Contract Details</h2>
          </div>
          <div
            className="border border-border bg-card p-8 md:p-12 shadow-editorial max-w-2xl"
            data-ocid="contract.card"
          >
            <div className="grid gap-6">
              {(
                [
                  ["Model", "Corrie Yee Ha", false],
                  [
                    "Total Contract Value",
                    "$20,000,000 (including bonuses)",
                    true,
                  ],
                  ["Contract End Date", "September 30, 2026", true],
                  ["Status", "Active", false],
                ] as [string, string, boolean][]
              ).map(([label, value, highlight]) => (
                <div
                  key={label}
                  className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6 border-b border-border pb-5"
                >
                  <div className="text-xs tracking-[0.2em] uppercase text-crimson font-semibold min-w-[200px]">
                    {label}
                  </div>
                  <div
                    className={`font-serif text-lg ${
                      highlight
                        ? "font-bold text-foreground"
                        : "text-foreground/80"
                    }`}
                  >
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const GALLERY_IMAGES: { src: string; alt: string }[] = [
  {
    src: "/assets/uploads/IMG-20260320-WA0000-1.jpg",
    alt: "Editorial — Collection I",
  },
  {
    src: "/assets/uploads/IMG-20260320-WA0001-2.jpg",
    alt: "Editorial — Collection II",
  },
  {
    src: "/assets/uploads/IMG-20260320-WA0002-3.jpg",
    alt: "Editorial — Collection III",
  },
  {
    src: "/assets/uploads/IMG-20260320-WA0003-5.jpg",
    alt: "Editorial — Collection IV",
  },
  {
    src: "/assets/uploads/IMG-20260320-WA0004-6.jpg",
    alt: "Editorial — Collection V",
  },
  {
    src: "/assets/uploads/IMG-20260320-WA0005-8.jpg",
    alt: "Editorial — Collection VI",
  },
];

function GallerySection() {
  return (
    <section id="gallery" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="editorial-divider" />
        <div className="text-xs tracking-[0.25em] uppercase text-crimson mb-4">
          Portfolio
        </div>
        <h2 className="section-heading mb-12">Gallery</h2>
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          data-ocid="gallery.panel"
        >
          {GALLERY_IMAGES.map((img, i) => (
            <div
              key={img.src}
              className="group overflow-hidden aspect-[3/4] bg-muted"
              data-ocid={`gallery.item.${i + 1}` as "gallery.item.1"}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const AGREEMENT_SECTIONS = [
  {
    num: 1,
    title: "Term",
    body: "This Agreement shall commence on the date of signing and shall continue in full force and effect until September 30, 2026 (\u201cthe Term\u201d). The Model\u2019s authorized agent holding a valid Power of Attorney may sign this Agreement on behalf of the Model, and such signature shall be legally binding and have the same effect as the Model\u2019s own signature.",
  },
  {
    num: 2,
    title: "Exclusivity",
    body: "During the Term of this Agreement, the Model agrees to provide exclusive modelling services to the Company. The Model shall not enter into any modelling, promotional, or representational agreement with any other agency, company, or individual without the prior written consent of the Company.",
  },
  {
    num: 3,
    title: "Services",
    body: "The Model agrees to perform such modelling assignments, promotional appearances, photoshoots, runway presentations, brand endorsements, and other related services as the Company may arrange from time to time. The Model shall conduct herself in a professional manner at all times.",
  },
  {
    num: 4,
    title: "Agency Fees",
    body: "The Company shall be entitled to retain a commission of fifteen percent (15%) of all gross earnings generated by the Model during the Term of this Agreement. This commission shall be deducted from payments received by the Company on behalf of the Model prior to disbursement.",
  },
  {
    num: 5,
    title: "Intellectual Property",
    body: "The Model assigns to the Company all rights, title, and interest in any photographs, videos, recordings, and other media produced during the course of services rendered under this Agreement. The Company shall have the right to use the Model\u2019s name, likeness, and image for promotional purposes.",
  },
  {
    num: 6,
    title: "Conduct and Professionalism",
    body: "The Model agrees to maintain a professional image consistent with the standards of the Company at all times, both in professional and personal conduct. The Model shall not engage in any activity that could bring the Company into disrepute.",
  },
  {
    num: 7,
    title: "Confidentiality",
    body: "The Model agrees to keep all terms of this Agreement, as well as all business dealings, client information, and Company strategies, strictly confidential. Breach of this clause shall entitle the Company to seek immediate injunctive relief and damages.",
  },
  {
    num: 8,
    title: "Fan Interaction Policy",
    body: "The Model acknowledges and agrees that she must not engage in deep, personal, or intimate conversations with any fan, follower, or member of the public in any capacity, whether online, in person, or through any medium of communication. Any violation of this Fan Interaction Policy shall give the Company the right to immediately terminate this Agreement, and upon such termination, no payment of any kind shall be owed or paid to the Model.",
  },
  {
    num: 9,
    title: "Payment Terms",
    body: "The total compensation payable to the Model under this Agreement is Fifteen Million United States Dollars (US$20,000,000), inclusive of all bonuses and performance incentives. The full amount of this payment will not be released to the Model until the contract end date of September 30, 2026. No advances, partial payments, interim disbursements, or early release of funds of any nature shall be permitted or granted before the said date under any circumstances whatsoever.",
  },
  {
    num: 10,
    title: "Termination",
    body: "This Agreement may be terminated by the Company immediately and without notice in the event of a material breach by the Model, including but not limited to violations of Sections 6, 7, or 8 of this Agreement. In the event of termination for cause, the Company shall owe no further payment obligations to the Model.",
  },
  {
    num: 11,
    title: "Governing Law",
    body: "This Agreement shall be governed by and construed in accordance with applicable law. Any disputes arising under this Agreement shall be resolved through binding arbitration.",
  },
  {
    num: 12,
    title: "Entire Agreement",
    body: "This Agreement constitutes the entire understanding between the parties with respect to the subject matter herein and supersedes all prior negotiations, representations, or agreements.",
  },
];

function AgreementSection() {
  return (
    <section id="agreement" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="editorial-divider" />
        <div className="text-xs tracking-[0.25em] uppercase text-crimson mb-4">
          Legal Document
        </div>
        <h2 className="section-heading mb-12">Model Agreement</h2>

        <div className="max-w-4xl">
          {/* Preamble */}
          <div className="mb-10 p-8 border border-border bg-card">
            <div className="text-xs tracking-[0.25em] uppercase text-crimson mb-3">
              Preamble
            </div>
            <p className="font-serif text-base leading-relaxed text-foreground/80">
              This Agreement is entered into between Glamour Modelling &amp;
              Talented Limited (&quot;the Company&quot;) and Whitney Espinoza
              (&quot;the Model&quot;). This Agreement sets out the full terms
              and conditions governing the exclusive professional relationship
              between the Company and the Model, and shall be binding upon both
              parties from the date of execution.
            </p>
          </div>

          {/* All 12 Sections */}
          <div className="space-y-10" data-ocid="agreement.panel">
            {AGREEMENT_SECTIONS.map((section, idx) => (
              <div
                key={section.num}
                className={
                  idx < AGREEMENT_SECTIONS.length - 1
                    ? "border-b border-border pb-10"
                    : "pb-10"
                }
              >
                <div className="flex items-start gap-6">
                  <div className="text-crimson font-serif font-bold text-2xl leading-none pt-1 min-w-[2rem]">
                    {section.num}
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold uppercase tracking-wider mb-4">
                      <span className="text-crimson">
                        Section {section.num}
                      </span>{" "}
                      — {section.title}
                    </h3>
                    <p className="font-serif text-base leading-relaxed text-foreground/80">
                      {section.body}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Signatures Block */}
          <div className="mt-16 pt-10 border-t-2 border-border">
            <div className="text-xs tracking-[0.25em] uppercase text-crimson mb-8">
              Signatures
            </div>
            <div className="grid md:grid-cols-2 gap-12">
              {/* Company Signatory */}
              <div className="flex flex-col gap-4">
                <div className="h-16 flex items-end">
                  <p className="font-serif text-2xl italic text-foreground/70 tracking-wide">
                    fashionnova
                  </p>
                </div>
                <div className="border-t border-foreground/40 pt-3">
                  <div className="text-xs tracking-[0.2em] uppercase text-crimson font-semibold">
                    Authorized Signatory
                  </div>
                  <div className="font-serif text-sm text-foreground/70 mt-1">
                    The Company — Glamour Modelling &amp; Talented Limited
                  </div>
                </div>
              </div>
              {/* Model / Agent Signatory */}
              <div className="flex flex-col gap-4">
                <div className="h-16 flex items-end">
                  <p className="font-serif text-2xl italic text-foreground/70 tracking-wide">
                    corrie yee ha
                  </p>
                </div>
                <div className="border-t border-foreground/40 pt-3">
                  <div className="text-xs tracking-[0.2em] uppercase text-crimson font-semibold">
                    Authorized Agent (POA)
                  </div>
                  <div className="font-serif text-sm text-foreground/70 mt-1">
                    The Model / Authorized Agent under Power of Attorney
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Confidentiality Footer */}
          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-xs tracking-wider text-muted-foreground uppercase">
              This document is confidential and for authorized parties only. All
              rights reserved. FashionNova International.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  const utmUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;
  return (
    <footer className="border-t border-border py-12 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="font-serif text-lg font-bold tracking-[0.15em] uppercase text-foreground">
          FashionNova
        </div>
        <p className="text-xs text-muted-foreground tracking-wider text-center">
          &copy; {year} FashionNova International. All rights reserved.
        </p>
        <p className="text-xs text-muted-foreground">
          Built with ♥ using{" "}
          <a
            href={utmUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-crimson transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </footer>
  );
}

export default function App() {
  const [unlocked, setUnlocked] = useState(() => {
    return sessionStorage.getItem(SESSION_KEY) === "true";
  });

  if (!unlocked) {
    return <LockScreen onUnlock={() => setUnlocked(true)} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <BiographySection />
        <GallerySection />
        <AgreementSection />
      </main>
      <Footer />
    </div>
  );
}
