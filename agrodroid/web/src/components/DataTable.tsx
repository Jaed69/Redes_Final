import { useMemo, useState } from "react";
import "../styles/Admin/Shared.css";

export interface DataTableColumn<T> {
  key: string;
  label: string;
  render: (row: T) => React.ReactNode;
}

interface DataTableProps<T extends { id: string }> {
  columns: DataTableColumn<T>[];
  rows: T[];
  /** Campos sobre los que buscar (deben ser strings o convertibles a string). */
  searchKeys: (keyof T)[];
  onEdit: (row: T) => void;
  onDelete: (row: T) => void;
  pageSize?: number;
  emptyMessage?: string;
}

/**
 * Tabla CRUD genérica: búsqueda + paginación + columna de acciones fija.
 * Cada Vista solo define sus columnas y le pasa el arreglo mock actual.
 */
export default function DataTable<T extends { id: string }>({
  columns,
  rows,
  searchKeys,
  onEdit,
  onDelete,
  pageSize = 5,
  emptyMessage = "No hay registros.",
}: DataTableProps<T>) {
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);

  const filtradas = useMemo(() => {
    if (!busqueda.trim()) return rows;
    const q = busqueda.trim().toLowerCase();
    return rows.filter((row) =>
      searchKeys.some((key) => String(row[key] ?? "").toLowerCase().includes(q))
    );
  }, [rows, busqueda, searchKeys]);

  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / pageSize));
  const paginaActual = Math.min(pagina, totalPaginas);
  const inicio = (paginaActual - 1) * pageSize;
  const visibles = filtradas.slice(inicio, inicio + pageSize);

  return (
    <div className="panel">
      <div className="table-toolbar">
        <div className="table-toolbar__search">
          <input
            type="text"
            placeholder="Buscar..."
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setPagina(1);
            }}
          />
        </div>
        <span className="table-toolbar__count">{filtradas.length} registros</span>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {visibles.map((row) => (
              <tr key={row.id}>
                {columns.map((col) => (
                  <td key={col.key}>{col.render(row)}</td>
                ))}
                <td>
                  <div className="table-actions">
                    <button
                      type="button"
                      className="table-actions__edit"
                      onClick={() => onEdit(row)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="table-actions__delete"
                      onClick={() => onDelete(row)}
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {visibles.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="empty-hint">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="table-pagination">
        <span className="table-pagination__info">
          Página {paginaActual} de {totalPaginas}
        </span>
        <div className="table-pagination__controls">
          <button type="button" disabled={paginaActual === 1} onClick={() => setPagina((p) => p - 1)}>
            ‹
          </button>
          <span className="table-pagination__page">
            {paginaActual} / {totalPaginas}
          </span>
          <button
            type="button"
            disabled={paginaActual === totalPaginas}
            onClick={() => setPagina((p) => p + 1)}
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}