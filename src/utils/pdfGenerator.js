import html2pdf from 'html2pdf.js';

function formatKey(key) {
  const parts = key.split('.')
  let last = parts[parts.length - 1]
  last = last.replace(/\[\d+\]/g, '')
  return last.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ')
    .split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ').trim()
}

function flattenData(data, prefix = '') {
  const items = []
  if (!data || typeof data !== 'object') return items
  for (const [key, value] of Object.entries(data)) {
    if (value === null || value === undefined || value === '') continue
    if (typeof value === 'object' && !Array.isArray(value)) {
      items.push(...flattenData(value, prefix ? `${prefix}.${key}` : key))
    } else if (Array.isArray(value)) {
      value.forEach((v, i) => {
        if (typeof v === 'object') {
          items.push(...flattenData(v, `${key}[${i}]`))
        } else if (v !== null && v !== '' && v !== undefined) {
          items.push({ key: `${key}`, value: String(v) }) 
        }
      })
    } else {
      items.push({ key: prefix ? `${prefix}.${key}` : key, value: String(value) })
    }
  }
  return items
}

function generateHTMLReport(title, contentHTML) {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });

  return `
    <div style="padding: 40px; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #111; position: relative; background: #fff; min-height: 100%;">
      
      <!-- BACKGROUND STAMP -->
      <div style="position: absolute; top: 40%; left: 50%; transform: translate(-50%, -50%) rotate(-35deg); font-size: 140px; font-weight: 900; color: rgba(168, 85, 247, 0.05); z-index: 0; pointer-events: none; white-space: nowrap;">
        A&lt;&gt;K VERIFIED
      </div>

      <div style="position: relative; z-index: 1;">
        <!-- Header -->
        <div style="border-bottom: 3px solid #00d4ff; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-end;">
          <div>
            <h1 style="margin: 0; font-size: 28px; color: #0f0f2a; text-transform: uppercase; letter-spacing: 2px;">${title}</h1>
            <p style="margin: 5px 0 0 0; color: #64748b; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Official Intelligence Report</p>
          </div>
          <div style="text-align: right; border: 1px solid #e2e8f0; padding: 10px 15px; border-radius: 8px; background: #f8fafc;">
            <div style="font-size: 22px; font-weight: 900; color: #a855f7; margin-bottom: 6px; letter-spacing: 2px;">A&lt;&gt;K</div>
            <div style="font-size: 11px; color: #475569; font-weight: 600;">DATE: <span style="color: #0f0f2a">${dateStr}</span></div>
            <div style="font-size: 11px; color: #475569; font-weight: 600;">TIME: <span style="color: #0f0f2a">${timeStr}</span></div>
          </div>
        </div>

        <!-- Content -->
        ${contentHTML}

        <!-- Footer -->
        <div style="margin-top: 50px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center; text-transform: uppercase; letter-spacing: 1px;">
          Generated securely by A&lt;&gt;K Deep Search Platform • Verified Intelligence Data
        </div>
      </div>
    </div>
  `;
}

export async function generateMobilePDF(resultsArray) {
  const count = resultsArray.length;
  const title = count === 1 
    ? `Mobile Lookup — ${resultsArray[0].number}` 
    : `Deep Search — ${count} Identities`;

  let contentHTML = '';
  
  resultsArray.forEach((entry, idx) => {
    contentHTML += `
      <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 24px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
        <h3 style="margin: 0 0 15px 0; color: #00d4ff; font-size: 16px; border-bottom: 2px solid #f1f5f9; padding-bottom: 12px; text-transform: uppercase; letter-spacing: 1px;">
          <span style="color: #94a3b8; margin-right: 8px;">#${idx + 1}</span> ${entry.number}
        </h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
    `;
    
    const items = flattenData(entry.data);
    items.forEach(item => {
      contentHTML += `
        <tr>
          <td style="padding: 10px 0; font-weight: 700; color: #475569; width: 35%; border-bottom: 1px solid #f1f5f9; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px;">${formatKey(item.key)}</td>
          <td style="padding: 10px 0; color: #0f0f2a; border-bottom: 1px solid #f1f5f9; word-break: break-word; font-weight: 500;">${item.value}</td>
        </tr>
      `;
    });
    
    contentHTML += `</table></div>`;
  });

  const wrapper = document.createElement('div');
  wrapper.innerHTML = generateHTMLReport(title, contentHTML);
  
  const opt = {
    margin:       [0.2, 0, 0.2, 0], // Top, Right, Bottom, Left margins in inches
    filename:     `AK_Mobile_Report_${Date.now()}.pdf`,
    image:        { type: 'jpeg', quality: 1 },
    html2canvas:  { scale: 2, useCORS: true, letterRendering: true },
    jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
  };

  await html2pdf().set(opt).from(wrapper).save();
}

export async function generateVehiclePDF(regNo, fields) {
  let contentHTML = `
    <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 24px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
      <h3 style="margin: 0 0 15px 0; color: #f59e0b; font-size: 16px; border-bottom: 2px solid #f1f5f9; padding-bottom: 12px; text-transform: uppercase; letter-spacing: 1px;">
        Vehicle Registration: <span style="color: #0f0f2a">${regNo}</span>
      </h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
  `;

  fields.forEach(f => {
    contentHTML += `
      <tr>
        <td style="padding: 10px 0; font-weight: 700; color: #475569; width: 35%; border-bottom: 1px solid #f1f5f9; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px;">${formatKey(f.label)}</td>
        <td style="padding: 10px 0; color: #0f0f2a; border-bottom: 1px solid #f1f5f9; word-break: break-word; font-weight: 500;">${f.value}</td>
      </tr>
    `;
  });

  contentHTML += `</table></div>`;

  const wrapper = document.createElement('div');
  wrapper.innerHTML = generateHTMLReport(`Vehicle RC Report`, contentHTML);

  const opt = {
    margin:       [0.2, 0, 0.2, 0], // Top, Right, Bottom, Left margins in inches
    filename:     `AK_Vehicle_Report_${Date.now()}.pdf`,
    image:        { type: 'jpeg', quality: 1 },
    html2canvas:  { scale: 2, useCORS: true, letterRendering: true },
    jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
  };

  await html2pdf().set(opt).from(wrapper).save();
}
