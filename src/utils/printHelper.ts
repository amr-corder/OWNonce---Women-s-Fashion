import { Order, StoreSettings } from '../types';

/**
 * Opens the digital transfer receipt in a high-resolution standalone viewer window or triggers fallback
 */
export const openReceiptFull = (
  proofUrl: string,
  orderNumber: string = 'OWN-RECEIPT',
  orderTotal?: number,
  onFallbackFullscreen?: () => void
): void => {
  if (!proofUrl) return;

  // Web URLs
  if (proofUrl.startsWith('http://') || proofUrl.startsWith('https://')) {
    const newWin = window.open(proofUrl, '_blank', 'noopener,noreferrer');
    if (!newWin && onFallbackFullscreen) {
      onFallbackFullscreen();
    }
    return;
  }

  // Data URLs (SVG or base64 PNG/JPG) or Blobs
  const title = `Receipt - #${orderNumber}`;
  const win = window.open('', '_blank', 'width=900,height=1000,menubar=no,toolbar=no,location=no');

  if (win) {
    win.document.open();
    win.document.write(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>${title} | OWNonce Transfer Proof</title>
          <style>
            * { box-sizing: border-box; }
            body {
              margin: 0;
              padding: 0;
              background-color: #1a1410;
              color: #f5f0eb;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              min-height: 100vh;
            }
            .header-bar {
              position: sticky;
              top: 0;
              left: 0;
              right: 0;
              width: 100%;
              background: #271c14;
              border-bottom: 1px solid #4a382d;
              padding: 14px 24px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              z-index: 100;
              box-shadow: 0 4px 20px rgba(0,0,0,0.4);
            }
            .title-info {
              display: flex;
              align-items: center;
              gap: 12px;
            }
            .badge {
              background: #b89578;
              color: #140f0c;
              font-weight: 700;
              font-size: 11px;
              padding: 4px 10px;
              border-radius: 6px;
              font-family: monospace;
              letter-spacing: 0.5px;
            }
            .desc {
              font-size: 13px;
              color: #d1b198;
            }
            .btn-group {
              display: flex;
              align-items: center;
              gap: 8px;
            }
            .btn {
              background: #b89578;
              color: #ffffff;
              border: none;
              padding: 8px 18px;
              border-radius: 8px;
              font-weight: 600;
              font-size: 12px;
              cursor: pointer;
              transition: background 0.15s;
              display: inline-flex;
              align-items: center;
              gap: 6px;
            }
            .btn:hover {
              background: #96745a;
            }
            .btn-secondary {
              background: #423023;
              color: #e6d0ba;
              border: 1px solid #5a4332;
            }
            .btn-secondary:hover {
              background: #523d2e;
            }
            .image-viewport {
              flex: 1;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 30px 20px;
              max-width: 100%;
            }
            img {
              max-width: 90vw;
              max-height: 85vh;
              object-fit: contain;
              border-radius: 16px;
              box-shadow: 0 25px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08);
              background: white;
            }
            @media print {
              .header-bar { display: none !important; }
              body { background: white !important; color: black !important; padding: 0 !important; }
              .image-viewport { padding: 0 !important; }
              img { max-width: 100% !important; max-height: 100% !important; box-shadow: none !important; border-radius: 0 !important; }
            }
          </style>
        </head>
        <body>
          <div class="header-bar">
            <div class="title-info">
              <span class="badge">#${orderNumber}</span>
              <span class="desc">Digital Transfer Proof ${orderTotal ? `• ${orderTotal.toLocaleString()} EGP` : ''}</span>
            </div>
            <div class="btn-group">
              <button class="btn" onclick="window.print()">Print Receipt 🖨️</button>
              <button class="btn btn-secondary" onclick="window.close()">Close</button>
            </div>
          </div>
          <div class="image-viewport">
            <img src="${proofUrl}" alt="Digital Transfer Receipt" />
          </div>
        </body>
      </html>
    `);
    win.document.close();
  } else {
    // If popup blocked in iframe sandbox, trigger fullscreen fallback
    if (onFallbackFullscreen) {
      onFallbackFullscreen();
    }
  }
};

/**
 * Prints the Payment Transfer Receipt image directly
 */
export const printReceiptDirect = (proofUrl: string, orderNumber: string = 'OWN-RECEIPT'): void => {
  const win = window.open('', '_blank', 'width=700,height=900');
  if (win) {
    win.document.open();
    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Receipt - #${orderNumber}</title>
          <style>
            @page { margin: 1cm; size: auto; }
            body { margin: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: sans-serif; background: #fff; }
            img { max-width: 100%; max-height: 95vh; object-fit: contain; }
          </style>
        </head>
        <body>
          <img src="${proofUrl}" onload="window.print(); setTimeout(() => window.close(), 1000);" alt="Receipt" />
        </body>
      </html>
    `);
    win.document.close();
  } else {
    window.print();
  }
};

/**
 * Formats and prints an Order Summary receipt / invoice
 */
export const printOrderSummary = (order: Order, settings: StoreSettings): void => {
  const printWindow = window.open('', '_blank', 'width=850,height=950');

  const itemsHtml = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px 10px; border-bottom: 1px solid #E2E8F0;">
        <div style="font-weight: 700; color: #1E293B; font-size: 13px;">${item.productName}</div>
        <div style="font-size: 11px; color: #64748B; margin-top: 2px;">
          Color: <strong>${item.selectedColor.name}</strong> | Size: <strong>${item.selectedSize}</strong> | Weight: ${item.weight} KG
        </div>
      </td>
      <td style="padding: 12px 10px; text-align: center; border-bottom: 1px solid #E2E8F0; font-size: 13px; font-weight: 600;">${item.quantity}</td>
      <td style="padding: 12px 10px; text-align: right; border-bottom: 1px solid #E2E8F0; font-size: 13px; font-weight: 600; color: #475569;">${item.price.toLocaleString()} EGP</td>
      <td style="padding: 12px 10px; text-align: right; border-bottom: 1px solid #E2E8F0; font-size: 13px; font-weight: 700; color: #77553B;">${(item.price * item.quantity).toLocaleString()} EGP</td>
    </tr>
  `
    )
    .join('');

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>Order Summary - #${order.orderNumber} | OWNonce</title>
        <style>
          * { box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background: #FFFFFF;
            color: #1E293B;
            margin: 0;
            padding: 36px 40px;
            font-size: 13px;
            line-height: 1.5;
          }
          .no-print-bar {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: #27180F;
            color: #FFFDF9;
            padding: 12px 28px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            z-index: 100;
            box-shadow: 0 4px 15px rgba(0,0,0,0.25);
          }
          .bar-title {
            font-weight: 700;
            font-size: 13px;
            letter-spacing: 0.5px;
          }
          .btn-print {
            background: #B89578;
            color: #FFFDF9;
            border: none;
            padding: 8px 20px;
            border-radius: 6px;
            font-weight: 700;
            font-size: 12px;
            cursor: pointer;
            transition: opacity 0.15s;
          }
          .btn-close {
            background: #4A382D;
            color: #E6D0BA;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            font-weight: 600;
            font-size: 12px;
            cursor: pointer;
            margin-left: 8px;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 2px solid #77553B;
            padding-bottom: 20px;
            margin-bottom: 24px;
            margin-top: 20px;
          }
          .brand {
            font-family: Georgia, serif;
            font-size: 26px;
            font-weight: 800;
            letter-spacing: 2px;
            color: #27180F;
          }
          .brand-sub {
            font-size: 10px;
            letter-spacing: 3px;
            color: #8C7A6D;
            text-transform: uppercase;
            font-weight: 600;
            margin-top: 2px;
          }
          .store-meta {
            font-size: 11px;
            color: #64748B;
            margin-top: 6px;
            line-height: 1.4;
          }
          .order-meta-box {
            text-align: right;
          }
          .doc-type {
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: #8C7A6D;
            font-weight: 700;
          }
          .order-id {
            font-size: 20px;
            font-weight: 800;
            color: #77553B;
            font-family: monospace;
            margin-top: 2px;
          }
          .order-date {
            font-size: 11px;
            color: #64748B;
            margin-top: 2px;
          }
          .status-tag {
            display: inline-block;
            margin-top: 6px;
            padding: 3px 10px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 700;
            background: #E0F2FE;
            color: #0369A1;
            border: 1px solid #BAE6FD;
          }
          .grid-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 24px;
          }
          .info-card {
            background: #F8FAFC;
            border: 1px solid #E2E8F0;
            border-radius: 10px;
            padding: 16px;
          }
          .card-heading {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #64748B;
            margin-bottom: 10px;
            border-bottom: 1px solid #E2E8F0;
            padding-bottom: 6px;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
            font-size: 12px;
          }
          .info-label {
            color: #64748B;
          }
          .info-val {
            font-weight: 600;
            color: #1E293B;
            text-align: right;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          th {
            background: #F1F5F9;
            padding: 10px;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #475569;
            text-align: left;
            border-bottom: 2px solid #CBD5E1;
          }
          .totals-wrap {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 30px;
          }
          .totals-table {
            width: 320px;
            background: #F8FAFC;
            border: 1px solid #E2E8F0;
            border-radius: 10px;
            padding: 14px 18px;
          }
          .tot-line {
            display: flex;
            justify-content: space-between;
            padding: 5px 0;
            font-size: 12px;
            color: #64748B;
          }
          .tot-line-final {
            display: flex;
            justify-content: space-between;
            padding-top: 10px;
            margin-top: 8px;
            border-top: 2px solid #CBD5E1;
            font-size: 16px;
            font-weight: 800;
            color: #1E293B;
          }
          .footer-note {
            text-align: center;
            border-top: 1px solid #E2E8F0;
            padding-top: 20px;
            font-size: 11px;
            color: #94A3B8;
            line-height: 1.6;
          }
          @media print {
            .no-print-bar { display: none !important; }
            body { padding: 10px !important; }
            .header { margin-top: 0 !important; }
          }
        </style>
      </head>
      <body>
        <div class="no-print-bar">
          <span class="bar-title">Order Summary Document (#${order.orderNumber})</span>
          <div>
            <button class="btn-print" onclick="window.print()">Print Document 🖨️</button>
            <button class="btn-close" onclick="window.close()">Close Window</button>
          </div>
        </div>

        <div class="header">
          <div>
            <div class="brand">OWNONCE</div>
            <div class="brand-sub">Womenswear Atelier • Cairo, Egypt</div>
            <div class="store-meta">
              Phone: ${settings.phone} • WhatsApp: ${settings.whatsapp}<br />
              Email: contact@ownonce.com • Web: www.ownonce.com
            </div>
          </div>
          <div class="order-meta-box">
            <div class="doc-type">Official Order Summary</div>
            <div class="order-id">#${order.orderNumber}</div>
            <div class="order-date">Date: ${new Date(order.createdAt).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}</div>
            <div class="status-tag">Status: ${order.orderStatus}</div>
          </div>
        </div>

        <div class="grid-info">
          <div class="info-card">
            <div class="card-heading">Customer & Shipping Information</div>
            <div class="info-row">
              <span class="info-label">Customer Name:</span>
              <span class="info-val">${order.customerName}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Phone Number:</span>
              <span class="info-val">${order.customerPhone}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Governorate:</span>
              <span class="info-val">${order.governorate} (${order.destinationZone})</span>
            </div>
            <div class="info-row">
              <span class="info-label">City / Area:</span>
              <span class="info-val">${order.city}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Delivery Address:</span>
              <span class="info-val">${order.address}</span>
            </div>
            ${
              order.notes
                ? `
            <div style="margin-top: 8px; padding-top: 8px; border-top: 1px dashed #E2E8F0; font-size: 11px; color: #77553B; font-style: italic;">
              Order Note: "${order.notes}"
            </div>`
                : ''
            }
          </div>

          <div class="info-card">
            <div class="card-heading">Fulfillment & Payment Details</div>
            <div class="info-row">
              <span class="info-label">Payment Method:</span>
              <span class="info-val">${order.paymentMethod.replace('_', ' ').toUpperCase()}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Payment Status:</span>
              <span class="info-val">${order.paymentStatus}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Total Parcel Weight:</span>
              <span class="info-val">${order.totalWeight} KG</span>
            </div>
            <div class="info-row">
              <span class="info-label">Shipping Matrix Route:</span>
              <span class="info-val">${order.originZone} ➔ ${order.destinationZone}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Estimated Delivery:</span>
              <span class="info-val" style="color: #77553B;">2 - 3 Business Days</span>
            </div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Garment Description & Specifications</th>
              <th style="text-align: center;">Quantity</th>
              <th style="text-align: right;">Unit Price</th>
              <th style="text-align: right;">Total Amount</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div class="totals-wrap">
          <div class="totals-table">
            <div class="tot-line">
              <span>Items Subtotal:</span>
              <span>${order.subtotal.toLocaleString()} EGP</span>
            </div>
            <div class="tot-line">
              <span>Shipping Fee (${order.destinationZone} • ${order.totalWeight} KG):</span>
              <span>${order.shippingCost.toLocaleString()} EGP</span>
            </div>
            <div class="tot-line-final">
              <span>Grand Total:</span>
              <span style="color: #77553B;">${order.total.toLocaleString()} EGP</span>
            </div>
          </div>
        </div>

        <div class="footer-note">
          <p>
            Thank you for your order with <strong>OWNonce Womenswear</strong>.<br />
            For any inquiries or modifications, please contact customer concierge via WhatsApp at <strong>${
              settings.whatsapp
            }</strong>.
          </p>
        </div>
      </body>
    </html>
  `;

  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.focus();
    }, 250);
  } else {
    // If popup blocked by iframe sandbox, use window.print()
    window.print();
  }
};
