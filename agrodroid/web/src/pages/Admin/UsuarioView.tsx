import { useState } from "react";
import DataTable, { type DataTableColumn } from "../../components/DataTable";
import ConfirmDialog from "../../components/ConfirmDialog";
import UsuarioModal from "../../modals/UsuarioModal";
import { empresasMock, usuariosMock } from "../../mockData";
import type { UsuarioAdmin } from "../../types/models";
import "../../styles/admin/shared.css";

function nombreEmpresa(empresaId: string): string {
  return empresasMock.find((e) => e.id === empresaId)?.nombre ?? "—";
}

export default function UsuarioView() {
  const [usuarios, setUsuarios] = useState<UsuarioAdmin[]>(usuariosMock);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState<UsuarioAdmin | null>(null);
  const [aEliminar, setAEliminar] = useState<UsuarioAdmin | null>(null);

  const columnas: DataTableColumn<UsuarioAdmin>[] = [
    { key: "nombre", label: "Nombre", render: (u) => u.nombre },
    { key: "correo", label: "Correo", render: (u) => <span className="mono-cell">{u.correo}</span> },
    { key: "rol", label: "Rol", render: (u) => u.rol },
    { key: "empresaNombre", label: "Empresa", render: (u) => u.empresaNombre },
    {
      key: "estado",
      label: "Estado",
      render: (u) => (
        <span className={`estado-pill ${u.estado === "Activo" ? "normal" : "offline"}`}>{u.estado}</span>
      ),
    },
  ];

  const handleNuevo = () => {
    setEditando(null);
    setModalAbierto(true);
  };

  const handleEditar = (usuario: UsuarioAdmin) => {
    setEditando(usuario);
    setModalAbierto(true);
  };

  const handleGuardar = (
    data: Omit<UsuarioAdmin, "id" | "empresaNombre"> & { contrasenia?: string }
  ) => {
    // La contraseña (data.contrasenia) no se persiste en este mock — al
    // conectar la API real, envíala solo cuando venga no-vacía.
    const { contrasenia: _contrasenia, ...resto } = data;
    const empresaNombre = nombreEmpresa(resto.empresaId);
    if (editando) {
      setUsuarios((prev) =>
        prev.map((u) => (u.id === editando.id ? { ...editando, ...resto, empresaNombre } : u))
      );
    } else {
      setUsuarios((prev) => [...prev, { ...resto, empresaNombre, id: crypto.randomUUID() }]);
    }
    setModalAbierto(false);
  };

  const handleEliminarConfirmado = () => {
    if (aEliminar) setUsuarios((prev) => prev.filter((u) => u.id !== aEliminar.id));
    setAEliminar(null);
  };

  return (
    <div className="admin-view">
      <div className="admin-view__header">
        <div>
          <h1>Usuarios</h1>
          <p className="view-header__sub">Gestiona las cuentas de acceso a la plataforma</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={handleNuevo}>
          + Nuevo usuario
        </button>
      </div>

      <DataTable
        columns={columnas}
        rows={usuarios}
        searchKeys={["nombre", "correo", "empresaNombre"]}
        onEdit={handleEditar}
        onDelete={setAEliminar}
        emptyMessage="No hay usuarios registrados."
      />

      <UsuarioModal
        open={modalAbierto}
        usuario={editando}
        onGuardar={handleGuardar}
        onClose={() => setModalAbierto(false)}
      />

      <ConfirmDialog
        open={aEliminar !== null}
        message={`¿Seguro que quieres eliminar al usuario "${aEliminar?.nombre}"? Esta acción no se puede deshacer.`}
        onConfirm={handleEliminarConfirmado}
        onCancel={() => setAEliminar(null)}
      />
    </div>
  );
}