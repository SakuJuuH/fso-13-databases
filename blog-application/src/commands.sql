CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes integer DEFAULT 0,
    UNIQUE (id)
);

INSERT INTO BLOGS (author, url, title, likes) VALUES
('John Doe', 'http://example.com/blog1', 'My First Blog', 10),
('Jane Smith', 'http://example.com/blog2', 'My Second Blog', 5);