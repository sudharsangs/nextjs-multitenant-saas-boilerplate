<script>
	import Login from '$components/modules/auth/login.svelte';
	import Register from '$components/modules/auth/register.svelte';

	let currentRoute = 'login';
</script>

<div class="flex min-h-screen w-full items-center justify-center">
	<div class="relative w-1/2">
		<div class="absolute inset-0 bg-black opacity-50"></div>
		<img src="/home.avif" alt="Home" class="h-screen w-full object-cover" />
		<div class="absolute inset-0 flex items-center justify-center">
			<div class="text-center text-white">
				<h1
					class="mb-4 bg-gradient-to-r from-teal-300 via-indigo-300 to-blue-300 bg-clip-text text-4xl font-bold text-transparent"
				>
					Welcome to Orderly
				</h1>
				<p class="text-lg">Your efficient order management system</p>
				<ul class="mt-4 space-y-2">
					<li class="text-teal-500">Track orders in real-time</li>
					<li class="text-amber-600">Manage inventory seamlessly</li>
					<li class="text-sky-200">Generate detailed reports</li>
					<li class="text-gray-100">Ensure customer satisfaction</li>
				</ul>
			</div>
		</div>
	</div>
	<div class="w-1/2">
		{#if currentRoute === 'login'}
			<Login />
			<p class="mt-4 text-center">
				Don't have an account? <button class="cursor-pointer text-blue-800"
					on:click={() => {
						currentRoute = 'register';
					}}>Register</button
				>
			</p>
		{:else}
			<Register />
			<p class="mt-4 text-center">
				Already have an account? <button
          class="cursor-pointer text-blue-800"
					on:click={() => {
						currentRoute = 'login';
					}}>Login</button
				>
			</p>
		{/if}
	</div>
</div>
