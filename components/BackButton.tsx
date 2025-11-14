"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  href: string;
  label?: string;
}

export default function BackButton({ href, label = "Back" }: BackButtonProps) {
  return (
    <Button variant="outline" size="sm" asChild>
      <Link href={href}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        {label}
      </Link>
    </Button>
  );
}