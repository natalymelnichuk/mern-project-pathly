
// Превращает "Summer Vacation in Rome!" -> "summer-vacation-in-rome"
export const slugify = (text: string): string => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove all non-word characters except spaces and dashes
        .replace(/[\s_-]+/g, '-')  // Replace spaces and underscores with a single dash
        .replace(/^-+|-+$/g, '');   // Trim dashes from the beginning and end
};