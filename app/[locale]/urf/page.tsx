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

        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                🚀 Use URF Builds as Templates
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Click "Create New Build" on any champion below to use their URF
                build as a starting point. You can then customize runes, items,
                and spells to create your perfect build!
              </p>
              <div className="flex flex-wrap justify-center gap-2 text-sm">
                <Badge variant="outline">Runes</Badge>
                <Badge variant="outline">Items</Badge>
                <Badge variant="outline">Spells</Badge>
                <Badge variant="outline">Customizable</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">
            URF builds configuration loaded. Ready to create new builds!
          </p>
        </div>
      </div>
    </div>
  );
}
