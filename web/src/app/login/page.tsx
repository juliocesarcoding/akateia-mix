export default function LoginPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  console.log(apiUrl);

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <div
        style={{
          width: 420,
          padding: 24,
          border: "1px solid #333",
          borderRadius: 12,
        }}
      >
        <h1 style={{ fontSize: 24, marginBottom: 8 }}>AKtéia Mix</h1>
        <p style={{ opacity: 0.8, marginBottom: 16 }}>
          Faça login com a Steam para entrar na fila do mix.
        </p>

        <a
          href={`${apiUrl}/auth/steam`}
          style={{
            display: "inline-block",
            width: "100%",
            textAlign: "center",
            padding: "12px 16px",
            borderRadius: 10,
            background: "#1b2838",
            color: "white",
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          Entrar com Steam
        </a>
      </div>
    </div>
  );
}