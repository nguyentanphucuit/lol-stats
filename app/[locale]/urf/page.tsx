"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/components/providers/locale-provider";
import { getLocaleCode } from "@/lib/locale-utils";
import { getTranslations } from "@/lib/translations";

export default function UrfPage() {
  const { locale } = useLocale();
  const currentLocaleCode = getLocaleCode(locale);
  const translations = getTranslations(locale);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              URF Champion Builds
            </CardTitle>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Ultimate Rapid Fire - The fastest way to dominate the Rift!
            </p>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
