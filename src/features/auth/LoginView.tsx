import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail } from "lucide-react";
import { T, fontBody, fontDisplay, fontMono } from "@/theme/tokens";
import { paths } from "@/router/paths";
import { login } from "./authStore";
import transorionLogo from "@/assets/transorion-logo.png";
import medhaLogo from "@/assets/image (12).png";
import { useAuditLog } from "@/features/administration/auditLog";

export function LoginView() {
  const navigate = useNavigate();
  const { logActivity } = useAuditLog();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Enter both email and password to continue.");
      logActivity({ action: "Login", module: "Auth", ref: email || "(empty)", result: "Failed" });
      return;
    }
    setError("");
    login();
    logActivity({ action: "Login", module: "Auth", ref: email });
    navigate(paths.dashboard, { replace: true });
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ ...fontBody, background: T.mist }}
    >
      <div
        className="hidden lg:flex w-[440px] shrink-0 flex-col justify-between p-12"
        style={{ background: T.brassDeep }}
      >
        <div>
          <div
            className="px-3 py-2 inline-flex w-fit"
            style={{ background: "#fff" }}
          >
            <img
              src={medhaLogo}
              alt="MEDHA — Invoice Extraction AI"
              className="h-16 w-auto"
            />
          </div>
        </div>

        <div>
          <div
            style={{
              ...fontDisplay,
              color: "#fff",
              fontWeight: 600,
              fontSize: 26,
              lineHeight: 1.3,
            }}
          >
            Empowering Intelligence &amp;
            <br />
            Intellect
          </div>
        </div>

        <div
          style={{
            ...fontMono,
            color: "rgba(255,255,255,0.55)",
            fontSize: 10.5,
            letterSpacing: "0.05em",
          }}
        >
          © {new Date().getFullYear()} Transorion. All rights reserved.
        </div>
      </div>

      <div className="flex-1 relative flex items-center justify-center p-8 overflow-hidden">
        <img
          src={transorionLogo}
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 w-[100%] max-w-[1500px]"
          style={{ opacity: 0.05 }}
        />
        <img
          src={transorionLogo}
          alt="Transorion"
          className="absolute top-8 right-8 z-10 w-60 h-auto"
        />
        <form
          onSubmit={handleSubmit}
          className="relative z-10 w-full max-w-[380px]"
        >
          <div className="mb-8">
            <div
              style={{
                ...fontDisplay,
                color: T.ink,
                fontWeight: 600,
                fontSize: 24,
              }}
            >
              Sign in
            </div>
            <div
              style={{
                ...fontBody,
                color: T.slateSoft,
                fontSize: 13,
                marginTop: 4,
              }}
            >
              Sign in to extract, validate, and export invoice data across every
              forwarder and shipment.
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <label
                className="block text-[11.5px] mb-1.5"
                style={{
                  ...fontMono,
                  color: T.slateSoft,
                  letterSpacing: "0.04em",
                }}
              >
                EMAIL
              </label>
              <div
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg"
                style={{ background: "#fff", border: `1px solid ${T.hair}` }}
              >
                <Mail size={14} color={T.slateSoft} />
                <input
                  type="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@transorion.com"
                  className="bg-transparent outline-none text-[13px] w-full"
                  style={{ ...fontBody, color: T.slate }}
                />
              </div>
            </div>

            <div>
              <label
                className="block text-[11.5px] mb-1.5"
                style={{
                  ...fontMono,
                  color: T.slateSoft,
                  letterSpacing: "0.04em",
                }}
              >
                PASSWORD
              </label>
              <div
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg"
                style={{ background: "#fff", border: `1px solid ${T.hair}` }}
              >
                <Lock size={14} color={T.slateSoft} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-transparent outline-none text-[13px] w-full"
                  style={{ ...fontBody, color: T.slate }}
                />
              </div>
            </div>

            {error && (
              <div style={{ ...fontBody, color: T.rust, fontSize: 12 }}>
                {error}
              </div>
            )}

            <div className="flex items-center justify-between mt-1">
              <label
                className="flex items-center gap-2 text-[12px]"
                style={{ ...fontBody, color: T.slateSoft }}
              >
                <input type="checkbox" style={{ accentColor: T.brass }} />
                Remember me
              </label>
              <button
                type="button"
                className="text-[12px] font-medium"
                style={{ ...fontBody, color: T.brass }}
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-2.5 rounded-lg text-[13px] font-semibold"
              style={{ ...fontBody, background: T.brass, color: "#fff" }}
            >
              Sign in
            </button>
          </div>

          <div
            className="mt-6 text-center"
            style={{ ...fontMono, color: T.slateSoft, fontSize: 10.5 }}
          >
            Demo access — any email &amp; password will sign you in.
          </div>
        </form>
      </div>
    </div>
  );
}
