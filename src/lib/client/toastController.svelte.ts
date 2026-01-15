export let toast: {
	text: string;
	duration: number;
} = $state({
	text: "",
	duration: 3000
});

let timeout: NodeJS.Timeout;

export const showToast = (text: string, duration: number = 3000) => {
	clearTimeout(timeout);
	toast.text = text;
	toast.duration = duration;

	timeout = setTimeout(() => {
		toast.text = "";
	}, toast.duration);
};
