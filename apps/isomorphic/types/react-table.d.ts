import '@tanstack/react-table';

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    handleDeleteRow?: (row: Row<TData>) => void;
    handleMultipleDelete?: (row: Row<TData>) => void;
     handleToggleBannerActive?: (id: string) => void;
    isToggling?: boolean;
  }
  interface ColumnMeta<TData extends RowData, TValue> {
    isColumnDraggable?: boolean;
  }
}
