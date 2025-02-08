import flowbite from "flowbite-react/tailwind";

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    flowbite.content(),
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		transitionProperty: {
  			'transform-colors': 'transform, colors'
  		},
  		backgroundColor: {
  			'custom-bg-light': '#f8fafc',
  			'custom-bg-lighter': '#fafbfc'
  		},
  		colors: {
  			'primary-text': '#202124',
  			'm-yellow': '#EFF87A',
  			'baby-blue': '#CFDCFF',
  			'coal-50': '#1b1c22',
  			'coal-100': '#15171c',
  			'coal-200': '#13141a',
  			'coal-300': '#111217',
  			'coal-400': '#0f1014',
  			'coal-500': '#0d0e12',
  			'coal-600': '#0b0c10',
  			'coal-black': '#000',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))'
  			},
  			'custom-blue': {
  				'50': '#e6f1ff',
  				'100': '#b3d7ff',
  				'200': '#80bdff',
  				'300': '#4da3ff',
  				'400': '#1a89ff',
  				'500': '#006fe6',
  				'600': '#0055b3',
  				'700': '#003c80',
  				'800': '#00234d',
  				'900': '#000a1a'
  			},
  			'custom-green': {
  				'50': '#e6f7f0',
  				'100': '#b3ebd1',
  				'200': '#80dfb2',
  				'300': '#4dd393',
  				'400': '#1ac774',
  				'500': '#00ad5a',
  				'600': '#008645',
  				'700': '#006030',
  				'800': '#00391b',
  				'900': '#001306'
  			},
  			'custom-gray': {
  				'50': '#f5f7fa',
  				'100': '#e1e5eb',
  				'200': '#cbd2dc',
  				'300': '#b5bdc6',
  				'400': '#9ca7b0',
  				'500': '#84919b',
  				'600': '#6b7280',
  				'700': '#4b5563',
  				'800': '#374151',
  				'900': '#1f2937'
  			},
  			'custom-red': {
  				'50': '#fff0f0',
  				'100': '#ffd1d1',
  				'200': '#ffb2b2',
  				'300': '#ff9393',
  				'400': '#ff7474',
  				'500': '#ff5555',
  				'600': '#cc4444',
  				'700': '#993333',
  				'800': '#662222',
  				'900': '#331111'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		boxShadow: {
  			'custom-light': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
  			'custom-medium': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  			'custom-dark': '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.08)'
  		}
  	}
  },
  plugins: [
    flowbite.plugin(),
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
  ],
};
