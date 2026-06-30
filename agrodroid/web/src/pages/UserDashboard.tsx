import '../styles/UserDashboard.css';

export default function UserDashboard() {
  return (
    <>
      <div className="navbar">
        <div>
          <h2>Plataforma SaaS - Monitoreo de Viñedos (Ica)</h2>
          <p>Nodo Activo: <b>Oficina Central (VLAN 60 DMZ)</b> | Enrutamiento: OSPF Área 0</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span className="badge success" style={{ padding: '8px 12px' }}>Servidor Cloud Ingesta: Conectado</span>
          <p style={{ margin: '5px 0 0 0', fontSize: '12px' }}>IP de Origen: 192.168.10.6 (Viñedo 1)</p>
        </div>
      </div>

      <div className="container">

        <div className="section-title">Lógica de Inferencia de IA &amp; Parámetros del Ecosistema</div>
        <div className="grid-thresholds">
          <div className="card danger">
            <h4>Umbral de Infestación Crítica</h4>
            <div className="value">&gt; 15 Focos / Hoja</div>
            <div className="detail">Dispara alerta inmediata vía Vertex AI a los agrónomos.</div>
          </div>
          <div className="card">
            <h4>Umbral Hidrométrico Crítico</h4>
            <div className="value">&lt; 40% Humedad</div>
            <div className="detail">Límite biológico para estrés hídrico detectado por MCUs.</div>
          </div>
          <div className="card info">
            <h4>Payload de Imagen Promedio</h4>
            <div className="value">3.0 MB (RGB/JPEG)</div>
            <div className="detail">Tráfico FTP simulado: Comando <code>put captura.jpg</code></div>
          </div>
        </div>

        <div className="section-title">Resultados Consolidados de Campo &amp; Pasarela de Archivos FTP</div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Sector Geográfico</th>
                <th>Coordenadas GPS</th>
                <th>Humedad Suelo</th>
                <th>Estado Dron</th>
                <th>Detección de Plagas (CNN)</th>
                <th>Acciones de Transferencia (FTP / Google Cloud)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><b>Viñedo 1 - Sector Norte</b></td>
                <td><code>14°04'21.2"S 75°43'11.5"W</code></td>
                <td>48% (Normal)</td>
                <td><span className="badge success">Completado</span></td>
                <td><span className="badge danger">Severidad Alta (Trips)</span></td>
                <td>
                  <div className="btn-group">
                    <a href="#" className="btn-action ftp-upload" title="Simula: put sector_norte.jpg">⬆ Cargar Captura (PUT)</a>
                    <a href="#" className="btn-action ftp-download" title="Simula: get reporte_norte.pdf">⬇ Descargar Reporte (GET)</a>
                  </div>
                </td>
              </tr>
              <tr>
                <td><b>Viñedo 1 - Sector Sur</b></td>
                <td><code>14°04'35.8"S 75°43'22.1"W</code></td>
                <td>35% <span style={{ color: 'red', fontWeight: 'bold' }}>¡Bajo!</span></td>
                <td><span className="badge success">Completado</span></td>
                <td><span className="badge success">Sin Alertas</span></td>
                <td>
                  <div className="btn-group">
                    <a href="#" className="btn-action ftp-upload">⬆ Cargar Captura (PUT)</a>
                    <a href="#" className="btn-action ftp-download">⬇ Descargar Reporte (GET)</a>
                  </div>
                </td>
              </tr>
              <tr>
                <td><b>Viñedo 2 - Sector Este</b></td>
                <td><code>14°05'12.0"S 75°42'55.4"W</code></td>
                <td>52% (Normal)</td>
                <td><span className="badge info">En Vuelo</span></td>
                <td><span className="badge info">Procesando...</span></td>
                <td>
                  <div className="btn-group">
                    <a href="#" className="btn-action ftp-upload" style={{ opacity: 0.5, pointerEvents: 'none' }}>传输 Transmitiendo...</a>
                    <a href="#" className="btn-action ftp-download" style={{ opacity: 0.5, pointerEvents: 'none' }}>Esperando Dataset</a>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="footer-actions">
          <div>
            <small style={{ color: '#666' }}>Simulación de Comandos de Red: Use <code>ftp 192.168.50.10</code> en la consola de Packet Tracer para validar las transferencias concurrentes.</small>
          </div>
          <div>
            <a href="#" className="logout">✕ Cerrar Sesión Segura</a>
          </div>
        </div>

      </div>
    </>
  );
}
