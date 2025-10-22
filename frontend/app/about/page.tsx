// app/about/page.tsx
'use client';

import Nav from '../Components/Navbar';

export default function AboutPage() {
  return (
    <div>
      <Nav />
      <div className="d-flex justify-content-center mt-4">
        <iframe
          src="https://drive.google.com/file/d/1IA_Tx9BhhDkJ1-YUOlq-bfS_M9NQ6Ew0/preview"
          width="640"
          height="360"
          allow="autoplay"
          allowFullScreen
          title="About Video"
          style={{ border: 'none' }}
        ></iframe>
      </div>
    </div>
  );
}
