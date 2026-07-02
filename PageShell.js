import Header from './Header';
import Footer from './Footer';
import MobileNavNote from './MobileNavNote';

export default function PageShell({ current, children, compactFooter = false, footerLeft, footerRight }) {
  return (
    <>
      <Header current={current} />
      <MobileNavNote />
      <main>{children}</main>
      <Footer compact={compactFooter} left={footerLeft} right={footerRight} />
    </>
  );
}
