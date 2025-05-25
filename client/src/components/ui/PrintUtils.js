export const generarResumenViaje = (item) => {
  return `
    <div class="resumen-container">
      <h1>Resumen del Viaje #${item.id}</h1>
      <p><strong>Fecha:</strong> ${item.fecha}</p>
      <p><strong>Origen:</strong> ${item.origen}</p>
      <p><strong>Destino:</strong> ${item.destino}</p>
      <p><strong>Pasajero:</strong> ${item.pasajero}</p>
      <p><strong>Conductor:</strong> ${item.conductor}</p>
      <p><strong>Estado:</strong> ${item.estado}</p>
      <p><strong>Importe:</strong> $${item.importe}</p>
    </div>
  `;
};

export const imprimirResumen = (contenidoHTML) => {
  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>Resumen del Viaje</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background-color: #fff;
              color: #222;
              padding: 40px;
              line-height: 1.6;
            }
            .resumen-container {
              max-width: 600px;
              margin: auto;
              border: 1px solid #ddd;
              padding: 30px;
              border-radius: 8px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            h1 {
              color: #f59e0b;
              font-size: 24px;
              margin-bottom: 20px;
              text-align: center;
            }
            p {
              margin: 10px 0;
              font-size: 16px;
            }
            strong {
              color: #111;
            }
          </style>
        </head>
        <body>
          ${contenidoHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  }
};
