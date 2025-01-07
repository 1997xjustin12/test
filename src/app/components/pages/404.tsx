import Link from 'next/link';

export default function Custom404() {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>404 - Page Not Found</h1>
      <p>Oops! The page you're looking for doesn't exist.</p>
      <Link href="/">
        <a style={{ color: 'blue', textDecoration: 'underline' }}>
          Go back to the homepage
        </a>
      </Link>
    </div>
  );
}