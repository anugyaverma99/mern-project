import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import { serverEndpoint } from '../../config/config';
import { Modal } from 'react-bootstrap';
import AssessmentIcon from '@mui/icons-material/Assessment';
import {usePermission} from '../../rbac/permissions';
import {useNavigate} from 'react-router-dom';

function LinkDashBoard() {
  const navigate=useNavigate();
  const permission=usePermission();
  const [errors, setErrors] = useState({});
  const [linksData, setLinksData] = useState([]);
  const [formData, setFormData] = useState({
    campaignTitle: '',
    originalUrl: '',
    category: ''
  });
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);


  const handleModalShow = (isEdit, data = {}) => {
    if (isEdit) {
      setFormData({
        id: data._id,
        campaignTitle: data.campaignTitle,
        originalUrl: data.originalUrl,
        category: data.category
      });
    } else {
      setFormData({
        campaignTitle: '',
        originalUrl: '',
        category: ''
      });
    }
    setIsEdit(isEdit);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleDeleteModalShow = (linkId) => {
    setFormData({
      id: linkId
    });
    setShowDeleteModal(true);
  };

  const handleDeleteModalClose = () => {
    setShowDeleteModal(false);
  };

  const handleDeleteSubmit = async () => {
    try {
      await axios.delete(`${serverEndpoint}/links/${formData.id}`, { withCredentials: true });
      setFormData({
        campaignTitle: '',
        originalUrl: '',
        category: ''
      });
      fetchLinks();
    } catch (error) {
      setErrors({ message: 'Something went wrong, please try again' });
    } finally {
      handleDeleteModalClose();
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = () => {
    let newErrors = {};
    let isValid = true;

    if (!formData.campaignTitle.trim()) {
      newErrors.campaignTitle = 'Campaign Title is mandatory';
      isValid = false;
    }
    if (!formData.originalUrl.trim()) {
      newErrors.originalUrl = 'Original URL is mandatory';
      isValid = false;
    }
    if (!formData.category.trim()) {
      newErrors.category = 'Category is mandatory';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const body = {
      campaign_title: formData.campaignTitle,
      original_url: formData.originalUrl,
      category: formData.category
    };
    const config = { withCredentials: true };

    try {
      if (isEdit) {
        await axios.put(`${serverEndpoint}/links/${formData.id}`, body, config);
      } else {
        await axios.post(`${serverEndpoint}/links`, body, config);
      }

      setFormData({ campaignTitle: '', originalUrl: '', category: '' });
      fetchLinks();
    } catch (error) {
      if(error.respnse?.data?.code==='INSUFFICIENT_FUNDS'){
        setErrors({
          message: 'You do not have enough credits to perform this action. Add fund to your accounts using Manage Payments option'
        });
      }
      else{
      setErrors({ message: 'Something went wrong, please try again' });
    }
   } finally {
      handleModalClose();
    }
  };

  const fetchLinks = async () => {
    try {
      const response = await axios.get(`${serverEndpoint}/links`, { withCredentials: true });
      setLinksData(response.data.data);
    } catch (error) {
      console.log(error);
      setErrors({ message: 'Unable to fetch links at the moment, please try again' });
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const columns = [
    { field: 'campaignTitle', headerName: 'Campaign', flex: 2 },
    { field: 'originalUrl', headerName: 'URL',flex: 3, renderCell: (params) => (
        <a href={`${serverEndpoint}/links/r/${params.row._id}`}
        target="_blank" rel="noopener noreferrer">
            {params.row.originalUrl}
             </a>
              ),

    },
    { field: 'originalUrl', headerName: 'URL', flex: 3 },
    { field: 'category', headerName: 'Category', flex: 2 },
    { field: 'clickCount', headerName: 'Clicks', flex: 1 },
    {
      field: 'action',
      headerName: 'Action',
      width: 100,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleModalShow(true, params.row)}>
            <EditIcon onClick={()=>handleModalShow(true,params.row)}/>
          </IconButton>
          <IconButton onClick={() => handleDeleteModalShow(params.row._id)}>
            <DeleteIcon onclick={()=>handleDeleteModalShow(params.row._id)} />
          </IconButton>

          {permission.canViewLink && (
            <IconButton>
              <AssessmentIcon onClick={()=>{
                navigate(`/analytics/${params.row._id}`);
              }}/>

            </IconButton>

          )}
        </>
      ),
    },
  ];

  return (
    <div className="container py-4">
      <h2 className="text-center">Manage Affiliate Links</h2>
      <div className="text-end mb-3">
        <button className='btn btn-primary btn-sm px-4 py-2 rounded shadow' onClick={() => handleModalShow(false)}>Add Link</button>
      </div>

      {errors.message && <div className="alert alert-danger">{errors.message}</div>}

      <div style={{ height: 500, width: '100%' }}>
        <DataGrid
          getRowId={(row) => row._id}
          rows={linksData}
          columns={columns}
          initialState={{ pagination: { paginationModel: { pageSize: 20, page: 0 } } }}
          pageSizeOptions={[20, 50, 100]}
          disableRowSelectionOnClick
          sx={{ fontFamily: 'inherit' }}
        />
      </div>

      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? 'Edit Link' : 'Add Link'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="campaignTitle" className="form-label">Campaign Title</label>
              <input
                type="text"
                className={`form-control ${errors.campaignTitle ? 'is-invalid' : ''}`}
                id="campaignTitle"
                name="campaignTitle"
                value={formData.campaignTitle}
                onChange={handleChange}
              />
              {errors.campaignTitle && <div className="invalid-feedback">{errors.campaignTitle}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="originalUrl" className="form-label">Original URL</label>
              <input
                type="text"
                className={`form-control ${errors.originalUrl ? 'is-invalid' : ''}`}
                id="originalUrl"
                name="originalUrl"
                value={formData.originalUrl}
                onChange={handleChange}
              />
              {errors.originalUrl && <div className="invalid-feedback">{errors.originalUrl}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="category" className="form-label">Category</label>
              <input
                type="text"
                className={`form-control ${errors.category ? 'is-invalid' : ''}`}
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              />
              {errors.category && <div className="invalid-feedback">{errors.category}</div>}
            </div>

            <div className="d-grid">
              <button type="submit" className="btn btn-primary">Submit</button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
  <Modal.Header closeButton>
    <Modal.Title>Confirm Delete</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    Are you sure you want to delete this link?
  </Modal.Body>
  <Modal.Footer>
    <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
      Cancel
    </button>
    <button className="btn btn-danger" onClick={handleDeleteSubmit}>
      Delete
    </button>
  </Modal.Footer>
</Modal>

    </div>
  );
}

export default LinkDashBoard;