export const printHtmlContent = (content: HTMLElement, title = "Print Preview") => {
  if (!content) return;

  const printWindow = window.open("", "", "width=800,height=600");
  if (!printWindow) return;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: system-ui, -apple-system, sans-serif;
            padding: 20px;
            max-width: 800px;
            margin: 0 auto;
          }
          .receipt {
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 24px;
          }
          .header {
            text-align: center;
            margin-bottom: 24px;
          }
          .header h2 {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 12px;
          }
          .header p {
            color: #6b7280;
            margin: 4px 0;
          }
          .section {
            margin: 20px 0;
          }
          .section-title {
            font-size: 11px;
            font-weight: bold;
            color: #6b7280;
            text-transform: uppercase;
            margin-bottom: 8px;
            letter-spacing: 0.05em;
          }
          .separator {
            border-top: 1px solid #e5e7eb;
            margin: 16px 0;
          }
          .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px;
          }
          .flex-between {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 8px 0;
          }
          .text-muted {
            color: #6b7280;
            font-size: 14px;
          }
          .text-sm {
            font-size: 14px;
          }
          .text-lg {
            font-size: 18px;
          }
          .font-medium {
            font-weight: 500;
          }
          .font-semibold {
            font-weight: 600;
          }
          .font-bold {
            font-weight: 700;
          }
          .pro-badge {
            color: #10b981;
            font-size: 12px;
            font-weight: 600;
          }
          .line-through {
            text-decoration: line-through;
          }
          .text-red {
            color: #ef4444;
          }
          .total-box {
            background: #000;
            color: #fff;
            border-radius: 8px;
            padding: 16px;
            margin: 16px 0;
          }
          .total-box .flex-between {
            margin: 0;
          }
          .text-center {
            text-align: center;
          }
          .uppercase {
            text-transform: uppercase;
          }
          .capitalize {
            text-transform: capitalize;
          }
          @media print {
            body {
              padding: 0;
            }
            .receipt {
              border: none;
            }
          }
        </style>
      </head>
      <body>
        ${content.innerHTML}
        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() {
              window.close();
            };
          };
        </script>
      </body>
    </html>
  `);

  printWindow.document.close();
};
