/**
 * Task entity class
 */
export class Task {
    constructor(id = 0, title = '', description = '', columnId = 1, order = 0, createdAt = null) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.columnId = columnId;
        this.order = order;
        this.createdAt = createdAt || new Date().toISOString();
    }

    /**
     * Create a Task from API response data
     * @param {Object} data - Task data from API
     * @returns {Task} - Task instance
     */
    static fromApiResponse(data) {
        return new Task(
            data.id,
            data.title,
            data.description,
            data.columnId,
            data.order || 0,
            data.createdAt
        );
    }

    /**
     * Convert Task to API format
     * @returns {Object} - Task data for API
     */
    toApiFormat() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            columnId: this.columnId,
            order: this.order,
            createdAt: this.createdAt
        };
    }

    /**
     * Update task properties
     * @param {Object} updates - Properties to update
     */
    update(updates) {
        Object.assign(this, updates);
    }
}
