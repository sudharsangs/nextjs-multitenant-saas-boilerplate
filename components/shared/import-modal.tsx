import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { readExcelFile, downloadTemplateFile, validateExcelData } from '@/lib/excel-utils';
import { AlertCircle, FileUp, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: Record<string, unknown>[]) => Promise<void>;
  title?: string;
  description?: string;
  templateColumns?: { key: string; header: string }[];
}

const ImportModal: React.FC<ImportModalProps> = ({
  isOpen,
  onClose,
  onImport,
  title = 'Import Data',
  description = 'Upload an Excel file to import data.',
  templateColumns = [],
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<any[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setError(null);
    setPreview([]);
    
    if (selectedFile) {
      setFile(selectedFile);
      previewFile(selectedFile);
    }
  };

  const previewFile = async (file: File) => {
    try {
      setIsLoading(true);
      const data = await readExcelFile(file);
      
      // Validate the data against required columns
      const requiredColumnKeys = templateColumns.map(col => col.key);
      const validation = validateExcelData(data, requiredColumnKeys);
      
      if (!validation.isValid) {
        setError(`Invalid file format: ${validation.errors.join(', ')}`);
        setPreview([]);
      } else {
        setPreview(data.slice(0, 3)); // Preview first 3 rows
      }
      
      setIsLoading(false);
    } catch (error) {
      setError('Failed to read file. Please make sure it\'s a valid Excel file.');
      setIsLoading(false);
    }
  };

  const handleImport = async () => {
    if (!file) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await readExcelFile(file);
      
      // Validate the data against required columns
      const requiredColumnKeys = templateColumns.map(col => col.key);
      const validation = validateExcelData(data, requiredColumnKeys);
      
      if (!validation.isValid) {
        setError(`Validation errors: ${validation.errors.join(', ')}`);
        setIsLoading(false);
        return;
      }
      
      await onImport(data);
      setIsLoading(false);
      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to import data. Please try again.';
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      // Convert template columns to ExcelColumns
      const excelColumns = templateColumns.map(col => ({
        header: col.header,
        key: col.key,
        width: col.header.length + 5
      }));
      
      // Use the Excel utility to download a proper Excel template
      await downloadTemplateFile(excelColumns, 'import_template.xlsx');
    } catch (error) {
      console.error('Error downloading template:', error);
      setError('Failed to download template file.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <label htmlFor="import-file" className="text-sm font-medium">
              Select Excel File
            </label>
            <div className="flex gap-2">
              <input
                id="import-file"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium"
              />
            </div>
            {templateColumns.length > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDownloadTemplate} 
                className="mt-2"
              >
                Download Template
              </Button>
            )}
          </div>

          {preview.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">Preview:</h3>
              <div className="border rounded-md overflow-auto max-h-32">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      {Object.keys(preview[0]).map((key) => (
                        <th key={key} className="px-2 py-1 text-left">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((row, i) => (
                      <tr key={i} className="border-t">
                        {Object.values(row).map((value: unknown, j) => (
                          <td key={j} className="px-2 py-1">
                            {value !== null && value !== undefined ? String(value) : ''}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleImport} 
            disabled={!file || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <FileUp className="mr-2 h-4 w-4" />
                Import
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportModal;
