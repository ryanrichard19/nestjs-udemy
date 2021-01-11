import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import {v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
    private tasks: Task[] = [];

    getAllTasks(): Task[] {
        return this.tasks;
    }

    getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
        const { status, search } = filterDto;
        let tasks: Task[] = this.getAllTasks();
        if (status) {
            tasks = tasks.filter(task => task.status === status);
        }
        if (search) {
            tasks = tasks.filter(task => task.title.includes(search) || task.description.includes(search));
        }
        return tasks;
    }

    getTaskById(id: string): Task {
        const found = this.tasks.find(task => task.id === id);
        if (!found) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }
        return this.tasks.find(task => task.id === id);
    }

    createTask(createTaskDto: CreateTaskDto): Task {

        const { title, description } = createTaskDto;
        const task: Task = {
            id: uuid(),
            title,
            description,
            status: TaskStatus.OPEN,
        };

        this.tasks.push(task);
        return task;
    }

    deleteTask(id: string): void {
        const found = this.getTaskById(id);
        const index = this.tasks.findIndex(task => task.id === id);
        this.tasks.splice(index, 1);
    }
    
    updateTaskStatus(id: string, status: TaskStatus): Task {
        let task = this.getTaskById(id);
        task.status = status;
        return task;
    }
}
