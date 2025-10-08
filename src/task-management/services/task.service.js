// src/services/task.service.js
import httpInstance from '../../shared/services/http.instance.js';

/**
 * Service to interact with the .NET API using the same HTTP instance as the rest of the app
 */
export const apiService = {
    // ===== Tableros (Boards) =====
    loadBoard: async (boardId) => {
        try {
            const response = await httpInstance.get(`/tasks/boards/${boardId}`);
            return response.data;
        } catch (error) {
            console.error('Error cargando el tablero:', error);
            throw error;
        }
    },

    // ===== Tareas =====
    createTask: async (task) => {
        try {
            const response = await httpInstance.post(`/tasks/tasks`, {
                Title: task.title,
                Description: task.description,
                ColumnId: task.columnId,
                Order: task.order
            });
            return response;
        } catch (error) {
            console.error('Error creando tarea:', error);
            throw error;
        }
    },

    updateTask: async (id, task) => {
        try {
            const response = await httpInstance.put(`/tasks/tasks/${id}`, {
                Title: task.title,
                Description: task.description,
                ColumnId: task.columnId,
                Order: task.order
            });
            return response;
        } catch (error) {
            console.error('Error actualizando tarea:', error);
            throw error;
        }
    },

    deleteTask: async (id) => {
        try {
            const response = await httpInstance.delete(`/tasks/tasks/${id}`);
            return response;
        } catch (error) {
            console.error('Error eliminando tarea:', error);
            throw error;
        }
    },

    moveTask: async (taskId, sourceColumnId, targetColumnId) => {
        try {
            const response = await httpInstance.put(`/tasks/tasks/${taskId}/move`, {
                TargetColumnId: targetColumnId,
                Order: 1 // Por ahora usar orden fijo, después puedes implementar lógica más compleja
            });
            return response;
        } catch (error) {
            console.error('Error moviendo tarea:', error);
            throw error;
        }
    }
};

export default apiService;