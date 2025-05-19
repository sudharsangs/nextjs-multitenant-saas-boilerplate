import ExcelJS from 'exceljs';

/**
 * Type definition for Excel column configuration
 */
export interface ExcelColumn {
  header: string;
  key: string;
  width?: number;
}

/**
 * Utility to read an Excel file and return its data as an array of objects
 * 
 * @param file The Excel file to read (File object from input element)
 * @returns Promise that resolves to an array of objects, each representing a row
 */
export const readExcelFile = async (file: File): Promise<Record<string, unknown>[]> => {
  try {
    // Read the file as an array buffer
    const buffer = await file.arrayBuffer();
    
    // Create a new workbook
    const workbook = new ExcelJS.Workbook();
    
    // Load the Excel file from the array buffer based on extension
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    if (fileExtension === 'csv') {
      // For CSV files
      const text = await file.text();
      const rows = text.split('\n');
      
      if (rows.length < 2) {
        throw new Error('CSV file must have at least a header row and one data row');
      }
      
      // Parse header row
      const headers = rows[0].split(',').map(header => header.trim());
      
      // Parse data rows
      const data: Record<string, unknown>[] = [];
      for (let i = 1; i < rows.length; i++) {
        if (!rows[i].trim()) continue; // Skip empty rows
        
        const values = rows[i].split(',').map(value => value.trim());
        const rowData: Record<string, unknown> = {};
        
        headers.forEach((header, index) => {
          rowData[header] = index < values.length ? values[index] : '';
        });
        
        data.push(rowData);
      }
      
      return data;
    } else {
      // For Excel files (.xlsx, .xls)
      await workbook.xlsx.load(buffer);
      
      // Get the first worksheet
      const worksheet = workbook.worksheets[0];
      
      if (!worksheet) {
        throw new Error('No worksheet found in the Excel file');
      }
      
      // Extract headers from the first row
      const headers: string[] = [];
      worksheet.getRow(1).eachCell((cell, colNumber) => {
        headers[colNumber - 1] = cell.value?.toString() || `Column${colNumber}`;
      });
      
      // Convert worksheet data to an array of objects
      const data: Record<string, unknown>[] = [];
      
      // Start from row 2 (after header)
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // Skip header row
        
        const rowData: Record<string, unknown> = {};
        row.eachCell((cell, colNumber) => {
          if (colNumber <= headers.length) {
            const header = headers[colNumber - 1];
            
            // Handle different cell types appropriately
            switch (cell.type) {
              case ExcelJS.ValueType.Number:
                rowData[header] = cell.value;
                break;
              case ExcelJS.ValueType.Date:
                rowData[header] = cell.value;
                break;
              case ExcelJS.ValueType.Formula:
                // Get the calculated value of the formula
                rowData[header] = cell.value;
                break;
              case ExcelJS.ValueType.Boolean:
                rowData[header] = cell.value;
                break;
              default:
                // Strings and other types
                rowData[header] = cell.value?.toString() || '';
            }
          }
        });
        
        // Make sure all headers have a value (even if empty)
        headers.forEach(header => {
          if (!(header in rowData)) {
            rowData[header] = '';
          }
        });
        
        data.push(rowData);
      });
      
      return data;
    }
  } catch (error) {
    console.error('Error reading Excel file:', error);
    throw error;
  }
};

/**
 * Utility to create and download an Excel file from data
 * 
 * @param data Array of objects to export
 * @param columns Column configuration for the Excel file
 * @param filename Filename for the downloaded file
 */
export const exportToExcel = async (
  data: Record<string, unknown>[],
  columns: ExcelColumn[],
  filename: string = 'export.xlsx'
): Promise<void> => {
  try {
    // Create a new workbook
    const workbook = new ExcelJS.Workbook();
    
    // Add a worksheet
    const worksheet = workbook.addWorksheet('Sheet 1');
    
    // Add columns to the worksheet
    worksheet.columns = columns;
    
    // Style the header row
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE9ECEF' }
    };
    
    // Add rows to the worksheet
    worksheet.addRows(data);
    
    // Auto fit columns width based on content
    worksheet.columns.forEach(column => {
      let maxLength = 0;
      if (column.header && column.header.length > maxLength) {
        maxLength = column.header.length;
      }
      // Find the max length of data in each column
      if (column.key) {
        worksheet.getColumn(column.key).eachCell({ includeEmpty: true }, (cell, rowNumber) => {
          if (rowNumber > 1) {
            const columnLength = cell.value ? String(cell.value).length : 0;
            if (columnLength > maxLength) {
              maxLength = columnLength;
            }
          }
        });
        column.width = maxLength + 2; // Add some padding
      }
    });
    
    // Generate a blob with the Excel data
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    // Create a download link and trigger download
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    throw error;
  }
};

/**
 * Validates Excel data against expected columns
 * @param data The data to validate
 * @param requiredColumns Array of column names that must be present
 * @returns Object with isValid flag and error messages
 */
export const validateExcelData = (
  data: Record<string, unknown>[],
  requiredColumns: string[]
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Check if data is empty
  if (!data || data.length === 0) {
    return {
      isValid: false,
      errors: ['No data found in the file']
    };
  }
  
  // Check for required columns
  const firstRow = data[0];
  const missingColumns = requiredColumns.filter(col => 
    !Object.keys(firstRow).some(key => 
      key.toLowerCase() === col.toLowerCase()
    )
  );
  
  if (missingColumns.length > 0) {
    errors.push(`Missing required columns: ${missingColumns.join(', ')}`);
  }
  
  // Check for empty values in required fields
  data.forEach((row, index) => {
    requiredColumns.forEach(column => {
      // Find the matching column regardless of case
      const matchingKey = Object.keys(row).find(
        key => key.toLowerCase() === column.toLowerCase()
      );
      
      if (matchingKey && (!row[matchingKey] || row[matchingKey] === '')) {
        errors.push(`Row ${index + 1}: Missing value for ${column}`);
      }
    });
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Creates and downloads a sample template Excel file with the specified columns
 * 
 * @param columns Array of column configurations
 * @param filename Name of the file to download
 */
export const downloadTemplateFile = async (
  columns: ExcelColumn[],
  filename: string = 'template.xlsx'
): Promise<void> => {
  try {
    // Create a new workbook
    const workbook = new ExcelJS.Workbook();
    
    // Add a worksheet
    const worksheet = workbook.addWorksheet('Template');
    
    // Add columns to the worksheet
    worksheet.columns = columns;
    
    // Style the header row
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE9ECEF' }
    };
    
    // Add an example row with empty cells
    const exampleRow: Record<string, string> = {};
    columns.forEach(col => {
      if (col.key) {
        exampleRow[col.key] = ''; // Empty cells for template
      }
    });
    worksheet.addRow(exampleRow);
    
    // Auto fit columns width
    columns.forEach(column => {
      if (column.key) {
        const headerLength = column.header ? column.header.length : 0;
        worksheet.getColumn(column.key).width = headerLength + 5;
      }
    });
    
    // Generate a blob with the Excel data
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    // Create a download link and trigger download
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error creating template file:', error);
    throw error;
  }
};
