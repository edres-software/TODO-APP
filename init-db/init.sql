CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  description TEXT NOT NULL,
  priority VARCHAR(10) DEFAULT 'Normal',
  due_date DATE
);
