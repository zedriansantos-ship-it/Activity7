import React, { useState, useEffect } from 'react';
import { getProjects, createProject, getTasks, createTask, updateTask, deleteTask, getUsers, createUser } from '../services/api';

export default function Board() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  // Forms
  const [newProject, setNewProject] = useState({ name: '', description: '', startDate: '', endDate: '' });
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'todo', deadline: '', userId: '' });
  const [newUser, setNewUser] = useState({ name: '', email: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [p, t, u] = await Promise.all([getProjects(), getTasks(), getUsers()]);
      setProjects(p.data);
      setTasks(t.data);
      setUsers(u.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddProject = async () => {
    if (!newProject.name) return;
    await createProject(newProject);
    setNewProject({ name: '', description: '', startDate: '', endDate: '' });
    fetchData();
  };

  const handleAddTask = async () => {
    if (!newTask.title || !selectedProject) {
        if(!selectedProject) alert('Select a project first!');
        return;
    }
    // Ensure we are passing valid strings for IDs
    const payload = { ...newTask, projectId: selectedProject._id };
    // If userId is empty string, remove it or handle it. Validation might complain.
    if (!payload.userId) delete payload.userId;

    await createTask(payload);
    setNewTask({ title: '', description: '', status: 'todo', deadline: '', userId: '' });
    fetchData();
  };

  const handleAddUser = async () => {
    if (!newUser.name) return;
    await createUser(newUser);
    setNewUser({ name: '', email: '' });
    fetchData();
  };

  const handleDeleteTask = async (id) => {
      await deleteTask(id);
      fetchData();
  }

  // Filter tasks safely handling populated objects or raw IDs
  const filteredTasks = selectedProject 
    ? tasks.filter(t => {
        const tPid = t.projectId && t.projectId._id ? t.projectId._id : t.projectId;
        return tPid === selectedProject._id;
    })
    : [];

  return (
    <div className='donezo-container'>
      {/* LEFT COLUMN: PROJECTS */}
      <div className='column col-projects'>
        <h2>Projects</h2>
        <div className='list'>
          {projects.map(p => (
            <div 
              key={p._id} 
              className={`card project-card ${selectedProject?._id === p._id ? 'active' : ''}`}
              onClick={() => setSelectedProject(p)}
            >
              <strong>{p.name}</strong>
              <div style={{fontSize: '0.8em', color: '#666'}}>{p.startDate} - {p.endDate}</div>
            </div>
          ))}
        </div>
        
        <div className='form-box' style={{marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid #ccc'}}>
            <h3>New Project</h3>
            <input placeholder='Name' value={newProject.name} onChange={e => setNewProject({...newProject, name: e.target.value})} />
            <input placeholder='Desc' value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} />
            <div style={{marginBottom: '5px'}}>
                <label style={{display: 'block', fontSize: '0.8em', marginBottom: '2px', color: '#666'}}>Start Date</label>
                <input type='date' value={newProject.startDate} onChange={e => setNewProject({...newProject, startDate: e.target.value})} />
            </div>
            <div style={{marginBottom: '5px'}}>
                <label style={{display: 'block', fontSize: '0.8em', marginBottom: '2px', color: '#666'}}>Deadline</label>
                <input type='date' value={newProject.endDate} onChange={e => setNewProject({...newProject, endDate: e.target.value})} />
            </div>
            <button className='btn' onClick={handleAddProject}>Add Project</button>
        </div>
      </div>

      {/* CENTER COLUMN: TASKS */}
      <div className='column col-tasks'>
        <div>
            <h2>{selectedProject ? `Tasks: ${selectedProject.name}` : 'Select a Project to view Tasks'}</h2>
            {selectedProject && <p style={{color: '#666', marginTop: '-10px', marginBottom: '20px'}}>{selectedProject.description}</p>}
        </div>
        
        {selectedProject && (
            <>
                <div className='task-grid' style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px'}}>
                    {filteredTasks.map(t => (
                        <div key={t._id} className={`card task-card task-status-${t.status}`}>
                            <h3>{t.title}</h3>
                            <p>{t.description}</p>
                            <small>Due: {t.deadline}</small>
                            <div style={{marginTop: '10px'}}>
                                <select 
                                    value={t.status} 
                                    onChange={async (e) => {
                                        await updateTask(t._id, { ...t, status: e.target.value });
                                        fetchData();
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <option value='todo'>To Do</option>
                                    <option value='in-progress'>In Progress</option>
                                    <option value='completed'>Completed</option>
                                </select>
                                <button style={{marginLeft: '5px', background: 'red', border:'none', color:'white', borderRadius:'4px', cursor: 'pointer'}} onClick={(e) => { e.stopPropagation(); handleDeleteTask(t._id); }}>X</button>
                            </div>
                            <div style={{fontSize: '0.8em', marginTop: '5px', color: '#888'}}>
                                Assigned: {t.userId?.name || 'Unassigned'}
                            </div>
                        </div>
                    ))}
                    {filteredTasks.length === 0 && <p>No tasks yet.</p>}
                </div>

                <div className='form-box' style={{marginTop: '30px', background: '#fff', padding: '20px', borderRadius: '8px'}}>
                    <h3>Add Task to {selectedProject.name}</h3>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                        <input placeholder='Task Title' value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} />
                        
                        <div style={{display: 'flex', gap: '10px'}}>
                            <div style={{flex: 1}}>
                                <label style={{display: 'block', fontSize: '0.8em', marginBottom: '2px', color: '#666'}}>Deadline</label>
                                <input type='date' value={newTask.deadline} onChange={e => setNewTask({...newTask, deadline: e.target.value})} />
                            </div>
                            <div style={{flex: 1}}>
                                <label style={{display: 'block', fontSize: '0.8em', marginBottom: '2px', color: '#666'}}>Assign To</label>
                                <select value={newTask.userId} onChange={e => setNewTask({...newTask, userId: e.target.value})}>
                                    <option value=''>Unassigned</option>
                                    {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
                                </select>
                            </div>
                        </div>

                        <textarea placeholder='Description' rows='2' value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} />
                        <button className='btn' onClick={handleAddTask}>Create Task</button>
                    </div>
                </div>
            </>
        )}
      </div>

      {/* RIGHT COLUMN: USERS */}
      <div className='column col-users'>
        <h2>Team</h2>
        <div className='list'>
             {users.map(u => (
                 <div key={u._id} className='card user-card'>
                     <strong>{u.name}</strong>
                     <div style={{fontSize: '0.7em'}}>{u.email}</div>
                 </div>
             ))}
        </div>
        <div className='form-box' style={{marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid #ccc'}}>
            <h3>Add Member</h3>
            <input placeholder='Name' value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} />
            <input placeholder='Email' value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} />
            <button className='btn' onClick={handleAddUser}>Add</button>
        </div>
      </div>
    </div>
  );
}