/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	// Ensure these dynamic classes aren't purged during build
	safelist: [
		'text-white',
		'text-neutral-900'
	],
	theme: {
		extend: {
			keyframes: {
				// small rotation wiggle
			
				// vertical bounce
				minbounce: {
					'0%, 100%': {
						transform: 'translateY(0)',
						animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)'
					},
					'50%': {
						transform: 'translateY(-05%)',
						animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)'
					},
				},
			},
			animation: {
				minbounce: 'minbounce 1s infinite'
			},
		},
	},
	plugins: [],
}
