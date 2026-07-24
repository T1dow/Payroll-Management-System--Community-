/** Trigger a file download in the browser */
export function downloadBlob(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** Convert an array of objects to a CSV string */
export function toCSV(rows: Record<string, unknown>[], headers?: string[]): string {
  if (rows.length === 0) return '';
  const cols = headers || Object.keys(rows[0]);
  const escape = (v: unknown) => {
    const str = String(v ?? '');
    return str.includes(',') || str.includes('"') || str.includes('\n')
      ? `"${str.replace(/"/g, '""')}"`
      : str;
  };
  const headerRow = cols.join(',');
  const dataRows = rows.map(row => cols.map(col => escape(row[col])).join(','));
  return [headerRow, ...dataRows].join('\n');
}

export function downloadCSV(rows: Record<string, unknown>[], filename: string, headers?: string[]) {
  downloadBlob(toCSV(rows, headers), filename, 'text/csv;charset=utf-8;');
}

export function downloadHTML(html: string, filename: string) {
  downloadBlob(html, filename, 'text/html;charset=utf-8;');
}

/** Build a printable HTML payslip document */
export function buildPayslipHTML(data: {
  companyName: string;
  employeeName: string;
  employeeId: string;
  designation: string;
  department: string;
  location: string;
  month: string;
  year: number;
  generatedDate: string;
  basicSalary: number;
  hra: number;
  allowances: number;
  grossSalary: number;
  esi: number;
  pf: number;
  tds: number;
  professionalTax?: number;
  otherDeductions?: number;
  totalDeductions: number;
  netSalary: number;
  bankAccount?: string;
  panNumber?: string;
}) {
  const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Payslip - ${data.employeeName} - ${data.month} ${data.year}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Arial, sans-serif; font-size: 12px; color: #1a1a1a; padding: 30px; }
  .header { text-align: center; border-bottom: 3px solid #1e40af; padding-bottom: 12px; margin-bottom: 20px; }
  .header h1 { font-size: 22px; color: #1e40af; }
  .header h2 { font-size: 14px; color: #555; margin-top: 4px; }
  .meta { display: flex; justify-content: space-between; margin-bottom: 20px; }
  .meta-box { flex: 1; }
  .meta-box h3 { font-size: 11px; font-weight: bold; color: #1e40af; text-transform: uppercase; margin-bottom: 8px; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; }
  .meta-row { display: flex; justify-content: space-between; margin-bottom: 4px; }
  .meta-row .label { color: #666; }
  .meta-row .value { font-weight: 500; }
  .salary-grid { display: flex; gap: 20px; margin-bottom: 20px; }
  .salary-col { flex: 1; }
  .salary-col h3 { font-size: 11px; font-weight: bold; text-transform: uppercase; padding: 6px 10px; margin-bottom: 0; }
  .earnings h3 { background: #dcfce7; color: #15803d; }
  .deductions h3 { background: #fee2e2; color: #b91c1c; }
  table { width: 100%; border-collapse: collapse; }
  td { padding: 6px 10px; border-bottom: 1px solid #f3f4f6; }
  td:last-child { text-align: right; font-weight: 500; }
  .total-row td { border-top: 2px solid #e5e7eb; font-weight: bold; padding-top: 8px; }
  .net-salary { background: #1e40af; color: white; text-align: center; padding: 14px; border-radius: 6px; margin-bottom: 20px; }
  .net-salary .label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.8; }
  .net-salary .amount { font-size: 24px; font-weight: bold; margin-top: 4px; }
  .footer { display: flex; justify-content: space-between; font-size: 11px; color: #666; border-top: 1px solid #e5e7eb; padding-top: 12px; }
  .watermark { text-align: center; color: #9ca3af; font-size: 10px; margin-top: 20px; }
</style>
</head>
<body>
<div class="header">
  <h1>${data.companyName}</h1>
  <h2>SALARY SLIP — ${data.month.toUpperCase()} ${data.year}</h2>
</div>

<div class="meta">
  <div class="meta-box" style="margin-right:20px">
    <h3>Employee Details</h3>
    <div class="meta-row"><span class="label">Name</span><span class="value">${data.employeeName}</span></div>
    <div class="meta-row"><span class="label">Employee ID</span><span class="value">${data.employeeId}</span></div>
    <div class="meta-row"><span class="label">Designation</span><span class="value">${data.designation}</span></div>
    <div class="meta-row"><span class="label">Department</span><span class="value">${data.department}</span></div>
    <div class="meta-row"><span class="label">Location</span><span class="value">${data.location}</span></div>
  </div>
  <div class="meta-box">
    <h3>Pay Details</h3>
    <div class="meta-row"><span class="label">Pay Period</span><span class="value">${data.month} ${data.year}</span></div>
    <div class="meta-row"><span class="label">Generated On</span><span class="value">${data.generatedDate}</span></div>
    ${data.bankAccount ? `<div class="meta-row"><span class="label">Bank Account</span><span class="value">${data.bankAccount}</span></div>` : ''}
    ${data.panNumber ? `<div class="meta-row"><span class="label">PAN</span><span class="value">${data.panNumber}</span></div>` : ''}
  </div>
</div>

<div class="salary-grid">
  <div class="salary-col earnings">
    <h3>Earnings</h3>
    <table>
      <tr><td>Basic Salary</td><td>${fmt(data.basicSalary)}</td></tr>
      <tr><td>House Rent Allowance (HRA)</td><td>${fmt(data.hra)}</td></tr>
      <tr><td>Other Allowances</td><td>${fmt(data.allowances)}</td></tr>
      <tr class="total-row"><td>Gross Salary</td><td>${fmt(data.grossSalary)}</td></tr>
    </table>
  </div>
  <div class="salary-col deductions">
    <h3>Deductions</h3>
    <table>
      <tr><td>Employee State Insurance (ESI)</td><td>${fmt(data.esi)}</td></tr>
      <tr><td>Provident Fund (PF)</td><td>${fmt(data.pf)}</td></tr>
      <tr><td>Tax Deducted at Source (TDS)</td><td>${fmt(data.tds)}</td></tr>
      ${data.professionalTax ? `<tr><td>Professional Tax</td><td>${fmt(data.professionalTax)}</td></tr>` : ''}
      ${data.otherDeductions ? `<tr><td>Other Deductions</td><td>${fmt(data.otherDeductions)}</td></tr>` : ''}
      <tr class="total-row"><td>Total Deductions</td><td>${fmt(data.totalDeductions)}</td></tr>
    </table>
  </div>
</div>

<div class="net-salary">
  <div class="label">Net Take-Home Salary</div>
  <div class="amount">${fmt(data.netSalary)}</div>
</div>

<div class="footer">
  <span>This is a computer-generated payslip and does not require a signature.</span>
  <span>Confidential — For Employee Use Only</span>
</div>
<div class="watermark">Generated by PayrollPro Enterprise HRMS • ${new Date().toLocaleDateString('en-IN')}</div>
</body>
</html>`;
}
