import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import { Modal } from 'react-bootstrap';
import { serverEndpoint } from '../../config/config';

function UserDashboard() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', role: '' });
  const [isEdit, setIsEdit] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [errors, setErrors] = useState({});

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${serverEndpoint}/users`, { withCredentials: true });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      setErrors({ message: 'Failed to fetch users' });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleModalShow = (edit = false, user = {}) => {
    setFormData(edit ? { ...user } : { name: '', email: '', role: '' });
    setIsEdit(edit);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setErrors({});
  };

  const handleDeleteModalShow = (id) => {
    setDeleteUserId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteModalClose = () => {
    setDeleteUserId(null);
    setShowDeleteModal(false);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${serverEndpoint}/users/${deleteUserId}`, { withCredentials: true });
      fetchUsers();
    } catch (err) {
      setErrors({ message: 'Delete failed' });
    } finally {
      handleDeleteModalClose();
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.role.trim()) newErrors.role = 'Role is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (isEdit) {
        await axios.put(`${serverEndpoint}/users/${formData._id}`, formData, { withCredentials: true });
      } else {
        await axios.post(`${serverEndpoint}/users`, formData, { withCredentials: true });
      }
      fetchUsers();
      handleModalClose();
    } catch (err) {
      setErrors({ message: 'Operation failed' });
    }
  };

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 2 },
    { field: 'role', headerName: 'Role', flex: 1 },
    {
      field: 'action', headerName: 'Actions', flex: 1, renderCell: (params) => (
        <>
          <IconButton onClick={() => handleModalShow(true, params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDeleteModalShow(params.row._id)}>
            <DeleteIcon />
          </IconButton>
        </>
      )
    }
  ];

  return (
    <div className="container py-4">
      <h2 className="text-center">Manage Users</h2>
      <div className="text-end mb-3">
        <button className="btn btn-primary btn-sm px-4 py-2" onClick={() => handleModalShow(false)}>Add User</button>
      </div>

      {errors.message && <div className="alert alert-danger">{errors.message}</div>}

      <div style={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={users}
          getRowId={(row) => row._id}
          columns={columns}
          pageSize={20}
          rowsPerPageOptions={[20, 50]}
          disableRowSelectionOnClick
        />
      </div>

      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? 'Edit User' : 'Add User'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input type="text" className={`form-control ${errors.name ? 'is-invalid' : ''}`} name="name" value={formData.name} onChange={handleChange} />
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} name="email" value={formData.email} onChange={handleChange} />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>
            <div className="mb-3">
              <label className="form-label">Role</label>
              <input type="text" className={`form-control ${errors.role ? 'is-invalid' : ''}`} name="role" value={formData.role} onChange={handleChange} />
              {errors.role && <div className="invalid-feedback">{errors.role}</div>}
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-success">{isEdit ? 'Update' : 'Create'}</button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      <Modal show={showDeleteModal} onHide={handleDeleteModalClose}>
        <Modal.Header closeButton><Modal.Title>Confirm Delete</Modal.Title></Modal.Header>
        <Modal.Body>Are you sure you want to delete this user?</Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={handleDeleteModalClose}>Cancel</button>
          <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default UserDashboard;
