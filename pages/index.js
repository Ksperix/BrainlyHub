import { useState, useMemo } from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export async function getStaticProps() {
  const postsDirectory = path.join(process.cwd(), 'content/zadania');
  let initialZadania = [];

  if (fs.existsSync(postsDirectory)) {
    const filenames = fs.readdirSync(postsDirectory);
    initialZadania = filenames.map((filename) => {
      const filePath = path.join(postsDirectory, filename);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContents);
      return {
        id: filename,
        title: data.title || '',
        link: data.link || '#',
        przedmiot: data.przedmiot || '',
        klasa: data.klasa || '',
        kategoria: data.kategoria || '',
        poziom: data.poziom || 'Podstawowy',
      };
    });
  }

  return {
    props: {
      initialZadania,
    },
  };
}

export default function Home({ initialZadania = [] }) {
  const [search, setSearch] = useState('');
  const [przedmiot, setPrzedmiot] = useState('');
  const [klasa, setKlasa] = useState('');
  const [poziom, setPoziom] = useState('');

  const filteredZadania = useMemo(() => {
    return initialZadania.filter((item) => {
      const matchSearch = item.title.toLowerCase().includes(search.toLowerCase()) || 
                          item.kategoria.toLowerCase().includes(search.toLowerCase());
      const matchPrzedmiot = przedmiot === '' || item.przedmiot === przedmiot;
      const matchKlasa = klasa === '' || item.klasa === klasa;
      const matchPoziom = poziom === '' || item.poziom === poziom;

      return matchSearch && matchPrzedmiot && matchKlasa && matchPoziom;
    });
  }, [search, przedmiot, klasa, poziom, initialZadania]);

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#4f46e5', fontSize: '32px', margin: '0 0 10px 0' }}>BrainlyHub</h1>[cite: 1, 2]
        <p style={{ color: '#64748b', margin: 0 }}>Baza zadań szkolnych z bezpośrednimi linkami</p>
      </header>
      
      {/* Pasek Filtrów */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
        gap: '12px', 
        marginBottom: '24px',
        backgroundColor: '#f8fafc',
        padding: '16px',
        borderRadius: '8px',
        border: '1px solid #e2e8f0'
      }}>
        <input 
          type="text" 
          placeholder="Szukaj tematu (np. Ułamki)..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
        />
        <select value={przedmiot} onChange={(e) => setPrzedmiot(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
          <option value="">Wszystkie przedmioty</option>
          <option value="Matematyka">Matematyka</option>
          <option value="Język Polski">Język Polski</option>
          <option value="Chemia">Chemia</option>
          <option value="Fizyka">Fizyka</option>
          <option value="Biologia">Biologia</option>
          <option value="Historia">Historia</option>
        </select>
        <select value={klasa} onChange={(e) => setKlasa(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
          <option value="">Wszystkie klasy</option>
          <option value="Klasa 4">Klasa 4</option>
          <option value="Klasa 5">Klasa 5</option>
          <option value="Klasa 6">Klasa 6</option>
          <option value="Klasa 7">Klasa 7</option>
          <option value="Klasa 8">Klasa 8</option>
          <option value="Klasa 1 LO">Klasa 1 LO</option>
          <option value="Klasa 2 LO">Klasa 2 LO</option>
          <option value="Klasa 3 LO">Klasa 3 LO</option>
          <option value="Klasa 4 LO">Klasa 4 LO</option>
        </select>
        <select value={poziom} onChange={(e) => setPoziom(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
          <option value="">Wszystkie poziomy</option>
          <option value="Podstawowy">Podstawowy</option>
          <option value="Średni">Średni</option>
          <option value="Master">Master</option>
        </select>
      </div>

      {/* Wyświetlanie wyników */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredZadania.length > 0 ? (
          filteredZadania.map((z) => (
            <div key={z.id} style={{ 
              border: '1px solid #e2e8f0', 
              padding: '16px', 
              borderRadius: '8px', 
              backgroundColor: '#ffffff',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>{z.title}</h3>
                <span style={{ 
                  background: z.poziom === 'Master' ? '#fef2f2' : '#f0fdf4', 
                  color: z.poziom === 'Master' ? '#dc2626' : '#16a34a', 
                  padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' 
                }}>
                  {z.poziom}
                </span>
              </div>
              <p style={{ color: '#64748b', fontSize: '14px', margin: '8px 0' }}>
                {z.przedmiot} • {z.klasa} {z.kategoria ? `• ${z.kategoria}` : ''}
              </p>
              <a 
                href={z.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ color: '#4f46e5', fontWeight: 'bold', textDecoration: 'none', display: 'inline-block', marginTop: '4px' }}
              >
                Otwórz zadanie w Brainly &rarr;
              </a>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
            Brak zadań w bazie. Wejdź na <code>/admin</code> i dodaj pierwsze pozycje!
          </div>
        )}
      </div>
    </div>
  );
}
