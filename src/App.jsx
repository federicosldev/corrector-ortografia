import { useState } from 'react';
import './App.css';

function App() {
  const [texto, setTexto] = useState('');
  const [correccion, setCorreccion] = useState('');

  const corregirTexto = async () => {
    const response = await fetch("https://api.languagetoolplus.com/v2/check", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        text: texto,
        language: "es"
      })
    });

    const data = await response.json();

    let textoCorregido = '';
    let lastIndex = 0;

    data.matches.forEach(match => {
      const { offset, length, replacements } = match;
      const replacement = replacements[0]?.value;

      if (replacement) {
        textoCorregido += texto.slice(lastIndex, offset);

        textoCorregido += replacement;

        lastIndex = offset + length;
      }
    });


    textoCorregido += texto.slice(lastIndex);

    setCorreccion(textoCorregido);
  };

  const copiarAlPortapapeles = () => {
    if (correccion) {
      navigator.clipboard.writeText(correccion)
        .then(() => {
          alert("Texto copiado al portapapeles ✅");
        })
        .catch((err) => {
          console.error('Error al copiar: ', err);
        });
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '3rem' }}>Corrector Ortográfico</h1>
      <textarea
        rows="13"
        cols="60"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Escribe aquí el texto a corregir..."
        style={{
          width: '100%',
          padding: '1rem',
          fontSize: '1rem',
          backgroundColor: '#222',
          color: '#eee',
          border: '1px solid #444'
        }}
      />
      <br />
      <button
        onClick={corregirTexto}
        style={{
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#000',
          color: '#fff',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        Corregir
      </button>

      <h2 style={{ marginTop: '2rem' }}>Texto corregido:</h2>
      <p>{correccion}</p>

      <button
        onClick={copiarAlPortapapeles}
        disabled={!correccion}
        style={{
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#000',
          color: '#fff',
          border: 'none',
          cursor: correccion ? 'pointer' : 'not-allowed',
          opacity: correccion ? 1 : 0.5
        }}
      >
        Copiar texto corregido
      </button>
    </div>
  );
}

export default App;
