-- Create tables
DROP TABLE IF EXISTS notes_tags;
DROP TABLE IF EXISTS notes;
DROP TABLE IF EXISTS folders;
DROP TABLE IF EXISTS tags;

CREATE TABLE IF NOT EXISTS folders (
  id serial PRIMARY KEY,
  name text NOT NULL
);

ALTER SEQUENCE folders_id_seq
  START WITH 100
  RESTART
;

CREATE TABLE IF NOT EXISTS notes (
  id serial PRIMARY KEY,
  title text NOT NULL,
  content text,
  created timestamp (0) WITH TIME ZONE DEFAULT now(),
  folder_id int REFERENCES folders(id) ON DELETE SET NULL
);

ALTER SEQUENCE notes_id_seq
  START WITH 1000
  RESTART
;

CREATE TABLE tags (
  id serial PRIMARY KEY,
  name text NOT NULL UNIQUE
);

ALTER SEQUENCE tags_id_seq
  START WITH 200
  RESTART
;

CREATE TABLE IF NOT EXISTS notes_tags (
  note_id integer NOT NULL REFERENCES notes ON DELETE CASCADE,
  tag_id INTEGER NOT NULL REFERENCES tags ON DELETE CASCADE
);


-- Insert sample data

INSERT INTO folders (name) VALUES
  ('Archived'),
  ('Drafts'),
  ('Personal'),
  ('Work')
;

INSERT INTO notes (title, content, folder_id) VALUES
  ('5 life lessons learned from cats', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 102),
  ('What the government doesn''t want you to know about cats', 'Posuere sollicitudin aliquam ultrices sagittis orci a. Feugiat sed lectus vestibulum mattis ullamcorper velit. Odio pellentesque diam volutpat commodo sed egestas egestas fringilla. Velit egestas dui id ornare arcu odio. Molestie at elementum eu facilisis sed odio morbi. Tempor nec feugiat nisl pretium. At tempor commodo ullamcorper a lacus. Egestas dui id ornare arcu odio. Id cursus metus aliquam eleifend. Vitae sapien pellentesque habitant morbi tristique. Dis parturient montes nascetur ridiculus. Egestas egestas fringilla phasellus faucibus scelerisque eleifend. Aliquam faucibus purus in massa tempor nec feugiat nisl.', null),
  ('The most boring article about cats you''ll ever read', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', null),
  ('7 things lady gaga has in common with cats', 'Posuere sollicitudin aliquam ultrices sagittis orci a. Feugiat sed lectus vestibulum mattis ullamcorper velit. Odio pellentesque diam volutpat commodo sed egestas egestas fringilla. Velit egestas dui id ornare arcu odio. Molestie at elementum eu facilisis sed odio morbi. Tempor nec feugiat nisl pretium. At tempor commodo ullamcorper a lacus. Egestas dui id ornare arcu odio. Id cursus metus aliquam eleifend. Vitae sapien pellentesque habitant morbi tristique. Dis parturient montes nascetur ridiculus. Egestas egestas fringilla phasellus faucibus scelerisque eleifend. Aliquam faucibus purus in massa tempor nec feugiat nisl.', 100),
  ('The most incredible article about cats you''ll ever read', 'Lorem ipsum dolor sit amet, boring consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', null),
  ('10 ways cats can help you live to 100', 'Posuere sollicitudin aliquam ultrices sagittis orci a. Feugiat sed lectus vestibulum mattis ullamcorper velit. Odio pellentesque diam volutpat commodo sed egestas egestas fringilla. Velit egestas dui id ornare arcu odio. Molestie at elementum eu facilisis sed odio morbi. Tempor nec feugiat nisl pretium. At tempor commodo ullamcorper a lacus. Egestas dui id ornare arcu odio. Id cursus metus aliquam eleifend. Vitae sapien pellentesque habitant morbi tristique. Dis parturient montes nascetur ridiculus. Egestas egestas fringilla phasellus faucibus scelerisque eleifend. Aliquam faucibus purus in massa tempor nec feugiat nisl.', null),
  ('9 reasons you can blame the recession on cats', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', null),
  ('10 ways marketers are making you addicted to cats', 'Posuere sollicitudin aliquam ultrices sagittis orci a. Feugiat sed lectus vestibulum mattis ullamcorper velit. Odio pellentesque diam volutpat commodo sed egestas egestas fringilla. Velit egestas dui id ornare arcu odio. Molestie at elementum eu facilisis sed odio morbi. Tempor nec feugiat nisl pretium. At tempor commodo ullamcorper a lacus. Egestas dui id ornare arcu odio. Id cursus metus aliquam eleifend. Vitae sapien pellentesque habitant morbi tristique. Dis parturient montes nascetur ridiculus. Egestas egestas fringilla phasellus faucibus scelerisque eleifend. Aliquam faucibus purus in massa tempor nec feugiat nisl.', null),
  ('11 ways investing in cats can make you a millionaire', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', null),
  ('Why you should forget everything you learned about cats', 'Posuere sollicitudin aliquam ultrices sagittis orci a. Feugiat sed lectus vestibulum mattis ullamcorper velit. Odio pellentesque diam volutpat commodo sed egestas egestas fringilla. Velit egestas dui id ornare arcu odio. Molestie at elementum eu facilisis sed odio morbi. Tempor nec feugiat nisl pretium. At tempor commodo ullamcorper a lacus. Egestas dui id ornare arcu odio. Id cursus metus aliquam eleifend. Vitae sapien pellentesque habitant morbi tristique. Dis parturient montes nascetur ridiculus. Egestas egestas fringilla phasellus faucibus scelerisque eleifend. Aliquam faucibus purus in massa tempor nec feugiat nisl.', null)
;

INSERT INTO tags (name) VALUES
  ('URGENT'),
  ('WORLD ENDING'),
  ('MANDATORY')
;

INSERT INTO notes_tags (note_id, tag_id) VALUES
  (1001, 201),
  (1003, 202),
  (1008, 200),
  (1003, 201)
;
