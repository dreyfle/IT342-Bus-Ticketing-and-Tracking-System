import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString();
};