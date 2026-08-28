// High Definition Payment Proof SVG generator and image helpers

export const generateInstapayReceiptSvg = (
  orderNumber: string = 'OWN-98421',
  amount: number = 1436,
  customerName: string = 'Nour El-Din',
  dateStr: string = '20 Aug 2026, 04:32 PM',
  trxId: string = 'IPAY-984210984'
): string => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 850" width="1200" height="1700">
    <defs>
      <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#4C1D95" />
        <stop offset="50%" stop-color="#6D28D9" />
        <stop offset="100%" stop-color="#7C3AED" />
      </linearGradient>
      <filter id="shadow" x="-5%" y="-2%" width="110%" height="106%" filterUnits="userSpaceOnUse">
        <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#4C1D95" flood-opacity="0.12" />
      </filter>
    </defs>
    
    <!-- Background Card -->
    <rect width="600" height="850" fill="#F8FAFC" rx="0" />
    <g transform="translate(30, 30)" filter="url(#shadow)">
      <rect width="540" height="790" fill="#FFFFFF" rx="24" stroke="#E2E8F0" stroke-width="1.5" />
      
      <!-- Top Banner -->
      <path d="M 0 24 C 0 10.745 10.745 0 24 0 L 516 0 C 529.255 0 540 10.745 540 24 L 540 150 L 0 150 Z" fill="url(#headerGrad)" />
      
      <!-- InstaPay Logo / Text in Banner -->
      <g transform="translate(40, 35)">
        <rect x="0" y="0" width="44" height="44" rx="12" fill="#FFFFFF" />
        <path d="M 14 12 L 30 12 L 24 32 L 14 32 Z" fill="#6D28D9" />
        <circle cx="28" cy="18" r="4" fill="#F59E0B" />
        <text x="56" y="28" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="800" fill="#FFFFFF" letter-spacing="0.5">instapay</text>
        <text x="56" y="44" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="500" fill="#DDD6FE" letter-spacing="0.3">National Instant Payment Network (IPN)</text>
      </g>
      
      <!-- Status Badge -->
      <g transform="translate(270, 150)">
        <circle cx="0" cy="0" r="32" fill="#10B981" stroke="#FFFFFF" stroke-width="4" />
        <path d="M -10 -1 L -3 7 L 11 -7" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
      </g>
      
      <text x="270" y="210" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="700" fill="#0F172A">Payment Successful</text>
      <text x="270" y="232" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="500" fill="#64748B">${dateStr}</text>
      
      <!-- Amount Box -->
      <g transform="translate(50, 255)">
        <rect width="440" height="90" rx="16" fill="#F5F3FF" stroke="#DDD6FE" stroke-width="1.5" />
        <text x="220" y="36" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="600" fill="#6D28D9" text-transform="uppercase" letter-spacing="1">Amount Transferred</text>
        <text x="220" y="68" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="30" font-weight="800" fill="#3B0764">${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} <tspan font-size="18" font-weight="600">EGP</tspan></text>
      </g>
      
      <!-- Details Table -->
      <g transform="translate(50, 375)" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
        <!-- Row 1 -->
        <text x="0" y="20" font-size="12" font-weight="500" fill="#64748B">Order Reference</text>
        <text x="440" y="20" text-anchor="end" font-size="13" font-weight="700" fill="#0F172A">${orderNumber}</text>
        <line x1="0" y1="36" x2="440" y2="36" stroke="#F1F5F9" stroke-width="1.5" />
        
        <!-- Row 2 -->
        <text x="0" y="62" font-size="12" font-weight="500" fill="#64748B">Transaction Reference ID</text>
        <text x="440" y="62" text-anchor="end" font-size="12" font-weight="600" font-family="monospace" fill="#6D28D9">${trxId}</text>
        <line x1="0" y1="78" x2="440" y2="78" stroke="#F1F5F9" stroke-width="1.5" />
        
        <!-- Row 3 -->
        <text x="0" y="104" font-size="12" font-weight="500" fill="#64748B">Sender</text>
        <text x="440" y="104" text-anchor="end" font-size="13" font-weight="600" fill="#0F172A">${customerName}</text>
        <line x1="0" y1="120" x2="440" y2="120" stroke="#F1F5F9" stroke-width="1.5" />
        
        <!-- Row 4 -->
        <text x="0" y="146" font-size="12" font-weight="500" fill="#64748B">Receiver IPA / Handle</text>
        <text x="440" y="146" text-anchor="end" font-size="13" font-weight="700" fill="#0F172A">ownonce@instapay</text>
        <line x1="0" y1="162" x2="440" y2="162" stroke="#F1F5F9" stroke-width="1.5" />
        
        <!-- Row 5 -->
        <text x="0" y="188" font-size="12" font-weight="500" fill="#64748B">Beneficiary Name</text>
        <text x="440" y="188" text-anchor="end" font-size="13" font-weight="600" fill="#0F172A">OWN ONCE Womenswear</text>
        <line x1="0" y1="204" x2="440" y2="204" stroke="#F1F5F9" stroke-width="1.5" />
        
        <!-- Row 6 -->
        <text x="0" y="230" font-size="12" font-weight="500" fill="#64748B">Transfer Purpose</text>
        <text x="440" y="230" text-anchor="end" font-size="12" font-weight="500" fill="#334155">Online Order Purchase</text>
      </g>
      
      <!-- Security Stamp -->
      <g transform="translate(50, 650)">
        <rect width="440" height="70" rx="12" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1" />
        <circle cx="36" cy="35" r="16" fill="#10B981" fill-opacity="0.15" />
        <path d="M 28 35 L 33 40 L 44 29" fill="none" stroke="#10B981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
        <text x="64" y="30" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#0F172A">Verified Instant Electronic Transfer</text>
        <text x="64" y="48" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="400" fill="#64748B">Central Bank of Egypt (CBE) IPN Network Certified</text>
      </g>
    </g>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const generateVodafoneCashReceiptSvg = (
  orderNumber: string = 'OWN-98544',
  amount: number = 1422,
  customerName: string = 'Farida Mansour',
  dateStr: string = '23 Aug 2026, 02:15 PM',
  trxId: string = 'VF-98544202608'
): string => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 850" width="1200" height="1700">
    <defs>
      <linearGradient id="vfGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#E60000" />
        <stop offset="100%" stop-color="#990000" />
      </linearGradient>
      <filter id="shadow" x="-5%" y="-2%" width="110%" height="106%" filterUnits="userSpaceOnUse">
        <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#E60000" flood-opacity="0.12" />
      </filter>
    </defs>
    
    <!-- Background Card -->
    <rect width="600" height="850" fill="#F8FAFC" rx="0" />
    <g transform="translate(30, 30)" filter="url(#shadow)">
      <rect width="540" height="790" fill="#FFFFFF" rx="24" stroke="#E2E8F0" stroke-width="1.5" />
      
      <!-- Top Banner -->
      <path d="M 0 24 C 0 10.745 10.745 0 24 0 L 516 0 C 529.255 0 540 10.745 540 24 L 540 150 L 0 150 Z" fill="url(#vfGrad)" />
      
      <!-- Vodafone Cash Banner Info -->
      <g transform="translate(40, 35)">
        <circle cx="22" cy="22" r="22" fill="#FFFFFF" />
        <path d="M 22 10 C 15.373 10 10 15.373 10 22 C 10 28.627 15.373 34 22 34 C 28.627 34 34 28.627 34 22 C 34 15.373 28.627 10 22 10 Z" fill="#E60000" />
        <circle cx="22" cy="22" r="5" fill="#FFFFFF" />
        <text x="58" y="28" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="800" fill="#FFFFFF" letter-spacing="0.5">Vodafone Cash</text>
        <text x="58" y="44" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="500" fill="#FECACA" letter-spacing="0.3">Wallet Transfer Confirmation</text>
      </g>
      
      <!-- Status Badge -->
      <g transform="translate(270, 150)">
        <circle cx="0" cy="0" r="32" fill="#10B981" stroke="#FFFFFF" stroke-width="4" />
        <path d="M -10 -1 L -3 7 L 11 -7" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
      </g>
      
      <text x="270" y="210" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="700" fill="#0F172A">Transfer Completed</text>
      <text x="270" y="232" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="500" fill="#64748B">${dateStr}</text>
      
      <!-- Amount Box -->
      <g transform="translate(50, 255)">
        <rect width="440" height="90" rx="16" fill="#FEF2F2" stroke="#FECACA" stroke-width="1.5" />
        <text x="220" y="36" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="600" fill="#DC2626" text-transform="uppercase" letter-spacing="1">Total Paid</text>
        <text x="220" y="68" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="30" font-weight="800" fill="#7F1D1D">${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} <tspan font-size="18" font-weight="600">EGP</tspan></text>
      </g>
      
      <!-- Details Table -->
      <g transform="translate(50, 375)" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
        <!-- Row 1 -->
        <text x="0" y="20" font-size="12" font-weight="500" fill="#64748B">Order ID</text>
        <text x="440" y="20" text-anchor="end" font-size="13" font-weight="700" fill="#0F172A">${orderNumber}</text>
        <line x1="0" y1="36" x2="440" y2="36" stroke="#F1F5F9" stroke-width="1.5" />
        
        <!-- Row 2 -->
        <text x="0" y="62" font-size="12" font-weight="500" fill="#64748B">Transaction ID</text>
        <text x="440" y="62" text-anchor="end" font-size="12" font-weight="600" font-family="monospace" fill="#DC2626">${trxId}</text>
        <line x1="0" y1="78" x2="440" y2="78" stroke="#F1F5F9" stroke-width="1.5" />
        
        <!-- Row 3 -->
        <text x="0" y="104" font-size="12" font-weight="500" fill="#64748B">From (Sender)</text>
        <text x="440" y="104" text-anchor="end" font-size="13" font-weight="600" fill="#0F172A">${customerName} (01298765432)</text>
        <line x1="0" y1="120" x2="440" y2="120" stroke="#F1F5F9" stroke-width="1.5" />
        
        <!-- Row 4 -->
        <text x="0" y="146" font-size="12" font-weight="500" fill="#64748B">To (Store Wallet)</text>
        <text x="440" y="146" text-anchor="end" font-size="13" font-weight="700" fill="#0F172A">01012345678 (OWN ONCE)</text>
        <line x1="0" y1="162" x2="440" y2="162" stroke="#F1F5F9" stroke-width="1.5" />
        
        <!-- Row 5 -->
        <text x="0" y="188" font-size="12" font-weight="500" fill="#64748B">Transfer Fees</text>
        <text x="440" y="188" text-anchor="end" font-size="13" font-weight="600" fill="#0F172A">0.00 EGP (Paid by Sender)</text>
      </g>
      
      <!-- Security Stamp -->
      <g transform="translate(50, 650)">
        <rect width="440" height="70" rx="12" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1" />
        <circle cx="36" cy="35" r="16" fill="#DC2626" fill-opacity="0.15" />
        <path d="M 28 35 L 33 40 L 44 29" fill="none" stroke="#DC2626" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
        <text x="64" y="30" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#0F172A">Official Mobile Wallet Receipt</text>
        <text x="64" y="48" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="400" fill="#64748B">Transaction completed and credited to merchant account</text>
      </g>
    </g>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const readFileAsHighResDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file as Data URL'));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};
