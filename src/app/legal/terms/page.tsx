export const metadata = { title: "Terms of Service" };
export default function Page() {
  return (
    <>
      <h1 className="font-serif text-4xl">Terms of Service</h1>
      <p className="mt-6">
        Mira is a private, AI-assisted wellness companion. It is <strong>not</strong> a medical
        service and does not replace professional mental health care. By using Mira you agree to
        these Terms.
      </p>
      <h2 className="font-serif text-2xl mt-10">1. The service</h2>
      <p className="mt-3">
        We provide a conversational interface intended for reflection, journaling, and gentle
        support. We do not provide diagnosis, prescriptions, or clinical treatment.
      </p>
      <h2 className="font-serif text-2xl mt-10">2. No clinical advice</h2>
      <p className="mt-3">
        Nothing the AI says constitutes medical, psychological, legal, or other professional
        advice. If you are in crisis, please use the resources on our <a href="/safety">Safety</a>{" "}
        page.
      </p>
      <h2 className="font-serif text-2xl mt-10">3. Your data</h2>
      <p className="mt-3">
        Your conversations are stored encrypted at rest and tied to your account. We do not sell
        your data. We do not use your conversations to train any AI model. You may export or
        delete your data at any time.
      </p>
      <h2 className="font-serif text-2xl mt-10">4. Account & age</h2>
      <p className="mt-3">
        You must be 18+ to use Mira. Misuse of the service, including abuse of the AI or other
        users, may result in account termination.
      </p>
    </>
  );
}
