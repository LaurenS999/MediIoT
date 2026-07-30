import { useEffect, useEffectEvent, useState } from "react";

import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import {
  getUser,
  updateUser,
  createUser,
  deleteUser,
} from "../services/userService";

// ======================================================
// USE USER
// ======================================================
export const useUser = () => {
  const { user } = useAuth();
  // ======================================================
  // STATE
  // ======================================================
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [openModal, setOpenModal] = useState(false);

  const [errors, setErrors] = useState({});

  const [selectedUser, setSelectedUser] = useState(null);
  const [modalMode, setModalMode] = useState("create");

  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const [selectedDeleteUser, setSelectedDeleteUser] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [limitPage, setLimitPage] = useState(10);
  const [totalPage, setTotalPage] = useState(1);

  // ======================================================
  // FORM USER
  // ======================================================
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    role: "",
    status_aktif: 0,
    id_relasi: null,
    bertugas_di: null,
  });

  const [konfimrasiPassword, setKonfirmasiPassword] = useState("");

  // ======================================================
  // GET USERS
  // ======================================================
  const fetchUsers = async (page = 1, limit = 10) => {
    try {
      setLoading(true);

      const res = await getUser(search, page, limit);

      setCurrentPage(res.data.pagination.page);
      setTotalPage(res.data.pagination.totalPage);

      if (res.data.data.length < 1) {
        toast.info("data user kosong", { toastId: "user-kosong" });
      }
      setUsers(res.data.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const validasi = (mode) => {
    const newErrors = {};

    if (!newUser.username) {
      newErrors.username = "Username wajib diisi";
    }

    if (mode === "tambah") {
      if (!newUser.password) {
        newErrors.password_kosong = "Password wajib diisi";
      }
    }

    if (!newUser.role) {
      newErrors.role = "Role wajib dipilih";
    }

    if (newUser.username.length > 0) {
      const usernameRegex = /^[a-zA-Z0-9._]+$/;
      if (!usernameRegex.test(newUser.username)) {
        toast.error(
          "Username hanya boleh berisi huruf, angka, underscore (_), dan dot (.).",
        );
        newErrors.username = true;
      }

      if (newUser.username.length < 8) {
        toast.error("Username minimal 8 karakter");
        newErrors.username = true;
      }
    }

    if (newUser.password.length > 0) {
      if (newUser.password != konfimrasiPassword) {
        toast.error("password tidak sama dengan konfirmasi password");
        newErrors.password = true;
      }
    }

    if (newUser.password.length < 8) {
      toast.error("password minimal 8 karakter");
      newErrors.password = true;
    }

    if (newUser.role === 5 && !newUser.id_relasi) {
      newErrors.id_relasi = true;
      toast.error("User dengan role pasien wajib isi id pasien user");
    }

    if (newUser.role === 1 && !newUser.bertugas_di) {
      newErrors.bertugas_di = true;
      toast.error("User dengan role perawat wajib isi Bertugas di Ruangan");
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);

      if (newErrors.username || newErrors.role || newErrors.password_kosong) {
        toast.error("Data tidak boleh kosong");
      }
      return false;
    }

    return true;
  };

  // ======================================================
  // CREATE USER
  // ======================================================
  const handleTambahUser = async () => {
    setErrors({});

    if (!validasi("tambah")) return;

    try {
      await createUser(newUser);

      toast.success("User berhasil ditambahkan");

      // RESET FORM
      setNewUser({
        username: "",
        password: "",
        role: "",
        status_aktif: 0,
        id_relasi: null,
        bertugas_di: null,
      });
      setErrors({});
      // CLOSE MODAL
      setOpenModal(false);

      // REFRESH DATA
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  const handleUpdateUser = async () => {
    if (!validasi("ubah")) {
      return;
    }
    try {
      setErrors({});

      const newErrors = {};

      const response = await updateUser(selectedUser.id_user, newUser);

      toast.success(response?.data?.message);

      setOpenModal(false);
      setNewUser({
        username: "",
        password: "",
        role: "",
        status_aktif: 0,
        id_relasi: null,
        bertugas_di: null,
      });
      setErrors({});

      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  const handleSaveUser = async () => {
    if (modalMode === "create") {
      handleTambahUser();
    } else {
      handleUpdateUser();
    }
  };

  // ======================================================
  // DELETE USER
  // ======================================================
  const handleConfirmDelete = async () => {
    try {
      const response = await deleteUser(selectedDeleteUser.id_user, user.role);
      toast.success(response?.data?.message);
      setOpenDeleteModal(false);
      setSelectedDeleteUser(null);

      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  const handleOpenTambah = () => {
    setModalMode("create");

    setSelectedUser(null);

    setNewUser({
      username: "",
      password: "",
      role: "",
      status_aktif: 0,
      id_relasi: null,
      bertugas_di: null,
    });

    setOpenModal(true);
  };

  const handleOpenEdit = (userEdit) => {
    setModalMode("edit");

    setSelectedUser(userEdit);

    setNewUser({
      id_relasi: userEdit.id_relasi || null,
      bertugas_di: userEdit.bertugas_di || null,
      username: userEdit.username,
      password: "",
      role: userEdit.role,
      status_aktif: userEdit.status_aktif,
    });

    setOpenModal(true);
  };

  const handleOpenDelete = (user) => {
    setSelectedDeleteUser(user);

    setOpenDeleteModal(true);
  };

  // ======================================================
  // INIT
  // ======================================================
  useEffect(() => {
    fetchUsers(currentPage, limitPage);
  }, [search, currentPage]);

  return {
    users,
    search,
    setSearch,

    openModal,
    setOpenModal,

    newUser,
    setNewUser,
    konfimrasiPassword,
    setKonfirmasiPassword,

    errors,
    setErrors,
    modalMode,
    selectedUser,

    openDeleteModal,
    setOpenDeleteModal,

    selectedDeleteUser,

    currentPage,
    setCurrentPage,
    totalPage,

    handleOpenTambah,
    handleOpenEdit,
    handleOpenDelete,
    handleTambahUser,
    handleConfirmDelete,
    handleSaveUser,
  };
};
