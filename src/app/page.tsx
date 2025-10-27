// src/app/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Award, Upload, Edit3, Download, Zap, Shield } from "lucide-react";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--rs-primary-50)] via-[var(--rs-neutral-50)] to-[var(--rs-accent-50)] dark:from-[var(--rs-primary-950)] dark:via-[var(--rs-neutral-950)] dark:to-[var(--rs-neutral-900)]">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-[var(--rs-primary-500)] to-[var(--rs-primary-600)] shadow-lg">
              <Award className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-[var(--rs-primary-600)] to-[var(--rs-primary-800)] bg-clip-text text-transparent">
              CertGen
            </span>
          </div>
          <Button
            onClick={() => router.push("/login")}
            style={{
              backgroundColor: "var(--rs-primary-500)",
              color: "white",
            }}
            className="hover:opacity-90 transition-opacity"
          >
            Sign In
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[var(--rs-primary-100)] dark:bg-[var(--rs-primary-900)] text-[var(--rs-primary-700)] dark:text-[var(--rs-primary-200)] px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Zap className="w-4 h-4" />
            Professional Certificate Generator
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-[var(--rs-primary-600)] via-[var(--rs-primary-500)] to-[var(--rs-accent-500)] bg-clip-text text-transparent">
              Create Beautiful
            </span>
            <br />
            <span className="text-[var(--rs-neutral-800)] dark:text-[var(--rs-neutral-100)]">
              Certificates in Minutes
            </span>
          </h1>

          <p className="text-xl text-[var(--rs-neutral-600)] dark:text-[var(--rs-neutral-300)] mb-10 max-w-3xl mx-auto leading-relaxed">
            Design, customize, and download professional certificates with our
            intuitive drag-and-drop editor. Perfect for schools, organizations,
            and businesses.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              size="lg"
              onClick={() => router.push("/login")}
              className="text-lg px-10 py-6 shadow-xl hover:shadow-2xl transition-all"
              style={{
                backgroundColor: "var(--rs-primary-500)",
                color: "white",
              }}
            >
              Get Started Free
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-10 py-6 border-2"
              style={{
                borderColor: "var(--rs-primary-500)",
                color: "var(--rs-primary-600)",
              }}
              onClick={() => {
                document.getElementById("features")?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
            >
              Learn More
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-8 items-center text-[var(--rs-neutral-500)] dark:text-[var(--rs-neutral-400)] text-sm">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[var(--rs-primary-500)]" />
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-[var(--rs-accent-500)]" />
              <span>Lightning Fast</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[var(--rs-primary-500)]" />
              <span>Professional Quality</span>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="mt-32 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-[var(--rs-neutral-800)] dark:text-[var(--rs-neutral-100)]">
              Everything You Need
            </h2>
            <p className="text-lg text-[var(--rs-neutral-600)] dark:text-[var(--rs-neutral-300)]">
              Powerful features to create stunning certificates effortlessly
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-[var(--rs-neutral-900)] rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 border border-[var(--rs-neutral-200)] dark:border-[var(--rs-neutral-800)]">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-lg"
                style={{
                  backgroundColor: "var(--rs-primary-100)",
                }}
              >
                <Upload
                  className="w-7 h-7"
                  style={{ color: "var(--rs-primary-600)" }}
                />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[var(--rs-neutral-800)] dark:text-[var(--rs-neutral-100)]">
                Upload Templates
              </h3>
              <p className="text-[var(--rs-neutral-600)] dark:text-[var(--rs-neutral-400)] leading-relaxed">
                Use your own certificate designs or choose from our
                professionally designed templates to get started instantly.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-[var(--rs-neutral-900)] rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 border border-[var(--rs-neutral-200)] dark:border-[var(--rs-neutral-800)]">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-lg"
                style={{
                  backgroundColor: "var(--rs-accent-100)",
                }}
              >
                <Edit3
                  className="w-7 h-7"
                  style={{ color: "var(--rs-accent-700)" }}
                />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[var(--rs-neutral-800)] dark:text-[var(--rs-neutral-100)]">
                Drag & Customize
              </h3>
              <p className="text-[var(--rs-neutral-600)] dark:text-[var(--rs-neutral-400)] leading-relaxed">
                Intuitive drag-and-drop interface to add text, signatures, and
                customize fonts, colors, and sizes with ease.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-[var(--rs-neutral-900)] rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 border border-[var(--rs-neutral-200)] dark:border-[var(--rs-neutral-800)]">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-lg"
                style={{
                  backgroundColor: "var(--rs-primary-100)",
                }}
              >
                <Download
                  className="w-7 h-7"
                  style={{ color: "var(--rs-primary-600)" }}
                />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[var(--rs-neutral-800)] dark:text-[var(--rs-neutral-100)]">
                Download Instantly
              </h3>
              <p className="text-[var(--rs-neutral-600)] dark:text-[var(--rs-neutral-400)] leading-relaxed">
                Export your certificates as high-quality PNG images ready to
                print or share digitally with recipients.
              </p>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mt-32 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-[var(--rs-neutral-800)] dark:text-[var(--rs-neutral-100)]">
              Simple 4-Step Process
            </h2>
            <p className="text-lg text-[var(--rs-neutral-600)] dark:text-[var(--rs-neutral-300)]">
              Create professional certificates in just a few clicks
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "1",
                title: "Choose Template",
                description: "Select from our library or upload your own",
              },
              {
                step: "2",
                title: "Add Content",
                description: "Add names, text, and images",
              },
              {
                step: "3",
                title: "Customize",
                description: "Adjust fonts, colors, and positioning",
              },
              {
                step: "4",
                title: "Download",
                description: "Export as high-quality image",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-xl bg-white dark:bg-[var(--rs-neutral-900)] border border-[var(--rs-neutral-200)] dark:border-[var(--rs-neutral-800)]"
              >
                <div
                  className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl shadow-lg"
                  style={{
                    backgroundColor: "var(--rs-primary-500)",
                  }}
                >
                  {item.step}
                </div>
                <h4 className="font-bold mb-2 text-[var(--rs-neutral-800)] dark:text-[var(--rs-neutral-100)]">
                  {item.title}
                </h4>
                <p className="text-sm text-[var(--rs-neutral-600)] dark:text-[var(--rs-neutral-400)]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-32 max-w-4xl mx-auto text-center">
          <div
            className="rounded-3xl p-12 shadow-2xl"
            style={{
              background: `linear-gradient(135deg, var(--rs-primary-500) 0%, var(--rs-primary-600) 100%)`,
            }}
          >
            <h2 className="text-4xl font-bold mb-4 text-white">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of users creating beautiful certificates every day
            </p>
            <Button
              size="lg"
              onClick={() => router.push("/login")}
              className="text-lg px-12 py-6 shadow-xl hover:shadow-2xl transition-all bg-white hover:bg-white/90"
              style={{
                color: "var(--rs-primary-600)",
              }}
            >
              Create Your First Certificate
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 mt-32 border-t border-[var(--rs-neutral-200)] dark:border-[var(--rs-neutral-800)]">
        <div className="text-center text-[var(--rs-neutral-600)] dark:text-[var(--rs-neutral-400)]">
          <p>© 2025 CertGen. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
