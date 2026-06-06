import type { UseFormRegisterReturn } from "react-hook-form";

interface LegalConsentProps {
  registration: UseFormRegisterReturn;
  error?: string;
}

/**
 * PDPL (UAE Federal Decree-Law No. 45 of 2021) consent control.
 * Required, unticked by default — submission is blocked until the user
 * gives explicit, affirmative consent to processing their personal data.
 */
export function LegalConsent({ registration, error }: LegalConsentProps) {
  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          {...registration}
          className="mt-1 h-5 w-5 shrink-0 accent-primary cursor-pointer"
          data-testid="checkbox-consent"
        />
        <span className="text-sm text-gray-300 leading-relaxed">
          I consent to UrbanFleet Delivery Service LLC collecting and processing the
          personal data I provide for the purpose of handling this submission, in
          accordance with the{" "}
          <a
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline hover:text-orange-400"
          >
            Privacy Policy
          </a>{" "}
          and{" "}
          <a
            href="/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline hover:text-orange-400"
          >
            Terms of Use
          </a>
          . I understand I can withdraw my consent at any time by contacting{" "}
          <a
            href="mailto:info@urbanfleetdelivery.ae"
            className="text-primary underline hover:text-orange-400"
          >
            info@urbanfleetdelivery.ae
          </a>
          .
        </span>
      </label>
      {error && (
        <p className="text-red-400 text-sm mt-3" data-testid="error-consent">
          {error}
        </p>
      )}
    </div>
  );
}
