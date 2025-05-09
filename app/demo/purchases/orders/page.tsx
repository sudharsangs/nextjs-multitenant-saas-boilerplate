import React from "react";

// Mock data for purchase orders
const mockPurchaseOrders = [
	{
		id: "PO-2025-001",
		vendor: "Tech Supplies Inc.",
		date: "2025-04-28",
		deliveryDate: "2025-05-15",
		total: 2450.75,
		status: "Pending",
		items: 12,
	},
	{
		id: "PO-2025-002",
		vendor: "Office Essentials",
		date: "2025-05-01",
		deliveryDate: "2025-05-10",
		total: 1890.25,
		status: "Approved",
		items: 8,
	},
	{
		id: "PO-2025-003",
		vendor: "Raw Materials Co.",
		date: "2025-05-03",
		deliveryDate: "2025-05-18",
		total: 5670.0,
		status: "Delivered",
		items: 5,
	},
	{
		id: "PO-2025-004",
		vendor: "Global Packaging Ltd.",
		date: "2025-05-05",
		deliveryDate: "2025-05-20",
		total: 3245.5,
		status: "Pending",
		items: 15,
	},
	{
		id: "PO-2025-005",
		vendor: "Equipment Specialists",
		date: "2025-05-07",
		deliveryDate: "2025-06-01",
		total: 12750.0,
		status: "Approved",
		items: 3,
	},
];

export default function PurchaseOrdersPage() {
	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-semibold">Purchase Orders</h1>
				<button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90">
					Create Order
				</button>
			</div>

			<div className="bg-card rounded-lg shadow p-6">
				<div className="text-card-foreground">
					<p className="mb-4">Manage your purchase orders here.</p>

					{mockPurchaseOrders.length > 0 ? (
						<div className="overflow-x-auto">
							<table className="w-full text-sm">
								<thead>
									<tr className="bg-muted/50">
										<th className="px-4 py-3 text-left font-medium">
											Order ID
										</th>
										<th className="px-4 py-3 text-left font-medium">
											Vendor
										</th>
										<th className="px-4 py-3 text-left font-medium">
											Order Date
										</th>
										<th className="px-4 py-3 text-left font-medium">
											Delivery Date
										</th>
										<th className="px-4 py-3 text-left font-medium">
											Items
										</th>
										<th className="px-4 py-3 text-left font-medium">
											Total
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
									{mockPurchaseOrders.map((order) => (
										<tr
											key={order.id}
											className="border-b hover:bg-muted/50"
										>
											<td className="px-4 py-3 font-medium">{order.id}</td>
											<td className="px-4 py-3">{order.vendor}</td>
											<td className="px-4 py-3">{order.date}</td>
											<td className="px-4 py-3">{order.deliveryDate}</td>
											<td className="px-4 py-3">{order.items}</td>
											<td className="px-4 py-3">
												${order.total.toFixed(2)}
											</td>
											<td className="px-4 py-3">
												<span
													className={`inline-block px-2 py-1 text-xs rounded-full ${
														order.status === "Approved"
															? "bg-green-100 text-green-800"
															: order.status === "Pending"
															? "bg-yellow-100 text-yellow-800"
															: "bg-blue-100 text-blue-800"
													}`}
												>
													{order.status}
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
							<h3 className="text-lg font-medium mb-2">
								No purchase orders found
							</h3>
							<p className="text-muted-foreground mb-4">
								Get started by creating your first purchase order.
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}