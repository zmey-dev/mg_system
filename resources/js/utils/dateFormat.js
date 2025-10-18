/**
 * Format date to DD/MM/YYYY
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
export function formatDate(date) {
    if (!date) return '-';

    const d = new Date(date);

    // Check if date is valid
    if (isNaN(d.getTime())) return '-';

    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();

    return `${day}/${month}/${year}`;
}

/**
 * Format datetime to DD/MM/YYYY HH:MM
 * @param {string|Date} datetime - Datetime to format
 * @returns {string} Formatted datetime string
 */
export function formatDateTime(datetime) {
    if (!datetime) return '-';

    const d = new Date(datetime);

    // Check if date is valid
    if (isNaN(d.getTime())) return '-';

    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
}

/**
 * Format time to HH:MM
 * @param {string|Date} datetime - Datetime to format
 * @returns {string} Formatted time string
 */
export function formatTime(datetime) {
    if (!datetime) return '-';

    const d = new Date(datetime);

    // Check if date is valid
    if (isNaN(d.getTime())) return '-';

    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');

    return `${hours}:${minutes}`;
}
