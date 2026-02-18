import React, { useEffect } from 'react';

export default function UserPrivacy() {

  // UserPivacy for HypeAI app
  useEffect(() => {
  }, []);

  return (
    <div className="container-xl px-3 px-md-4 py-4 py-md-5 mt-4 mt-md-5">
      <div className="mx-auto" style={{ maxWidth: 960 }}>
        <div className="mb-4">
          <p className="text-uppercase small mb-2" style={{ letterSpacing: 2, color: 'rgba(255,255,255,0.6)' }}>HypeAI</p>
          <h1 className="h3 h-md-2 fw-bold mb-2">Privacy Policy</h1>
          <p className="mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>HypeAI – Your All-in-One AI Toolbox for Everyday Life</p>
        </div>

        <div className="bg-gray-alpha-1 br-4 px-3 px-md-4 py-3 py-md-4" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
          <section className="mb-4">
            <h2 className="h5 fw-bold mb-2">1. Introduction</h2>
            <p className="mb-2" style={{ color: 'rgba(255,255,255,0.8)' }}>
              Welcome to HypeAI.
            </p>
            <p className="mb-2" style={{ color: 'rgba(255,255,255,0.8)' }}>
              HypeAI is an all-in-one AI toolbox designed to enhance productivity, creativity, and daily convenience. This Privacy Policy
              explains how we collect, use, store, and protect your information when you use our mobile application (“App”).
            </p>
            <p className="mb-0" style={{ color: 'rgba(255,255,255,0.8)' }}>
              By using HypeAI, you agree to the collection and use of information in accordance with this policy.
            </p>
          </section>

          <section className="mb-4">
            <h2 className="h5 fw-bold mb-2">2. Information We Collect</h2>
            <p className="mb-3" style={{ color: 'rgba(255,255,255,0.8)' }}>
              We collect only the information necessary to provide and improve our services.
            </p>

            <h3 className="h6 fw-bold mb-2">2.1 Information You Provide</h3>
            <ul className="mb-3 ps-3">
              <li className="mb-1" style={{ color: 'rgba(255,255,255,0.8)' }}>Account information (such as email address, if you register)</li>
              <li className="mb-1" style={{ color: 'rgba(255,255,255,0.8)' }}>Content you input into AI tools (text, prompts, or files you choose to upload)</li>
              <li className="mb-0" style={{ color: 'rgba(255,255,255,0.8)' }}>Customer support messages</li>
            </ul>

            <h3 className="h6 fw-bold mb-2">2.2 Automatically Collected Information</h3>
            <ul className="mb-3 ps-3">
              <li className="mb-1" style={{ color: 'rgba(255,255,255,0.8)' }}>Device information (device model, OS version)</li>
              <li className="mb-1" style={{ color: 'rgba(255,255,255,0.8)' }}>App usage data (feature usage, session duration)</li>
              <li className="mb-1" style={{ color: 'rgba(255,255,255,0.8)' }}>Log data (IP address, crash logs)</li>
              <li className="mb-0" style={{ color: 'rgba(255,255,255,0.8)' }}>Diagnostic data for performance improvement</li>
            </ul>

            <h3 className="h6 fw-bold mb-2">2.3 Optional Permissions</h3>
            <p className="mb-2" style={{ color: 'rgba(255,255,255,0.8)' }}>
              Depending on features used, the App may request access to:
            </p>
            <ul className="mb-2 ps-3">
              <li className="mb-1" style={{ color: 'rgba(255,255,255,0.8)' }}>Storage (to upload or save files)</li>
              <li className="mb-0" style={{ color: 'rgba(255,255,255,0.8)' }}>Camera or microphone (if using AI tools that require them)</li>
            </ul>
            <p className="mb-0" style={{ color: 'rgba(255,255,255,0.8)' }}>
              Permissions are requested only when necessary and can be disabled in device settings.
            </p>
          </section>

          <section className="mb-4">
            <h2 className="h5 fw-bold mb-2">3. How We Use Your Information</h2>
            <p className="mb-2" style={{ color: 'rgba(255,255,255,0.8)' }}>
              We use collected information to:
            </p>
            <ul className="mb-2 ps-3">
              <li className="mb-1" style={{ color: 'rgba(255,255,255,0.8)' }}>Provide AI-powered features</li>
              <li className="mb-1" style={{ color: 'rgba(255,255,255,0.8)' }}>Improve tool performance and user experience</li>
              <li className="mb-1" style={{ color: 'rgba(255,255,255,0.8)' }}>Fix bugs and maintain security</li>
              <li className="mb-1" style={{ color: 'rgba(255,255,255,0.8)' }}>Respond to customer support requests</li>
              <li className="mb-0" style={{ color: 'rgba(255,255,255,0.8)' }}>Prevent fraud and misuse</li>
            </ul>
            <p className="mb-0" style={{ color: 'rgba(255,255,255,0.8)' }}>
              We do not sell your personal data.
            </p>
          </section>

          <section className="mb-4">
            <h2 className="h5 fw-bold mb-2">4. AI Processing &amp; Data Handling</h2>
            <p className="mb-2" style={{ color: 'rgba(255,255,255,0.8)' }}>
              Content submitted to AI tools may be processed through secure cloud-based AI services.
            </p>
            <p className="mb-2" style={{ color: 'rgba(255,255,255,0.8)' }}>
              User inputs are used only to generate requested outputs.
            </p>
            <p className="mb-2" style={{ color: 'rgba(255,255,255,0.8)' }}>
              We do not use your private content for advertising purposes.
            </p>
            <p className="mb-0" style={{ color: 'rgba(255,255,255,0.8)' }}>
              We do not permanently store AI prompts unless required for service functionality or debugging.
            </p>
          </section>

          <section className="mb-4">
            <h2 className="h5 fw-bold mb-2">5. Third-Party Services</h2>
            <p className="mb-2" style={{ color: 'rgba(255,255,255,0.8)' }}>
              HypeAI may use trusted third-party providers, including:
            </p>
            <ul className="mb-2 ps-3">
              <li className="mb-1" style={{ color: 'rgba(255,255,255,0.8)' }}>Cloud hosting services</li>
              <li className="mb-1" style={{ color: 'rgba(255,255,255,0.8)' }}>Analytics providers</li>
              <li className="mb-1" style={{ color: 'rgba(255,255,255,0.8)' }}>Crash reporting tools</li>
              <li className="mb-0" style={{ color: 'rgba(255,255,255,0.8)' }}>Payment processors (for in-app purchases)</li>
            </ul>
            <p className="mb-0" style={{ color: 'rgba(255,255,255,0.8)' }}>
              These providers only access information necessary to perform their services and are obligated to protect your data.
            </p>
          </section>

          <section className="mb-4">
            <h2 className="h5 fw-bold mb-2">6. Data Retention</h2>
            <p className="mb-2" style={{ color: 'rgba(255,255,255,0.8)' }}>
              We retain personal data only as long as necessary to:
            </p>
            <ul className="mb-2 ps-3">
              <li className="mb-1" style={{ color: 'rgba(255,255,255,0.8)' }}>Provide services</li>
              <li className="mb-1" style={{ color: 'rgba(255,255,255,0.8)' }}>Comply with legal obligations</li>
              <li className="mb-1" style={{ color: 'rgba(255,255,255,0.8)' }}>Resolve disputes</li>
              <li className="mb-0" style={{ color: 'rgba(255,255,255,0.8)' }}>Enforce agreements</li>
            </ul>
            <p className="mb-0" style={{ color: 'rgba(255,255,255,0.8)' }}>
              You may request deletion of your account and associated data at any time.
            </p>
          </section>

          <section className="mb-4">
            <h2 className="h5 fw-bold mb-2">7. Data Security</h2>
            <p className="mb-0" style={{ color: 'rgba(255,255,255,0.8)' }}>
              We implement reasonable administrative, technical, and physical safeguards to protect your information. However, no system
              is 100% secure. We encourage users to protect their account credentials.
            </p>
          </section>

          <section className="mb-4">
            <h2 className="h5 fw-bold mb-2">8. Children’s Privacy</h2>
            <p className="mb-2" style={{ color: 'rgba(255,255,255,0.8)' }}>
              HypeAI is not directed to children under 13 (or the minimum age required in your country). We do not knowingly collect
              personal data from children.
            </p>
            <p className="mb-0" style={{ color: 'rgba(255,255,255,0.8)' }}>
              If you believe a child has provided us personal information, please contact us for removal.
            </p>
          </section>

          <section className="mb-4">
            <h2 className="h5 fw-bold mb-2">9. Your Privacy Rights</h2>
            <p className="mb-2" style={{ color: 'rgba(255,255,255,0.8)' }}>
              Depending on your location, you may have rights to:
            </p>
            <ul className="mb-2 ps-3">
              <li className="mb-1" style={{ color: 'rgba(255,255,255,0.8)' }}>Access your data</li>
              <li className="mb-1" style={{ color: 'rgba(255,255,255,0.8)' }}>Correct inaccurate data</li>
              <li className="mb-1" style={{ color: 'rgba(255,255,255,0.8)' }}>Request deletion</li>
              <li className="mb-1" style={{ color: 'rgba(255,255,255,0.8)' }}>Withdraw consent</li>
              <li className="mb-0" style={{ color: 'rgba(255,255,255,0.8)' }}>Request data portability</li>
            </ul>
            <p className="mb-0" style={{ color: 'rgba(255,255,255,0.8)' }}>
              To exercise these rights, contact us at the email below.
            </p>
          </section>

          <section className="mb-4">
            <h2 className="h5 fw-bold mb-2">10. International Users</h2>
            <p className="mb-0" style={{ color: 'rgba(255,255,255,0.8)' }}>
              Your information may be processed and stored in countries outside your own. By using HypeAI, you consent to such transfers
              where permitted by law.
            </p>
          </section>

          <section className="mb-4">
            <h2 className="h5 fw-bold mb-2">11. Changes to This Policy</h2>
            <p className="mb-0" style={{ color: 'rgba(255,255,255,0.8)' }}>
              We may update this Privacy Policy from time to time. Updates will be posted on this page with a revised effective date.
            </p>
          </section>

          <section>
            <h2 className="h5 fw-bold mb-2">12. Contact Us</h2>
            <p className="mb-2" style={{ color: 'rgba(255,255,255,0.8)' }}>
              If you have any questions about this Privacy Policy, please contact:
            </p>
            <p className="mb-1" style={{ color: 'rgba(255,255,255,0.8)' }}>
              Email: sun8ziran@gmail.com
            </p>
            <p className="mb-1" style={{ color: 'rgba(255,255,255,0.8)' }}>
              Company Name: HpyeBot
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
