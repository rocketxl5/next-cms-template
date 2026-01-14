type FooterProps = {
    minimal?: boolean
}

export function Footer({ minimal = false }: FooterProps) {
  if (minimal) return null;

  return (
    <footer className="border-t p-4 text-xs">
      <p className="text-center">
        Copyright © {new Date().getFullYear()} ACME CMS
      </p>
    </footer>
  );
}