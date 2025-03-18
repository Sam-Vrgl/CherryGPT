import LandingClient from './pages/landing';

export default function Page() {
  return (
    <main  style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#000',
      color: '#fff'
    }}>
      <LandingClient />
    </main>
  );
}
