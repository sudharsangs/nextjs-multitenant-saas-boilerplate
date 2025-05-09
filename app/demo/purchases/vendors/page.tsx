"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

// Mock vendors data
const mockVendors = [
	{
		id: "V-001",
		name: "Tech Supplies Inc.",
		contactPerson: "John Smith",
		email: "john@techsupplies.com",
		phone: "+1 (555) 123-4567",
		address: "123 Tech Street, San Francisco, CA 94107",
		status: "Active",
		category: "Electronics",
		lastOrderDate: "2025-05-01",
		paymentTerms: "Net 30",
		rating: 4.8,
	},
	{
		id: "V-002",
		name: "Office Essentials",
		contactPerson: "Sarah Johnson",
		email: "sarah@officeessentials.com",
		phone: "+1 (555) 234-5678",
		address: "456 Office Avenue, Chicago, IL 60601",
		status: "Active",
		category: "Furniture",
		lastOrderDate: "2025-04-28",
		paymentTerms: "Net 15",
		rating: 4.5,
	},
	{
		id: "V-003",
		name: "Raw Materials Co.",
		contactPerson: "Michael Chen",
		email: "michael@rawmaterials.com",
		phone: "+1 (555) 345-6789",
		address: "789 Industrial Blvd, Houston, TX 77002",
		status: "Active",
		category: "Raw Materials",
		lastOrderDate: "2025-05-03",
		paymentTerms: "Net 45",
		rating: 4.2,
	},
	{
		id: "V-004",
		name: "Global Packaging Ltd.",
		contactPerson: "Emma Roberts",
		email: "emma@globalpackaging.com",
		phone: "+1 (555) 456-7890",
		address: "1010 Packaging Drive, Seattle, WA 98101",
		status: "Inactive",
		category: "Packaging",
		lastOrderDate: "2025-04-15",
		paymentTerms: "Net 30",
		rating: 3.9,
	},
	{
		id: "V-005",
		name: "Equipment Specialists",
		contactPerson: "David Wong",
		email: "david@equipmentspec.com",
		phone: "+1 (555) 567-8901",
		address: "555 Machine Road, Detroit, MI 48201",
		status: "Active",
		category: "Equipment",
		lastOrderDate: "2025-05-07",
		paymentTerms: "Net 30",
		rating: 4.7,
	},
];

export default function VendorsPage() {
	const [searchTerm, setSearchTerm] = useState("");
	const [showActiveOnly] = useState(false);

	// Filter vendors based on search and active status
	const filteredVendors = mockVendors.filter((vendor) =>
		(!showActiveOnly || vendor.status === "Active") &&
		(vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
		vendor.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()))
	);

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-semibold">Vendors</h1>
				<Button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90">
					Add Vendor
				</Button>
			</div>

			<div className="bg-card rounded-lg shadow p-6">
				<div className="text-card-foreground">
					<div className="flex justify-between items-center mb-4">
						<p>Manage your vendors and suppliers here.</p>
						<div className="flex gap-2">
							<input
								type="text"
								placeholder="Search vendors..."
								className="px-3 py-2 border rounded-md text-sm"
							/>
							<select className="px-3 py-2 border rounded-md text-sm">
								<option value="">All Categories</option>
								<option value="electronics">Electronics</option>
								<option value="furniture">Furniture</option>
								<option value="raw-materials">Raw Materials</option>
								<option value="packaging">Packaging</option>
								<option value="equipment">Equipment</option>
							</select>
						</div>
					</div>

					{filteredVendors.length > 0 ? (
						<div className="overflow-x-auto">
							<table className="w-full text-sm">
								<thead>
									<tr className="bg-muted/50">
										<th className="px-4 py-3 text-left font-medium">
											Vendor ID
										</th>
										<th className="px-4 py-3 text-left font-medium">
											Name
										</th>
										<th className="px-4 py-3 text-left font-medium">
											Contact Person
										</th>
										<th className="px-4 py-3 text-left font-medium">
											Email
										</th>
										<th className="px-4 py-3 text-left font-medium">
											Phone
										</th>
										<th className="px-4 py-3 text-left font-medium">
											Category
										</th>
										<th className="px-4 py-3 text-left font-medium">
											Status
										</th>
										<th className="px-4 py-3 text-left font-medium">
											Actions
										</th>
									</tr>
								</thead>
								<tbody>
									{filteredVendors.map((vendor) => (
										<tr
											key={vendor.id}
											className="border-b hover:bg-muted/50"
										>
											<td className="px-4 py-3 font-medium">{vendor.id}</td>
											<td className="px-4 py-3">{vendor.name}</td>
											<td className="px-4 py-3">{vendor.contactPerson}</td>
											<td className="px-4 py-3">{vendor.email}</td>
											<td className="px-4 py-3">{vendor.phone}</td>
											<td className="px-4 py-3">{vendor.category}</td>
											<td className="px-4 py-3">
												<span
													className={`inline-block px-2 py-1 text-xs rounded-full ${
														vendor.status === "Active"
															? "bg-green-100 text-green-800"
															: "bg-gray-100 text-gray-800"
													}`}
												>
													{vendor.status}
												</span>
											</td>
											<td className="px-4 py-3">
												<div className="flex space-x-2">
													<button className="text-blue-600 hover:text-blue-800">
														View
													</button>
													<button className="text-gray-600 hover:text-gray-800">
														Edit
													</button>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					) : (
						<div className="border rounded-md p-8 text-center">
							<h3 className="text-lg font-medium mb-2">No vendors found</h3>
							<p className="text-muted-foreground mb-4">
								{searchTerm
									? "No vendors match your search criteria."
									: "Get started by adding your first vendor."}
							</p>
							{searchTerm && (
								<Button
									variant="outline"
									onClick={() => setSearchTerm("")}
								>
									Clear Search
								</Button>
							)}
						</div>
					)}

					{/* Additional vendor statistics */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
						<div className="bg-muted/20 p-4 rounded-md">
							<h3 className="font-medium mb-1">Total Vendors</h3>
							<p className="text-2xl font-bold">
								{mockVendors.length}
							</p>
							<p className="text-xs text-muted-foreground">
								Across{" "}
								{new Set(mockVendors.map((v) => v.category)).size} categories
							</p>
						</div>
						<div className="bg-muted/20 p-4 rounded-md">
							<h3 className="font-medium mb-1">Active Vendors</h3>
							<p className="text-2xl font-bold">
								{
									mockVendors.filter((v) => v.status === "Active").length
								}
							</p>
							<p className="text-xs text-muted-foreground">
								Ready for ordering
							</p>
						</div>
						<div className="bg-muted/20 p-4 rounded-md">
							<h3 className="font-medium mb-1">Avg. Vendor Rating</h3>
							<p className="text-2xl font-bold">
								{(
									mockVendors.reduce((sum, v) => sum + v.rating, 0) /
									mockVendors.length
								).toFixed(1)}
								/5
							</p>
							<p className="text-xs text-muted-foreground">
								Based on delivery and quality metrics
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}