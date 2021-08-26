interface ToastOptions {
	title: string;
	duration: number;
	mask: boolean;
	icon?: 'success' | 'error' | 'loading' | 'none';
	image?: string;
}

interface LoadingOption extends Omit<ToastOptions, 'duration'> {
	duration?: number;
}

interface CustomToastOptions extends Omit<LoadingOption, 'mask'> {
	mask?: boolean;
}
