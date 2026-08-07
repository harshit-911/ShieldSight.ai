import { redirect } from 'next/navigation';

export const metadata = {
  title: 'ShieldSight AI — Project Defense Presentation',
  description: 'Interactive project defense presentation slide deck for ShieldSight AI.',
};

export default function PresentationPage() {
  redirect('/presentation.html');
}
