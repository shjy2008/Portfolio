import '../index.css';
import '../App.css';
import '../features/home/Home.css';

// Project / component global styles
import '../projects/BertSentiment.css';
import '../projects/FlowerVision.css';
import '../SearchEngine/SearchEngine.css';
import '../components/Navbar.css';
import '../projects/Games.css';

import Navbar from '../components/Navbar';
import ScrollToTop from '../components/ScrollToTop';

export const metadata = {
  title: 'Junyi Shen — Portfolio',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ScrollToTop />
        <div className="app-wrapper">
          <Navbar />
          <main className="content-area">{children}</main>
        </div>
      </body>
    </html>
  );
}
