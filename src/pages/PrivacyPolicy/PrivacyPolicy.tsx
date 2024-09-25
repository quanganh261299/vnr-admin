import { FC } from "react";

const PrivacyPolicy: FC = () => {
  return (
    <div>
      <h1>Privacy Policy</h1>
      <p>
        Your privacy is important to us. This privacy statement explains the personal data our application collects, how we process it, and for what purposes.
      </p>

      <h2>Information We Collect</h2>
      <p>
        When you use Facebook Login to sign in to our application, we may collect certain personal information, including but not limited to:
      </p>
      <ul>
        <li>Your Facebook profile information (name, email, profile picture).</li>
        <li>Facebook user ID and other data you have allowed Facebook to share with us.</li>
      </ul>

      <h2>How We Use Your Information</h2>
      <p>
        The information collected through Facebook Login is used for the following purposes:
      </p>
      <ul>
        <li>To provide personalized user experiences within our app.</li>
        <li>To improve the features and services of our app.</li>
        <li>To communicate with you about your account or usage of the app.</li>
      </ul>

      <h2>Sharing Your Information</h2>
      <p>
        We do not share your personal information with any third parties, except when required by law or necessary to protect our legal rights.
      </p>

      <h2>Data Retention</h2>
      <p>
        We retain your personal data as long as your account is active or as necessary to provide services to you.
      </p>

      <h2>Your Rights</h2>
      <p>
        You have the right to access, correct, or delete your personal information stored in our app. If you wish to exercise these rights, please contact us at [insert contact info].
      </p>

      <h2>Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date.
      </p>

      <h2>Contact Us</h2>
      <p>
        If you have any questions or concerns about this Privacy Policy, please contact us at [insert email or support information].
      </p>
    </div>
  );
}

export default PrivacyPolicy;
