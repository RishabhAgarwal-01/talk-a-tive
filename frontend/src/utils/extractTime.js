export function extractTime(dateString) {
    const date = new Date(dateString);

    const day = padZero(date.getDate());
    const month = padZero(date.getMonth() + 1); // Months are 0-indexed
    const year = date.getFullYear();
    
    const hours = padZero(date.getHours());
    const minutes = padZero(date.getMinutes());

    return `${day}/${month}/${year} ${hours}:${minutes}`;
}

// Helper function to pad single-digit numbers with a leading zero
function padZero(number) {
    return number.toString().padStart(2, "0");
}
