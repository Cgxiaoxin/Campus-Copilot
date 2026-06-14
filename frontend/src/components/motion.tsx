"use client"

import { motion, type Variants } from "framer-motion"
import type { ComponentProps } from "react"

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1]

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease } },
}

export const stagger: Variants = {
  hidden: { opacity: 0 },
  visible: { transition: { staggerChildren: 0.06 } },
}

export const cardItem: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease } },
}

export function PageTransition(props: ComponentProps<typeof motion.div>) {
  return <motion.div initial="hidden" animate="visible" variants={fadeInUp} {...props} />
}

export function StaggerGrid(props: ComponentProps<typeof motion.div>) {
  return <motion.div initial="hidden" animate="visible" variants={stagger} {...props} />
}

export function CardMotion(props: ComponentProps<typeof motion.div>) {
  return <motion.div variants={cardItem} {...props} />
}
