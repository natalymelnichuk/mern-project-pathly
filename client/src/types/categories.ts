
export interface ManageCategoriesModalProps {
    isOpen: boolean;
    onClose: () => void;
    userCategories: string[];
    onAddCategory: (newCategory: string) => Promise<void> | void;
    onDeleteCategory: (categoryToDelete: string) => Promise<void> | void;
}