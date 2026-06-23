import React from "react";

export interface DataColumn {
  key: string;
  label: string;
  align?: "left" | "center" | "right";
  width?: string | number;
  /** Custom cell renderer: (value, row) => node. */
  render?: (value: any, row: any) => React.ReactNode;
}

/**
 * @startingPoint section="Data" subtitle="Tabela de dados operacionais" viewport="700x320"
 */
export interface DataTableProps {
  columns: DataColumn[];
  rows: any[];
  /** Field used as React key. @default "id" */
  rowKey?: string;
  onRowClick?: (row: any) => void;
  emptyText?: string;
  style?: React.CSSProperties;
}

/**
 * Operational data table — uppercase header on soft blue, 64px rows, purple hover.
 */
export function DataTable(props: DataTableProps): JSX.Element;
