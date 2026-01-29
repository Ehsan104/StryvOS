"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function EnvDebugPage() {
  // Check which Firebase variables are set (client-side only)
  const envVars = {
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "✅ Set" : "❌ Missing",
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? "✅ Set" : "❌ Missing",
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? "✅ Set" : "❌ Missing",
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? "✅ Set" : "❌ Missing",
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? "✅ Set" : "❌ Missing",
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? "✅ Set" : "❌ Missing",
  };

  const requiredVars = [
    "NEXT_PUBLIC_FIREBASE_API_KEY",
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  ];

  const allRequiredSet = requiredVars.every(
    (varName) => process.env[varName as keyof typeof process.env]
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Environment Variables Debug</CardTitle>
          <CardDescription>
            Check which Firebase environment variables are available
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Firebase Client SDK Variables:</h3>
              <ul className="space-y-1 font-mono text-sm">
                {Object.entries(envVars).map(([key, value]) => (
                  <li key={key} className={value.includes("❌") ? "text-destructive" : "text-green-500"}>
                    {key}: {value}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="pt-4 border-t">
              <h3 className="font-semibold mb-2">Status:</h3>
              {allRequiredSet ? (
                <p className="text-green-500">✅ All required variables are set!</p>
              ) : (
                <div>
                  <p className="text-destructive mb-2">❌ Missing required variables:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {requiredVars.map((varName) => (
                      <li key={varName} className={!process.env[varName as keyof typeof process.env] ? "text-destructive" : ""}>
                        {varName} {!process.env[varName as keyof typeof process.env] && "(MISSING)"}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="pt-4 border-t">
              <h3 className="font-semibold mb-2">Next Steps:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Go to Vercel Dashboard → Your Project → Settings → Environment Variables</li>
                <li>Add all missing variables (marked with ❌)</li>
                <li>Make sure to select <strong>Production</strong> environment</li>
                <li>Redeploy your project</li>
                <li>Refresh this page to verify</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
