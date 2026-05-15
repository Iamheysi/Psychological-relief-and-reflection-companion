export const metadata = { title: "Medical Disclaimer" };
export default function Page() {
  return (
    <>
      <h1 className="font-serif text-4xl">Medical Disclaimer</h1>
      <p className="mt-6 text-lg">
        <strong>
          Mira is not a medical service and does not replace professional mental health care.
        </strong>
      </p>
      <p className="mt-4">
        The AI in Mira is not a licensed therapist, counselor, psychiatrist, psychologist, or
        physician. It cannot diagnose conditions, prescribe medication, or provide clinical
        treatment. Anything it says is for reflection and support only.
      </p>
      <p className="mt-4">
        If you are experiencing a mental health crisis — including thoughts of suicide or
        self-harm — please contact a real person now. See our{" "}
        <a href="/safety" className="underline">Safety page</a> for resources by country.
      </p>
      <p className="mt-4">
        If you are managing a diagnosed condition, please continue working with your clinician.
        Mira is a companion alongside professional care, never a substitute for it.
      </p>
    </>
  );
}
