"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

export const MovingBorder = ({
  children,
  duration = 2000,
  className,
  containerClassName,
}: {
  children: React.ReactNode;
  duration?: number;
  className?: string;
  containerClassName?: string;
}) => {
  return (
    <div
      className={cn(
        "relative p-[1px] overflow-hidden rounded-2xl",
        containerClassName
      )}
    >
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{
          background:
            "linear-gradient(90deg, #06b6d4, #8b5cf6, #06b6d4, #8b5cf6)",
          backgroundSize: "200% 100%",
        }}
        animate={{
          backgroundPosition: ["0% 0%", "200% 0%"],
        }}
        transition={{
          duration: duration / 1000,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <div
        className={cn(
          "relative bg-slate-950 rounded-2xl p-6",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
};

export const HoverBorderGradient = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={cn(
        "relative p-[2px] rounded-2xl overflow-hidden group",
        className
      )}
    >
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background: useTransform(
            [mouseX, mouseY],
            ([x, y]) =>
              `radial-gradient(circle at ${x}px ${y}px, rgba(6, 182, 212, 0.4), transparent 80%)`
          ),
        }}
      />
      <div className="relative bg-slate-950 rounded-2xl p-6 z-10">
        {children}
      </div>
    </div>
  );
};
