import { Task } from './task.entity.js';

/**
 * TaskColumn entity class
 */
export class TaskColumn {
    constructor(id = 0, title = '', boardId = 1, order = 0, tasks = []) {
        this.id = id;
        this.title = title;
        this.boardId = boardId;
        this.order = order;
        this.tasks = tasks.map(task => task instanceof Task ? task : Task.fromApiResponse(task));
    }

    /**
     * Create a TaskColumn from API response data
     * @param {Object} data - Column data from API
     * @returns {TaskColumn} - TaskColumn instance
     */
    static fromApiResponse(data) {
        return new TaskColumn(
            data.id,
            data.title,
            data.boardId,
            data.order || 0,
            data.tasks || []
        );
    }

    /**
     * Get the number of tasks in this column
     * @returns {number} - Task count
     */
    get taskCount() {
        return this.tasks.length;
    }

    /**
     * Add a task to this column
     * @param {Task} task - Task to add
     */
    addTask(task) {
        if (!(task instanceof Task)) {
            task = Task.fromApiResponse(task);
        }
        task.columnId = this.id;
        task.order = this.tasks.length + 1;
        this.tasks.push(task);
    }

    /**
     * Remove a task from this column
     * @param {number} taskId - ID of task to remove
     */
    removeTask(taskId) {
        const index = this.tasks.findIndex(task => task.id === taskId);
        if (index !== -1) {
            this.tasks.splice(index, 1);
            // Reorder remaining tasks
            this.tasks.forEach((task, idx) => {
                task.order = idx + 1;
            });
        }
    }

    /**
     * Update a task in this column
     * @param {number} taskId - ID of task to update
     * @param {Object} updates - Updates to apply
     */
    updateTask(taskId, updates) {
        const task = this.tasks.find(task => task.id === taskId);
        if (task) {
            task.update(updates);
        }
    }

    /**
     * Find a task by ID
     * @param {number} taskId - ID of task to find
     * @returns {Task|null} - Found task or null
     */
    findTask(taskId) {
        return this.tasks.find(task => task.id === taskId) || null;
    }
}
