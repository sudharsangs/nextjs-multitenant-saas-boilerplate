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
		CircleUser,
		Contact
	} from 'lucide-svelte';

	const navItems = [
		{ href: '/dashboard', icon: Presentation, label: 'Dashboard' },
		{ href: '/dashboard/orders', icon: Container, label: 'Orders' },
		{ href: '/dashboard/customers', icon: UsersRound, label: 'Customers' },
		{ href: '/dashboard/inventory', icon: Box, label: 'Inventory' },
		{ href: '/dashboard/invoice', icon: Scroll, label: 'Invoices' },
		{ href: '/dashboard/warehouse', icon: Warehouse, label: 'Warehouse' }
	];

	const userNavItems = [
		{ href: '/dashboard/company', icon: Building2, label: 'Company' },
		{ href: '/dashboard/users', icon: Contact, label: 'Users' },
		{ href: '/dashboard/profile', icon: CircleUser, label: 'Profile' }
	];
</script>

<div class="flex h-screen">
	<div class="fixed w-64 bg-gray-800 text-white">
		<div class="p-4">
			<h1 class="text-2xl font-bold">Orderly</h1>
		</div>
		<div class="flex h-[95vh] flex-col justify-between">
			<nav class="mt-5">
				{#each navItems as { href, icon: Icon, label }}
					<a
						{href}
						class="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-700"
						class:bg-primary={page.url.pathname === href}
					>
						<Icon />
						{label}
					</a>
				{/each}
			</nav>
			<div>
				{#each userNavItems as { href, icon: Icon, label }}
					<a
						{href}
						class="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-700"
						class:bg-primary={page.url.pathname === href}
					>
						<Icon />
						{label}
					</a>
				{/each}
				<button class="mb-10 flex cursor-pointer items-center gap-2 px-4 py-2.5 hover:text-sky-100"
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
