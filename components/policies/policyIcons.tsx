import { FileText, Lock, RotateCcw, ShieldCheck, Truck, type LucideIcon } from "lucide-react";

export const policyIcons: Record<string, LucideIcon> = {
  "privacy-policy": Lock,
  "warranty-policy": ShieldCheck,
  "shipping-policy": Truck,
  "return-and-refund-policy": RotateCcw,
  "terms-and-conditions": FileText,
};

export const policyIcon = (slug: string): LucideIcon => policyIcons[slug] ?? FileText;