export const metadata = {
  title: 'ShieldSight AI — Project Defense Presentation',
  description: 'Interactive project defense presentation slide deck for ShieldSight AI.',
};

export default function PresentationPage() {
  return (
    <div className="w-screen h-screen bg-[#0B1220] overflow-hidden">
      <iframe
        src="/presentation.html"
        className="w-full h-full border-0"
        title="ShieldSight AI Presentation Deck"
      />
    </div>
  );
}
