import * as XLSX from 'xlsx';

const convertToXLSX = (data: any[]): string => {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
  const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
  const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  return excelBuffer;
  };

export { convertToXLSX };
