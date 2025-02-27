CREATE DATABASE IF NOT EXISTS todo_db;

USE todo_db;

-- creating task_status table
CREATE TABLE
    IF NOT EXISTS task_status (
        id INT AUTO_INCREMENT PRIMARY KEY,
        status_name VARCHAR(50) NOT NULL UNIQUE
    ) ENGINE = InnoDB;

-- inserting default task statuses
INSERT INTO
    task_status (id, status_name)
VALUES
    (1, 'todo'),
    (2, 'hold'),
    (3, 'completed') ON DUPLICATE KEY
UPDATE id = id;

-- creating task table with status_id as foreign key
CREATE TABLE
    IF NOT EXISTS task (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status_id INT NOT NULL DEFAULT 1,
        FOREIGN KEY (status_id) REFERENCES task_status (id) ON DELETE CASCADE
    ) ENGINE = InnoDB;