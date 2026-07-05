import { useEffect, useState } from "react";
import DataTable, { type DataTableColumn } from "../../components/DataTable";
import ConfirmDialog from "../../components/ConfirmDialog";
import UsuarioModal from "../../modals/UsuarioModal";
import { api } from "../../services/api";
import type { EmpresaAdmin, UsuarioAdmin } from "../../types/models";
import "../../styles/Admin/Shared.css";

type ApiUsuario = {
  idusuario: number;
  nombreusuario: string;
  correo: string;
  rol: string;
  empresa_idempresa: number;
  nombreempresa: string;
};

const mapUsuario = (a: ApiUsuario): UsuarioAdmin => ({
  id: String(a.idusuario),
  nombre: a.nombreusuario,
  correo: a.correo,
  rol: a.rol,
  empresaId: String(a.empresa_idempresa),
  empresaNombre: a.nombreempresa,
});

export default function TiCuentas() {
  const [usuarios, setUsuarios] = useState<UsuarioAdmin[]>([]);
  const [empresas, setEmpresas] = useState<EmpresaAdmin[]>([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState<UsuarioAdmin | null>(null);
  const [aEliminar, setAEliminar] = useState<UsuarioAdmin | null>(null);

  const cargar = async () => {
    try {
      const [uData, eData] = await Promise.all([
        api.get("/usuarios") as Promise<ApiUsuario[]>,
        api.get("/empresas") as Promise<{ idempresa: number; nombreempresa: string }[]>,
      ]);
      setUsuarios(uData.map(mapUsuario));
      setEmpresas(
        eData.map((e) => ({ id: String(e.idempresa), nombre: e.nombreempresa, ruc: "", direccion: "" }))
      );
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const columnas: DataTableColumn<UsuarioAdmin>[] = [
    { key: "nombre", label: "Nombre", render: (u) => u.nombre },
    { key: "correo", label: "Correo", render: (u) => <span className="mono-cell">{u.correo}</span> },
    { key: "rol", label: "Rol", render: (u) => u.rol },
    { key: "empresaNombre", label: "Empresa", render: (u) => u.empresaNombre },
  ];

  const handleNuevo = () => {
    setEditando(null);
    setModalAbierto(true);
  };

  const handleEditar = (usuario: UsuarioAdmin) => {
    setEditando(usuario);
    setModalAbierto(true);
  };

  const handleGuardar = async (data: {
    nombre: string;
    correo: string;
    contrasenia: string;
    rol: string;
    empresaId: string;
  }) => {
    try {
      if (editando) {
        const body: Record<string, unknown> = {
          nombreUsuario: data.nombre,
          correo: data.correo,
          rol: data.rol,
          Empresa_idEmpresa: Number(data.empresaId),
        };
        if (data.contrasenia) body.contrasenia = data.contrasenia;
        await api.put(`/usuarios/${editando.id}`, body);
      } else {
        await api.post("/usuarios", {
          nombreUsuario: data.nombre,
          correo: data.correo,
          contrasenia: data.contrasenia,
          rol: data.rol,
          Empresa_idEmpresa: Number(data.empresaId),
        });
      }
      await cargar();
      setModalAbierto(false);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error al guardar usuario");
    }
  };

  const handleEliminarConfirmado = async () => {
    if (!aEliminar) return;
    try {
      await api.del(`/usuarios/${aEliminar.id}`);
      await cargar();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error al eliminar usuario");
    }
    setAEliminar(null);
  };

  return (
    <div className="admin-view">
      <div className="admin-view__header">
        <div>
          <h1>Cuentas de usuario</h1>
          <p className="view-header__sub">TI: alta, edición y baja de cuentas de acceso</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={handleNuevo}>
          + Nueva cuenta
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
        empresas={empresas}
        onGuardar={handleGuardar}
        onClose={() => setModalAbierto(false)}
      />

      <ConfirmDialog
        open={aEliminar !== null}
        message={`¿Seguro que quieres dar de baja al usuario "${aEliminar?.nombre}"?`}
        onConfirm={handleEliminarConfirmado}
        onCancel={() => setAEliminar(null)}
      />
    </div>
  );
}