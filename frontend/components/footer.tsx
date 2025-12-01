import { LucideGlobe } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t mt-20 px-6 py-16 text-slate-700">
      <div className="max-w-7xl mx-auto">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between gap-10">
          {/* Left Text */}
          <div className="max-w-lg">
            <div className="flex w-fit gap-2 items-center text-left justify-around">
              <h1 className="font-bold italic text-left text-4xl">Velox</h1>
              <h4 className="text-xs font-semibold tracking-widest text-slate-500">
                POWERING THE API WORLD
              </h4>
            </div>

            <p className="mt-4 text-sm leading-relaxed">
              Increase developer productivity, security, and performance at
              scale with the unified platform for API management, AI gateways,
              service mesh, and ingress controller.
            </p>
          </div>

          {/* Newsletter */}
          <div>
            <p className="text-xs font-semibold tracking-widest text-slate-500 mb-3">
              Sign up for Velox newsletter
            </p>
            <div className="flex items-center gap-3">
              <input
                type="email"
                placeholder="Email"
                className="border rounded-md px-3 py-2 text-sm w-64"
              />
              <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <hr className="my-12 border-slate-200" />

        {/* Link Sections */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 text-sm">
          {/* PLATFORM */}
          <div>
            <h5 className="text-xs font-semibold tracking-widest mb-4 text-slate-500">
              PLATFORM
            </h5>
            <ul className="space-y-2">
              <li>Velox Konnect</li>
              <li>Velox Gateway</li>
              <li>Velox AI Gateway</li>
              <li>Velox Insomnia</li>
              <li>Developer Portal</li>
              <li>Gateway Manager</li>
              <li>Cloud Gateway</li>
              <li>Get a Demo</li>
            </ul>
          </div>

          {/* EXPLORE MORE */}
          <div>
            <h5 className="text-xs font-semibold tracking-widest mb-4 text-slate-500">
              EXPLORE MORE
            </h5>
            <ul className="space-y-2">
              <li>Open Banking API Solutions</li>
              <li>API Governance Solutions</li>
              <li>Istio API Gateway Integration</li>
              <li>Kubernetes API Management</li>
              <li>API Gateway: Build vs Buy</li>
              <li>Velox vs Postman</li>
              <li>Velox vs MuleSoft</li>
              <li>Velox vs Apigee</li>
            </ul>
          </div>

          {/* DOCUMENTATION */}
          <div>
            <h5 className="text-xs font-semibold tracking-widest mb-4 text-slate-500">
              DOCUMENTATION
            </h5>
            <ul className="space-y-2">
              <li>Velox Konnect Docs</li>
              <li>Velox Gateway Docs</li>
              <li>Velox Mesh Docs</li>
              <li>Velox AI Gateway</li>
              <li>Velox Insomnia Docs</li>
              <li>Velox Plugin Hub</li>
            </ul>
          </div>

          {/* OPEN SOURCE */}
          <div>
            <h5 className="text-xs font-semibold tracking-widest mb-4 text-slate-500">
              OPEN SOURCE
            </h5>
            <ul className="space-y-2">
              <li>Velox Gateway</li>
              <li>Kuma</li>
              <li>Insomnia</li>
              <li>Velox Community</li>
            </ul>
          </div>

          {/* COMPANY */}
          <div>
            <h5 className="text-xs font-semibold tracking-widest mb-4 text-slate-500">
              COMPANY
            </h5>
            <ul className="space-y-2">
              <li>About Velox</li>
              <li>Customers</li>
              <li>Careers</li>
              <li>Press</li>
              <li>Events</li>
              <li>Contact</li>
              <li>Pricing</li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-12 pt-6 text-xs text-slate-500 flex flex-col md:flex-row justify-between items-center">
          {/* Icons */}
          <div className="flex gap-4 text-slate-500 text-lg">
            <span>
              <img className="size-6" src="github.svg" alt="github" />
            </span>
            <span>
              <img className="size-6" src="instagram.svg" alt="instagram" />
            </span>
            <span>
              <img className="size-6" src="linkedin.svg" alt="linkedin" />
            </span>
            <span>
              <img className="size-6" src="twitter-alt.svg" alt="X" />
            </span>
            <span>
              <img className="size-6" src="google.svg" alt="google" />
            </span>
          </div>

          {/* Bottom Links */}
          <div className="flex gap-4 mt-4 md:mt-0">
            <span>Terms</span>
            <span>Privacy</span>
            <span>Trust and Compliance</span>
            <span>Privacy Choices</span>
          </div>

          <p className="text-xs mt-4 md:mt-0">© Velox Inc. 20 25</p>
        </div>
      </div>
    </footer>
  );
}
