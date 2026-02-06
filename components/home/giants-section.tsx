"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const giants = [
  {
    initials: "AT",
    name: "Alan Turing",
    years: "1912–1954",
    quote: "\u201cCan machines think?\u201d",
    highlight: "Father of Turing Test",
    desc: "defined the boundary of \u201cintelligence\u201d",
    img: "/img/giants/turing.jpg",
    gradient: "from-blue-600 to-indigo-700",
    cardGradient: "from-blue-900/30 to-indigo-900/30",
    border: "border-blue-500/20 hover:border-blue-400/50",
    color: "text-blue-400",
    highlightColor: "text-blue-400/80",
    ring: "ring-blue-500/30",
  },
  {
    initials: "JN",
    name: "John von Neumann",
    years: "1903–1957",
    quote: "\u201cStored-program\u201d architecture founder",
    highlight: "Father of Modern Computing",
    desc: "game theory pioneer",
    img: "/img/giants/neumann.jpg",
    gradient: "from-purple-600 to-pink-700",
    cardGradient: "from-purple-900/30 to-pink-900/30",
    border: "border-purple-500/20 hover:border-purple-400/50",
    color: "text-purple-400",
    highlightColor: "text-purple-400/80",
    ring: "ring-purple-500/30",
  },
  {
    initials: "TK",
    name: "Theodore von K\u00e1rm\u00e1n",
    years: "1881–1963",
    quote: "Mentor of Qian Xuesen",
    highlight: "Father of Aerospace",
    desc: "fluid dynamics master",
    img: null,
    gradient: "from-orange-600 to-red-700",
    cardGradient: "from-orange-900/30 to-red-900/30",
    border: "border-orange-500/20 hover:border-orange-400/50",
    color: "text-orange-400",
    highlightColor: "text-orange-400/80",
    ring: "ring-orange-500/30",
  },
  {
    initials: "CS",
    name: "Claude Shannon",
    years: "1916–2001",
    quote: "\u201cEverything is 0 and 1\u201d",
    highlight: "Father of Information Theory",
    desc: "founded the digital age",
    img: null,
    gradient: "from-green-600 to-teal-700",
    cardGradient: "from-green-900/30 to-teal-900/30",
    border: "border-green-500/20 hover:border-green-400/50",
    color: "text-green-400",
    highlightColor: "text-green-400/80",
    ring: "ring-green-500/30",
  },
];

function Avatar({ giant }: { giant: typeof giants[0] }) {
  if (giant.img) {
    return (
      <div className={`relative w-20 h-20 rounded-full overflow-hidden ring-2 ${giant.ring} mb-4 mx-auto`}>
        <Image
          src={giant.img}
          alt={giant.name}
          fill
          className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
          sizes="80px"
        />
      </div>
    );
  }
  return (
    <div className={`relative w-20 h-20 rounded-full bg-gradient-to-br ${giant.gradient} ring-2 ${giant.ring} mb-4 mx-auto flex items-center justify-center`}>
      <span className="text-2xl font-black text-white/90 tracking-tight">{giant.initials}</span>
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.15),transparent)]" />
    </div>
  );
}

export function GiantsSection() {
  return (
    <div className="mb-20">
      <div className="text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-black mb-4"
        >
          <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 bg-clip-text text-transparent">
            Standing on the Shoulders of Giants
          </span>
        </motion.h2>
        <p className="text-[var(--muted)] max-w-2xl mx-auto">
          Honoring the pioneers who shaped AI and computer science
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
        {giants.map((g, i) => (
          <motion.div
            key={g.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`group relative p-6 rounded-2xl bg-gradient-to-br ${g.cardGradient} border ${g.border} transition-all overflow-hidden`}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.05),transparent_70%)]" />
            <div className="relative z-10">
              <Avatar giant={g} />
              <h3 className={`font-bold ${g.color} mb-1 text-center`}>{g.name}</h3>
              <p className="text-xs text-[var(--muted)] mb-2 text-center">{g.years}</p>
              <p className="text-xs text-[var(--muted-foreground)] leading-relaxed text-center">
                {g.quote}<br />
                <span className={g.highlightColor}>{g.highlight}</span>, {g.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 text-center max-w-3xl mx-auto">
        <blockquote className="text-lg italic text-[var(--muted)] border-l-4 border-amber-500/50 pl-4">
          &ldquo;We can only see a short distance ahead, but we can see plenty there that needs to be done.&rdquo;
          <footer className="text-sm text-amber-400/60 mt-2">&mdash; Alan Turing</footer>
        </blockquote>
      </div>
    </div>
  );
}
