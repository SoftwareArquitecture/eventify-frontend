import { TaskColumn } from './task-column.entity.js';
import { Task } from './task.entity.js';
import { apiService } from '../services/task.service.js';

/**
 * TaskBoard API entity class that manages board operations
 */
export class TaskBoardApi {
    constructor(id = 1, title = 'Task Board', description = '', columns = []) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.columns = columns.map(col => col instanceof TaskColumn ? col : TaskColumn.fromApiResponse(col));
    }

    /**
     * Load a task board from the API
     * @param {number} boardId - ID of the board to load (default: 1)
     * @returns {Promise<TaskBoardApi>} - Loaded task board
     */
    static async load(boardId = 1) {
        try {
            // Intentar cargar desde tu API real de .NET
            console.log('📋 Loading task board from .NET API');
            const boardData = await apiService.loadBoard(boardId);
            return new TaskBoardApi(
                boardData.id,
                boardData.title,
                boardData.description,
                boardData.columns
            );
        } catch (error) {
            console.warn('Could not load from API, using default board:', error);
            // Fallback to default board if API is not available
            return TaskBoardApi.createDefaultBoard();
        }
    }

    /**
     * Create a default board with sample data
     * @returns {TaskBoardApi} - Default task board
     */
    static createDefaultBoard() {
        const defaultColumns = [
            new TaskColumn(1, 'Por hacer', 1, 1, [
                new Task(1, 'Diseñar interfaz de usuario', 'Crear mockups y prototipos', 1, 1),
                new Task(2, 'Configurar base de datos', 'Instalar y configurar PostgreSQL', 1, 2)
            ]),
            new TaskColumn(2, 'En progreso', 1, 2, [
                new Task(3, 'Implementar autenticación', 'Desarrollar sistema de login', 2, 1)
            ]),
            new TaskColumn(3, 'Completado', 1, 3, [
                new Task(4, 'Configurar proyecto', 'Inicializar repositorio y dependencias', 3, 1)
            ])
        ];

        return new TaskBoardApi(1, 'Mi Tablero de Tareas', 'Tablero principal de gestión de tareas', defaultColumns);
    }

    /**
     * Save the current board to localStorage
     */
    save() {
        try {
            const boardData = {
                id: this.id,
                title: this.title,
                description: this.description,
                columns: this.columns.map(column => ({
                    id: column.id,
                    title: column.title,
                    boardId: column.boardId,
                    order: column.order,
                    tasks: column.tasks.map(task => task.toApiFormat())
                }))
            };
            localStorage.setItem(`taskBoard_${this.id}`, JSON.stringify(boardData));
            console.log('💾 Task board saved to localStorage');
        } catch (error) {
            console.error('Error saving board to localStorage:', error);
        }
    }

    /**
     * Clear all board data from localStorage
     * @param {number} boardId - ID of the board to clear (default: 1)
     */
    static clearSavedData(boardId = 1) {
        localStorage.removeItem(`taskBoard_${boardId}`);
        console.log('🗑️ Cleared task board data from localStorage');
    }

    /**
     * Create a new task in a column
     * @param {string} title - Task title
     * @param {string} description - Task description
     * @param {number} columnId - ID of the column to add the task to
     * @returns {Promise<Task>} - Created task
     */
    async createTask(title, description, columnId) {
        try {
            const column = this.findColumn(columnId);
            if (!column) {
                throw new Error(`Column with ID ${columnId} not found`);
            }

            // Create task object
            const newTaskData = new Task(
                0, // Temporary ID, will be replaced by server
                title,
                description,
                columnId,
                column.tasks.length + 1
            );

            try {
                // Intentar crear via API real
                console.log('📝 Creating task via .NET API');
                const response = await apiService.createTask(newTaskData.toApiFormat());
                const createdTask = Task.fromApiResponse(response.data);
                
                // Add to local column
                column.addTask(createdTask);
                return createdTask;
            } catch (apiError) {
                console.warn('API creation failed, adding locally:', apiError);
                // Fallback: add locally with timestamp ID
                newTaskData.id = Date.now();
                column.addTask(newTaskData);
                return newTaskData;
            }
        } catch (error) {
            console.error('Error creating task:', error);
            throw error;
        }
    }

    /**
     * Update an existing task
     * @param {number} taskId - ID of the task to update
     * @param {number} columnId - ID of the column containing the task
     * @param {Object} updates - Updates to apply
     * @returns {Promise<Task>} - Updated task
     */
    async updateTask(taskId, columnId, updates) {
        try {
            const column = this.findColumn(columnId);
            if (!column) {
                throw new Error(`Column with ID ${columnId} not found`);
            }

            const task = column.findTask(taskId);
            if (!task) {
                throw new Error(`Task with ID ${taskId} not found in column ${columnId}`);
            }

            try {
                // Intentar actualizar via API real
                console.log('✏️ Updating task via .NET API');
                const updatedData = { ...task.toApiFormat(), ...updates };
                const response = await apiService.updateTask(taskId, updatedData);
                
                // Update local task
                task.update(updates);
                return task;
            } catch (apiError) {
                console.warn('API update failed, updating locally:', apiError);
                // Fallback: update locally
                task.update(updates);
                return task;
            }
        } catch (error) {
            console.error('Error updating task:', error);
            throw error;
        }
    }

    /**
     * Delete a task
     * @param {number} taskId - ID of the task to delete
     * @param {number} columnId - ID of the column containing the task
     * @returns {Promise<boolean>} - Success status
     */
    async deleteTask(taskId, columnId) {
        try {
            const column = this.findColumn(columnId);
            if (!column) {
                throw new Error(`Column with ID ${columnId} not found`);
            }

            try {
                // Intentar eliminar via API real
                console.log('🗑️ Deleting task via .NET API');
                await apiService.deleteTask(taskId);
            } catch (apiError) {
                console.warn('API deletion failed, deleting locally:', apiError);
            }

            // Remove from local column
            column.removeTask(taskId);
            return true;
        } catch (error) {
            console.error('Error deleting task:', error);
            throw error;
        }
    }

    /**
     * Move a task between columns
     * @param {number} taskId - ID of the task to move
     * @param {number} sourceColumnId - ID of the source column
     * @param {number} targetColumnId - ID of the target column
     * @returns {Promise<boolean>} - Success status
     */
    async moveTask(taskId, sourceColumnId, targetColumnId) {
        try {
            if (sourceColumnId === targetColumnId) {
                return true; // No need to move
            }

            const sourceColumn = this.findColumn(sourceColumnId);
            const targetColumn = this.findColumn(targetColumnId);

            if (!sourceColumn || !targetColumn) {
                throw new Error('Source or target column not found');
            }

            const task = sourceColumn.findTask(taskId);
            if (!task) {
                throw new Error(`Task with ID ${taskId} not found in source column`);
            }

            try {
                // Intentar mover via API real
                console.log('🔄 Moving task via .NET API');
                await apiService.moveTask(taskId, sourceColumnId, targetColumnId);
            } catch (apiError) {
                console.warn('API move failed, moving locally:', apiError);
            }

            // Move locally
            sourceColumn.removeTask(taskId);
            task.columnId = targetColumnId;
            targetColumn.addTask(task);

            return true;
        } catch (error) {
            console.error('Error moving task:', error);
            throw error;
        }
    }

    /**
     * Find a column by ID
     * @param {number} columnId - ID of the column to find
     * @returns {TaskColumn|null} - Found column or null
     */
    findColumn(columnId) {
        return this.columns.find(col => col.id === columnId) || null;
    }

    /**
     * Get all tasks across all columns
     * @returns {Task[]} - Array of all tasks
     */
    getAllTasks() {
        return this.columns.reduce((allTasks, column) => {
            return allTasks.concat(column.tasks);
        }, []);
    }

    /**
     * Get total task count
     * @returns {number} - Total number of tasks
     */
    get totalTaskCount() {
        return this.getAllTasks().length;
    }
}
