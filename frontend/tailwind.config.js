/** @type {import('tailwindcss').Config} */ 
export default {
    darkMode: ["class"],
    content: [
    "./index.html",
"./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		height: {
  			'custom-height': '555px',
  			'registration-page': '639px'
  		},
  		colors: {
  			black: '#000000',
  			white: '#fdfdfd',
  			blue: '#0096FF',
  			violet: '#7f00ff',
  			silver: '#232B2B',
  			lightViolet: '#CF9FFF',
  			orange: '#ff8134',
  			baseBaground: '#636363',
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
  			}
  		},
  		fontFamily: {
  			sans: ['Plus Jakarta Sans"', 'sans-serif']
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	},
  	keyframes: {
  		'slide-down': {
  			'0%': {
  				transform: 'translateY(-1000%)',
  				opacity: '0'
  			},
  			'100%': {
  				transform: 'translateY(100)',
  				opacity: '1'
  			}
  		},
  		jiggle: {
  			'0%, 100%': {
  				transform: 'translateX(0)'
  			},
  			'35%': {
  				transform: 'translateX(-5px)'
  			},
  			'65%': {
  				transform: 'translateX(5px)'
  			}
  		},
  		tada: {
  			'0%': {
  				transform: 'scale(1)'
  			},
  			'5%, 15%, 25%, 35%, 45%, 55%, 65%, 75%, 85%, 95%': {
  				transform: 'scale(0.9) rotate(-3deg)'
  			},
  			'10%, 20%, 30%, 40%, 50%, 60%, 70%, 80%, 90%': {
  				transform: 'scale(1.1) rotate(3deg)'
  			},
  			'100%': {
  				transform: 'scale(1) rotate(0deg)'
  			}
  		},
  		zoomOut: {
  			'0%': {
  				transform: 'scale(1)'
  			},
  			'100%': {
  				transform: 'scale(0)'
  			}
  		},
  		zoomIn: {
  			'0%': {
  				transform: 'scale(0.5)'
  			},
  			'100%': {
  				transform: 'scale(1)'
  			}
  		}
  	},
  	animation: {
  		'slide-down': 'slide-down .800s ease-out',
  		jiggle: 'jiggle 0.5s ease-in-out infinite',
  		tada: 'tada 1s ease-in-out infinite',
  		zoomOut: 'zoomOut 1s ease-out forwards',
  		zoomIn: 'zoomIn 0.2s ease-out forwards'
  	},
  	boxShadow: {
  		'custom-black': '1px 4px 30px 4px #000000'
  	}
  },
  plugins: [require("tailwindcss-animate")],
}