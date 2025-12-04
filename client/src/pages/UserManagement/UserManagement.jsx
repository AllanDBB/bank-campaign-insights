import React, { useState, useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Select, MenuItem, Button, Alert } from '@mui/material';
import apiClient from '../../services/api';
import s from './UserManagement.module.css';
import PermissionEditor from './components/PermissionEditor';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newUser, setNewUser] = useState({ name: '', lastname: '', email: '', password: '', role: 'ejecutivo' });
  const [ejecutivoPerms, setEjecutivoPerms] = useState({});
  const [gerentePerms, setGerentePerms] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUsers();
    fetchPermissions();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await apiClient.get('/users');
      setUsers(response.data.data);
    } catch (err) {
      setError('Error fetching users');
      console.error(err);
    }
  };

  const fetchPermissions = async () => {
    try {
      const [ejResponse, gerResponse] = await Promise.all([
        apiClient.get('/rbac/roles/ejecutivo/permissions'),
        apiClient.get('/rbac/roles/gerente/permissions')
      ]);
      if (ejResponse.data.permissions) {
        setEjecutivoPerms(ejResponse.data.permissions);
      }
      if (gerResponse.data.permissions) {
        setGerentePerms(gerResponse.data.permissions);
      }
    } catch (err) {
      console.error('Error fetching permissions:', err);
      // Don't show error if it's just initial load
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.lastname || !newUser.email || !newUser.password) {
      setError('All fields are required');
      return;
    }

    try {
      setLoading(true);
      await apiClient.post('/users', newUser);
      setSuccess('User created successfully');
      setNewUser({ name: '', lastname: '', email: '', password: '', role: 'ejecutivo' });
      fetchUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating user');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      setLoading(true);
      await apiClient.patch(`/users/${userId}/role`, { role: newRole });
      setSuccess('User role updated successfully');
      fetchUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating role');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePermissions = async (roleName, permissions) => {
    try {
      setLoading(true);
      await apiClient.put(`/rbac/roles/${roleName}/permissions`, { permissions });
      setSuccess(`Permissions updated for ${roleName}`);
      fetchPermissions();

      // Update sessionStorage if this is the current user's role
      const currentUser = JSON.parse(sessionStorage.getItem('user') || '{}');
      if (currentUser.role === roleName) {
        sessionStorage.setItem('permissions', JSON.stringify(permissions));
        // Force UI update by reloading page
        window.location.reload();
      }

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating permissions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={s.container}>
      {error && (
        <Alert
          severity="error"
          onClose={() => setError('')}
          sx={{
            backgroundColor: 'rgba(244, 67, 54, 0.15)',
            color: '#f44336',
            border: '1px solid #f44336',
            borderRadius: '4px',
          }}
        >
          {error}
        </Alert>
      )}
      {success && (
        <Alert
          severity="success"
          onClose={() => setSuccess('')}
          sx={{
            backgroundColor: 'rgba(76, 175, 80, 0.15)',
            color: '#4caf50',
            border: '1px solid #4caf50',
            borderRadius: '4px',
          }}
        >
          {success}
        </Alert>
      )}

      {/* Section 1: Create User */}
      <Box className={s.section}>
        <Typography variant="h5" className={s.sectionTitle}>Crear Usuario</Typography>
        <form onSubmit={handleCreateUser} className={s.form}>
          <TextField
            label="Nombre"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            fullWidth
            size="small"
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#ccc',
                backgroundColor: '#0d0d0d',
                '& fieldset': {
                  borderColor: '#444',
                },
                '&:hover fieldset': {
                  borderColor: '#666',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#44a1b4',
                },
              },
              '& .MuiInputBase-input::placeholder': {
                color: '#666',
                opacity: 1,
              },
              '& .MuiInputLabel-root': {
                color: '#999',
                '&.Mui-focused': {
                  color: '#44a1b4',
                },
              },
            }}
          />
          <TextField
            label="Apellido"
            value={newUser.lastname}
            onChange={(e) => setNewUser({ ...newUser, lastname: e.target.value })}
            fullWidth
            size="small"
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#ccc',
                backgroundColor: '#0d0d0d',
                '& fieldset': {
                  borderColor: '#444',
                },
                '&:hover fieldset': {
                  borderColor: '#666',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#44a1b4',
                },
              },
              '& .MuiInputBase-input::placeholder': {
                color: '#666',
                opacity: 1,
              },
              '& .MuiInputLabel-root': {
                color: '#999',
                '&.Mui-focused': {
                  color: '#44a1b4',
                },
              },
            }}
          />
          <TextField
            label="Email"
            type="email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            fullWidth
            size="small"
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#ccc',
                backgroundColor: '#0d0d0d',
                '& fieldset': {
                  borderColor: '#444',
                },
                '&:hover fieldset': {
                  borderColor: '#666',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#44a1b4',
                },
              },
              '& .MuiInputBase-input::placeholder': {
                color: '#666',
                opacity: 1,
              },
              '& .MuiInputLabel-root': {
                color: '#999',
                '&.Mui-focused': {
                  color: '#44a1b4',
                },
              },
            }}
          />
          <TextField
            label="Contraseña"
            type="password"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            fullWidth
            size="small"
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#ccc',
                backgroundColor: '#0d0d0d',
                '& fieldset': {
                  borderColor: '#444',
                },
                '&:hover fieldset': {
                  borderColor: '#666',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#44a1b4',
                },
              },
              '& .MuiInputBase-input::placeholder': {
                color: '#666',
                opacity: 1,
              },
              '& .MuiInputLabel-root': {
                color: '#999',
                '&.Mui-focused': {
                  color: '#44a1b4',
                },
              },
            }}
          />
          <Select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            fullWidth
            size="small"
            variant="outlined"
            MenuProps={{
              PaperProps: {
                sx: {
                  backgroundColor: '#0f1117',
                  '& .MuiMenuItem-root': {
                    backgroundColor: '#0f1117',
                    color: '#eaeaea',
                    '&:hover': {
                      backgroundColor: '#1a1d26',
                    },
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(68, 161, 180, 0.15)',
                      color: '#44a1b4',
                    },
                  },
                },
              },
            }}
            sx={{
              color: '#eaeaea',
              backgroundColor: '#0f1117',
              fontWeight: '500',
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#0f1117',
                '& fieldset': {
                  borderColor: '#1f222b',
                },
                '&:hover fieldset': {
                  borderColor: '#2a2c33',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#44a1b4',
                },
              },
              '& .MuiSvgIcon-root': {
                color: '#44a1b4',
              },
            }}
          >
            <MenuItem
              value="ejecutivo"
              sx={{
                backgroundColor: '#0f1117',
                color: '#eaeaea',
                '&:hover': {
                  backgroundColor: '#1a1d26',
                },
                '&.Mui-selected': {
                  backgroundColor: 'rgba(68, 161, 180, 0.15)',
                  color: '#44a1b4',
                  fontWeight: '600',
                }
              }}
            >
              Ejecutivo
            </MenuItem>
            <MenuItem
              value="gerente"
              sx={{
                backgroundColor: '#0f1117',
                color: '#eaeaea',
                '&:hover': {
                  backgroundColor: '#1a1d26',
                },
                '&.Mui-selected': {
                  backgroundColor: 'rgba(68, 161, 180, 0.15)',
                  color: '#44a1b4',
                  fontWeight: '600',
                }
              }}
            >
              Gerente
            </MenuItem>
          </Select>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
              backgroundColor: '#44a1b4',
              color: 'white',
              fontWeight: '600',
              padding: '0.75rem',
              '&:hover': {
                backgroundColor: '#62c9dd',
              },
              '&.Mui-disabled': {
                backgroundColor: '#333',
                color: '#666',
              },
            }}
          >
            Crear Usuario
          </Button>
        </form>
      </Box>

      {/* Section 2: User List */}
      <Box className={s.section}>
        <Typography variant="h5" className={s.sectionTitle}>Usuarios del Sistema</Typography>
        <TextField
          placeholder="Buscar usuario..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
          size="small"
          variant="outlined"
          sx={{
            marginBottom: '1.5rem',
            '& .MuiOutlinedInput-root': {
              color: '#eaeaea',
              backgroundColor: '#0f1117',
              '& fieldset': {
                borderColor: '#1f222b',
              },
              '&:hover fieldset': {
                borderColor: '#2a2c33',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#44a1b4',
              },
            },
            '& .MuiInputBase-input::placeholder': {
              color: '#555',
              opacity: 1,
            },
            '& .MuiInputLabel-root': {
              color: '#999',
              '&.Mui-focused': {
                color: '#44a1b4',
              },
            },
          }}
        />
        <TableContainer className={s.tableScroll}>
          <Table>
            <TableHead>
              <TableRow className={s.tableHeader}>
                <TableCell>Nombre</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Rol</TableCell>
                <TableCell>Creado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users
                .filter(user =>
                  user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  user.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  user.email.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map(user => (
                <TableRow key={user.id} className={s.tableRow}>
                  <TableCell>{user.name} {user.lastname}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      disabled={loading}
                      size="small"
                      variant="outlined"
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            backgroundColor: '#0f1117',
                            '& .MuiMenuItem-root': {
                              backgroundColor: '#0f1117',
                              color: '#eaeaea',
                              '&:hover': {
                                backgroundColor: '#1a1d26',
                              },
                              '&.Mui-selected': {
                                backgroundColor: 'rgba(68, 161, 180, 0.15)',
                                color: '#44a1b4',
                              },
                            },
                          },
                        },
                      }}
                      sx={{
                        minWidth: '140px',
                        color: '#eaeaea',
                        backgroundColor: '#0f1117',
                        fontWeight: '500',
                        '& .MuiOutlinedInput-root': {
                          padding: '8px 12px',
                          backgroundColor: '#0f1117',
                          '& fieldset': {
                            borderColor: '#1f222b',
                          },
                          '&:hover fieldset': {
                            borderColor: '#2a2c33',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#44a1b4',
                          },
                        },
                        '& .MuiSvgIcon-root': {
                          color: '#44a1b4',
                          right: '8px',
                        },
                        '&.Mui-disabled': {
                          color: '#555',
                          backgroundColor: '#0a0e15',
                        },
                      }}
                    >
                      <MenuItem
                        value="ejecutivo"
                        sx={{
                          backgroundColor: '#0f1117',
                          color: '#eaeaea',
                          '&:hover': {
                            backgroundColor: '#1a1d26',
                          },
                          '&.Mui-selected': {
                            backgroundColor: 'rgba(68, 161, 180, 0.15)',
                            color: '#44a1b4',
                            fontWeight: '600',
                          }
                        }}
                      >
                        Ejecutivo
                      </MenuItem>
                      <MenuItem
                        value="gerente"
                        sx={{
                          backgroundColor: '#0f1117',
                          color: '#eaeaea',
                          '&:hover': {
                            backgroundColor: '#1a1d26',
                          },
                          '&.Mui-selected': {
                            backgroundColor: 'rgba(68, 161, 180, 0.15)',
                            color: '#44a1b4',
                            fontWeight: '600',
                          }
                        }}
                      >
                        Gerente
                      </MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Section 3: Role Permissions */}
      <Box className={s.section}>
        <Typography variant="h5" className={s.sectionTitle}>Permisos por Rol</Typography>
        <Box className={s.permissionsGrid}>
          <PermissionEditor
            roleName="ejecutivo"
            permissions={ejecutivoPerms}
            onChange={setEjecutivoPerms}
            onSave={handleSavePermissions}
          />
          <PermissionEditor
            roleName="gerente"
            permissions={gerentePerms}
            onChange={setGerentePerms}
            onSave={handleSavePermissions}
          />
        </Box>
      </Box>
    </div>
  );
}
