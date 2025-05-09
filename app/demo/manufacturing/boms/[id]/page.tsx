"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Clipboard,
  FileText,
  Package,
  Calendar,
  Clock,
  User,
  Edit,
  Trash2,
  FileDown,
  FilePlus,
  History,
  Tag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card";

// Mock BOM details with components
const mockBOMDetails = {
  "bom1": {
    id: "bom1",
    productName: "Circuit Board Assembly",
    productCode: "CBX-001",
    description: "Main circuit board assembly for industrial control systems",
    version: "1.0",
    createdAt: "2025-04-10",
    lastUpdated: "2025-05-02",
    createdBy: "John Smith",
    status: "Active",
    components: [
      { id: "comp001", name: "Microcontroller", partNumber: "MCU-328P", quantity: 1, unitCost: 3.50, totalCost: 3.50, unitOfMeasure: "pcs" },
      { id: "comp002", name: "Resistor 10kΩ", partNumber: "RES-10K", quantity: 12, unitCost: 0.05, totalCost: 0.60, unitOfMeasure: "pcs" },
      { id: "comp003", name: "Capacitor 100nF", partNumber: "CAP-100N", quantity: 8, unitCost: 0.08, totalCost: 0.64, unitOfMeasure: "pcs" },
      { id: "comp004", name: "LED Red", partNumber: "LED-RED", quantity: 4, unitCost: 0.12, totalCost: 0.48, unitOfMeasure: "pcs" },
      { id: "comp005", name: "Transistor NPN", partNumber: "TRN-NPN", quantity: 3, unitCost: 0.25, totalCost: 0.75, unitOfMeasure: "pcs" },
      { id: "comp006", name: "Crystal 16MHz", partNumber: "XTAL-16", quantity: 1, unitCost: 0.45, totalCost: 0.45, unitOfMeasure: "pcs" },
      { id: "comp007", name: "PCB Board", partNumber: "PCB-01", quantity: 1, unitCost: 1.80, totalCost: 1.80, unitOfMeasure: "pcs" },
      { id: "comp008", name: "Header Pins", partNumber: "HDR-40", quantity: 2, unitCost: 0.30, totalCost: 0.60, unitOfMeasure: "pcs" }
    ]
  },
  "bom2": {
    id: "bom2",
    productName: "Power Supply Unit",
    productCode: "PSU-450",
    description: "450W power supply unit for electronic equipment",
    version: "2.3",
    createdAt: "2025-03-15",
    lastUpdated: "2025-04-28",
    createdBy: "Mike Chen",
    status: "Active",
    components: [
      { id: "comp101", name: "Transformer", partNumber: "TRF-450", quantity: 1, unitCost: 12.50, totalCost: 12.50, unitOfMeasure: "pcs" },
      { id: "comp102", name: "Capacitor 470μF", partNumber: "CAP-470", quantity: 4, unitCost: 0.85, totalCost: 3.40, unitOfMeasure: "pcs" },
      { id: "comp103", name: "Diode Bridge", partNumber: "DB-100", quantity: 1, unitCost: 1.25, totalCost: 1.25, unitOfMeasure: "pcs" },
      { id: "comp104", name: "Voltage Regulator", partNumber: "VR-7805", quantity: 2, unitCost: 0.95, totalCost: 1.90, unitOfMeasure: "pcs" },
      { id: "comp105", name: "Heat Sink", partNumber: "HS-ALU", quantity: 2, unitCost: 1.10, totalCost: 2.20, unitOfMeasure: "pcs" },
      { id: "comp106", name: "DC Jack", partNumber: "DCJ-55", quantity: 1, unitCost: 0.75, totalCost: 0.75, unitOfMeasure: "pcs" },
      { id: "comp107", name: "Power Switch", partNumber: "SW-PWR", quantity: 1, unitCost: 0.65, totalCost: 0.65, unitOfMeasure: "pcs" },
      { id: "comp108", name: "PCB Board", partNumber: "PCB-02", quantity: 1, unitCost: 3.20, totalCost: 3.20, unitOfMeasure: "pcs" },
      { id: "comp109", name: "LED Indicator", partNumber: "LED-IND", quantity: 1, unitCost: 0.18, totalCost: 0.18, unitOfMeasure: "pcs" },
      { id: "comp110", name: "Fuse Holder", partNumber: "FSH-01", quantity: 1, unitCost: 0.55, totalCost: 0.55, unitOfMeasure: "pcs" },
      { id: "comp111", name: "Fuse 5A", partNumber: "FSE-5A", quantity: 1, unitCost: 0.25, totalCost: 0.25, unitOfMeasure: "pcs" },
      { id: "comp112", name: "Screw Terminal", partNumber: "SCRTRM", quantity: 2, unitCost: 0.35, totalCost: 0.70, unitOfMeasure: "pcs" },
      { id: "comp113", name: "Wire Bundle", partNumber: "WB-100", quantity: 1, unitCost: 1.80, totalCost: 1.80, unitOfMeasure: "pcs" },
      { id: "comp114", name: "Housing Case", partNumber: "HC-210", quantity: 1, unitCost: 4.50, totalCost: 4.50, unitOfMeasure: "pcs" }
    ]
  },
  "bom3": {
    id: "bom3",
    productName: "LED Light Assembly",
    productCode: "LED-A20",
    description: "20W LED light assembly with heat sink",
    version: "1.5",
    createdAt: "2025-04-22",
    lastUpdated: "2025-04-22",
    createdBy: "Sarah Johnson",
    status: "Active",
    components: [
      { id: "comp201", name: "LED Array 20W", partNumber: "LED-20W", quantity: 1, unitCost: 5.75, totalCost: 5.75, unitOfMeasure: "pcs" },
      { id: "comp202", name: "Heat Sink Aluminum", partNumber: "HS-ALU-L", quantity: 1, unitCost: 2.80, totalCost: 2.80, unitOfMeasure: "pcs" },
      { id: "comp203", name: "LED Driver", partNumber: "LDRV-20", quantity: 1, unitCost: 3.50, totalCost: 3.50, unitOfMeasure: "pcs" },
      { id: "comp204", name: "Diffuser Lens", partNumber: "DL-80", quantity: 1, unitCost: 1.20, totalCost: 1.20, unitOfMeasure: "pcs" },
      { id: "comp205", name: "Mounting Bracket", partNumber: "MB-01", quantity: 2, unitCost: 0.75, totalCost: 1.50, unitOfMeasure: "pcs" },
      { id: "comp206", name: "Cable Set", partNumber: "CS-50", quantity: 1, unitCost: 1.25, totalCost: 1.25, unitOfMeasure: "pcs" }
    ]
  },
  "bom4": {
    id: "bom4",
    productName: "Control Panel",
    productCode: "CP-100",
    description: "Touch-enabled control panel for industrial machinery",
    version: "3.0",
    createdAt: "2025-02-10",
    lastUpdated: "2025-05-01",
    createdBy: "Emily Brown",
    status: "Obsolete",
    components: [
      { id: "comp301", name: "LCD Display", partNumber: "LCD-7IN", quantity: 1, unitCost: 18.50, totalCost: 18.50, unitOfMeasure: "pcs" },
      { id: "comp302", name: "Touch Panel", partNumber: "TP-7IN", quantity: 1, unitCost: 12.75, totalCost: 12.75, unitOfMeasure: "pcs" },
      { id: "comp303", name: "Controller Board", partNumber: "CTR-85", quantity: 1, unitCost: 8.90, totalCost: 8.90, unitOfMeasure: "pcs" },
      { id: "comp304", name: "Push Button", partNumber: "PB-16", quantity: 6, unitCost: 0.85, totalCost: 5.10, unitOfMeasure: "pcs" },
      { id: "comp305", name: "Rotary Encoder", partNumber: "RE-24", quantity: 2, unitCost: 2.45, totalCost: 4.90, unitOfMeasure: "pcs" },
      { id: "comp306", name: "LED Indicator", partNumber: "LED-IND-M", quantity: 8, unitCost: 0.35, totalCost: 2.80, unitOfMeasure: "pcs" },
      { id: "comp307", name: "Enclosure", partNumber: "ENC-CP1", quantity: 1, unitCost: 15.20, totalCost: 15.20, unitOfMeasure: "pcs" },
      { id: "comp308", name: "Cable Harness", partNumber: "CH-125", quantity: 1, unitCost: 4.50, totalCost: 4.50, unitOfMeasure: "pcs" },
      { id: "comp309", name: "Power Supply", partNumber: "PS-12V", quantity: 1, unitCost: 6.80, totalCost: 6.80, unitOfMeasure: "pcs" },
      { id: "comp310", name: "Connector Set", partNumber: "CS-JP20", quantity: 1, unitCost: 3.25, totalCost: 3.25, unitOfMeasure: "pcs" },
      { id: "comp311", name: "Mounting Kit", partNumber: "MK-CP1", quantity: 1, unitCost: 2.10, totalCost: 2.10, unitOfMeasure: "pcs" },
      { id: "comp312", name: "Security Key", partNumber: "SK-01", quantity: 1, unitCost: 5.65, totalCost: 5.65, unitOfMeasure: "pcs" }
    ]
  },
  "bom5": {
    id: "bom5",
    productName: "Enclosure Box",
    productCode: "EB-225",
    description: "Weather-resistant enclosure for outdoor electronics",
    version: "1.2",
    createdAt: "2025-04-18",
    lastUpdated: "2025-04-18",
    createdBy: "John Smith",
    status: "Active",
    components: [
      { id: "comp401", name: "Plastic Housing", partNumber: "PH-225", quantity: 1, unitCost: 8.50, totalCost: 8.50, unitOfMeasure: "pcs" },
      { id: "comp402", name: "Rubber Gasket", partNumber: "RG-225", quantity: 1, unitCost: 2.25, totalCost: 2.25, unitOfMeasure: "pcs" },
      { id: "comp403", name: "Mounting Bracket", partNumber: "MB-225", quantity: 2, unitCost: 1.85, totalCost: 3.70, unitOfMeasure: "pcs" },
      { id: "comp404", name: "Locking Latch", partNumber: "LL-01", quantity: 2, unitCost: 1.45, totalCost: 2.90, unitOfMeasure: "pcs" },
      { id: "comp405", name: "Cable Gland", partNumber: "CG-12", quantity: 4, unitCost: 0.95, totalCost: 3.80, unitOfMeasure: "pcs" }
    ]
  }
};

export default function BOMDetailPage({ params }: { params: { id: string }}) {
  const router = useRouter();
  const bomId = params.id;
  const bomDetails = mockBOMDetails[bomId as keyof typeof mockBOMDetails];

  // Calculate total cost
  const totalCost = bomDetails?.components.reduce((sum, component) => sum + component.totalCost, 0) ?? 0;

  // If BOM not found
  if (!bomDetails) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            className="mr-4"
            onClick={() => router.back()}
          >
            <ArrowLeft size={16} className="mr-1" />
            Back
          </Button>
          <h1 className="text-2xl font-semibold">BOM Not Found</h1>
        </div>
        
        <div className="bg-card rounded-lg shadow p-6 text-center">
          <p>The requested Bill of Materials could not be found.</p>
          <Button 
            className="mt-4"
            onClick={() => router.push("/demo/manufacturing/boms")}
          >
            Return to BOMs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            className="mr-4"
            onClick={() => router.back()}
          >
            <ArrowLeft size={16} className="mr-1" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">{bomDetails.productName}</h1>
            <div className="text-sm text-muted-foreground">
              Product Code: {bomDetails.productCode} • Version {bomDetails.version}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex gap-1">
            <Edit size={14} />
            Edit
          </Button>
          <Button variant="outline" size="sm" className="flex gap-1">
            <FileDown size={14} />
            Export
          </Button>
          <Button variant="destructive" size="sm" className="flex gap-1">
            <Trash2 size={14} />
            Delete
          </Button>
        </div>
      </div>

      {/* BOM Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* BOM Description */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <FileText size={16} />
                BOM Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{bomDetails.description}</p>
            </CardContent>
          </Card>

          {/* Components Table */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Package size={16} />
                Components ({bomDetails.components.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr className="border-b">
                      <th className="text-left py-2 px-4 text-xs font-medium text-muted-foreground">Component Name</th>
                      <th className="text-left py-2 px-4 text-xs font-medium text-muted-foreground">Part Number</th>
                      <th className="text-center py-2 px-4 text-xs font-medium text-muted-foreground">Quantity</th>
                      <th className="text-right py-2 px-4 text-xs font-medium text-muted-foreground">Unit Cost</th>
                      <th className="text-right py-2 px-4 text-xs font-medium text-muted-foreground">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bomDetails.components.map((component) => (
                      <tr key={component.id} className="border-b border-border hover:bg-muted/50">
                        <td className="py-2 px-4 font-medium">{component.name}</td>
                        <td className="py-2 px-4 text-muted-foreground">{component.partNumber}</td>
                        <td className="py-2 px-4 text-center">
                          {component.quantity} {component.unitOfMeasure}
                        </td>
                        <td className="py-2 px-4 text-right">₹{component.unitCost.toFixed(2)}</td>
                        <td className="py-2 px-4 text-right font-medium">₹{component.totalCost.toFixed(2)}</td>
                      </tr>
                    ))}
                    {/* Total row */}
                    <tr className="bg-muted/50">
                      <td colSpan={4} className="py-2 px-4 text-right font-medium">Total Cost:</td>
                      <td className="py-2 px-4 text-right font-bold">₹{totalCost.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar with additional info */}
        <div className="space-y-6">
          {/* BOM Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Clipboard size={16} />
                BOM Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-3 text-sm">
                <div className="flex items-center">
                  <dt className="flex items-center gap-2 text-muted-foreground w-1/3">
                    <Tag size={14} />
                    Status:
                  </dt>
                  <dd className="w-2/3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      bomDetails.status === "Active" 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500'
                        : bomDetails.status === "Obsolete"
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500'
                    }`}>
                      {bomDetails.status}
                    </span>
                  </dd>
                </div>

                <div className="flex items-center">
                  <dt className="flex items-center gap-2 text-muted-foreground w-1/3">
                    <User size={14} />
                    Created By:
                  </dt>
                  <dd className="w-2/3">{bomDetails.createdBy}</dd>
                </div>

                <div className="flex items-center">
                  <dt className="flex items-center gap-2 text-muted-foreground w-1/3">
                    <Calendar size={14} />
                    Created:
                  </dt>
                  <dd className="w-2/3">{new Date(bomDetails.createdAt).toLocaleDateString()}</dd>
                </div>

                <div className="flex items-center">
                  <dt className="flex items-center gap-2 text-muted-foreground w-1/3">
                    <Clock size={14} />
                    Updated:
                  </dt>
                  <dd className="w-2/3">{new Date(bomDetails.lastUpdated).toLocaleDateString()}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Button variant="outline" className="w-full justify-start text-sm" size="sm">
                <FilePlus size={14} className="mr-2" />
                Create Production Order
              </Button>
              <Button variant="outline" className="w-full justify-start text-sm" size="sm">
                <History size={14} className="mr-2" />
                View Version History
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}