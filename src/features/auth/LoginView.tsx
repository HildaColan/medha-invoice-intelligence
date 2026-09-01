import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail } from "lucide-react";
import { T, fontBody, fontDisplay, fontMono } from "@/theme/tokens";
import { paths } from "@/router/paths";
import { login } from "./authStore";

export function LoginView() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Enter both email and password to continue.");
      return;
    }
    setError("");
    login();
    navigate(paths.dashboard, { replace: true });
  };

  return (
    <div className="min-h-screen flex" style={{ ...fontBody, background: T.mist }}>
      <div
        className="hidden lg:flex w-[440px] shrink-0 flex-col justify-between p-12"
        style={{ background: T.brassDeep }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "#fff" }}>
            <span style={{ ...fontDisplay, color: T.brassDeep, fontWeight: 700, fontSize: 17 }}>M</span>
          </div>
          <div>
            <div style={{ ...fontDisplay, color: "#fff", fontWeight: 600, fontSize: 18, letterSpacing: 0.3 }}>MEDHA</div>
            <div style={{ ...fontMono, color: "rgba(255,255,255,0.75)", fontSize: 9.5, letterSpacing: "0.14em" }}>
              INVOICE INTELLIGENCE
            </div>
          </div>
        </div>

        <div>
          <div style={{ ...fontDisplay, color: "#fff", fontWeight: 600, fontSize: 30, lineHeight: 1.25, maxWidth: 320 }}>
            Invoice extraction, reconciled at scale.
          </div>
          <div style={{ ...fontBody, color: "rgba(255,255,255,0.78)", fontSize: 13, marginTop: 14, maxWidth: 320 }}>
            Automated data capture, validation, and export across every forwarder and shipment.
          </div>
        </div>

        <div style={{ ...fontMono, color: "rgba(255,255,255,0.55)", fontSize: 10.5, letterSpacing: "0.05em" }}>
          © {new Date().getFullYear()} Transorion. All rights reserved.
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <form onSubmit={handleSubmit} className="w-full max-w-[380px]">
          <div className="mb-8">
            <div style={{ ...fontDisplay, color: T.ink, fontWeight: 600, fontSize: 24 }}>Sign in</div>
            <div style={{ ...fontBody, color: T.slateSoft, fontSize: 13, marginTop: 4 }}>
              Welcome back. Enter your credentials to continue.
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <label
                className="block text-[11.5px] mb-1.5"
                style={{ ...fontMono, color: T.slateSoft, letterSpacing: "0.04em" }}
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
                style={{ ...fontMono, color: T.slateSoft, letterSpacing: "0.04em" }}
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

            {error && <div style={{ ...fontBody, color: T.rust, fontSize: 12 }}>{error}</div>}

            <div className="flex items-center justify-between mt-1">
              <label className="flex items-center gap-2 text-[12px]" style={{ ...fontBody, color: T.slateSoft }}>
                <input type="checkbox" style={{ accentColor: T.brass }} />
                Remember me
              </label>
              <button type="button" className="text-[12px] font-medium" style={{ ...fontBody, color: T.brass }}>
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

          <div className="mt-6 text-center" style={{ ...fontMono, color: T.slateSoft, fontSize: 10.5 }}>
            Demo access — any email &amp; password will sign you in.
          </div>
        </form>
      </div>
    </div>
  );
}
