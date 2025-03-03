<script lang="ts">
	import { page } from '$app/state';
	import {
		Warehouse,
		Box,
		Container,
		Scroll,
		Presentation,
		UsersRound,
		Power,
		Building2,

		CircleUser

	} from 'lucide-svelte';
</script>

<div class="flex h-screen">
	<div class="fixed w-64 bg-gray-800 text-white">
		<div class="p-4">
			<h1 class="text-2xl font-bold">Orderly</h1>
		</div>
		<div class="flex h-[95vh] flex-col justify-between">
			<nav class="mt-5">
				<a
					href="/dashboard"
					class="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-700"
					class:bg-primary={page.url.pathname === '/dashboard'}
				>
					<Presentation />
					Dashboard
				</a>
				<a
					href="/dashboard/orders"
					class="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-700"
					class:bg-primary={page.url.pathname === '/dashboard/orders'}
				>
					<Container />
					Orders
				</a>
				<a
					href="/dashboard/customers"
					class="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-700"
					class:bg-primary={page.url.pathname === '/dashboard/customers'}
				>
					<UsersRound />
					Customers
				</a>
				<a
					href="/dashboard/inventory"
					class="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-700"
					class:bg-primary={page.url.pathname === '/dashboard/inventory'}
				>
					<Box />
					Inventory
				</a>
				<a
					href="/dashboard/invoice"
					class="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-700"
					class:bg-primary={page.url.pathname === '/dashboard/invoice'}
				>
					<Scroll />
					Invoices
				</a>
				<a
					href="/dashboard/warehouse"
					class="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-700"
					class:bg-primary={page.url.pathname === '/dashboard/warehouse'}
				>
					<Warehouse />
					Warehouse
				</a>
			</nav>
			<div>
				<a href="/dashboard/company" class="flex items-center gap-2 px-4 py-2.5 hover:text-sky-200">
					<Building2 />
					Company
				</a>
				<a href="/dashboard/profile" class="flex items-center gap-2 px-4 py-2.5 hover:text-sky-200">
					<CircleUser />
					Profile
				</a>
				<button class="mb-10 flex cursor-pointer items-center gap-2 px-4 py-2.5 hover:text-sky-200"
					><Power />Logout
				</button>
			</div>
		</div>
	</div>
	<div class="w-64"></div>
	<div class="flex-1 bg-gray-100 p-6">
		<slot></slot>
	</div>
</div>
